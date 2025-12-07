var config = {
    type: Phaser.AUTO,
    width: 900,
    height: 600,
    backgroundColor: '#006400',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);
var deck;

function preload() {
    // Load all card images
    for (let suit of ['clubs','diamonds','hearts','spades']) {
        for (let rank of ['A','2','3','4','5','6','7','8','9','10','J','Q','K']) {
            this.load.image(`${rank}_of_${suit}`, `assets/cards/${rank}_of_${suit}.png`);
        }
    }
}

function create() {
    deck = new Deck();

    // Draw 5 cards and put them on screen
    let x = 100;

    for (let i = 0; i < 5; i++) {
        let card = deck.draw();
        this.add.image(x, 200, `${card.rank}_of_${card.suit}`).setScale(0.8);
        x += 150;
    }

    // Click anywhere to draw 1 new card
    this.input.on('pointerdown', () => {
        if (deck.cards.length > 0) {
            let card = deck.draw();
            this.add.image(450, 400, `${card.rank}_of_${card.suit}`).setScale(0.8);
        }
    });
}
