const sprJumpOff = new Image()
sprJumpOff.src = './img/effect_jumpoff.png'

export class Effects {
    constructor() {
        this.container = []
    }

    update(go, dt) {
        this.container.forEach(effect => {
            effect.time += dt / 1000
        })

        this.container = this.container.filter(effect => effect.time < effect.life)
    }

    draw(go) {
        this.container.forEach(effect => {
            let spriteNum = Math.floor(effect.frames * (effect.time / effect.life))
            go.ctx.drawImage(effect.sprite, spriteNum * effect.width, 0, effect.width, effect.height, Math.floor(effect.pos.x), Math.floor(effect.pos.y - go.cameraVis + go.cameraVisDelta), effect.width, effect.height)
        })
    }

    create(effect, x, y) {
        const newEffect = {
            time: 0,
            pos: {
                x: x,
                y: y
            }
        }

        if (effect === 'jumpoff') {
            newEffect.life = 0.5
            newEffect.sprite = sprJumpOff
            newEffect.frames = 4
            newEffect.width = 16
            newEffect.height = 16
        }

        this.container.push(newEffect)
    }
}