# 🚨 EMERGENCY ROLLBACK FIXES
## Reversing the Nuclear Fix Damage

The nuclear fix added CSS rules that are **cutting off and hiding content**. Here are the exact lines to fix:

---

## PROBLEM 1: snap-section forcing max-height (Lines 7844-7866)

### REMOVE THIS ENTIRE BLOCK (Lines 7844-7896):

```css
/* DELETE THIS ENTIRE SECTION - IT'S BREAKING EVERYTHING */

.snap-section {
    scroll-snap-align: start;
    scroll-snap-stop: always;
    min-height: 100vh;
    min-height: 100dvh;
    max-height: 100vh;        /* ← DELETE THIS LINE */
    max-height: 100dvh;       /* ← DELETE THIS LINE */
    height: 100vh;            /* ← DELETE THIS LINE */
    height: 100dvh;           /* ← DELETE THIS LINE */
    overflow: hidden;         /* ← DELETE THIS LINE */
    display: flex;            /* ← DELETE THIS LINE */
    flex-direction: column;   /* ← DELETE THIS LINE */
    justify-content: center;  /* ← DELETE THIS LINE */
    align-items: center;      /* ← DELETE THIS LINE */
    box-sizing: border-box;
    padding-top: max(5rem, calc(var(--ticker-height, 40px) + var(--nav-height, 60px) + 1rem));
    padding-bottom: 2rem;
    padding-left: 2rem;
    padding-right: 2rem;
}

/* Force section content to fit within viewport */
.snap-section > *:not(.neural-canvas):not(.particle-canvas):not(canvas) {
    max-height: calc(100vh - 10rem);     /* ← DELETE ENTIRE RULE */
    max-height: calc(100dvh - 10rem);
    width: 100%;
    overflow: hidden;
}

.snap-section .section-inner,
.snap-section .container,
.snap-section > div:first-child:not(canvas) {
    max-height: calc(100vh - var(--ticker-height, 40px) - var(--nav-height, 60px) - 6rem);  /* ← DELETE ENTIRE RULE */
    max-height: calc(100dvh - var(--ticker-height, 40px) - var(--nav-height, 60px) - 6rem);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
}
```

### REPLACE WITH THIS SAFE VERSION:

```css
.snap-section {
    scroll-snap-align: start;
    scroll-snap-stop: always;
    min-height: 100vh;
    min-height: 100dvh;
    /* Ensure content isn't hidden behind ticker */
    padding-top: max(2rem, env(safe-area-inset-top));
}
```

---

## PROBLEM 2: ideas-grid max-height (Lines 1167-1170)

### CURRENT (BROKEN):
```css
.ideas-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 1fr);
    gap: 1rem;
    width: 100%;
    max-width: 1400px;
    max-height: calc(100vh - 14rem);      /* ← DELETE */
    max-height: calc(100dvh - 14rem);     /* ← DELETE */
    overflow: hidden;                      /* ← DELETE */
}
```

### REPLACE WITH:
```css
.ideas-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 2rem;
}
```

---

## PROBLEM 3: idea-card padding too small (Line 1175)

### CURRENT (BROKEN):
```css
.idea-card {
    padding: 1rem 1.25rem;  /* Too small! */
}
```

### REPLACE WITH:
```css
.idea-card {
    padding: 2.5rem;
}
```

---

## PROBLEM 4: timeline-evidence max-height (Lines 6171-6172)

### CURRENT (BROKEN):
```css
.timeline-evidence-inner {
    max-height: calc(100vh - 12rem);
    overflow: hidden;
}
```

### FIX:
Remove the `max-height` and `overflow: hidden` lines entirely.

---

## PROBLEM 5: evidence-locker max-height (Line 6248)

### CURRENT (BROKEN):
```css
.evidence-locker-inner {
    max-height: calc(100vh - var(--ticker-height, 40px) - var(--nav-height, 60px) - 3rem);
    overflow: hidden;
}
```

### FIX:
Remove the `max-height` and `overflow: hidden` lines entirely.

---

## PROBLEM 6: hrih-content max-height (Lines 4466-4467)

### CURRENT (BROKEN):
```css
.hrih-section .hrih-content {
    max-height: calc(100vh - var(--ticker-height, 40px) - var(--nav-height, 60px) - 2rem);
    overflow: hidden;
}
```

### FIX:
Remove the `max-height` and `overflow: hidden` lines entirely.

---

# 🔧 QUICK FIX COMMAND

Run this find/replace in your code editor:

1. **Find:** `max-height: 100vh;`  
   **Replace with:** `/* max-height: 100vh; DISABLED */`

2. **Find:** `max-height: 100dvh;`  
   **Replace with:** `/* max-height: 100dvh; DISABLED */`

3. **Find:** `max-height: calc(100vh`  
   **Replace with:** `/* max-height: calc(100vh`

4. **Find:** `height: 100vh;`  
   **Replace with:** `/* height: 100vh; DISABLED */`

5. **Find:** `height: 100dvh;`  
   **Replace with:** `/* height: 100dvh; DISABLED */`

6. For ALL sections with `overflow: hidden` inside snap-section rules, change to:
   **Replace with:** `overflow: visible;`

---

# 🎯 THE ROOT CAUSE

The nuclear fix added these rules that are **cutting off content**:

1. `max-height: 100vh` on `.snap-section` - Forces sections to EXACT viewport height
2. `height: 100vh` on `.snap-section` - Same problem
3. `overflow: hidden` everywhere - HIDES anything that exceeds the height
4. `max-height: calc(100vh - Xrem)` on children - Further constrains content

**These rules are TOO AGGRESSIVE.** Content like your ideas grid, evidence locker, and HRIH sections have MORE content than fits in 100vh, so they get CUT OFF.

---

# ✅ SAFE SNAP-SECTION CSS

Replace the entire broken snap-section block with this SAFE version:

```css
/* ═══════════════════════════════════════════════════════════════════════
   SAFE SNAP SECTION - Without content-cutting max-height
   ═══════════════════════════════════════════════════════════════════════ */
.snap-section {
    scroll-snap-align: start;
    scroll-snap-stop: always;
    min-height: 100vh;
    min-height: 100dvh;
    /* NO max-height - allow content to determine height */
    /* NO overflow: hidden - allow content to be visible */
    padding-top: max(2rem, env(safe-area-inset-top));
}

/* Smaller snap sections - align but don't force stop */
.snap-point {
    scroll-snap-align: start;
    scroll-snap-stop: normal;
}
```

This maintains scroll-snap behavior WITHOUT cutting off content.
