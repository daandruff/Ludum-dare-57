const sprScrew = new Image()
sprScrew.src = './img/pickup_screw.png'

export class Pickup {
    constructor(x, y) {
        this.pos = {
            x: x,
            y: y
        }
        this.type = 'screw'
        this.collected = false
    }

    update(go, dt) {
        if (Math.round(go.player.pos.x / 16) === this.pos.x && Math.round(go.player.pos.y / 16) === this.pos.y) {
            this.collected = true
            for (let i = 0; i < 5; i++) {
                go.effects.create('collect', this.pos.x * 16, this.pos.y * 16)
            }
            go.player.inventory.screws++
            go.hud.screwBounce = 5
        }
    }

    draw(go, x, y) {
        const frame = Math.floor(go.time / 100 % 3)
        go.ctx.drawImage(sprScrew, frame * 16, 0, 16, 16, x, y + Math.round(Math.sin(go.time / 300) * 3), 16, 16)
    }
}