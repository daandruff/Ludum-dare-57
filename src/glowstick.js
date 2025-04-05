const sprNormal = new Image()
sprNormal.src = './img/glowstick.png'

let activeSprite = sprNormal

export class Glowstick {
    constructor(x, y, force) {
        this.pos = {
            x: x,
            y: y
        }
        this.force = force

        this.gravity = -1
        this.strength = 2.6
        this.speed = 0.075
    }

    update(go, dt) {
        // Update position
        const prePos = {...this.pos}

        this.gravity += 0.006 * dt
        if (this.gravity > this.strength) {
            this.gravity = this.strength
        } else if (this.gravity < -this.strength) {
            this.gravity = -this.strength
        }
        this.pos.y += this.gravity
        if (this.isColliding(go)) {
            this.pos.y = prePos.y
            this.gravity = 0
            this.onGround = true
            this.force *= 0.9
        }
        
        this.pos.x += this.force * dt
        if (this.isColliding(go)) {
            this.pos.x = prePos.x
            this.force *= -1
        }
    }

    draw(go) {
        go.ctx.drawImage(activeSprite, Math.floor(go.time / 300 % 2) * 16, 0, 16, 16, Math.round(this.pos.x), Math.round(this.pos.y - go.cameraVis + go.cameraVisDelta), 16, 16)
    }

    isColliding(go) {
        let x = Math.floor((this.pos.x + 8) / 16)
        let y = Math.floor((this.pos.y + 16) / 16)

        const tile = go.map.data[go.map.width * y + x]
        if (tile === 1 || tile === 2) {
            return true
        }

        if (x < 0 || x > 17) {
            return true
        }

        return false
    }
}