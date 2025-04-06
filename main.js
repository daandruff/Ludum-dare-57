import { Map } from "./src/map.js"
import { Hud } from "./src/hud.js"
import { Player } from "./src/player.js"
import { DustParticles } from "./src/dust-particles.js"

const cnv = document.querySelector('canvas')
const ctx = cnv.getContext('2d')

// Game object
const go = {
    cnv: cnv,
    ctx: ctx,

    width: 288,
    height: 152,

    camera: 0,
    cameraVis: 0,
    cameraDelta: 0,
    cameraVisDelta: 0,

    keys: {
        up: 0,
        down: 0,
        left: 0,
        right: 0,
        jump: 0,
        use: 0,
        dig: 0
    },

    map: new Map(),
    hud: new Hud(),
    player: new Player(),
    dust: new DustParticles(0, 0, 288, 152, true),
    glowstickInv: 4,
    glowstickList: [],
    shovelInv: 3,
    time: 0
}

// Main update-function
const update = (dt) => {
    go.map.update(go, dt)
    go.player.update(go, dt)
    go.glowstickList.forEach(glowstick => {
        glowstick.update(go, dt)
    })

    // Update camera delta
    if (go.keys.up) {
        go.cameraDelta = 80
    } else if (go.keys.down) {
        go.cameraDelta = -50
    } else {
        go.cameraDelta = 0
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

    // Update hud
    go.hud.update(go, dt)
}

// Main draw-function
const draw = () => {
    go.ctx.fillStyle = '#3c0000'
    go.ctx.fillRect(0, 0, go.width, go.height)

    go.glowstickList.forEach(glowstick => {
        glowstick.draw(go)
    })
    go.dust.draw(go)
    go.map.draw(go)
    go.player.draw(go)
    go.hud.draw(go)
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
    if (e.code === 'ArrowUp') { go.keys.up = 1 }
    if (e.code === 'ArrowDown') { go.keys.down = 1 }
    if (e.code === 'ArrowLeft') { go.keys.left = 1 }
    if (e.code === 'ArrowRight') { go.keys.right = 1 }
    if (e.code === 'Space') { go.keys.jump = 1 }
    if (e.code === 'KeyA') { go.keys.use = 1 }
    if (e.code === 'KeyS') { go.keys.dig = 1 }
})

document.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowUp') { go.keys.up = 0 }
    if (e.code === 'ArrowDown') { go.keys.down = 0 }
    if (e.code === 'ArrowLeft') { go.keys.left = 0 }
    if (e.code === 'ArrowRight') { go.keys.right = 0 }
    if (e.code === 'Space') { go.keys.jump = 0 }
    if (e.code === 'KeyA') { go.keys.use = 0 }
    if (e.code === 'KeyS') { go.keys.dig = 0 }
})

// Init loop
step(0)