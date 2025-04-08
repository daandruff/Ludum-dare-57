export class DustParticles {
    constructor(x, y, w, h, g, a = 50, m = 5, c = '#c07d58') {
        this.particles = []
        this.pos = {
            x: x,
            y: y
        }
        this.width = w
        this.height = h
        this.global = g
        this.maxSize = m
        this.color = c

        this.timer = 0
        this.spawnrate = 300
        this.amount = a
        this.life = 5000
    }

    update(go, dt) {
        this.timer += dt

        if (this.timer >= this.spawnrate) {
            this.timer = 0
            if (this.particles.length < this.amount) {
                this.createParticle(go)
            }
        }

        this.particles.forEach(particle => {
            particle.pos.x += (Math.random() -.6) * dt / 50
            particle.pos.y += (Math.random() -.3) * dt / 50
            particle.life += dt
        })

        let thisPointer = this
        this.particles = this.particles.filter((particle) => particle.life < thisPointer.life)
    }

    draw(go) {
        go.ctx.fillStyle = this.color
        this.particles.forEach(particle => {
            go.ctx.fillRect(Math.floor(particle.pos.x), Math.floor(particle.pos.y - (go.cameraVis * particle.layer) + (go.cameraVisDelta * particle.layer)), particle.size, particle.size)
        })
    }

    createParticle(go) {
        this.particles.push({
            pos: {
                x: Math.random() * (this.width - this.pos.x) + this.pos.x,
                y: Math.random() * (this.height - this.pos.y) + this.pos.y + (this.global ? go.cameraVis + go.cameraVisDelta : 0)
            },
            life: 0,
            size: Math.ceil(Math.random() * this.maxSize),
            layer: Math.random() * 0.5 + 0.5
        })
    }
}