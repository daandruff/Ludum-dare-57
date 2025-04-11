import { NumberSprite } from "./number.js"

const sprLife = new Image()
const sprShovel = new Image()
const sprGlowstick = new Image()
const sprSpeakOn = new Image()
const sprSpeakOff = new Image()
const sprInventory = new Image()
const sprScrew = new Image()
const sprDepth1 = new Image()
const sprDepth2 = new Image()
const sprDepth3 = new Image()
const sprDepth4 = new Image()
const sprDepth5 = new Image()
sprLife.src = './img/hud_life.png'
sprShovel.src = './img/hud_shovel.png'
sprGlowstick.src = './img/hud_glowstick.png'
sprSpeakOn.src = './img/speaker_on.png'
sprSpeakOff.src = './img/speaker_off.png'
sprInventory.src = './img/hud_inventory.png'
sprScrew.src = './img/hud_screw.png'
sprDepth1.src = './img/depth_1.png'
sprDepth2.src = './img/depth_2.png'
sprDepth3.src = './img/depth_3.png'
sprDepth4.src = './img/depth_4.png'
sprDepth5.src = './img/depth_5.png'

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
        this.numberSprite = new NumberSprite(),
        this.posDepthX = 264
        this.posDepthXVis = 314
        this.hidden = false
        this.hurt = 0
        this.locked = false
        this.screwBounce = 0
    }

    update(go, dt) {
        if (this.posVis.y != this.pos.y) {
            this.posVis.y += (this.pos.y - this.posVis.y) * 0.1
        }
        if (this.posDepthXVis != this.posDepthX) {
            this.posDepthXVis += (this.posDepthX - this.posDepthXVis) * 0.1
        }
        if (this.hurt > 0) {
            this.hurt -= dt
        } else {
            this.hurt = 0
        }

        if (this.screwBounce > 0) {
            this.screwBounce = this.screwBounce * 0.9
            if (this.screwBounce < 0) {
                this.screwBounce = 0
            }
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

        // Draw depth level
        if (go.level === 1) {
            go.ctx.drawImage(sprDepth1, Math.floor(this.posDepthXVis), 9)
        } else if (go.level === 2) {
            go.ctx.drawImage(sprDepth2, Math.floor(this.posDepthXVis), 9)
        } else if (go.level === 3) {
            go.ctx.drawImage(sprDepth3, Math.floor(this.posDepthXVis), 9)
        } else if (go.level === 4) {
            go.ctx.drawImage(sprDepth4, Math.floor(this.posDepthXVis), 9)
        } else if (go.level === 5) {
            go.ctx.drawImage(sprDepth5, Math.floor(this.posDepthXVis), 9)
        }
        

        // Draw speaker icon
        if (go.mute) {
            go.ctx.drawImage(sprSpeakOff, go.width - 18, go.height - 18)
        } else {
            go.ctx.drawImage(sprSpeakOn, go.width - 18, go.height - 18)
        }

        // Draw inventory
        const screwBase = go.width / 2 - 20
        go.ctx.drawImage(sprInventory, screwBase, Math.floor(go.height - 10 + -this.posVis.y) + Math.floor(this.screwBounce))
        go.ctx.drawImage(sprScrew, screwBase + 2, Math.floor(go.height - 11 + -this.posVis.y) - Math.floor(this.screwBounce))
        this.numberSprite.draw(go, go.player.inventory.screws, screwBase + 20, Math.floor(go.height - 5 + -this.posVis.y + Math.floor(this.screwBounce)))
    }

    hide(setLocked) {
        if (setLocked) {
            this.locked = true
        }

        this.hidden = true
        this.pos.y = -50
        this.posDepthX = 314
    }

    show(revertLocked) {
        if (revertLocked) {
            this.locked = false
        }
        
        this.hidden = false
        this.pos.y = 4
        this.posDepthX = 264
    }
}