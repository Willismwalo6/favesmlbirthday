import { useEffect, useRef, useState } from 'react';
import { site } from '../config/site';
import { usePhotos } from '../context/PhotoContext';

export default function MusicPlayer() {
  const { trackUrl, trackName, openStudio } = usePhotos();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.65);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume, trackUrl]);

  useEffect(() => {
    if (!trackUrl) setPlaying(false);
  }, [trackUrl]);

  const toggle = async () => {
    setError(null);
    if (!trackUrl) {
      openStudio(undefined, 'music');
      return;
    }
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
      return;
    }
    try {
      await audio.play();
      setPlaying(true);
    } catch {
      setError('Your browser blocked playback — tap play once more ♡');
    }
  };

  return (
    <div className={`music ${open ? 'is-open' : ''}`}>
      <button
        type="button"
        className="music__toggle"
        onClick={() => void toggle()}
        aria-pressed={playing}
        aria-label={
          trackUrl
            ? playing
              ? 'Pause background music'
              : 'Play background music'
            : 'Choose a background song (opens the photo studio)'
        }
        title={trackUrl ? (playing ? 'Pause music' : 'Play music') : 'Add a song'}
      >
        <span className={`music__icon ${playing ? 'is-playing' : ''}`} aria-hidden="true">
          {playing ? (
            <svg viewBox="0 0 24 24">
              <rect x="6" y="5" width="4" height="14" rx="1.4" fill="currentColor" />
              <rect x="14" y="5" width="4" height="14" rx="1.4" fill="currentColor" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24">
              <path d="M9 18V6l10-2v11" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              <circle cx="6.5" cy="18" r="2.7" fill="currentColor" />
              <circle cx="16.5" cy="15" r="2.7" fill="currentColor" />
            </svg>
          )}
        </span>
        <span className="music__label">Music</span>
        {trackUrl && (
          <span className={`music__pulse ${playing ? 'is-on' : ''}`} aria-hidden="true" />
        )}
      </button>

      <button
        type="button"
        className="music__more"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-controls="music-panel"
        aria-label="Music settings"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="music__panel" id="music-panel" hidden={!open}>
        <p className="music__track">
          {trackUrl
            ? `${trackName ?? 'Your song'} · plays softly, on repeat ♡`
            : site.music.missing}
        </p>
        {trackUrl ? (
          <label className="music__volume">
            <span>Volume</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={volume}
              onChange={(event) => setVolume(Number(event.target.value))}
              aria-label="Music volume"
            />
          </label>
        ) : (
          <button
            type="button"
            className="music__play"
            onClick={() => {
              setOpen(false);
              openStudio(undefined, 'music');
            }}
          >
            Add a song ♡
          </button>
        )}
        {trackUrl && (
          <button
            type="button"
            className="music__link"
            onClick={() => {
              setOpen(false);
              openStudio(undefined, 'music');
            }}
          >
            Change song
          </button>
        )}
        {error && <p className="music__error">{error}</p>}
      </div>

      {trackUrl && (
        <audio
          ref={audioRef}
          src={trackUrl}
          loop
          preload="metadata"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />
      )}
    </div>
  );
}
