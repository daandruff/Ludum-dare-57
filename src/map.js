import { Pickup } from "./pickup.js"

const sprShadow = new Image()
const sprBlock = new Image()
const sprBlockTop = new Image()
const sprBlockGrassA = new Image()
const sprBlockGrassB = new Image()
const sprNextLevel = new Image()
sprShadow.src = './img/shadow.png'
sprBlock.src = './img/block.png'
sprBlockTop.src = './img/block_top.png'
sprBlockGrassA.src = './img/block_grass_a.png'
sprBlockGrassB.src = './img/block_grass_b.png'
sprNextLevel.src = './img/nextlevel.png'

export class Map {
    constructor(height = 60) {
        this.width = 18
        this.height = height

        this.data = Array(this.width * this.height)
        this.pickups = []
        this.timer = 0
        this.generate()
    }

    update(go, dt) {
        this.timer += dt / 1000
        this.pickups.forEach(pickup => {
            pickup.update(go, dt)
        })
        this.pickups = this.pickups.filter(pickup => !pickup.collected)
    }

    draw(go) {
        const lightPositions = []

        // Add player as light source
        lightPositions.push({
            x: go.player.pos.x / 16,
            y: go.player.pos.y / 16
        })

        // Add glowsticks
        go.glowstickList.forEach(glowstick => {
            lightPositions.push({
                x: glowstick.pos.x / 16,
                y: glowstick.pos.y / 16
            })
        })

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                let yPos = y * 16 - go.cameraVis + go.cameraVisDelta
                if (!(yPos < -16 || yPos > go.height + 16)) {
                    const tile = this.data[y * this.width + x]

                    let lightDistance = 100
                    lightPositions.forEach(position => {
                        const dx = position.x - x
                        const dy = position.y - y
                        const distance = Math.sqrt(dx * dx + dy * dy)

                        if (distance < lightDistance) {
                            lightDistance = distance
                        }
                    })

                    let selectedTileSprite = false
                    if (tile === 1) { selectedTileSprite = sprBlock }
                    if (tile === 2) { selectedTileSprite = sprBlockTop }
                    if (tile === 3) { selectedTileSprite = sprBlockGrassA }
                    if (tile === 4) { selectedTileSprite = sprBlockGrassB }

                    if (selectedTileSprite) {
                        if (lightDistance < 3.5 && lightDistance >= 2.5) {
                            go.ctx.drawImage(selectedTileSprite, x * 16, Math.round(y * 16 - go.cameraVis + go.cameraVisDelta))
                            go.ctx.drawImage(sprShadow, x * 16, Math.round(y * 16 - go.cameraVis + go.cameraVisDelta))
                        }
                        if (lightDistance < 2.5) {
                            go.ctx.drawImage(selectedTileSprite, x * 16, Math.round(y * 16 - go.cameraVis + go.cameraVisDelta))
                        }
                    } else {
                        const pickupOnTile = this.pickups.filter(pickup => pickup.pos.x === x && pickup.pos.y === y)
                        pickupOnTile.forEach(pickup => {
                            if (lightDistance < 3.5 && lightDistance >= 2.5) {
                                pickup.draw(go, x * 16, Math.round(y * 16 - go.cameraVis + go.cameraVisDelta))
                                go.ctx.drawImage(sprShadow, x * 16, Math.round(y * 16 - go.cameraVis + go.cameraVisDelta))
                            }
                            if (lightDistance < 2.5) {
                                pickup.draw(go, x * 16, Math.round(y * 16 - go.cameraVis + go.cameraVisDelta))
                            }
                        })
                    }
                }
            }
        }

        go.ctx.drawImage(sprNextLevel, 125, 32 + (this.height * 16 + Math.floor(Math.sin(this.timer * 5) * 10)) - go.cameraVis + go.cameraVisDelta)
    }

    generate() {
        this.data.fill(1) // Fill all with standard-block
        this.data.fill(0, 0, this.width) // Remove top layer
        this.data.fill(0, this.width * 1, this.width * 1 + this.width) // Remove top layer

        // Make central hole
        let baseHoleCenter = Math.floor(this.width / 2) - 1
        let randomModifier = Math.random() * 10

        for (let y = 0; y < this.height; y++) {
            let holeCenter = baseHoleCenter + Math.sin(y / 3 + randomModifier) * 3

            for (let x = 0; x < this.width; x++) {
                if (x > holeCenter - 2 && x < holeCenter + 2) {
                    this.data[y * this.width + x] = 0
                }
            }
        }

        // Carve out some pieces
        let mapCopy = [...this.data]
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (y > 2) {
                    if (mapCopy[y * this.width + x] === 1) {
                        // If piece is against air, chance to remove
                        if (mapCopy[y * this.width + x + 1] === 1 && mapCopy[y * this.width + x - 1] === 0) {
                            if (Math.random() > 0.5) {
                                this.data[y * this.width + x] = 0
                            }
                        } else if (mapCopy[y * this.width + x - 1] === 1 && mapCopy[y * this.width + x + 1] === 0) {
                            if (Math.random() > 0.5) {
                                this.data[y * this.width + x] = 0
                            }

                        }

                    // If piece has only air around it, chance to add
                    } else if (mapCopy[y * this.width + x] === 0) {
                        if (mapCopy[y * this.width + x - 1] === 0 && mapCopy[y * this.width + x + 1] === 0) {
                            if (Math.random() > 0.7) {
                                this.data[y * this.width + x] = 1
                            }
                        }
                    }
                }
            }
        }

        // Add grass
        mapCopy = [...this.data]
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (mapCopy[y * this.width + x] === 1) {
                    if (mapCopy[(y - 1) * this.width + x] === 0) {
                        this.data[y * this.width + x] = 2
                        if (Math.random() > .5) {
                            if (Math.random() > .5) {
                                this.data[(y - 1) * this.width + x] = 3
                            } else {
                                this.data[(y - 1) * this.width + x] = 4
                            }
                        }
                    }
                }
            }
        }

        // Add pickups
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.data[y * this.width + x] === 0) {
                    if (Math.random() > 0.9 && y > 4) {
                        const thisPickup = new Pickup(x, y)
                        this.pickups.push(thisPickup)
                    }
                }
            }
        }
    }
}