const sprLife = new Image()
const sprShovel = new Image()
const sprGlowstick = new Image()
sprLife.src = './img/hud_life.png'
sprShovel.src = './img/hud_shovel.png'
sprGlowstick.src = './img/hud_glowstick.png'

export class Hud {
    constructor() {
        this.pos = {
            x: 134,
            y: 4
        }
    }

    update(go, dt) {

    }

    draw(go) {
        // Draw life
        go.ctx.fillStyle = '#f5d7af'
        go.ctx.fillRect(this.pos.x + 2, this.pos.y + 4, 16, 10)
        go.ctx.drawImage(sprLife, this.pos.x, this.pos.y)

        // Draw glowsticks
        for (let i = 0; i < go.glowstickInv; i++) {
            go.ctx.drawImage(sprGlowstick, this.pos.x + (3 * i) + 20, this.pos.y + 4)
        }

        // Draw shovels
        for (let i = 0; i < go.shovelInv; i++) {
            go.ctx.drawImage(sprShovel, this.pos.x - (6 * i) - 7, this.pos.y + 4)
        }
    }
}