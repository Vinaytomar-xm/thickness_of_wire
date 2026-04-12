# Experiment 1 — Thickness of Wire using Laser Diffraction

> **An interactive physics simulation** — measure wire thickness (including human hair) using laser diffraction. Built with vanilla HTML/CSS/JS. No install needed.

---

## 🌐 Live Demo

**[▶ Open Simulation](https://vinaytomar-xm.github.io/thickness_wire/)**

---

## 🔗 Links

| | |
|---|---|
| **LinkedIn** | [Vinay Singh Tomar](https://linkedin.com/in/vinay-singh-tomar-5b65b9377) |
| **GitHub** | [Vinaytomar-xm](https://github.com/Vinaytomar-xm) |

---

## 📌 About

A fully browser-based physics lab simulation. Uses **single-slit laser diffraction** via **Babinet's Principle** to calculate wire thickness from the fringe pattern on a screen. Supports 4 laser wavelengths, 8 wire specimens (including human hair), live fringe animation, and a continuous wire-diameter slider.

---

## ⚙️ Physics Formula

```
d = D × λ / b
```

| Symbol | Meaning |
|--------|---------|
| `d` | Wire thickness (calculated) |
| `D` | Wire-to-screen distance (mm) |
| `λ` | Laser wavelength (nm) |
| `b` | Half-width of central maxima (mm) |

---

## 🔦 Laser Sources

| Laser | Wavelength | Colour |
|-------|-----------|--------|
| He-Ne | 632.8 nm | 🔴 Red |
| Green | 532.0 nm | 🟢 Green |
| Blue  | 473.0 nm | 🔵 Blue |
| Violet | 405.0 nm | 🟣 Violet |

---

## 🧪 Wire Specimens

| Wire | Description | d (mm) | Valid D Range |
|------|-------------|--------|---------------|
| W0 | Thin wire | 0.05000 | 700 – 1300 mm |
| W1 | Wire 1 | 0.10547 | 700 – 1500 mm |
| W2 | Wire 2 | 0.18000 | 700 – 1500 mm |
| W3 | Wire 3 | 0.24543 | 700 – 1500 mm |
| W4 | Wire 4 | 0.35000 | 700 – 1500 mm |
| W5 | Wire 5 | 0.48000 | 700 – 1500 mm |
| W6 | Thick wire | 1.50000 | 900 – 1500 mm |
| **W7** | **Human Hair** | **0.07000** | 700 – 1500 mm |

> W0 overflows screen at D ≥ 1400 mm. W6 fringes become unresolvable at D ≤ 800 mm. Both show the **live limit transition** — pattern visible until the threshold, warning appears only when crossed.

---

## 🖥️ Key Features

| Feature | Description |
|---------|-------------|
| **Live diffraction pattern** | sinc² intensity, expands as D increases |
| **Wire d slider** | Vary wire diameter 0.02–2.00 mm continuously — watch fringes widen/narrow in real time, just like the D slider |
| **Dynamic limits** | W0 and W6 show real pattern until threshold D is crossed, then warning appears |
| **4 laser sources** | He-Ne, Green, Blue, Violet — pattern colour + λ change live |
| **Measurement noise** | ±2.5% seeded variation in b → different d_calc per D → realistic mean |
| **Observation table** | Records b and d_calc per reading, computes mean ± σ |
| **Laser lock** | Add/Calculate disabled until laser is ON |
| **b vs D graph** | Chart.js scatter plot with slope → d calculation |
| **Theory tab** | Full derivation, limitations with exact thresholds, Human Hair explanation |
| **Procedure tab** | Real lab steps + simulation guide |
| **Quiz tab** | 8 MCQs with instant feedback |

---

## 🎯 Wire Diameter Slider — How It Works

The **Wire d slider** (0.02 → 2.00 mm) continuously varies the effective wire thickness:

- **Decrease d** → b = Dλ/d gets larger → fringes spread wider → eventually overflows (too thin limit)
- **Increase d** → b gets smaller → fringes compress → eventually unresolvable (too thick limit)
- When slider differs from the selected wire button's d, a **CUSTOM** tag appears
- Clicking any wire button resets the slider to that wire's exact d
- This lets you see both limitation thresholds live in one sweep

---

## 🦱 Human Hair (W7) — Physics

Human hair thickness is typically **60–100 µm**. Modelled here as **d = 70 µm = 0.07 mm**.

```
At D = 1000 mm, He-Ne laser (λ = 632.8 nm):
b = D × λ / d = 1000 × 0.0006328 / 0.07 = 9.04 mm
```

This is wide enough to measure clearly on a screen. By Babinet's Principle, the diffraction pattern of hair is identical to a slit of the same width — the fringe positions are exact. Hair is one of the classic demonstration objects for this experiment.

---

## 🚀 How to Use

1. Open `index.html` locally **or** visit the [Live Demo](https://vinaytomar-xm.github.io/thickness_wire/)
2. Select a **laser source**
3. Select a **wire** (try W7 for human hair)
4. Turn the **Laser ON**
5. Move **D slider** → watch fringes expand/compress
6. Move **Wire d slider** → watch fringes widen (thinner) or narrow (thicker)
7. Click **＋ Add Reading** at 5 different D values
8. Click **▶ Calculate Mean d** → get d̄ ± σ
9. Visit **Graph** tab → see b vs D straight line → slope = λ/d

---

## 📁 File Structure

```
index.html     ← Main HTML (tabs, panels, canvas)
script.js      ← Physics engine + UI logic
styles.css     ← Dark theme, layout, components
Readme.md      ← This file
vinay.jpeg     ← OG image
vinay2.jpeg    ← Favicon img
```

---

## 🛠️ Tech Stack

| Technology | Usage |
|-----------|-------|
| HTML5 Canvas | Laser setup + diffraction animation |
| Vanilla JS | Physics, UI state, rendering |
| Chart.js (CDN) | b vs D graph |
| CSS3 | Dark theme, grid layout, animations |

Zero frameworks. Zero build tools. One CDN dependency (Chart.js).

---

## ⚠️ Lab Precautions

1. Never look into the laser beam — permanent eye damage risk
2. Dark room for clear fringe visibility
3. Measure b from exact centre of bright fringe to first dark fringe
4. Do not disturb laser/wire position during readings
5. Take mean of ≥ 5 readings to reduce random error

---

*Made with ❤️ by Vinay Singh Tomar*