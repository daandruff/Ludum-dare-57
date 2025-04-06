import { Glowstick } from "./glowstick.js"

const sprNormalR = new Image()
const sprNormalL = new Image()
const sprUp = new Image()
const sprDown = new Image()
sprNormalR.src = './img/player_normal_r.png'
sprNormalL.src = './img/player_normal_l.png'
sprUp.src = './img/player_up.png'
sprDown.src = './img/player_down.png'

let activeSprite = sprNormalR

export class Player {
    constructor() {
        this.pos = {
            x: 0,
            y: 13
        }

        this.latestDirection = 1
        this.onGround = true
        this.gravity = 0
        this.strength = 2.6
        this.speed = 0.075
        this.health = 100
        this.startFall = 0
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
            if (this.gravity > 0 && this.onGround === false) {
                this.onGround = true
                console.log((this.pos.y - this.startFall) / 16)
            }
            this.gravity = 0
        }
        if (Math.abs(this.gravity) > 1 && this.onGround === true) {
            this.onGround = false
            this.startFall = this.pos.y
        }

        if (go.keys.jump && this.onGround) {
            this.gravity = -this.strength
            this.onGround = false
        }
        
        if (go.keys.right) {
            this.pos.x += this.speed * dt
            this.latestDirection = 1
        }
        if (go.keys.left) {
            this.pos.x -= this.speed * dt
            this.latestDirection = -1
        }
        if (this.isColliding(go)) {
            this.pos.x = prePos.x
        }

        // Update sprite
        if (go.keys.up) {
            activeSprite = sprUp
        } else if (go.keys.down) {
            activeSprite = sprDown
        } else {
            if (this.latestDirection > 0) {
                activeSprite = sprNormalR
            } else {
                activeSprite = sprNormalL
            }
        }

        // Throw glowstick
        if (go.keys.use) {
            go.keys.use = 0

            // Calculate throwing force
            if (go.glowstickInv) {
                let force = 0.02
                if (go.keys.right || go.keys.right) {
                    force += 0.05
                }
                force = force * this.latestDirection
    
                go.glowstickList.push(new Glowstick(this.pos.x, this.pos.y, force))
                go.glowstickInv--
            }
        }

        // Dig tile out
        if (go.keys.dig) {
            go.keys.dig = 0

            if (go.shovelInv) {
                let gridPos = {
                    x: Math.floor((this.pos.x + 8) / 16),
                    y: Math.floor((this.pos.y + 16) / 16)
                }

                let digPos = {...gridPos}

                if (go.keys.up || go.keys.down) {
                    if (go.keys.up) {
                        digPos.y--
                    } else {
                        digPos.y++
                    }
                } else {
                    digPos.x += this.latestDirection
                }

                // Make sure we are digging inside the map
                if (digPos.x >= 0 && digPos.x < go.map.width && digPos.y >= 0 && digPos.y < go.map.height) {
                    let tileData = go.map.data[digPos.y * go.map.width + digPos.x]
                    
                    // Make sure you can dig the tile
                    if (tileData === 1 || tileData === 2) {
                        go.map.data[digPos.y * go.map.width + digPos.x] = 0

                        // Remove grass a top tile
                        let aboveTileData = go.map.data[(digPos.y - 1) * go.map.width + digPos.x]
                        if (aboveTileData === 3 || aboveTileData === 4) {
                            go.map.data[(digPos.y - 1) * go.map.width + digPos.x] = 0
                        }

                        // Adjust new block below to be top-layer
                        let belowTileData = go.map.data[(digPos.y + 1) * go.map.width + digPos.x]
                        if (belowTileData === 1) {
                            go.map.data[(digPos.y + 1) * go.map.width + digPos.x] = 2
                        }

                        go.shovelInv--
                    }
                }
            }
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