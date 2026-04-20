# 🔬 Thickness of Wire using Laser Diffraction

> An interactive browser-based physics lab simulation for measuring the thickness of thin wires — including human hair — using single-slit laser diffraction and Babinet's Principle.
> Built entirely with vanilla HTML, CSS, and JavaScript. No installation, no frameworks, no backend.

<br>

---

## 🌐 Live Demo

**[▶ Click here to open the simulation](https://vinaytomar-xm.github.io/thickness_wire/)**

> Works in any modern browser (Chrome, Firefox, Edge). No download required.

---

## 👨‍💻 Author

| Platform | Link |
|----------|------|
| 🔵 LinkedIn | [Vinay Singh Tomar](https://linkedin.com/in/vinay-singh-tomar-5b65b9377) |
| 🐙 GitHub | [Vinaytomar-xm](https://github.com/Vinaytomar-xm) |

---

## 📌 What Is This?

This is a **fully interactive virtual physics experiment** that simulates what happens in a real optics laboratory when you shine a laser at a thin wire. The wire diffracts the laser beam, creating a pattern of bright and dark bands on a screen. By measuring the width of these bands, you can calculate the exact thickness of the wire using a simple formula.

The simulation faithfully recreates:
- The laser beam, wire holder, and screen setup on an HTML5 canvas
- The real sinc² intensity diffraction pattern, changing live with both D and d sliders
- Realistic measurement noise (±2.5%) so each D reading gives a slightly different b — just like a real lab ruler
- Dynamic limit warnings that appear at the exact threshold D where the pattern becomes unmeasurable
- Full observation tables, mean ± σ calculation, b vs D graph, theory, procedure, and quiz

This project can be used as a **pre-lab preparation tool**, a **virtual experiment substitute**, or a **classroom teaching demonstration**.

---

## ⚙️ The Physics — From Scratch

### What is Diffraction?

When light passes close to the edge of an obstacle — like a thin wire — it bends around the edges instead of travelling straight. This bending is called **diffraction**. On a screen placed behind the wire, the result is a symmetric pattern of alternating bright and dark bands.

### Babinet's Principle

A key idea that makes this experiment work: **the diffraction pattern produced by a thin opaque wire is identical to the pattern produced by a transparent slit of the same width.** This is Babinet's Principle. All the well-established single-slit diffraction mathematics applies directly to the wire.

### Deriving the Formula Step by Step

For a wire of thickness `d`, the condition for the **first dark fringe** on either side of the bright central band is:

```
d · sin θ = λ
```

where `θ` = angle of first dark fringe, `λ` = laser wavelength.

For small angles (valid here): `sin θ ≈ tan θ = b / D`

where `D` = wire-to-screen distance, `b` = half-width of central maxima.

Substituting and rearranging:

```
┌──────────────────────────┐
│    d  =  D  ×  λ  /  b   │
└──────────────────────────┘
```

| Symbol | Meaning | Unit |
|--------|---------|------|
| `d` | Wire thickness — the result | mm |
| `D` | Wire-to-screen distance — set by slider | mm |
| `λ` | Laser wavelength — known constant | nm → mm |
| `b` | Half-width of central maxima — measured | mm |

### Full Intensity Distribution

```
I(θ) = I₀ · (sin β / β)²    where β = π·d·sinθ / λ
```

- Centre (β = 0): I = I₀ — maximum brightness
- At β = π, 2π, 3π …: I = 0 — dark fringes
- Central band is the widest and brightest; each side lobe is progressively dimmer

---

## 🔦 Laser Sources

Changing the laser changes λ, which directly changes fringe width `b = Dλ/d`:

| Laser | Wavelength | Colour | b relative to He-Ne |
|-------|-----------|--------|---------------------|
| He-Ne (Helium-Neon) | 632.8 nm = 6328 Å | 🔴 Red | baseline |
| Green (DPSS) | 532.0 nm | 🟢 Green | ~16% narrower |
| Blue (diode) | 473.0 nm | 🔵 Blue | ~25% narrower |
| Violet (diode) | 405.0 nm | 🟣 Violet | ~36% narrower |

Longer wavelength → wider fringes. Shorter wavelength → narrower fringes. Switching lasers live updates the pattern colour and fringe spacing instantly.

---

## 🧪 Wire Specimens

| Wire | Description | d (mm) | d (µm) | Valid D Range | b at D=1000mm (He-Ne) |
|------|-------------|--------|--------|---------------|----------------------|
| W0 | Thin wire | 0.05000 | 50 µm | 700 – 1300 mm | 12.66 mm |
| W1 | Wire 1 | 0.10547 | 105 µm | 700 – 1500 mm | 5.99 mm |
| W2 | Wire 2 | 0.18000 | 180 µm | 700 – 1500 mm | 3.52 mm |
| W3 | Wire 3 | 0.24543 | 245 µm | 700 – 1500 mm | 2.58 mm |
| W4 | Wire 4 | 0.35000 | 350 µm | 700 – 1500 mm | 1.81 mm |
| W5 | Wire 5 | 0.48000 | 480 µm | 700 – 1500 mm | 1.32 mm |
| W6 | Thick wire | 1.50000 | 1500 µm | 900 – 1500 mm | 0.42 mm |
| **W7** | **Human Hair** | **0.07000** | **70 µm** | **700 – 1500 mm** | **9.04 mm** |

> **b ∝ 1/d** — doubling wire thickness halves fringe width. This is directly observable by switching between wires at the same D.

---

## 🦱 Human Hair (W7) — Physics and Background

### Why Hair?

Human hair is one of the most famous objects in optical diffraction demonstrations. It sits in a sweet spot: thin enough that laser light diffracts with a clearly visible and easily measurable fringe pattern, thick enough that the pattern does not overflow a standard screen.

### Typical Thickness

Human hair ranges from about **40–100 µm** depending on genetics, age, and hair type. Fine hair ≈ 50–60 µm, average hair ≈ 70 µm, coarse hair ≈ 90–100 µm. This simulation uses **d = 70 µm = 0.07 mm** as a representative value.

### Worked Calculation

```
At D = 1000 mm, He-Ne laser (λ = 632.8 nm = 6.328 × 10⁻⁴ mm):

b = D × λ / d
b = 1000 × 6.328×10⁻⁴ / 0.07
b = 0.6328 / 0.07
b = 9.04 mm

The central bright band is ~18 mm wide on screen — very clearly visible.
```

### Why the Formula Still Works

Hair is roughly circular/oval in cross-section, not a flat rectangle. However, by Babinet's Principle, the fringe **positions** (dark fringe locations) depend only on the projected width — the same as a flat slit of equal width. So `d = Dλ/b` gives the correct diameter to within the measurement precision of the experiment.

### Comparison with Other Wires in This Simulation

```
Wire     d (mm)     b at D=1000mm    Fringes (wider = easier to see)
W1       0.10547    5.99 mm          ████████████
W7 Hair  0.07000    9.04 mm          ██████████████████   ← widest among visible wires
W0       0.05000    12.66 mm         ████████████████████████  ← close to overflow at high D
```

Human hair produces noticeably wider fringes than W1, making it an excellent demonstration specimen. Try it on D = 1000 mm and compare side-by-side with W1.

---

## ⚠️ Experimental Limitations

### Case 1 — Wire Too Thin (Pattern Overflows Screen)

When `d` is small, `b = Dλ/d` is large. If b is larger than the screen dimensions, the first dark fringe falls outside — b cannot be measured.

**In this simulation:**
- **W0** (d = 0.05 mm): Pattern visible at D = 700–1300 mm. At D ≥ 1400 mm, the central maxima overflows and the warning appears live
- The transition is gradual and observable — drag D from 1300 → 1400 on W0 and watch it happen

**Real-world reference:**
| Object | d | b at D=1000mm | Status |
|--------|---|---------------|--------|
| Spider silk | ~0.003 mm | ~211 mm | ❌ Never fits on screen |
| W0 (this sim) | 0.050 mm | 12.7 mm | ✅ Fits at D ≤ 1300 mm |
| Human hair | 0.070 mm | 9.0 mm | ✅ Full range |

### Case 2 — Wire Too Thick (Fringes Unresolvable)

When `d` is large, `b` is tiny. If b < ~0.5 mm (human eye resolution / ruler least count), individual dark fringes cannot be distinguished — the pattern looks like a single bright dot.

**In this simulation:**
- **W6** (d = 1.50 mm): Fringes unresolvable at D ≤ 800 mm. At D ≥ 900 mm, b is just large enough and the pattern appears

**Real-world reference:**
| Object | d | b at D=1000mm | Status |
|--------|---|---------------|--------|
| W6 (this sim) | 1.50 mm | 0.42 mm | ❌ At D ≤ 800 mm |
| W6 (this sim) | 1.50 mm | 0.57 mm | ✅ At D = 900 mm |
| Steel rod | 3.00 mm | 0.21 mm | ❌ Never resolvable |

### Live Transition (Key Feature)

This simulation shows the **exact transition moment** dynamically — not just a static warning. The diffraction pattern is drawn correctly right up to the threshold, and the warning replaces it only when that exact threshold is crossed. This directly demonstrates *why* the limits exist rather than just stating them.

---

## 🎛️ Wire Diameter Slider — Continuous d Variation

A **Wire d slider** (range: 0.02 → 2.00 mm, step: 0.01 mm) lets you continuously vary the effective wire thickness in real time — exactly like the D slider varies screen distance.

**What changes as you move the slider:**
- `b = Dλ/d` recalculates instantly → pattern on canvas updates on the same animation frame
- Slide **left** (smaller d) → b increases → fringes spread wider → eventually overflow warning (too thin)
- Slide **right** (larger d) → b decreases → fringes compress → eventually unresolvable warning (too thick)
- A **CUSTOM** badge appears when slider value differs from the selected wire button's preset d
- Clicking any wire button resets slider to that wire's exact d and hides the badge

**Why this is useful:**
This slider is the most direct way to observe the `b ∝ 1/d` relationship and to sweep through both measurement limits in one continuous motion — something impossible to do in a real lab without physically swapping wires.

---

## 🧮 Measurement Noise and Why d_calc Varies

In a real experiment, every time you measure b with a ruler there is a small reading error — maybe ±0.5 mm depending on the scale and lighting. This means that at D = 1000 mm and D = 1100 mm, even if the physics is the same, your measured b values will differ slightly, giving slightly different d_calc values.

This simulation reproduces this using **seeded pseudo-random noise** of ±2.5%:

```javascript
b_meas = b_true × (1 + noise × seededRand(wi × 1000 + D + laser × 100))
```

The seed depends on wire index, D value, and laser type — so the same setup always gives the same b (the experiment is reproducible), but different D values give different b values. This is why taking 5 readings at 5 different D values and computing the mean gives a better estimate than a single reading.

Standard deviation σ is shown alongside the mean to quantify the spread.

---

## 🖥️ Simulation Tabs

| Tab | What It Contains |
|-----|-----------------|
| **Simulation** | Canvas animation + live controls + observation table |
| **Theory** | Full derivation, Babinet's Principle, intensity formula, limitations, Human Hair |
| **Procedure** | Real lab steps, apparatus list, safety, simulation guide, lab record format |
| **Graph** | b vs D chart with best-fit lines and slope → d calculation |
| **Quiz** | 8 MCQs with instant correct/wrong feedback and explanations |

---

## 🚀 How to Run

### Online (Easiest)
Visit **[https://vinaytomar-xm.github.io/thickness_wire/](https://vinaytomar-xm.github.io/thickness_wire/)**

### Local
```bash
git clone https://github.com/Vinaytomar-xm/thickness_wire.git
cd thickness_wire

# Open directly — no server required
open index.html          # macOS
start index.html         # Windows
xdg-open index.html      # Linux
```

---

## 📋 Step-by-Step Usage Guide

```
1.  Open simulation (browser or local)

2.  SELECT LASER SOURCE
    He-Ne (default) → red beam, λ = 632.8 nm
    Green / Blue / Violet → narrower fringes

3.  SELECT WIRE
    W1–W5  → standard experiment range, always valid
    W7     → Human Hair, d = 0.07 mm, wide fringes
    W0     → thin wire, valid only at D ≤ 1300 mm
    W6     → thick wire, valid only at D ≥ 900 mm

4.  TURN LASER ON
    Click red button → beam appears, animation starts
    Add Reading and Calculate are now unlocked

5.  VARY D SLIDER (700 → 1500 mm)
    Watch fringes physically expand on screen as D increases
    b value in readout updates live

6.  VARY WIRE d SLIDER (0.02 → 2.00 mm)
    Watch fringes widen as d decreases, narrow as d increases
    CUSTOM badge appears if slider differs from preset wire d

7.  ADD READINGS
    Set a D value, click [＋ Add Reading]
    Repeat at 5 different D values (e.g. 700, 900, 1100, 1300, 1500)
    Each reading stores b_meas with ±2.5% noise

8.  CALCULATE MEAN
    Click [▶ Calculate Mean d]
    d_calc fills in for each row
    Mean d̄ ± σ shown at bottom of wire block

9.  GRAPH TAB
    Click Refresh Graph
    See b vs D straight lines per wire
    Slope = λ/d → d = λ/slope computed for each

10. QUIZ TAB
    8 questions — test understanding of key concepts
```

---

## 📁 File Structure

```
thickness_wire/
├── index.html        ← Tabs, panels, canvas, all HTML structure
├── script.js         ← Physics engine, canvas rendering, UI logic,
│                        tables, graph, quiz, noise model
├── styles.css        ← Full dark-theme CSS, grid layout, animations
├── Readme.md         ← This file
├── vinay.jpeg        ← Open Graph / social preview image
└── vinay2.jpeg       ← Browser tab favicon
```

---

## 🛠️ Tech Stack

| Technology | Version | Usage |
|-----------|---------|-------|
| HTML5 Canvas API | Native | Laser, wire, beam, diffraction pattern drawing |
| Vanilla JavaScript (ES6+) | Native | Physics, state, rendering, seeded noise |
| CSS3 | Native | Layout (Grid + Flex), dark theme, transitions |
| Chart.js | 4.4.1 via cdnjs | b vs D scatter plot with regression lines |

**Zero npm packages. Zero build step. Zero bundler. One CDN script tag.**

---

## 🔧 Implementation Notes

### Sinc² Pattern Rendering
The diffraction pattern is rendered pixel-by-pixel into an `ImageData` buffer using `sinc²(β)` where `β = π·d·sinθ/λ`. Gamma correction (`I^0.55`) and laser colour tinting give a photorealistic appearance.

### Fixed Scale Anchor
The mm-to-pixel scale is anchored at D_ref = 700 mm on Wire 1. As D increases, the same number of mm spans more pixels — so the pattern visually expands exactly as it does in a real lab.

### Dynamic Limit Detection
No wire has a hardcoded "always blocked" state. `getWireLimit()` computes `b_px` on every frame:
- `b_px ≥ 46% of screen height` → overflow warning (too thin)
- `b_px < 5 pixels` → unresolvable warning (too thick)
- Otherwise → draw full pattern

This is why W0 at D=700mm shows a real pattern, but at D=1400mm shows the warning.

### Seeded Noise
`seededRand(seed) = frac(sin(seed+1) × 43758.5)` — same wire+D+laser always gives the same b_meas (reproducible session), but different D values give different seeds → different b → realistic d_calc variation.

---

## ⚠️ Safety (For Real Lab Reference)

> **LASER SAFETY**: Never look directly into the laser beam or its specular reflection from any surface. Even brief exposure to a He-Ne (1–5 mW) or green DPSS laser can cause permanent retinal damage. Always use laser safety goggles rated for the specific wavelength. Point the laser only at the screen. Keep the beam path clear of people.

---

## 📄 License

Open source — free for educational and academic use.

---

*Made with ❤️ by **Vinay Singh Tomar***
*B.tech Physics — Laser Diffraction Virtual Lab*