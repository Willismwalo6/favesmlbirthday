import { useEffect, useRef, useState } from 'react';
import {
  PHOTO_SLOTS,
  SECTION_LABELS,
  SECTION_ORDER,
  photosBySection,
} from '../config/photos';
import { usePhotos } from '../context/PhotoContext';

export default function PhotoStudio() {
  const {
    studioOpen,
    studioTab,
    activeSlot,
    photos,
    photoCount,
    closeStudio,
    openStudio,
    upload,
    remove,
    setCrop,
    trackUrl,
    trackName,
    uploadTrack,
    removeTrack,
  } = usePhotos();

  const [draft, setDraft] = useState({ x: 50, y: 50, zoom: 1 });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const musicRef = useRef<HTMLInputElement>(null);
  const activeItemRef = useRef<HTMLButtonElement>(null);
  const photo = activeSlot ? photos[activeSlot] : undefined;
  const slot = activeSlot ? PHOTO_SLOTS.find((item) => item.id === activeSlot) : undefined;

  useEffect(() => {
    if (!studioOpen) return;
    closeRef.current?.focus();
    document.body.classList.add('is-locked');
    return () => document.body.classList.remove('is-locked');
  }, [studioOpen]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeStudio();
    };
    if (studioOpen) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [studioOpen, closeStudio]);

  useEffect(() => {
    if (photo) setDraft({ x: photo.x, y: photo.y, zoom: photo.zoom });
  }, [activeSlot, photo?.x, photo?.y, photo?.zoom]);

  useEffect(() => {
    if (studioOpen) activeItemRef.current?.scrollIntoView({ block: 'nearest' });
  }, [studioOpen, activeSlot]);

  // Commit crop changes shortly after the slider settles.
  useEffect(() => {
    if (!studioOpen || !activeSlot || !photo) return;
    if (draft.x === photo.x && draft.y === photo.y && draft.zoom === photo.zoom) return;
    const timer = window.setTimeout(() => {
      void setCrop(activeSlot, draft.x, draft.y, draft.zoom);
    }, 260);
    return () => window.clearTimeout(timer);
  }, [draft, activeSlot, studioOpen, photo, setCrop]);

  if (!studioOpen) return null;

  const handleFiles = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file || !activeSlot) return;
    setBusy(true);
    setError(null);
    try {
      await upload(activeSlot, file);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not add that photograph.');
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleTrack = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      await uploadTrack(file);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not add that song.');
    } finally {
      setBusy(false);
      if (musicRef.current) musicRef.current.value = '';
    }
  };

  const step = (direction: 1 | -1) => {
    if (!activeSlot) return;
    const index = PHOTO_SLOTS.findIndex((item) => item.id === activeSlot);
    const next = PHOTO_SLOTS[(index + direction + PHOTO_SLOTS.length) % PHOTO_SLOTS.length];
    openStudio(next.id, 'photos');
    setError(null);
  };

  return (
    <div className="studio-backdrop" onClick={closeStudio}>
      <div
        className="studio"
        role="dialog"
        aria-modal="true"
        aria-labelledby="studio-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="studio__head">
          <div>
            <p className="studio__eyebrow">Private studio · stays in this browser</p>
            <h2 id="studio-title">Faves&rsquo; photographs</h2>
          </div>
          <div className="studio__head-right">
            <span className="studio__count">
              {photoCount} <span>/ 38 added</span>
            </span>
            <button
              type="button"
              className="studio__close"
              onClick={closeStudio}
              aria-label="Close the photo studio"
              ref={closeRef}
            >
              ✕
            </button>
          </div>
        </header>

        <div className="studio__tabs" role="tablist" aria-label="Studio sections">
          <button
            type="button"
            role="tab"
            aria-selected={studioTab === 'photos'}
            className={studioTab === 'photos' ? 'is-active' : ''}
            onClick={() => openStudio(activeSlot ?? undefined, 'photos')}
          >
            Photographs <span>38 slots</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={studioTab === 'music'}
            className={studioTab === 'music' ? 'is-active' : ''}
            onClick={() => openStudio(activeSlot ?? undefined, 'music')}
          >
            Music <span>{trackUrl ? '1 song' : 'empty'}</span>
          </button>
        </div>

        {studioTab === 'photos' ? (
          <div className="studio__body">
            <div className="studio__list" aria-label="All 38 photograph slots">
              {SECTION_ORDER.map((section) => {
                const slots = photosBySection(section);
                const added = slots.filter((item) => photos[item.id]).length;
                return (
                  <section key={section} className="studio__group">
                    <h3>
                      {SECTION_LABELS[section]}
                      <span>
                        {added}/{slots.length}
                      </span>
                    </h3>
                    <ul>
                      {slots.map((item) => {
                        const stored = photos[item.id];
                        const isActive = activeSlot === item.id;
                        return (
                          <li key={item.id}>
                            <button
                              type="button"
                              className={`studio__item ${isActive ? 'is-active' : ''} ${stored ? 'has-photo' : ''}`}
                              onClick={() => {
                                openStudio(item.id, 'photos');
                                setError(null);
                              }}
                              ref={isActive ? activeItemRef : undefined}
                              aria-pressed={isActive}
                            >
                              <span className="studio__thumb">
                                {stored ? (
                                  <img src={stored.url} alt="" />
                                ) : (
                                  <span>{String(item.number).padStart(2, '0')}</span>
                                )}
                              </span>
                              <span className="studio__item-text">
                                <strong>{item.id}</strong>
                                <em>{item.location}</em>
                              </span>
                              <span className={`studio__dot ${stored ? 'is-on' : ''}`} aria-hidden="true" />
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                );
              })}
            </div>

            <div className="studio__editor">
              {slot ? (
                <>
                  <div className="studio__editor-head">
                    <div>
                      <p className="studio__eyebrow">Slot {String(slot.number).padStart(2, '0')} of 38</p>
                      <h3>{slot.label}</h3>
                      <p className="studio__where">{slot.location}</p>
                    </div>
                    <div className="studio__pager">
                      <button type="button" onClick={() => step(-1)} aria-label="Previous photograph slot">
                        ‹
                      </button>
                      <button type="button" onClick={() => step(1)} aria-label="Next photograph slot">
                        ›
                      </button>
                    </div>
                  </div>

                  <div
                    className={`studio__preview ${photo ? 'has-photo' : ''}`}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(event) => {
                      event.preventDefault();
                      void handleFiles(event.dataTransfer.files);
                    }}
                  >
                    {photo ? (
                      <img
                        src={photo.url}
                        alt={`Preview of ${slot.id}`}
                        style={{
                          objectPosition: `${draft.x}% ${draft.y}%`,
                          transform: `scale(${draft.zoom})`,
                        }}
                      />
                    ) : (
                      <div className="studio__preview-empty">
                        <span className="studio__preview-number">
                          {String(slot.number).padStart(2, '0')}
                        </span>
                        <p>Drop a photo here, or choose one below.</p>
                        <p className="studio__preview-hint">
                          Portrait, landscape and square photos all work — you can adjust the crop.
                        </p>
                      </div>
                    )}
                    <span className="studio__preview-tag">{slot.id}</span>
                  </div>

                  <div className="studio__buttons">
                    <label className="studio__upload">
                      <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        onChange={(event) => void handleFiles(event.target.files)}
                      />
                      {busy ? 'Adding…' : photo ? 'Replace photograph' : 'Choose photograph'}
                    </label>
                    {photo && (
                      <button
                        type="button"
                        className="studio__remove"
                        onClick={() => {
                          void remove(slot.id);
                          setError(null);
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  {photo && (
                    <div className="studio__crop">
                      <label>
                        <span>Horizontal position</span>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={draft.x}
                          onChange={(event) =>
                            setDraft((current) => ({ ...current, x: Number(event.target.value) }))
                          }
                        />
                        <output>{draft.x}%</output>
                      </label>
                      <label>
                        <span>Vertical position</span>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={draft.y}
                          onChange={(event) =>
                            setDraft((current) => ({ ...current, y: Number(event.target.value) }))
                          }
                        />
                        <output>{draft.y}%</output>
                      </label>
                      <label>
                        <span>Zoom</span>
                        <input
                          type="range"
                          min={1}
                          max={2}
                          step={0.01}
                          value={draft.zoom}
                          onChange={(event) =>
                            setDraft((current) => ({ ...current, zoom: Number(event.target.value) }))
                          }
                        />
                        <output>{draft.zoom.toFixed(2)}×</output>
                      </label>
                    </div>
                  )}

                  {error && <p className="studio__error" role="alert">{error}</p>}
                  <p className="studio__privacy">
                    Photographs are saved privately in this browser only — they are never uploaded to
                    a server. Keep using the same browser and device to see them.
                  </p>
                </>
              ) : (
                <div className="studio__empty">
                  <span aria-hidden="true">♡</span>
                  <p>Choose a slot on the left to add or replace a photograph.</p>
                  <p className="studio__empty-hint">
                    There are exactly 38 slots: 2 welcome, 2 countdown, 5 hero, 3 gifts, 2 letter,
                    16 memories, 3 wish and 5 finale.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="studio__music">
            <div className="studio__music-copy">
              <p className="studio__eyebrow">Background music</p>
              <h3>{trackName ?? 'No song chosen yet'}</h3>
              <p>
                Add a romantic song you own or have permission to use. Music never autoplays — Faves
                presses play herself, and can pause or change the volume at any time.
              </p>
              <div className="studio__buttons">
                <label className="studio__upload">
                  <input
                    ref={musicRef}
                    type="file"
                    accept="audio/*"
                    onChange={(event) => void handleTrack(event.target.files)}
                  />
                  {busy ? 'Adding…' : trackUrl ? 'Replace song' : 'Choose a song'}
                </label>
                {trackUrl && (
                  <button
                    type="button"
                    className="studio__remove"
                    onClick={() => {
                      void removeTrack();
                      setError(null);
                    }}
                  >
                    Remove song
                  </button>
                )}
              </div>
              {error && <p className="studio__error" role="alert">{error}</p>}
              {trackUrl && (
                <audio className="studio__audio" src={trackUrl} controls preload="metadata">
                  Your browser does not support audio playback.
                </audio>
              )}
              <p className="studio__privacy">
                The song is stored in this browser alongside the photographs, privately.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
