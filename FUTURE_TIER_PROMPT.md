# 🚀 FUTURE TIER — CLAUDE CODE EXECUTION PROMPT

> **Copy this directly into Claude Code after phases 1-7 are complete**
> **Prerequisites:** MOBILE_WOW_ENHANCEMENTS.md phases 1-7 MUST be installed first

---

## YOUR MISSION

Transform this website into something that feels like it came from 2035. Implement phases 8-17 from `FUTURE_TIER_ENHANCEMENTS.md`.

The goal: When someone visits, they should think "How is this even possible? Who built this?"

---

## CRITICAL RULES

1. **Backup first:** `cp index.html index.html.backup.future.$(date +%Y%m%d_%H%M%S)`
2. **Read the full file:** `FUTURE_TIER_ENHANCEMENTS.md` before implementing
3. **Execute phases in order:** 8 → 9 → 10 → 11 → 12 → 13 → 14 → 15 → 16 → 17
4. **Test after each phase** — don't batch
5. **DO NOT modify** existing Three.js, tesseract, or phases 1-7 code

---

## PHASE SUMMARY

| Phase | Feature | Description |
|-------|---------|-------------|
| 8 | Video Portal | Cinematic video background in CTA section |
| 9 | Liquid Reality | Lenis smooth scroll with physics |
| 10 | Sonic Architecture | Tone.js ambient soundscape |
| 11 | Holographic Book | 3D book cover with mouse/gyro tracking |
| 12 | Particle Dissolution | Title dissolves into particles on scroll |
| 13 | Time Consciousness | Site adapts to time of day (dawn/day/dusk/night) |
| 14 | Neural Network | Animated neural network behind concepts |
| 15 | Constellation Progress | Star-based scroll progress indicator |
| 16 | Sentient Cursor | Custom cursor that morphs by context |
| 17 | Quantum Entanglement | Mirror particles that move together |

---

## EXTERNAL DEPENDENCIES

Add these to `<head>` before implementing:

```html
<!-- Lenis Smooth Scroll (Phase 9) -->
<script src="https://unpkg.com/lenis@1.1.13/dist/lenis.min.js"></script>

<!-- Tone.js Audio (Phase 10) -->
<script src="https://unpkg.com/tone@14.7.77/build/Tone.js"></script>
```

---

## VIDEO ASSET PREPARATION (Phase 8)

If video file exists, prepare it:

```bash
# Rename video file
mv "book ad 3.mp4" hero-portal.mp4 2>/dev/null || true

# If ffmpeg available, compress for web
ffmpeg -i hero-portal.mp4 -vcodec libx264 -crf 28 -preset fast -vf scale=720:-2 -an hero-portal-compressed.mp4 2>/dev/null || echo "Skipping compression"

# Create poster frame
ffmpeg -i hero-portal.mp4 -vframes 1 -f image2 hero-portal-poster.jpg 2>/dev/null || echo "Skipping poster"
```

If no video file exists, skip Phase 8.

---

## IMPLEMENTATION ORDER

```
1. Read FUTURE_TIER_ENHANCEMENTS.md completely
2. Add external scripts to <head>
3. Implement Phase 8 (Video Portal) — if video exists
4. Implement Phase 9 (Lenis Scroll)
5. Implement Phase 10 (Audio Engine)
6. Implement Phase 11 (Holographic Book)
7. Implement Phase 12 (Particle Text)
8. Implement Phase 13 (Time Awareness)
9. Implement Phase 14 (Neural Network)
10. Implement Phase 15 (Constellation Nav)
11. Implement Phase 16 (Sentient Cursor)
12. Implement Phase 17 (Quantum Particles)
13. Test all features together
14. Deploy
```

---

## INSERT LOCATIONS

| Content Type | Insert Location |
|--------------|-----------------|
| External scripts | `<head>` before `</head>` |
| New CSS | Before `/* FOOTER */` in `<style>` |
| Time-aware elements | After `<body>` tag |
| Cursor elements | After `<body>` tag |
| Video portal HTML | First child inside CTA section |
| Neural canvas | First child inside Ideas section |
| Constellation nav | Before `</body>` |
| Audio toggle | Before `</body>` |
| All JavaScript | Before closing `})();` |

---

## VERIFICATION COMMANDS

After implementation:

```bash
# Check all phases installed
grep -c "video-portal" index.html        # Phase 8
grep -c "lenis" index.html               # Phase 9
grep -c "SonicArchitecture" index.html   # Phase 10
grep -c "holoBook" index.html            # Phase 11
grep -c "dissolve-text" index.html       # Phase 12
grep -c "TimeConsciousness" index.html   # Phase 13
grep -c "neural-canvas" index.html       # Phase 14
grep -c "constellation-nav" index.html   # Phase 15
grep -c "cursor-dot" index.html          # Phase 16
grep -c "QuantumField" index.html        # Phase 17

# Start server
npx serve . -p 3000
```

---

## TESTING CHECKLIST

**Desktop:**
- [ ] Smooth scroll feels "liquid" (Phase 9)
- [ ] Audio toggle works, ambient sound plays (Phase 10)
- [ ] Book tilts following mouse (Phase 11)
- [ ] Title dissolves when scrolling down (Phase 12)
- [ ] Time-appropriate theme (Phase 13)
- [ ] Neural network animates in Ideas section (Phase 14)
- [ ] Constellation nav appears on scroll (Phase 15)
- [ ] Custom cursor morphs on hover (Phase 16)
- [ ] Quantum particles mirror each other (Phase 17)

**Mobile:**
- [ ] Video plays in CTA section (Phase 8)
- [ ] Touch scroll is smooth (Phase 9)
- [ ] Book tilts with phone gyroscope (Phase 11)
- [ ] Time theme works (Phase 13)
- [ ] No cursor elements visible (Phase 16)

---

## DEPLOYMENT

```bash
git add .
git commit -m "feat: Future Tier enhancements - phases 8-17 (video, audio, 3D, quantum)"
vercel --prod
```

---

## EXPECTED RESULT

**Visitor Experience:**

1. Page loads with liquid-smooth scrolling
2. Stars appear at night, warm glow at dawn/dusk
3. Book cover floats in 3D, tracks their gaze
4. Scrolling down dissolves the title into particles
5. Ideas section has living neural network behind it
6. Constellation navigation lights up as they scroll
7. CTA section has cinematic video bleeding through
8. Quantum particles dance in synchronized pairs
9. Custom cursor morphs and follows with soul
10. Optional: Ambient soundscape hums beneath

**Their thought:** "This isn't a website. This is a PORTAL. Whoever made this is operating on a completely different level. I MUST read this book."

---

**NOW BEGIN. Read FUTURE_TIER_ENHANCEMENTS.md and execute all phases.**
