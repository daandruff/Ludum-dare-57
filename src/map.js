const sprBlock = new Image()
const sprBlockTop = new Image()
const sprBlockGrassA = new Image()
const sprBlockGrassB = new Image()
sprBlock.src = './img/block.png'
sprBlockTop.src = './img/block_top.png'
sprBlockGrassA.src = './img/block_grass_a.png'
sprBlockGrassB.src = './img/block_grass_b.png'

export class Map {
    constructor() {
        this.width = 18
        this.height = 60

        this.data = Array(this.width * this.height)
        this.generate()
    }

    update(go, dt) {

    }

    draw(go) {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const tile = this.data[y * this.width + x]

                let selectedTileSprite = false
                if (tile === 1) { selectedTileSprite = sprBlock }
                if (tile === 2) { selectedTileSprite = sprBlockTop }
                if (tile === 3) { selectedTileSprite = sprBlockGrassA }
                if (tile === 4) { selectedTileSprite = sprBlockGrassB }

                if (selectedTileSprite) {
                    go.ctx.drawImage(selectedTileSprite, x * 16, Math.round(y * 16 - go.cameraVis + go.cameraVisDelta))
                }
            }
        }
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
    }
}