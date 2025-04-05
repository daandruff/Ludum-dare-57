export class Particles {
    constructor(x, y, w, h, g) {
        this.particles = []
        this.pos = {
            x: x,
            y: y
        }
        this.width = w
        this.height = h
        this.global = g

        this.timer = 0
        this.spawnrate = 500
        this.amount = 20
        this.life = 5000
    }

    update(go, dt) {
        this.timer += dt

        if (this.timer >= this.spawnrate) {
            this.timer = 0
            if (this.particles.length < this.amount) {
                console.log('create particle')
                this.createParticle(go)
            }
        }

        this.particles.forEach(particle => {
            particle.pos.x += (Math.random() -.5) * dt / 50
            particle.pos.y += (Math.random() -.5) * dt / 50
            particle.life += dt
        })

        let thisPointer = this
        this.particles = this.particles.filter((particle) => particle.life < thisPointer.life)
    }

    draw(go) {
        go.ctx.fillStyle = '#c07d58'
        this.particles.forEach(particle => {
            go.ctx.fillRect(Math.floor(particle.pos.x), Math.floor(particle.pos.y - go.cameraVis + go.cameraVisDelta), particle.size, particle.size)
        })
    }

    createParticle(go) {
        this.particles.push({
            pos: {
                x: Math.random() * (this.width - this.pos.x) + this.pos.x,
                y: Math.random() * (this.height - this.pos.y) + this.pos.y + (this.global ? go.cameraVis + go.cameraVisDelta : 0)
            },
            life: 0,
            size: Math.ceil(Math.random() * 3)
        })
    }
}