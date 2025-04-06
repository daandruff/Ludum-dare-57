import { Map } from "./src/map.js"
import { Hud } from "./src/hud.js"
import { Player } from "./src/player.js"
import { DustParticles } from "./src/dust-particles.js"

const cnv = document.querySelector('canvas')
const ctx = cnv.getContext('2d')

// Screens
const scrTitle = new Image()
const scrShade = new Image()
const scrDeath = new Image()
const scrYou = new Image()
const scrHealth = new Image()
const scrShovel = new Image()
const scrGlowsticks = new Image()
const scrDepth = new Image()
scrTitle.src = './img/titlescreen.png'
scrShade.src = './img/fullscreen_shade.png'
scrDeath.src = './img/fullscreen_death.png'
scrYou.src = './img/fullscreen_you.png'
scrHealth.src = './img/fullscreen_health.png'
scrShovel.src = './img/fullscreen_shovel.png'
scrGlowsticks.src = './img/fullscreen_glowsticks.png'
scrDepth.src = './img/fullscreen_depth.png'


// Game object
const go = {
    cnv: cnv,
    ctx: ctx,
    music: document.querySelector('.music'),
    mute: false,

    width: 288,
    height: 152,

    camera: 0,
    cameraVis: 0,
    cameraDelta: 0,
    cameraVisDelta: 0,

    tutorial: 0,
    level: 1,

    keys: {
        up: 0,
        down: 0,
        left: 0,
        right: 0,
        jump: 0,
        use: 0,
        dig: 0,
        reset: 0,
        mute: 0
    },

    map: new Map(40),
    mapHeight: 40,
    hud: new Hud(),
    player: new Player(),
    dust: new DustParticles(0, 0, 288, 152, true),
    hurtEffect: false,
    glowstickInvStart: 6,
    glowstickInv: 6,
    glowstickList: [],
    shovelInvStart: 4,
    shovelInv: 4,
    time: 0
}

// Main update-function
const update = (dt) => {
    if (go.tutorial !== 0) {
        go.map.update(go, dt)
        go.player.update(go, dt)
    }
    go.glowstickList.forEach(glowstick => {
        glowstick.update(go, dt)
    })

    // Update camera delta
    if (go.player.health > 0) {
        if (go.keys.up) {
            go.cameraDelta = 80
        } else if (go.keys.down) {
            go.cameraDelta = -50
        } else {
            go.cameraDelta = 0
        }
    }

    if (go.cameraVisDelta !== go.cameraDelta) {
        go.cameraVisDelta += (go.cameraDelta - go.cameraVisDelta) * 0.005 * dt
    }

    // Update camera position
    if (go.camera !== go.player.pos.y) {
        go.camera = go.player.pos.y - go.height / 2 + 32
    }

    if (go.cameraVis !== go.camera) {
        go.cameraVis += (go.camera - go.cameraVis) * 0.01 * dt
    }

    // Update particle effects
    go.dust.update(go, dt)
    if (go.hurtEffect) {
        go.hurtEffect.update(go, dt)
    }

    // Update hud
    if (go.tutorial !== 0) {
        go.hud.update(go, dt)
    }

    // Mute game
    if (go.keys.mute) {
        go.keys.mute = 0
        if (go.music.paused) {
            go.music.play()
            go.mute = false
        } else {
            go.music.pause()
            go.mute = true
        }
    }

    if (!go.mute && go.music.paused) {
        go.music.play()
    }
}

// Main draw-function
const draw = () => {
    go.ctx.fillStyle = '#3c0000'
    go.ctx.fillRect(0, 0, go.width, go.height)

    go.glowstickList.forEach(glowstick => {
        glowstick.draw(go)
    })
    go.dust.draw(go)
    if (go.tutorial !== 0) {
        go.map.draw(go)
        go.player.draw(go)
    }
    if (go.hurtEffect) {
        go.hurtEffect.draw(go)
    }

    if (go.player.health <= 0) {
        go.ctx.drawImage(scrShade, 0, 0)
        go.ctx.drawImage(scrDeath, 0, 0)
    }

    go.hud.draw(go)
    if (go.tutorial === 0) {
        go.ctx.drawImage(scrTitle, 0, 0)
    } else if (go.tutorial === 1) {
        go.ctx.drawImage(scrYou, 0, 0)
    } else if (go.tutorial === 2) {
        go.ctx.drawImage(scrHealth, 0, 0)
    } else if (go.tutorial === 3) {
        go.ctx.drawImage(scrShovel, 0, 0)
    } else if (go.tutorial === 4) {
        go.ctx.drawImage(scrGlowsticks, 0, 0)
    } else if (go.tutorial === 5) {
        go.ctx.drawImage(scrDepth, 0, 0)
    }
}

// Main loop
let lastTime = 0
const step = (time) => {
    const dt = time - lastTime

    update(dt)
    draw()

    lastTime = time
    go.time = time
    requestAnimationFrame(step)
}

// Input-handling
document.addEventListener('keydown', (e) => {
    if (go.tutorial >= 0 && go.tutorial < 6) {
        go.tutorial++
        return
    }

    if (e.code === 'ArrowUp') { go.keys.up = 1 }
    if (e.code === 'ArrowDown') { go.keys.down = 1 }
    if (e.code === 'ArrowLeft') { go.keys.left = 1 }
    if (e.code === 'ArrowRight') { go.keys.right = 1 }
    if (e.code === 'Space') { go.keys.jump = 1 }
    if (e.code === 'KeyA') { go.keys.dig = 1 }
    if (e.code === 'KeyS') { go.keys.use = 1 }
    if (e.code === 'KeyR') { go.keys.reset = 1 }
    if (e.code === 'KeyM') { go.keys.mute = 1 }
})

document.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowUp') { go.keys.up = 0 }
    if (e.code === 'ArrowDown') { go.keys.down = 0 }
    if (e.code === 'ArrowLeft') { go.keys.left = 0 }
    if (e.code === 'ArrowRight') { go.keys.right = 0 }
    if (e.code === 'Space') { go.keys.jump = 0 }
    if (e.code === 'KeyA') { go.keys.dig = 0 }
    if (e.code === 'KeyS') { go.keys.use = 0 }
    if (e.code === 'KeyR') { go.keys.reset = 0 }
    if (e.code === 'KeyM') { go.keys.mute = 0 }
})

// Init loop
step(0)