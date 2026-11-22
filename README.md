# Faves, My Love ♡

A personal, interactive birthday fairytale for **Favour Kioko** — eight chapters, four animated mascot companions, thirty-eight photograph placeholders, and one very important question at the end.

Built with React, TypeScript, Vite and Framer Motion. All copy, dates and photo slots live in central config files so nothing is buried inside components.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # typecheck + production build into dist/
```

## The experience

| Chapter | Section id | What happens |
| --- | --- | --- |
| 1. The magical welcome | `home` | Sealed envelope, wax heart seal, two photos, Heart Buddy waving. Opening it bursts hearts and eases into the story. |
| 2. Birthday countdown | `birthday` | Live days/hours/minutes/seconds until **5 December, Africa/Nairobi**, switching to birthday mode all day on the 5th. |
| 3. Birthday hero | — | Five photos, cake, balloons, confetti, the birthday message, and a kiss from Heart Buddy. |
| 4. Interactive gift room | `surprises` | Three wrapped gifts with ribbons, individual photos and messages, tracked progress, and Bunny Buddy peeking, popping and celebrating. |
| 5. The love letter | `letter` | Warm-cream stationery that unfolds (and refolds), with the full letter and two photographs. |
| 6. Our memories | `memories` | A 16-print scrapbook gallery with polaroid frames, rotations, ribbons, captions and a keyboard-friendly lightbox. |
| 7. Make a wish | — | Pink cake with dancing flames, Strawberry Buddy, three photos, smoke and confetti when the candles are blown. |
| 8. The grand finale | `question` | Rose-petal darkness, five photos, Cupid flying in with a letter, the final question, and both gentle answers honoured. |

Navigation, music controls, scroll progress, reduced-motion support and a replayable ending are included throughout.

## Photographs — all 38 slots

Click **Photo studio** in the bottom-left corner. It lists every slot grouped by section with its id, exact location and a live preview. Add, replace, crop (horizontal, vertical, zoom) or remove each photograph independently; the layout never shifts. Everything is stored privately in the browser (IndexedDB), not on a server.

See [PHOTO-GUIDE.md](PHOTO-GUIDE.md) for the full mapping of `faves-photo-01` … `faves-photo-38`. The slot registry lives in [`src/config/photos.ts`](src/config/photos.ts).

## Music

Open the studio's **Music** tab and add a song you own or have permission to use. Music never autoplays: Faves presses play in the navigation bar, and can pause and set the volume there.

## Configuration

- Copy, gifts, letter and finale text: [`src/config/site.ts`](src/config/site.ts)
- Photo slots, captions, dates and layout metadata: [`src/config/photos.ts`](src/config/photos.ts)
- Countdown logic (Africa/Nairobi, leap years, year rollover): [`src/lib/birthday.ts`](src/lib/birthday.ts)

## Notes

- No stock photographs and no invented memories: empty frames show a designed placeholder with the slot id until a real photo is added.
- The countdown respects `prefers-reduced-motion` and returns to the next year's birthday after 5 December ends.
