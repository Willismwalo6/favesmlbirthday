import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { photoStore, trackStore } from '../lib/storage';
import type { StoredPhoto } from '../config/photos';
import { PHOTO_ASSETS } from '../config/photoAssets';

export type PhotoState = {
  url: string;
  x: number;
  y: number;
  zoom: number;
  /** Bundled photographs only */
  srcSet?: string;
  full?: string;
  blur?: string;
  w?: number;
  h?: number;
};

const BASE = import.meta.env.BASE_URL;

/** Song shipped with the site; a song added in the owner studio overrides it. */
const BUNDLED_TRACK = { url: `${BASE}music/love-love.mp3`, name: 'Love Love' };

/** Photographs shipped with the site (public/photos), keyed by slot id. */
const BUNDLED: Record<string, PhotoState> = Object.fromEntries(
  Object.entries(PHOTO_ASSETS).map(([id, a]) => {
    const f = (w: number) => `${BASE}photos/${a.n}-${w}.webp`;
    const mid = a.widths.includes(960) ? 960 : a.widths[a.widths.length - 1];
    return [
      id,
      {
        url: f(mid),
        srcSet: a.widths.map((w) => `${f(w)} ${w}w`).join(', '),
        full: f(a.widths[a.widths.length - 1]),
        blur: a.blur,
        w: a.w,
        h: a.h,
        x: a.fx,
        y: a.fy,
        zoom: 1,
      } satisfies PhotoState,
    ];
  })
);

export type StudioTab = 'photos' | 'music';

type PhotoContextValue = {
  photos: Record<string, PhotoState>;
  ready: boolean;
  upload: (id: string, file: File) => Promise<void>;
  remove: (id: string) => Promise<void>;
  setCrop: (id: string, x: number, y: number, zoom: number) => Promise<void>;
  studioOpen: boolean;
  studioTab: StudioTab;
  activeSlot: string | null;
  openStudio: (id?: string, tab?: StudioTab) => void;
  closeStudio: () => void;
  trackUrl: string | null;
  trackName: string | null;
  uploadTrack: (file: File) => Promise<void>;
  removeTrack: () => Promise<void>;
  photoCount: number;
};

const PhotoContext = createContext<PhotoContextValue | null>(null);

