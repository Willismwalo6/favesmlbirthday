import type { StoredPhoto } from '../config/photos';

const DB_NAME = 'faves-love-studio';
const DB_VERSION = 1;
const PHOTO_STORE = 'photos';
const TRACK_STORE = 'tracks';
const PROGRESS_KEY = 'faves-progress-v1';
const CONSENT_KEY = 'faves-consent-v1';

export type Consent = 'all' | 'essential';

export function getConsent(): Consent | null {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === 'all' || v === 'essential' ? v : null;
  } catch {
    return null;
  }
}

export function setConsent(value: Consent) {
  try {
    localStorage.setItem(CONSENT_KEY, value);
    if (value === 'essential') localStorage.removeItem(PROGRESS_KEY);
  } catch {
    /* ignore */
  }
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB is not available in this browser.'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(PHOTO_STORE)) db.createObjectStore(PHOTO_STORE);
      if (!db.objectStoreNames.contains(TRACK_STORE)) db.createObjectStore(TRACK_STORE);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Could not open storage.'));
  });
}

function tx<T>(
  store: string,
  mode: IDBTransactionMode,
  run: (store: IDBObjectStore) => IDBRequest<T>
): Promise<T> {
  return openDb().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const transaction = db.transaction(store, mode);
        const request = run(transaction.objectStore(store));
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error ?? new Error('Storage request failed.'));
        transaction.oncomplete = () => db.close();
      })
  );
}

export const photoStore = {
  all(): Promise<Record<string, StoredPhoto>> {
    return new Promise((resolve) => {
      openDb()
        .then((db) => {
          const transaction = db.transaction(PHOTO_STORE, 'readonly');
          const store = transaction.objectStore(PHOTO_STORE);
          const keysRequest = store.getAllKeys();
          const valuesRequest = store.getAll();
          transaction.oncomplete = () => {
            const result: Record<string, StoredPhoto> = {};
            keysRequest.result.forEach((key, index) => {
              result[String(key)] = valuesRequest.result[index] as StoredPhoto;
            });
            db.close();
            resolve(result);
          };
          transaction.onerror = () => {
            db.close();
            resolve({});
          };
        })
        .catch(() => resolve({}));
    });
  },
  put(id: string, photo: StoredPhoto) {
    return tx(PHOTO_STORE, 'readwrite', (store) => store.put(photo, id));
  },
  remove(id: string) {
    return tx(PHOTO_STORE, 'readwrite', (store) => store.delete(id));
  },
  clear() {
    return tx(PHOTO_STORE, 'readwrite', (store) => store.clear());
  },
};

export const trackStore = {
  get(): Promise<Blob | undefined> {
    return new Promise((resolve) => {
      openDb()
        .then((db) => {
          const transaction = db.transaction(TRACK_STORE, 'readonly');
          const request = transaction.objectStore(TRACK_STORE).get('song');
          request.onsuccess = () => {
            resolve(request.result as Blob | undefined);
            db.close();
          };
          request.onerror = () => {
            resolve(undefined);
            db.close();
          };
        })
        .catch(() => resolve(undefined));
    });
  },
  put(blob: Blob) {
    return tx(TRACK_STORE, 'readwrite', (store) => store.put(blob, 'song'));
  },
  remove() {
    return tx(TRACK_STORE, 'readwrite', (store) => store.delete('song'));
  },
};

export type Progress = {
  envelopeOpened: boolean;
  openedGifts: number[];
  letterOpened: boolean;
  candlesBlown: boolean;
  answer: 'yes' | 'think' | null;
  visits: number;
};

export const emptyProgress: Progress = {
  envelopeOpened: false,
  openedGifts: [],
  letterOpened: false,
  candlesBlown: false,
  answer: null,
  visits: 0,
};

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return { ...emptyProgress, visits: 1 };
    const parsed = JSON.parse(raw) as Partial<Progress>;
    return {
      ...emptyProgress,
      ...parsed,
      openedGifts: Array.isArray(parsed.openedGifts) ? parsed.openedGifts : [],
      visits: (parsed.visits ?? 0) + 1,
    };
  } catch {
    return { ...emptyProgress, visits: 1 };
  }
}

export function saveProgress(progress: Progress) {
  if (getConsent() === 'essential') return;
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch {
    /* storage may be unavailable; the experience still works */
  }
}

export function clearProgress() {
  try {
    localStorage.removeItem(PROGRESS_KEY);
  } catch {
    /* ignore */
  }
}
