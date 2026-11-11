<div align="center">

# Sound Galaxy

**Make some noise and watch the galaxy move.**

A mic-powered visualizer that turns the sound around you into 600 glowing particles, colored by bass, mid and treble.

![Hackatime](https://hackatime.hackclub.com/api/v1/badge/U0B4TE3MN1G/Senvor/Sound-Galaxy)

Live Preview: https://soundgalaxy.senvor.dev/

<img src="images/preview.png" alt="Sound Galaxy running in the browser" width="800" />

</div>

---

## What is it?

Sound visualization is one of the coolest things that modern-day web development tools have made accessible. There's something surreal and indescribably satisfying about seeing the sounds around you on your screen and somehow understanding what you're seeing.

Sound Galaxy listens to your mic, splits the sound into three bands and gives each band its own color of particles. When a band gets louder, its particles grow, glow brighter and fall faster. When it's quiet, they just drift slowly across a starry background.

Turn on your mic, play some music, or scream as loud as you can to see the galaxy react!

## Features

- **600 particles in three colors**: pink for bass, green for mid, blue for treble
- **Reacts per band**, so a bass drop and a high note move different particles
- **Auto-adjusts to your mic**: it remembers the loudest each band has been, so even a quiet mic still gets the galaxy moving
- **Soft glow and trails** from a see-through background drawn every frame
- **Starry background** with 150 little stars
- **Live HUD** showing your volume, the loudest frequency in Hz, and a level bar for each band
- **Help popup** with **H** that explains the colors
- **Friendly error** if the mic is blocked, telling you to allow it and reload
- Works on phones too: tap to start

## How to Use

1. Open the live preview
2. Click (or tap) anywhere to turn on the mic, and allow mic access
3. Make some noise and watch the particles react
4. Press **H** any time to show or hide the help

Try different sound sources (music, talking, whistling, clapping) to see how each band responds!

## Getting Started

### Dependencies

- Any modern browser with a microphone
- [p5.js](https://p5js.org/) and p5.sound v1.9.4, loaded from a CDN so nothing to install

### Installing

```
git clone https://github.com/Senvor/Sound-Galaxy.git
cd Sound-Galaxy
```

No build step and no packages needed.

### Running it locally

Browsers only give mic access to pages on `https` or `localhost`, so run it through a local server instead of double clicking `index.html`:

```
python -m http.server 8000
```

Then go to http://localhost:8000

## Tech Stack

- **p5.js** - drawing the particles on the canvas
- **p5.sound** - getting the mic input and reading the sound levels (FFT)
- **JavaScript** - all the particle logic
- **HTML** - the page
- **GitHub Pages** - hosting the live preview

## Project Structure

```
Sound-Galaxy/
├── index.html   # the page, loads p5.js and p5.sound
├── script.js    # mic, FFT, particles and HUD
├── images/      # README screenshot
├── CNAME        # custom domain for GitHub Pages
└── LICENSE
```

## Why I Built It

I built this project to level up my programming skills and explore the creative possibilities of modern web development by following [this](https://workshops.hackclub.com/sound_galaxy/) tutorial.

## What I Learned

- Getting mic input in the browser with p5.sound
- Using an FFT to split sound into bass, mid and treble
- Smoothing values so the visuals don't flicker
- Making trails with a see-through background

## License

This project is licensed under the [MIT License](LICENSE). You're free to use, modify, and share it, as long as the original copyright notice is kept.
