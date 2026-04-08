# 🔬 Virtual Optics Lab — Thickness of Wire using He-Ne Laser Diffraction

> **Experiment 1** · Physics Virtual Lab · Medicaps University  
> A fully interactive, browser-based simulation for determining wire thickness using laser diffraction.

---

## 📋 Project Summary

This is a **single-file HTML virtual laboratory** that simulates the real physics experiment of determining the thickness of a thin wire using He-Ne laser diffraction (Babinet's Principle). Students can interact with all parameters, observe real-time diffraction patterns, record observations, calculate results, and verify them via graphs — all in the browser, with zero installation.

---

## ✨ Features

| Feature | Description |
|---|---|
| **4 Laser Sources** | He-Ne (632.8 nm), Green (532 nm), Blue (473 nm), Violet (405 nm) — beam colour changes live |
| **5 Wires** | Increasing thickness from W1 (0.105 mm) to W5 (0.480 mm) |
| **Live Canvas Animation** | Real-time laser beam, wire, screen, diffraction pattern via HTML Canvas API |
| **Diffraction Pattern Spreading** | Pattern physically expands as D increases — matches real lab behaviour |
| **Auto b Calculation** | b = Dλ/d with ±2.5% seeded noise for realistic variation |
| **Observation Tables** | 5 separate tables (one per wire), d_calc shown only after Calculate is clicked |
| **Mean & Std Dev** | σ calculated across all readings per wire on Calculate click |
| **Graph (b vs D)** | Chart.js scatter plot with linear regression, slope = λ/d verified |
| **Theory Tab** | Complete beginner-friendly theory from scratch |
| **Procedure Tab** | Real lab + simulation steps, safety, lab record format |
| **Quiz Tab** | 8 MCQs with instant feedback and score |
| **Laser Lock** | Add Reading / Calculate locked until Laser is ON |
| **Demo Data** | One-click load of all 5 wires × 5 D values |
| **No Installation** | Pure HTML/CSS/JS, open directly in browser |

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Structure** | HTML5 | Single-file app, all tabs, panels, tables |
| **Styling** | CSS3 | Dark theme, CSS variables, Grid, Flexbox, animations |
| **Fonts** | Google Fonts | Orbitron (headers), Rajdhani (body), Share Tech Mono (data) |
| **Physics Rendering** | HTML5 Canvas API | Laser beam, wire, screen, diffraction pattern (pixel-by-pixel) |
| **Graphing** | Chart.js 4.4.1 (CDN) | b vs D scatter plot with linear regression |
| **Logic** | Vanilla JavaScript (ES6+) | All physics, UI state, calculations |
| **No frameworks** | — | No React, Vue, Angular, Node — pure browser |

---

## 🔧 JavaScript Functions Reference

### Physics Functions
| Function | Parameters | Returns | Description |
|---|---|---|---|
| `getLambdaMM()` | — | `number` (mm) | Returns active laser wavelength in mm |
| `getBTrue(D, wi)` | D: mm, wi: wire index | `number` (mm) | Ideal b = Dλ/d (no noise) |
| `getBMeasured(D, wi)` | D: mm, wi: wire index | `number` (mm) | b with ±2.5% seeded noise |
| `getDcalc(D, b)` | D: mm, b: mm | `number` (mm) | d = Dλ/b |
| `sinc2(x)` | x: beta angle | `number` 0–1 | Sinc² function for intensity: (sinx/x)² |
| `seededRand(seed)` | seed: number | `number` 0–1 | Reproducible pseudo-random (sin-based) |

### UI Builder Functions
| Function | Description |
|---|---|
| `buildLaserGrid()` | Creates 4 laser selector buttons with colour coding |
| `buildWireGrid()` | Creates 5 wire selector buttons |
| `selectLaser(i)` | Switches active laser, updates beam colour, header, readout |
| `selectWire(i)` | Switches active wire, updates readout |
| `updateReadout()` | Refreshes all live parameter display values |
| `onDChange()` | Called on D slider input — updates D_mm, readout, triggers flash |

### Canvas / Drawing Functions
| Function | Description |
|---|---|
| `resizeCanvas()` | Sets canvas dimensions to parent size (with zero-guard), calls draw() |
| `draw(W, H)` | Master draw function — grid, setup, diffraction, flash overlay |
| `drawGrid(W, H)` | Draws background dot-grid |
| `drawSetup(W, H)` | Draws laser box, beam, wire, screen, D arrow |
| `drawDiffractionScreen(W, H)` | Pixel-by-pixel sinc² intensity rendering with fixed mmPerPx scale |
| `animLoop()` | requestAnimationFrame loop — runs when laser is ON |

### Data / Experiment Functions
| Function | Description |
|---|---|
| `addReading()` | Saves current {D, b_true, b_meas, d_calc:null} to readings[activeWire] |
| `calculateAll()` | Computes d_calc = Dλ/b_meas for every reading, then mean + σ per wire |
| `clearAll()` | Clears all readings arrays, re-renders empty tables |
| `loadDemo()` | Fills all 5 wires with D = [700,900,1100,1300,1500] mm sample data |
| `renderTables()` | Re-renders all 5 wire observation tables from readings[] state |

### Graph Functions
| Function | Description |
|---|---|
| `refreshGraph()` | Destroys old Chart.js instance, creates new scatter plot from readings |
| `showPage(id, el)` | Tab switcher — shows correct .page div, activates .ntab |

### Quiz Functions
| Function | Description |
|---|---|
| `buildQuiz()` | Renders all 8 MCQ questions from QUIZ array |
| `selectQ(i, j)` | Records answer selection, highlights border |
| `submitQuiz()` | Grades all answers, shows correct/wrong, reveals feedback |
| `resetQuiz()` | Clears selections, re-renders quiz |

### Helpers
| Function | Description |
|---|---|
| `hexToRgb(hex)` | Converts #rrggbb → "r,g,b" string for rgba() |
| `hexToRgbArr(hex)` | Converts #rrggbb → [r,g,b] array for Canvas pixel data |

---

## 📐 Physics Behind the Simulation

```
Experiment:  He-Ne Laser → Thin Wire → Screen
Principle:   Babinet's Principle (wire ≡ complementary slit)

Condition for 1st dark fringe:
    d · sin θ = λ

Small angle approximation (sin θ ≈ tan θ = b/D):
    d · (b/D) = λ

Working formula:
    d = D × λ / b

Intensity distribution:
    I(θ) = I₀ · (sin β / β)²
    where β = π · d · sin θ / λ

Diffraction scaling:
    b ∝ D        (larger distance → wider pattern)
    b ∝ λ        (longer wavelength → wider pattern)
    b ∝ 1/d      (thicker wire → narrower pattern)

Graph:
    b vs D → straight line through origin
    Slope = λ/d  →  d = λ / slope
```

---

## 📁 File Structure

```
laser_lab_final.html     ← Complete virtual lab (single file, ~870 lines)
README.md                ← This file
```

Everything is self-contained in one HTML file. No build step, no dependencies to install, no server required.

---

## 🚀 Deployment Guide

### Option 1: Open Directly (Simplest)
```
1. Download laser_lab_final.html
2. Double-click the file
3. It opens in your browser — done.
```
Works on Chrome, Firefox, Edge, Safari. Requires internet for Google Fonts and Chart.js CDN.

---

### Option 2: GitHub Pages (Free, Shareable URL)

```bash
# Step 1: Create a new GitHub repository
# Go to https://github.com/new
# Repository name: virtual-optics-lab
# Make it Public

# Step 2: Upload the file
# Rename laser_lab_final.html → index.html
# Upload index.html to the repository

# Step 3: Enable GitHub Pages
# Go to repository → Settings → Pages
# Source: Deploy from branch → main → / (root)
# Click Save

# Step 4: Your lab is live at:
# https://yourusername.github.io/virtual-optics-lab/
```

---

### Option 3: Netlify Drop (Instant, No Account Needed)

```
1. Go to https://app.netlify.com/drop
2. Rename the file to index.html
3. Drag and drop the file onto the page
4. Netlify gives you a live URL like: https://random-name.netlify.app
5. Share the URL with anyone
```

---

### Option 4: Vercel (CLI Deploy)

```bash
# Install Vercel CLI
npm install -g vercel

# Create a folder and put index.html inside
mkdir virtual-optics-lab
cp laser_lab_final.html virtual-optics-lab/index.html
cd virtual-optics-lab

# Deploy
vercel

# Follow prompts → get a live URL
```

---

### Option 5: Self-Hosted / College Server

```bash
# If your college has a web server (Apache/Nginx):
# Upload the file to /var/www/html/ or equivalent
# Access via the server's IP or domain

# Using Python for quick local server:
python -m http.server 8080
# Then open: http://localhost:8080/laser_lab_final.html
```

---

### Option 6: Embed in Google Sites / Notion / LMS

```html
<!-- For any platform that supports iframe embedding: -->
<iframe 
  src="https://yourusername.github.io/virtual-optics-lab/" 
  width="100%" 
  height="700px"
  frameborder="0">
</iframe>
```

---

## 🌐 CDN Dependencies (Internet Required)

| Library | Version | CDN URL | Purpose |
|---|---|---|---|
| Chart.js | 4.4.1 | cdnjs.cloudflare.com | b vs D graph plotting |
| Google Fonts | — | fonts.googleapis.com | Orbitron, Rajdhani, Share Tech Mono |

To make it work **fully offline**, download these and replace the CDN links with local paths.

---

## 🧪 Wire Data Reference

| Wire | Actual d (mm) | b at D=1000mm, He-Ne |
|---|---|---|
| Wire 1 | 0.10547 mm | ≈ 5.99 mm |
| Wire 2 | 0.18000 mm | ≈ 3.51 mm |
| Wire 3 | 0.24543 mm | ≈ 2.58 mm |
| Wire 4 | 0.35000 mm | ≈ 1.81 mm |
| Wire 5 | 0.48000 mm | ≈ 1.32 mm |

---

## 👨‍🎓 Made For

- B.Tech / B.Sc Physics students learning optics
- Virtual lab assignments and viva preparation  
- Self-study: theory + simulation + quiz in one place
- College practical records (use Load Demo → Calculate → copy values)

---

## 📄 License

Free to use for educational purposes.  
Built with HTML5 Canvas + Chart.js + Vanilla JS.  
No frameworks. No build tools. Just open and run.

## made with ❤️ by Vinay Singh Tomar 