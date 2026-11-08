let fft
let mic
let started = false
let particles = []

let showHelp = false

// each band gets its own color so you can see the music
const bands = {
    bass: [255, 70, 70],
    mid: [70, 255, 140],
    treble: [90, 150, 255]
}
const bandNames = ['bass', 'mid', "treble"]

let Particle = function (position, band) {
    this.position = position
    this.band = band
    this.base = bands[band]
    this.diameter = 0
    this.twinkle = random(TWO_PI)

    this.draw = function (energy) {
        // brighter when its band is loud
        let glow = 0.35 + energy * 0.65
        fill(this.base[0] * glow, this.base[1] * glow, this.base[2] * glow)
        circle(this.position.x, this.position.y, this.diameter)
    }

    this.update = function (energy) {
        // small drift so it never freezes when quiet
        this.position.y += 0.3 + energy * 10
        if (this.position.y > height) this.position.y = 0
        this.twinkle += 0.05
        this.diameter = 4 + sin(this.twinkle) * 1.5 + energy * 60
    }
}

function positionParticles () {
    particles = []
    for (let i = 0; i < 1024; i++) {
        let band = bandNames[i % 3]
        particles.push(new Particle(createVector(random(width), random(height)), band))
    }
}


function setup () {
    createCanvas(windowWidth, windowHeight)
    noStroke()

    mic = new p5.AudioIn()
    fft = new p5.FFT()
    fft.setInput(mic)

    positionParticles()
}

function draw () {
    background(0, 0, 0)
    if (!started) {
        // Browsers block audio until the user clicks, so wait for a click before turning on the mic
        fill(255)
        textAlign(CENTER, CENTER)
        textSize(min(width, height) / 18)
        text('Click to turn on the mic', width / 2, height / 2)
        return
    }
    let spectrum = fft.analyze()
    let energy = {
        bass: fft.getEnergy('bass') / 255,
        mid: fft.getEnergy('mid') / 255,
        treble: fft.getEnergy('treble') / 255
    }

    for (let p of particles) {
        p.update(energy[p.band])
        p.draw(energy[p.band])
    }

    drawHud(spectrum, energy)
}

function drawHud (spectrum, energy) {
    // loudest frequency = the bin with the biggest value
    let maxI = 0
    for (let i = 1; i < spectrum.length; i++) {
        if (spectrum[i] > spectrum[maxI]) maxI = i
    }
    let hz = round(maxI * (sampleRate() / 2) / spectrum.length)
    let vol = round(mic.getLevel() * 100)

    fill(0, 0, 0, 160)
    rect(12, 12, 210, 120, 8)

    fill(255)
    textAlign(LEFT, TOP)
    textSize(14)
    text('volume: ' + vol, 24, 22)
    text('peak: ' + hz + ' Hz', 24, 42)

    // little bars for each band
    let y = 66
    for (let b of bandNames) {
        fill(bands[b])
        rect(24, y, energy[b] * 120, 10, 3)
        fill(255)
        text(b, 152, y - 3)
        y += 18
    }

    if (showHelp) {
        fill(0, 0, 0, 200)
        rect(width / 2 - 150, height / 2 - 60, 300, 120, 10)
        fill(255)
        textAlign(CENTER, CENTER)
        text('red = bass, green = mid, blue = treble\nmake some noise to move the galaxy\nH to hide this', width / 2, height / 2)
    } else {
        fill(255, 120)
        textAlign(RIGHT, BOTTOM)
        text('H for help', width - 12, height - 12)
    }
}

function startMic () {
    if (started) return
    if (typeof userStartAudio === 'function') userStartAudio()
    else getAudioContext().resume()
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
    positionParticles()
}
