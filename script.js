let fft
let mic
let started = false
let micError = false
let particles = []
let stars = []
let showHelp = false

// two themes: black (default) and white
const themes = {
    dark: {
        bg: [0, 0, 0], text: 255, star: [255, 255, 255, 120], panel: [15, 15, 25, 200],
        bands: { bass: [255, 80, 110], mid: [80, 255, 170], treble: [110, 170, 255] }
    },
    light: {
        bg: [255, 255, 255], text: 20, star: [30, 30, 60, 90], panel: [240, 240, 248, 220],
        bands: { bass: [225, 30, 75], mid: [0, 165, 105], treble: [40, 90, 230] }
    }
}
let themeName = localStorage.getItem('sg-theme') === 'light' ? 'light' : 'dark'
let theme = themes[themeName]

// each band gets its own color so you can see the music
let bands = theme.bands
const bandNames = ['bass', 'mid', 'treble']

// smoothed levels + the loudest each band has been, so quiet mics still react
let level = { bass: 0, mid: 0, treble: 0 }
let peak = { bass: 0.2, mid: 0.2, treble: 0.2 }

let Particle = function (band) {
    this.band = band
    this.reset = function () {
        this.position = createVector(random(width), random(height))
        this.sway = random(TWO_PI)
        this.size = random(2, 4)
    }
    this.reset()

    this.update = function (energy) {
        // slow drift when quiet, falls faster with sound
        this.position.y += 0.4 + energy * 9
        this.sway += 0.02
        this.position.x += sin(this.sway) * 0.4
        if (this.position.y > height + 10) {
            this.position.y = -10
            this.position.x = random(width)
        }
    }

    this.draw = function (energy) {
        let d = this.size + energy * 22
        let c = bands[this.band]
        // soft glow behind the dot
        fill(c[0], c[1], c[2], 40 + energy * 60)
        circle(this.position.x, this.position.y, d * 2.2)
        fill(c[0], c[1], c[2], 140 + energy * 115)
        circle(this.position.x, this.position.y, d)
    }
}

function makeScene () {
    particles = []
    for (let i = 0; i < 600; i++) {
        particles.push(new Particle(bandNames[i % 3]))
    }
    stars = []
    for (let i = 0; i < 150; i++) {
        stars.push([random(width), random(height), random(0.5, 1.5)])
    }
}

function setup () {
    createCanvas(windowWidth, windowHeight)
    noStroke()
    textFont('monospace')

    mic = new p5.AudioIn(() => { micError = true })
    fft = new p5.FFT(0.8, 1024)
    fft.setInput(mic)

    makeScene()
    applyTheme()
    document.getElementById('theme-toggle').addEventListener('click', (e) => {
        e.stopPropagation()
        themeName = themeName === 'dark' ? 'light' : 'dark'
        localStorage.setItem('sg-theme', themeName)
        applyTheme()
    })
}

function applyTheme () {
    theme = themes[themeName]
    bands = theme.bands
    document.body.classList.toggle('light', themeName === 'light')
    // repaint fully so old trails don't linger
    background(theme.bg[0], theme.bg[1], theme.bg[2])
}

function overButton (e) {
    return e && e.target && e.target.closest && e.target.closest('#theme-toggle')
}

function draw () {
    // see-through background leaves little trails
    background(theme.bg[0], theme.bg[1], theme.bg[2], started ? 70 : 255)
    drawStars()

    if (!started) {
        drawTitle()
        return
    }
    if (micError) {
        drawCenter('mic blocked :(\nallow the mic in your browser and reload')
        return
    }

    let spectrum = fft.analyze()
    for (let b of bandNames) {
        let raw = fft.getEnergy(b) / 255
        peak[b] = max(peak[b] * 0.995, raw, 0.15)
        level[b] = lerp(level[b], raw / peak[b], 0.3)
    }

    for (let p of particles) {
        p.update(level[p.band])
        p.draw(level[p.band])
    }

    drawHud(spectrum)
}

function drawStars () {
    fill(theme.star)
    for (let s of stars) circle(s[0], s[1], s[2])
}

function drawTitle () {
    textAlign(CENTER, CENTER)
    fill(theme.text)
    textSize(min(width, height) / 12)
    text('SOUND GALAXY', width / 2, height / 2 - 30)
    fill(theme.text, 160)
    textSize(16)
    text('click anywhere to turn on the mic', width / 2, height / 2 + 30)
}

function drawCenter (msg) {
    fill(theme.text)
    textAlign(CENTER, CENTER)
    textSize(18)
    text(msg, width / 2, height / 2)
}

function drawHud (spectrum) {
    // loudest frequency = the bin with the biggest value
    let maxI = 0
    for (let i = 1; i < spectrum.length; i++) {
        if (spectrum[i] > spectrum[maxI]) maxI = i
    }
    let hz = round(maxI * (sampleRate() / 2) / spectrum.length)
    let vol = round(min(mic.getLevel() * 300, 100))

    fill(theme.panel)
    rect(16, 16, 220, 132, 12)

    textAlign(LEFT, TOP)
    textSize(13)
    fill(theme.text)
    text('volume  ' + vol + '%', 30, 28)
    text('peak    ' + (spectrum[maxI] > 0 ? hz + ' Hz' : '-'), 30, 48)

    // a bar for each band
    let y = 76
    for (let b of bandNames) {
        fill(theme.text, 30)
        rect(30, y, 130, 10, 5)
        fill(bands[b])
        rect(30, y, level[b] * 130, 10, 5)
        fill(theme.text, 200)
        text(b, 172, y - 2)
        y += 20
    }

    if (showHelp) {
        fill(theme.panel[0], theme.panel[1], theme.panel[2], 235)
        rect(width / 2 - 170, height / 2 - 70, 340, 140, 14)
        fill(theme.text)
        textAlign(CENTER, CENTER)
        textSize(14)
        text('pink = bass   green = mid   blue = treble\n\nmake some noise to move the galaxy\n\nH to close', width / 2, height / 2)
    } else {
        fill(theme.text, 110)
        textAlign(RIGHT, BOTTOM)
        textSize(12)
        text('H for help', width - 16, height - 16)
    }
}

function startMic () {
    if (started) return
    userStartAudio()
    mic.start()
    started = true
}

function mousePressed (e) { if (!overButton(e)) startMic() }
function touchStarted (e) { if (!overButton(e)) startMic() }
function keyPressed () {
    if (key === 'h' || key === 'H') showHelp = !showHelp
    startMic()
}

function windowResized () {
    resizeCanvas(windowWidth, windowHeight)
    makeScene()
}
