const sprJumpOff = new Image()
sprJumpOff.src = './img/effect_jumpoff.png'
const sprLanding = new Image()
sprLanding.src = './img/effect_land.png'
const sprRun = new Image()
const sprRunM = new Image()
sprRun.src = './img/effect_run.png'
sprRunM.src = './img/effect_run_mirror.png'
const sprCollect = new Image()
sprCollect.src = './img/effect_collect.png'

export class Effects {
    constructor() {
        this.container = []
    }

    update(go, dt) {
        this.container.forEach(effect => {
            effect.time += dt / 1000

            if (effect.name === 'run') {
                effect.pos.y -= 0.005 * dt
            }

            if (effect.velocity) {
                effect.pos.x += dt / 5 * effect.velocity.x
                effect.pos.y += dt / 5 * effect.velocity.y

                if (effect.name === 'collect') {
                    effect.pos.x += (go.player.pos.x - effect.pos.x) * dt / 200
                    effect.pos.y += (go.player.pos.y - effect.pos.y) * dt / 200
                }

                effect.velocity.x *= 0.99
                effect.velocity.y *= 0.99
            }
        })

        this.container = this.container.filter(effect => effect.time < effect.life)
    }

    draw(go) {
        this.container.forEach(effect => {
            let spriteNum = Math.floor(effect.frames * (effect.time / effect.life))
            go.ctx.drawImage(effect.sprite, spriteNum * effect.width, 0, effect.width, effect.height, Math.round(effect.pos.x), Math.round(effect.pos.y - go.cameraVis + go.cameraVisDelta), effect.width, effect.height)
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
            newEffect.name = effect
            newEffect.life = 0.5
            newEffect.sprite = sprJumpOff
            newEffect.frames = 4
            newEffect.width = 16
            newEffect.height = 16
        }

        if (effect === 'landing') {
            newEffect.name = effect
            newEffect.life = 0.5
            newEffect.sprite = sprLanding
            newEffect.frames = 4
            newEffect.width = 32
            newEffect.height = 16
        }

        if (effect === 'run') {
            newEffect.name = effect
            newEffect.life = 0.5
            if (Math.random() > .5) {
                newEffect.sprite = sprRun
            } else {
                newEffect.sprite = sprRunM
            }
            newEffect.frames = 4
            newEffect.width = 6
            newEffect.height = 6
        }

        if (effect === 'collect') {
            newEffect.name = effect
            newEffect.life = .7
            newEffect.sprite = sprCollect
            newEffect.frames = 6
            newEffect.width = 16
            newEffect.height = 16
            newEffect.velocity = {
                x: (Math.random() - 0.5) * 3,
                y: (Math.random() - 0.5) * 3 
            }
        }

        this.container.push(newEffect)
    }
}