import { useEffect, useState } from 'react';
import { site } from '../config/site';
import { useActiveSection } from '../hooks/useActiveSection';
import { scrollToId } from '../lib/scroll';
import MusicPlayer from './MusicPlayer';

const NAV_IDS = site.nav.map((item) => item.id);

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const active = useActiveSection(NAV_IDS);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const go = (id: string) => {
    scrollToId(id);
    setMenuOpen(false);
  };

  return (
    <header className={`nav ${scrolled ? 'is-scrolled' : ''} ${menuOpen ? 'is-menu-open' : ''}`}>
      <div className="nav__inner">
        <a
          href="#home"
          className="nav__brand"
          onClick={(event) => {
            event.preventDefault();
            go('home');
          }}
          aria-label="Faves, my love — back to the beginning"
        >
          <span className="nav__heart" aria-hidden="true">
            <svg viewBox="0 0 32 32">
              <path
                d="M16 28C8 22 3 17 3 11.5 3 7 6.5 4 10.5 4c2.4 0 4.4 1.2 5.5 3 1.1-1.8 3.1-3 5.5-3C25.5 4 29 7 29 11.5 29 17 24 22 16 28Z"
                fill="currentColor"
              />
            </svg>
          </span>
          <span className="nav__brand-text">
            Faves <em>my love</em>
          </span>
        </a>

        <nav className="nav__links" aria-label="Sections of Faves' birthday surprise">
          {site.nav.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`nav__link ${active === item.id ? 'is-active' : ''}`}
              aria-current={active === item.id ? 'true' : undefined}
              onClick={(event) => {
                event.preventDefault();
                go(item.id);
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="nav__actions">
          <MusicPlayer />
          <button
            type="button"
            className="nav__burger"
            aria-expanded={menuOpen}
            aria-controls="nav-drawer"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((current) => !current)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <div className="nav__drawer" id="nav-drawer" hidden={!menuOpen}>
        <nav aria-label="Mobile sections">
          {site.nav.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`nav__drawer-link ${active === item.id ? 'is-active' : ''}`}
              onClick={(event) => {
                event.preventDefault();
                go(item.id);
              }}
            >
              <span aria-hidden="true">♡</span> {item.label}
            </a>
          ))}
        </nav>
        <p className="nav__drawer-note">Made with love, just for you, Faves.</p>
      </div>
    </header>
  );
}
