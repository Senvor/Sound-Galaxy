let fft
let particles = []

let Particle = function (position) {
    this.position = position
    this.speed = createVector(0, 1)
    this.color = [random(0, 255), random(0, 255), random(0, 255)]
    this.diameter = 0

    this.draw = function () {
        fill(this.color)
        circle(this.position.x, this.position.y, this.diameter)
    }

    this.update = function (energy) {
        this.position.y += this.speed.y * energy * 10
        if (this.position.y > height) {
            this.position.y = 0
        }
        this.diameter = random(5, 7) + energy * 100
    }
}

function positionParticles () {
    particles = []
    for (let i = 0; i < 1024; i++) {
        particles.push(new Particle(createVector(random(width), random(height))))
    }
}

function drawParticles () {
    for (let i = 0; i < particles.length; i++) {
        particles[i].draw()
    }
}

function updateParticles (spectrum) {
    for (let i = 0; i < particles.length; i++) {
        particles[i].update(spectrum[i % spectrum.length] / 255)
    }
}

function setup () {
    createCanvas(windowWidth, windowHeight)
    noStroke()

    let mic = new p5.AudioIn()
    mic.start()

    fft = new p5.FFT()
    fft.setInput(mic)

    positionParticles()
}

function draw () {
    background(0, 0, 0)
    let spectrum = fft.analyze()
    updateParticles(spectrum)
    drawParticles()
}

