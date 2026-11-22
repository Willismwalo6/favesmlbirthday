import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { getConsent, setConsent, type Consent } from '../lib/storage';

type Tab = 'cookies' | 'terms';
const EVENT = 'faves:legal';
const UPDATED = '23 November 2026';

export const openLegal = (tab: Tab = 'cookies') =>
  window.dispatchEvent(new CustomEvent<Tab>(EVENT, { detail: tab }));

const ease = [0.22, 1, 0.36, 1] as const;

function CookiePolicy() {
  return (
    <>
      <h3>The short version</h3>
      <p>
        This site is a private birthday gift. It does <strong>not</strong> use advertising, analytics or
        tracking cookies, and it does not sell or share anything about you.
      </p>
      <h3>What is stored on your device</h3>
      <ul>
        <li>
          <strong>Your progress</strong> (local storage, <code>faves-progress-v1</code>): which gifts you
          opened, whether the letter was read, the candles, and your answer, so the story can pick up where
          you left it. Stays on this device only.
        </li>
        <li>
          <strong>Your cookie choice</strong> (local storage, <code>faves-consent-v1</code>): remembers the
          button you pressed so we don&rsquo;t ask again.
        </li>
        <li>
          <strong>Music &amp; photo studio</strong> (IndexedDB, <code>faves-love-studio</code>): only if the
          site owner uses the private studio on their own browser to swap a photograph or add a song. Never
          uploaded anywhere.
        </li>
      </ul>
      <h3>Third parties</h3>
      <p>
        Fonts (Playfair Display, Dancing Script and Poppins) are loaded from Google Fonts. Google receives
        your IP address and browser details to deliver them, under its own privacy policy. No other
        third-party service is contacted.
      </p>
      <h3>Your choices</h3>
      <ul>
        <li>
          <strong>Keep my progress</strong> saves your place on this device.
        </li>
        <li>
          <strong>Essential only</strong> means nothing about your journey is saved; refreshing starts the
          story again.
        </li>
        <li>
          You can change your mind any time with <em>Cookie settings</em> in the footer, or clear this
          site&rsquo;s data in your browser settings.
        </li>
      </ul>
    </>
  );
}

function Terms() {
  return (
    <>
      <h3>1. A gift, shared in good faith</h3>
      <p>
        &ldquo;Faves, My Love&rdquo; is a personal, non-commercial birthday surprise made for Favour Kioko.
        By opening it you agree to these simple terms.
      </p>
      <h3>2. Private by design</h3>
      <p>
        The photographs, letters and messages are personal. Please don&rsquo;t copy, screenshot for sharing,
        republish or redistribute any of it without the creator&rsquo;s permission and the consent of the
        people pictured.
      </p>
      <h3>3. Ownership</h3>
      <p>
        The design, code and written content belong to the creator. Photographs belong to their
        respective owners and are used here with their knowledge for this gift only.
      </p>
      <h3>4. No data collection</h3>
      <p>
        We don&rsquo;t ask for, collect or transmit personal information. The experience works entirely in
        your browser. See the Cookie Policy for what is stored on your device.
      </p>
      <h3>5. As-is, with love</h3>
      <p>
        The site is provided &ldquo;as is&rdquo;, without warranties. Dates and the countdown follow
        Africa/Nairobi time. Animations respect your device&rsquo;s reduced-motion setting. The creator isn&rsquo;t
        liable for any loss arising from its use, to the extent allowed by law.
      </p>
      <h3>6. Changes &amp; contact</h3>
      <p>
        These terms may be updated if the site changes. Questions or removal requests (including for any
        photograph of you) can go to the person who shared this link with you.
      </p>
    </>
  );
}

export function LegalLayer() {
  const [open, setOpen] = useState<Tab | null>(null);
  const [consent, setConsentState] = useState<Consent | null>(() => getConsent());
  const [bannerReady, setBannerReady] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const on = (e: Event) => {
      lastFocus.current = document.activeElement as HTMLElement | null;
      setOpen((e as CustomEvent<Tab>).detail);
    };
    window.addEventListener(EVENT, on);
    return () => window.removeEventListener(EVENT, on);
  }, []);

  // Gentle delay so the banner never competes with the welcome moment.
  useEffect(() => {
    const t = window.setTimeout(() => setBannerReady(true), 2200);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    document.body.classList.add('is-locked');
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.classList.remove('is-locked');
      lastFocus.current?.focus?.();
    };
  }, [open]);

  const choose = useCallback((value: Consent) => {
    setConsent(value);
    setConsentState(value);
  }, []);

  // Footer "Cookie settings" re-opens the banner.
  useEffect(() => {
    const on = () => setConsentState(null);
    window.addEventListener('faves:consent-reset', on);
    return () => window.removeEventListener('faves:consent-reset', on);
  }, []);

  return (
    <>
      <AnimatePresence>
        {bannerReady && !consent && !open && (
          <motion.aside
            className="cookie"
            role="region"
            aria-label="Cookie notice"
            initial={{ opacity: 0, y: 28, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
            transition={{ duration: 0.5, ease }}
          >
            <span className="cookie__icon" aria-hidden="true">
              🍪
            </span>
            <div className="cookie__body">
              <p className="cookie__title">A tiny note about cookies</p>
              <p className="cookie__text">
                No tracking, no ads. We only save your progress on this device so your surprise remembers
                where you were.{' '}
                <button type="button" className="link-btn" onClick={() => openLegal('cookies')}>
                  Read the policy
                </button>
              </p>
              <div className="cookie__actions">
                <button type="button" className="btn-soft btn-soft--primary" onClick={() => choose('all')}>
                  Keep my progress
                </button>
                <button type="button" className="btn-soft" onClick={() => choose('essential')}>
                  Essential only
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            className="legal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setOpen(null)}
          >
            <motion.div
              className="legal__card"
              role="dialog"
              aria-modal="true"
              aria-labelledby="legal-title"
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.38, ease }}
              onClick={(e) => e.stopPropagation()}
            >
              <header className="legal__head">
                <div className="legal__tabs" role="tablist" aria-label="Legal documents">
                  {(['cookies', 'terms'] as Tab[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      role="tab"
                      aria-selected={open === t}
                      className={`legal__tab ${open === t ? 'is-active' : ''}`}
                      onClick={() => setOpen(t)}
                    >
                      {t === 'cookies' ? 'Cookie Policy' : 'Terms & Conditions'}
                      {open === t && <motion.span layoutId="legal-ink" className="legal__ink" />}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  ref={closeRef}
                  className="legal__close"
                  onClick={() => setOpen(null)}
                  aria-label="Close"
                >
                  ✕
                </button>
              </header>
              <div className="legal__body" id="legal-title" tabIndex={-1}>
                <p className="legal__updated">Last updated {UPDATED}</p>
                {open === 'cookies' ? <CookiePolicy /> : <Terms />}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
