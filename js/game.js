var config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 700,
    backgroundColor: '#2e8b57',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

var deck;
var players = [];
var currentPlayer = 0;
var turnText;
var startButton, nextButton, endButton;
var cardBack;

function preload() {
    // card back (you can change this)
    this.load.image("cardBack", "assets/cards/back.png");

    // Load actual cards
    for (let suit of ["clubs", "diamonds", "hearts", "spades"]) {
        for (let rank of ["A","2","3","4","5","6","7","8","9","10","J","Q","K"]) {
            this.load.image(`${rank}_of_${suit}`, `assets/cards/${rank}_of_${suit}.png`);
        }
    }
}

function create() {
    // UI Buttons
    startButton = this.add.text(420, 300, "START GAME", {
        font: "40px Arial",
        fill: "#ffffff",
        backgroundColor: "#000"
    })
    .setPadding(10)
    .setInteractive()
    .on("pointerdown", () => startGame.call(this));

    endButton = this.add.text(830, 20, "End Game", {
        font: "24px Arial",
        fill: "#ffffff",
        backgroundColor: "#8b0000"
    })
    .setPadding(8)
    .setInteractive()
    .on("pointerdown", () => location.reload());
}

function startGame() {
    deck = new Deck();

    players = [
        { name: "Player 1", hand: [] },
        { name: "Player 2", hand: [] }
    ];

    // Deal 4 cards to each
    for (let p of players) {
        for (let i = 0; i < 4; i++) p.hand.push(deck.draw());
    }

    startButton.destroy(); // remove start button

    turnText = this.add.text(20, 20, "", {
        font: "32px Arial",
        fill: "#ffffff"
    });

    nextButton = this.add.text(420, 620, "Next Turn", {
        font: "32px Arial",
        fill: "#ffffff",
        backgroundColor: "#000000"
    })
    .setPadding(10)
    .setInteractive()
    .on("pointerdown", () => handleTurn.call(this));

    renderHands.call(this);
    updateTurnText();
}

function updateTurnText() {
    turnText.setText("Turn: " + players[currentPlayer].name);
}

function renderHands() {
    if (this.cardImages) this.cardImages.forEach(img => img.destroy());
    this.cardImages = [];

    let yPositions = [200, 470];

    for (let i = 0; i < players.length; i++) {
        let player = players[i];
        let y = yPositions[i];
        let x = 80;

        // Player label
        this.add.text(80, y - 50, player.name, {
            font: "28px Arial",
            fill: "#ffffff"
        });

        // Cards spaced clearly
        for (let card of player.hand) {
            let img = this.add.image(x, y, `${card.rank}_of_${card.suit}`)
                .setScale(0.5)
                .setInteractive();
            this.cardImages.push(img);
            x += 130;
        }
    }
}

function handleTurn() {
    let p = players[currentPlayer];

    if (p.hand.length === 0) {
        alert(p.name + " has no cards! They win!");
        return;
    }

    // Example logic: play last card
    let playedCard = p.hand.pop();
    console.log(p.name + " played", playedCard.rank, playedCard.suit);

    renderHands.call(this);

    currentPlayer = (currentPlayer + 1) % players.length;
    updateTurnText();
}
