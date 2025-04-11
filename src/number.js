export class NumberSprite {
    constructor() {
        this.numberSprite = new Image()
        this.numberSprite.src = './img/numbers.png'
    }

    draw(go, num, x, y) {
        const numCharArray = num.toString().split('')

        let i = 0
        for (let i = 0; i < numCharArray.length; i++) {
            const char = numCharArray[i]
            go.ctx.drawImage(this.numberSprite, parseInt(char) * 4, 0, 4, 8, x + 5 * i, y, 4, 8)
        }
    }
}