# Sound Galaxy

Live: https://soundgalaxy.senvor.dev/

## What is it?
Sound Galaxy turns your mic into a little galaxy. Open it, allow the mic, and make some noise. Music, clapping, talking, whatever. The galaxy reacts to the sound in real time.

## How it works
It listens to your mic and splits the sound into 3 parts, each with its own color:
- Pink = bass. Low booming sounds
- Green = mid. Voices and most instruments
- Blue = treble. High sounds like hi-hats and whistles

When that part of the sound gets louder, its color gets bigger and moves more. Quiet = calm galaxy, loud = chaos.

## Stuff it does
- Mic auto adjust, so it works whether you're quiet or loud
- Trails + stars that follow the movement
- A HUD that shows what's going on
- Press H for help
- Tap to start on phones

## Run it
Open the live link and allow the mic.
Or locally:
```
git clone https://github.com/Senvor/Sound-Galaxy.git
cd Sound-Galaxy
python -m http.server 8000
```
Then open http://localhost:8000

## Built with
- p5.js
- p5.sound (FFT)
- JavaScript, HTML
- GitHub Pages

## Why I made it
I wanted to make something you can actually play with instead of just look at. Music already feels like it has colors and movement, so I tried to show that on screen.

## What I learned
- How FFT splits sound into bass, mid and treble
- Mic permissions work differently on phones, which is why you tap to start
- Making the mic level adjust itself so it doesn't look dead or maxed out

## AI usage
I used AI to help debug and clean up parts of the code. The idea, design and the way it looks and feels are mine.

## License
MIT
