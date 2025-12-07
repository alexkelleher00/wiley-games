var config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 700,
    backgroundColor: '#2e8b57',
    scale: { autoCenter: Phaser.Scale.CENTER_BOTH },
    scene: { preload, create }
};

var game = new Phaser.Game(config);

var deck;
var players = [];
var currentPlayer = 0;

var turnNumber = 1;
var turnText;
var playZone;
var pile = [];          // stores cards played each turn
var pileImages = [];    // images displayed in center
var inputBox;
var callBSButton;

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

    players = [
        { name: "Player 1", hand: [], isHuman: true },
        { name: "Player 2", hand: [], isHuman: false }
    ];

    // Deal 4 cards each
    for (let p of players) {
        for (let i = 0; i < 4; i++) p.hand.push(deck.draw());
    }

    // Turn label
    turnText = this.add.text(330, 20, "", {
        font: "32px Arial",
        fill: "#ffffff"
    });

    updateTurnText();

    // Center pile zone
    playZone = this.add.rectangle(500, 350, 280, 200, 0x000000, 0.25)
        .setStrokeStyle(3, 0xffffff);
    this.add.text(445, 260, "PILE", {
        font: "24px Arial",
        fill: "#ffffff"
    });

    // Buttons
    createCallBSButton.call(this);

    renderHands.call(this);

    // drag events
    this.input.on('dragstart', (pointer, gameObject) => gameObject.setScale(0.6));

    this.input.on('drag', (pointer, gameObject, x, y) => {
        gameObject.x = x; gameObject.y = y;
    });

    // Drop card onto pile
    this.input.on('dragend', (pointer, card) => {
        card.setScale(0.5);

        if (Phaser.Geom.Rectangle.Contains(playZone.getBounds(), card.x, card.y)) {
            playCard(card);
        } else {
            renderHands.call(this); // restore original positions
        }
    });

    // Create claim textbox
    createTextInput();
}

function renderHands() {
    if (this.cardImages) this.cardImages.forEach(img => img.destroy());
    this.cardImages = [];

    let positions = [550, 150];

    for (let i = 0; i < players.length; i++) {
        let player = players[i];
        let y = positions[i];
        let x = 100;

        this.add.text(20, y - 40, player.name, {
            font: "28px Arial",
            fill: "#ffffff"
        });

        for (let card of player.hand) {
            let img = this.add.image(x, y,
                `${card.rank}_of_${card.suit}`)
                .setScale(0.5)
                .setInteractive({ draggable: true });
            img.cardData = card;

            this.input.setDraggable(img);
            this.cardImages.push(img);

            x += 130;
        }
    }
}

function updateTurnText() {
    const ranks = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"];
    turnText.setText(`Turn: Play ${ranks[turnNumber - 1]}'s`);
}

// ------------------------
// PLAYING A CARD
// ------------------------
function playCard(cardImage) {
    let player = players[currentPlayer];

    // Remove card from hand
    let idx = player.hand.indexOf(cardImage.cardData);
    if (idx >= 0) player.hand.splice(idx, 1);

    // Add to pile (always hidden from human)
    pile.push(cardImage.cardData);

    // Refresh visuals
    renderHands.call(this);
    renderPile.call(this);

    // Move to next turn
    nextTurn();
}

// ------------------------
// DRAW PILE
// ------------------------
function renderPile() {
    pileImages.forEach(img => img.destroy());
    pileImages = [];

    let x = 480;
    let y = 330;

    for (let i = 0; i < pile.length; i++) {
        let img = this.scene.add.image(x + i * 4, y + i * 4, "cardBack")
            .setScale(0.45);
        pileImages.push(img);
    }
}

// ------------------------
// TURN SYSTEM
// ------------------------
function nextTurn() {
    currentPlayer = (currentPlayer + 1) % players.length;

    turnNumber++;
    if (turnNumber > 13) turnNumber = 1;

    updateTurnText();
}

// ------------------------
// CALL BS SYSTEM
// ------------------------
function createCallBSButton() {
    callBSButton = this.add.text(830, 20, "Call BS", {
        font: "28px Arial",
        fill: "#ffffff",
        backgroundColor: "#8b0000"
    })
    .setPadding(10)
    .setInteractive()
    .on("pointerdown", () => callBS.call(this));
}

function callBS() {
    if (pile.length === 0) {
        alert("Pile is empty — can't call BS.");
        return;
    }

    // Reveal pile
    pileImages.forEach(img => img.destroy());
    pileImages = [];

    let x = 480;
    let y = 330;

    for (let i = 0; i < pile.length; i++) {
        let card = pile[i];
        let img = this.add.image(x + i * 4, y + i * 4,
            `${card.rank}_of_${card.suit}`).setScale(0.5);
        pileImages.push(img);
    }

    // Check if bluffing (TRUE if any card does not match required rank)
    const requiredRank = ["ace","2","3","4","5","6","7","8","9","10","jack","queen","king"][turnNumber - 1];
    const wasLying = pile.some(card => card.rank !== requiredRank);

    let loser = wasLying ? players[currentPlayer] :
                           players[(currentPlayer + 1) % players.length];

    alert(`${loser.name} loses the BS call and takes the pile!`);

    // Give pile to loser
    loser.hand.push(...pile);

    // Clear pile
    pile = [];
    pileImages.forEach(img => img.destroy());
    pileImages = [];

    // Re-render
    renderHands.call(this);
}

// ------------------------
// TEXT INPUT BOX
// ------------------------
function createTextInput() {
    inputBox = document.createElement("input");
    inputBox.type = "text";
    inputBox.placeholder = "Enter your claim (optional)";

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
