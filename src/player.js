const sprNormal = new Image()
const sprUp = new Image()
const sprDown = new Image()
sprNormal.src = './img/player_normal.png'
sprUp.src = './img/player_up.png'
sprDown.src = './img/player_down.png'

let activeSprite = sprNormal

export class Player {
    constructor() {
        this.pos = {
            x: 0,
            y: 13
        }

        this.onGround = false
        this.gravity = 0
        this.strength = 2.6
        this.speed = 0.075
    }

    update(go, dt) {
        // Update position
        const prePos = {...this.pos}

        this.gravity += 0.1
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
        }

        if (go.keys.jump && this.onGround) {
            this.gravity = -this.strength
            this.onGround = false
        }
        
        if (go.keys.right) { this.pos.x += this.speed * dt }
        if (go.keys.left) { this.pos.x -= this.speed * dt }
        if (this.isColliding(go)) {
            this.pos.x = prePos.x
        }

        // Update sprite
        if (go.keys.up) {
            activeSprite = sprUp
        } else if (go.keys.down) {
            activeSprite = sprDown
        } else {
            activeSprite = sprNormal
        }
    }

    draw(go) {
        go.ctx.drawImage(activeSprite, Math.floor(go.time / 100 % 15) * 16, 0, 16, 16, Math.round(this.pos.x), Math.round(this.pos.y - go.cameraVis + go.cameraVisDelta), 16, 16)
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