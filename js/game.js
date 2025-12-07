var config = {
    type: Phaser.AUTO,
    width: 900,
    height: 600,
    backgroundColor: '#0d0e0dff',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);
var deck;
var players = [];
var currentPlayer = 0;

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

    // --- Create Players ---
    players = [
        { name: "Player 1", hand: [] },
        { name: "Player 2", hand: [] }
    ];

    // --- Deal 4 cards to each player ---
    for (let p of players) {
        for (let i = 0; i < 4; i++) {
            p.hand.push(deck.draw());
        }
    }

    // --- Render Hands ---
    renderHands.call(this);

    // --- Create a "Next Turn" button ---
    const nextBtn = this.add.text(400, 550, "Next Turn", {
        font: "32px Arial",
        fill: "#FFFFFF",
        backgroundColor: "#000000"
    })
    .setPadding(10)
    .setInteractive()
    .on("pointerdown", () => handleTurn.call(this));
}

function renderHands() {
    // Clear old cards (if rerendering)
    if (this.cardImages) {
        for (let img of this.cardImages) img.destroy();
    }
    this.cardImages = [];

    let yPositions = [150, 350]; // Player 1 row, Player 2 row

    for (let i = 0; i < players.length; i++) {
        let player = players[i];
        let y = yPositions[i];
        let x = 100;

        for (let card of player.hand) {
            let img = this.add.image(x, y, `${card.rank}_of_${card.suit}`).setScale(0.8);
            this.cardImages.push(img);
            x += 110;
        }
    }
}

function handleTurn() {
    let p = players[currentPlayer];

    console.log("Turn:", p.name);

    // 🃏 Example placeholder:
    // Pick random card from hand to "play"
    let playedCard = p.hand.pop();

    if (!playedCard) {
        console.log(p.name + " has no cards left!");
        return;
    }

    console.log(p.name, "played:", playedCard.rank, "of", playedCard.suit);

    // TODO:
    // 👉 Add your game logic (BS rules, lying, adding numbers, calling BS, etc.)

    // Re-render hands visually
    renderHands.call(this);

    // Move to next player
    currentPlayer = (currentPlayer + 1) % players.length;
}