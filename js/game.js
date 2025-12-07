var config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 700,
    backgroundColor: '#2e8b57',

    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },

    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

var deck;
var players = [];
var currentPlayer = 0;

var turnNumber = 1; // 1 → 13
var turnText;
var playZone;
var inputBox;

function preload() {
    this.load.image("cardBack", "assets/cards/back.png");

    for (let suit of ["clubs", "diamonds", "hearts", "spades"]) {
        for (let rank of ["A","2","3","4","5","6","7","8","9","10","J","Q","K"]) {
            this.load.image(`${rank}_of_${suit}`, `assets/cards/${rank}_of_${suit}.png`);
        }
    }
}

function create() {
    deck = new Deck();

    // Create players
    players = [
        { name: "Player 1", hand: [] },
        { name: "Player 2", hand: [] }
    ];

    // Deal 4 cards each
    for (let p of players) {
        for (let i = 0; i < 4; i++)
            p.hand.push(deck.draw());
    }

    // Turn text (shows which number is being played)
    turnText = this.add.text(350, 20, "Turn: Play all **1s** (Aces)", {
        font: "32px Arial",
        fill: "#ffffff"
    });

    // Central play zone
    playZone = this.add.rectangle(500, 350, 300, 200, 0x000000, 0.3)
        .setStrokeStyle(3, 0xffffff);

    this.add.text(430, 260, "PLAY HERE", {
        font: "24px Arial",
        fill: "#ffffff"
    });

    // Render hands
    renderHands.call(this);

    // Drag mechanics
    this.input.on('dragstart', function (pointer, gameObject) {
        gameObject.setScale(0.6);
    });

    this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
        gameObject.x = dragX;
        gameObject.y = dragY;
    });

    this.input.on('dragend', (pointer, card) => {
        card.setScale(0.5);

        // Check if card dropped in play zone
        if (Phaser.Geom.Rectangle.Contains(playZone.getBounds(), card.x, card.y)) {
            // Remove card from hand
            let hand = players[currentPlayer].hand;
            let index = hand.indexOf(card.cardData);
            if (index !== -1) hand.splice(index, 1);

            card.setVisible(false);

            // Move to next turn
            nextTurn.call(this);
            renderHands.call(this);
        }
    });

    // Create Textbox (HTML overlay)
    createTextInput();
}

function renderHands() {
    if (this.cardImages) this.cardImages.forEach(img => img.destroy());
    this.cardImages = [];

    let yPositions = [550, 150];

    for (let i = 0; i < players.length; i++) {
        let player = players[i];
        let y = yPositions[i];
        let x = 100;

        this.add.text(20, y - 40, player.name, {
            font: "28px Arial",
            fill: "#ffffff"
        });

        for (let card of player.hand) {
            let img = this.add.image(x, y, `${card.rank}_of_${card.suit}`)
                .setScale(0.5)
                .setInteractive({ draggable: true });

            img.cardData = card; // attach card reference

            this.input.setDraggable(img);

            this.cardImages.push(img);
            x += 130;
        }
    }
}

function nextTurn() {
    currentPlayer = (currentPlayer + 1) % players.length;

    turnNumber++;
    if (turnNumber > 13) turnNumber = 1;

    const ranks = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"];
    turnText.setText(`Turn: Play all **${turnNumber} (${ranks[turnNumber - 1]})**`);
}


// HTML input box overlaid onto canvas
function createTextInput() {
    inputBox = document.createElement("input");
    inputBox.type = "text";
    inputBox.placeholder = "Claim your amount (ex: 'I played 2 cards')";

    Object.assign(inputBox.style, {
        position: "absolute",
        top: "80px",
        left: "50%",
        transform: "translateX(-50%)",
        padding: "10px",
        fontSize: "18px",
        width: "400px",
        zIndex: 10
    });

    document.body.appendChild(inputBox);
}