export function PhotoProvider({ children }: { children: ReactNode }) {
  const [photos, setPhotos] = useState<Record<string, PhotoState>>(BUNDLED);
  const [ready, setReady] = useState(false);
  const [studioOpen, setStudioOpen] = useState(false);
  const [studioTab, setStudioTab] = useState<StudioTab>('photos');
  const [activeSlot, setActiveSlot] = useState<string | null>(null);
  const [trackUrl, setTrackUrl] = useState<string | null>(BUNDLED_TRACK.url);
  const [trackName, setTrackName] = useState<string | null>(BUNDLED_TRACK.name);
  const blobRefs = useRef<Record<string, Blob>>({});
  const trackBlob = useRef<Blob | null>(null);
  const objectUrls = useRef<string[]>([]);

  const makeUrl = useCallback((blob: Blob) => {
    const url = URL.createObjectURL(blob);
    objectUrls.current.push(url);
    return url;
  }, []);

  useEffect(() => {
    let cancelled = false;
    Promise.all([photoStore.all(), trackStore.get()]).then(([stored, track]) => {
      if (cancelled) return;
      const next: Record<string, PhotoState> = {};
      Object.entries(stored).forEach(([id, entry]: [string, StoredPhoto]) => {
        if (!entry?.blob) return;
        blobRefs.current[id] = entry.blob;
        next[id] = {
          url: makeUrl(entry.blob),
          x: entry.x ?? 50,
          y: entry.y ?? 50,
          zoom: entry.zoom ?? 1,
        };
      });
      setPhotos({ ...BUNDLED, ...next });
      if (track) {
        trackBlob.current = track;
        setTrackUrl(makeUrl(track));
        setTrackName('Your song');
      }
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [makeUrl]);

  useEffect(
    () => () => {
      objectUrls.current.forEach((url) => URL.revokeObjectURL(url));
      objectUrls.current = [];
    },
    []
  );

  const upload = useCallback(
    async (id: string, file: File) => {
      if (!file.type.startsWith('image/')) throw new Error('Please choose an image file.');
      if (file.size > 25 * 1024 * 1024) throw new Error('Please choose an image under 25 MB.');
      const previous = photos[id];
      if (previous) URL.revokeObjectURL(previous.url);
      blobRefs.current[id] = file;
      const entry: StoredPhoto = {
        blob: file,
        x: previous?.x ?? 50,
        y: previous?.y ?? 50,
        zoom: previous?.zoom ?? 1,
      };
      await photoStore.put(id, entry);
      setPhotos((current) => ({
        ...current,
        [id]: { url: makeUrl(file), x: entry.x, y: entry.y, zoom: entry.zoom },
      }));
    },
    [makeUrl, photos]
  );

  const remove = useCallback(
    async (id: string) => {
      const previous = photos[id];
      if (previous) URL.revokeObjectURL(previous.url);
      delete blobRefs.current[id];
      await photoStore.remove(id);
      setPhotos((current) => {
        const next = { ...current };
        if (BUNDLED[id]) next[id] = BUNDLED[id];
        else delete next[id];
        return next;
      });
    },
    [photos]
  );

  const setCrop = useCallback(
    async (id: string, x: number, y: number, zoom: number) => {
      const blob = blobRefs.current[id];
      if (!blob) return;
      const rounded = {
        x: Math.round(Math.min(100, Math.max(0, x))),
        y: Math.round(Math.min(100, Math.max(0, y))),
        zoom: Math.round(Math.min(2, Math.max(1, zoom)) * 100) / 100,
      };
      await photoStore.put(id, { blob, ...rounded });
      setPhotos((current) => ({ ...current, [id]: { ...current[id], ...rounded } }));
    },
    []
  );

  const openStudio = useCallback((id?: string, tab: StudioTab = 'photos') => {
    setActiveSlot(id ?? null);
    setStudioTab(tab);
    setStudioOpen(true);
  }, []);

  const closeStudio = useCallback(() => setStudioOpen(false), []);

  const uploadTrack = useCallback(
    async (file: File) => {
      if (!file.type.startsWith('audio/')) throw new Error('Please choose an audio file.');
      if (file.size > 25 * 1024 * 1024) throw new Error('Please choose a song under 25 MB.');
      if (trackUrl) URL.revokeObjectURL(trackUrl);
      await trackStore.put(file);
      trackBlob.current = file;
      setTrackUrl(makeUrl(file));
      setTrackName(file.name.replace(/\.[^.]+$/, ''));
    },
    [makeUrl, trackUrl]
  );

  const removeTrack = useCallback(async () => {
    if (trackUrl) URL.revokeObjectURL(trackUrl);
    await trackStore.remove();
    trackBlob.current = null;
    setTrackUrl(BUNDLED_TRACK.url);
    setTrackName(BUNDLED_TRACK.name);
  }, [trackUrl]);

  const value = useMemo(
    () => ({
      photos,
      ready,
      upload,
      remove,
      setCrop,
      studioOpen,
      studioTab,
      activeSlot,
      openStudio,
      closeStudio,
      trackUrl,
      trackName,
      uploadTrack,
      removeTrack,
      photoCount: Object.keys(photos).length,
    }),
    [
      photos,
      ready,
      upload,
      remove,
      setCrop,
      studioOpen,
      studioTab,
      activeSlot,
      openStudio,
      closeStudio,
      trackUrl,
      trackName,
      uploadTrack,
      removeTrack,
    ]
  );

  return <PhotoContext.Provider value={value}>{children}</PhotoContext.Provider>;
}

export function usePhotos() {
  const context = useContext(PhotoContext);
  if (!context) throw new Error('usePhotos must be used inside PhotoProvider');
  return context;
}
