const sprLife = new Image()
const sprShovel = new Image()
const sprGlowstick = new Image()
const sprSpeakOn = new Image()
const sprSpeakOff = new Image()
sprLife.src = './img/hud_life.png'
sprShovel.src = './img/hud_shovel.png'
sprGlowstick.src = './img/hud_glowstick.png'
sprSpeakOn.src = './img/speaker_on.png'
sprSpeakOff.src = './img/speaker_off.png'

export class Hud {
    constructor() {
        this.pos = {
            x: 134,
            y: 4
        }
        this.posVis = {
            x: 134,
            y: -50
        }
        this.hidden = false
        this.hurt = 0
        this.locked = false
    }

    update(go, dt) {
        if (this.posVis.y != this.pos.y) {
            this.posVis.y += (this.pos.y - this.posVis.y) * 0.1
        }
        if (this.hurt > 0) {
            this.hurt -= dt
        } else {
            this.hurt = 0
        }
    }

    draw(go) {
        // HUD shake
        let posVis = {...this.posVis}
        posVis.x = Math.floor(posVis.x)
        posVis.y = Math.floor(posVis.y)
        posVis.x += Math.ceil((Math.random() -.5) * 50 * this.hurt / 8000)
        posVis.y += Math.ceil((Math.random() -.5) * 20 * this.hurt / 8000)

        // Draw life
        let healthHeight = Math.floor(go.player.health / 10)
        go.ctx.fillStyle = '#f5d7af'
        go.ctx.fillRect(posVis.x + 2, posVis.y + 4 + 10 - healthHeight, 16, healthHeight)
        go.ctx.drawImage(sprLife, posVis.x, posVis.y)

        // Draw glowsticks
        for (let i = 0; i < go.glowstickInv; i++) {
            go.ctx.drawImage(sprGlowstick, posVis.x + (4 * i) + 20, posVis.y + 4)
        }

        // Draw shovels
        for (let i = 0; i < go.shovelInv; i++) {
            go.ctx.drawImage(sprShovel, posVis.x - (6 * i) - 7, posVis.y + 4)
        }

        if (go.mute) {
            go.ctx.drawImage(sprSpeakOff, go.width - 18, go.height - 18)
        } else {
            go.ctx.drawImage(sprSpeakOn, go.width - 18, go.height - 18)
        }
    }

    hide(setLocked) {
        if (setLocked) {
            this.locked = true
        }

        this.hidden = true
        this.pos.y = -50
    }

    show(revertLocked) {
        if (revertLocked) {
            this.locked = false
        }
        
        this.hidden = false
        this.pos.y = 4
    }
}