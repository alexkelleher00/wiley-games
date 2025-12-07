class Deck {
    constructor() {
        this.suits = ["clubs", "diamonds", "hearts", "spades"];
        this.ranks = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"];
        this.cards = [];

        this.createDeck();
        this.shuffle();
    }

    createDeck() {
        this.cards = [];

        for (let suit of this.suits) {
            for (let rank of this.ranks) {
                this.cards.push({
                    suit,
                    rank,
                    image: `${rank}_of_${suit}.png`
                });
            }
        }
    }

    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    draw() {
        return this.cards.pop();
    }
}
