export class SpotParticles {
    constructor(x, y, w, h, g, a = 100, ms = 5, ml = 2500) {
        this.particles = []
        this.pos = {
            x: x,
            y: y
        }
        this.width = w
        this.height = h
        this.global = g
        this.maxSize = ms
        this.maxLife = ml

        this.amount = a
        this.created = false
    }

    update(go, dt) {
        this.timer += dt

        if (!this.created) {
            for (let i = 0; i < this.amount; i++) {
                this.createParticle(go)
            }
            this.created = true
        }

        this.particles.forEach(particle => {
            particle.pos.x += (Math.random() -.6) * dt / 50
            particle.pos.y += (Math.random() -.3) * dt / 50
            particle.life += dt
        })

        let thisPointer = this
        this.particles = this.particles.filter((particle) => particle.life < particle.death)
    }

    draw(go) {
        this.particles.forEach(particle => {
            if (particle.life < particle.death / 2) {
                go.ctx.fillStyle = '#f5d7af'
            } else {
                go.ctx.fillStyle = '#c07d58'
            }
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
            death: this.life = Math.random() * this.maxLife,
            size: Math.ceil(Math.random() * this.maxSize),
            layer: Math.random() * 0.5 + 0.5
        })
    }
}