import { ProgressProvider } from './context/ProgressContext';
import { PhotoProvider, usePhotos } from './context/PhotoContext';
import { MoodProvider } from './context/MoodContext';
import Nav from './components/Nav';
import PhotoStudio from './components/PhotoStudio';
import HeartCompanion from './components/HeartCompanion';
import ScrollProgress from './components/ScrollProgress';
import { LegalLayer, openLegal } from './components/Legal';
import Welcome from './sections/Welcome';
import Countdown from './sections/Countdown';
import BirthdayHero from './sections/BirthdayHero';
import GiftRoom from './sections/GiftRoom';
import LoveLetter from './sections/LoveLetter';
import Memories from './sections/Memories';
import MakeAWish from './sections/MakeAWish';
import Finale from './sections/Finale';

function StudioFab() {
  const { openStudio, photoCount } = usePhotos();
  // Owner-only tool: visit the site with ?studio to show it.
  if (!new URLSearchParams(window.location.search).has('studio')) return null;
  return (
    <button
      type="button"
      className="studio-fab"
      onClick={() => openStudio()}
      aria-label="Open the private photo studio to add Faves' 38 photographs"
    >
      <span className="studio-fab__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <rect x="2.5" y="7" width="19" height="13" rx="3" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="12" cy="13.5" r="3.6" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="M8 7l1.4-2.4h5.2L16 7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          <circle cx="18.4" cy="10" r="0.9" fill="currentColor" />
        </svg>
      </span>
      <span className="studio-fab__text">
        Photo studio
        <em>{photoCount}/38 photos</em>
      </span>
    </button>
  );
}

function Experience() {
  return (
    <>
      <a className="skip-link" href="#birthday">
        Skip to Faves&rsquo; birthday ♡
      </a>
      <Nav />
      <main id="main">
        <Welcome />
        <Countdown />
        <BirthdayHero />
        <GiftRoom />
        <LoveLetter />
        <Memories />
        <MakeAWish />
        <Finale />
      </main>
      <footer className="footer">
        <p className="footer__main">Made with love, for Favour Kioko · December 5th ♡</p>
        <p className="footer__small">
          Eight chapters · four little friends · thirty-eight photographs · one very loved girl
        </p>
        <nav className="footer__legal" aria-label="Legal">
          <button type="button" onClick={() => openLegal('cookies')}>Cookie Policy</button>
          <span aria-hidden="true">·</span>
          <button type="button" onClick={() => openLegal('terms')}>Terms &amp; Conditions</button>
          <span aria-hidden="true">·</span>
          <button type="button" onClick={() => window.dispatchEvent(new Event('faves:consent-reset'))}>
            Cookie settings
          </button>
        </nav>
      </footer>
      <HeartCompanion />
      <ScrollProgress />
      <StudioFab />
      <PhotoStudio />
      <LegalLayer />
    </>
  );
}

export default function App() {
  return (
    <PhotoProvider>
      <ProgressProvider>
        <MoodProvider>
          <Experience />
        </MoodProvider>
      </ProgressProvider>
    </PhotoProvider>
  );
}
