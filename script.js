let fft
let mic
let started = false
let micError = false
let particles = []
let stars = []
let showHelp = false

// each band gets its own color so you can see the music
const bands = {
    bass: [255, 80, 110],
    mid: [80, 255, 170],
    treble: [110, 170, 255]
}
const bandNames = ['bass', 'mid', 'treble']

// smoothed levels + the loudest each band has been, so quiet mics still react
let level = { bass: 0, mid: 0, treble: 0 }
let peak = { bass: 0.2, mid: 0.2, treble: 0.2 }

let Particle = function (band) {
    this.band = band
    this.base = bands[band]
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
        // soft glow behind the dot
        fill(this.base[0], this.base[1], this.base[2], 40 + energy * 60)
        circle(this.position.x, this.position.y, d * 2.2)
        fill(this.base[0], this.base[1], this.base[2], 140 + energy * 115)
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
}

function draw () {
    // see-through background leaves little trails
    background(5, 3, 18, started ? 70 : 255)
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
    fill(255, 255, 255, 120)
    for (let s of stars) circle(s[0], s[1], s[2])
}

function drawTitle () {
    textAlign(CENTER, CENTER)
    fill(255)
    textSize(min(width, height) / 12)
    text('SOUND GALAXY', width / 2, height / 2 - 30)
    fill(255, 160)
    textSize(16)
    text('click anywhere to turn on the mic', width / 2, height / 2 + 30)
}

function drawCenter (msg) {
    fill(255)
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

    fill(10, 8, 30, 200)
    rect(16, 16, 220, 132, 12)

    textAlign(LEFT, TOP)
    textSize(13)
    fill(255)
    text('volume  ' + vol + '%', 30, 28)
    text('peak    ' + (spectrum[maxI] > 0 ? hz + ' Hz' : '-'), 30, 48)

    // a bar for each band
    let y = 76
    for (let b of bandNames) {
        fill(255, 255, 255, 30)
        rect(30, y, 130, 10, 5)
        fill(bands[b])
        rect(30, y, level[b] * 130, 10, 5)
        fill(255, 200)
        text(b, 172, y - 2)
        y += 20
    }

    if (showHelp) {
        fill(10, 8, 30, 230)
        rect(width / 2 - 170, height / 2 - 70, 340, 140, 14)
        fill(255)
        textAlign(CENTER, CENTER)
        textSize(14)
        text('pink = bass   green = mid   blue = treble\n\nmake some noise to move the galaxy\n\nH to close', width / 2, height / 2)
    } else {
        fill(255, 110)
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

function mousePressed () { startMic() }
function touchStarted () { startMic() }
function keyPressed () {
    if (key === 'h' || key === 'H') showHelp = !showHelp
    startMic()
}

function windowResized () {
    resizeCanvas(windowWidth, windowHeight)
    makeScene()
}
