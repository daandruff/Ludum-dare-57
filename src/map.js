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
        this.height = 12

        this.data = Array(this.width * this.height)
        this.data.fill(1) // Fill all with standard-block
        this.data.fill(0, 0, this.width) // Remove top layer
        this.data.fill(0, this.width * 1, this.width * 1 + this.width) // Remove top layer
        this.data.fill(2, this.width * 2, this.width * 2 + this.width) // Add ground
        // Add some grass
        for (let pos = this.width * 1; pos < this.width * 1 + this.width; pos++) {
            if (Math.random() > 0.5) {
                if (Math.random() > 0.5) {
                    this.data[pos] = 3
                } else {
                    this.data[pos] = 4
                }
            }
        }
        // Add a dev-block
        this.data[2 * this.width + 7] = 1
        this.data[1 * this.width + 7] = 2
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
}