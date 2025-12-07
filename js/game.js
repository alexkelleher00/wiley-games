<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Phaser Card Game</title>
<script src="https://cdn.jsdelivr.net/npm/phaser@3.60.0/dist/phaser.js"></script>
<style>
    body { margin: 0; padding: 0; }
    #game-container { margin: 0 auto; }
    button { position: absolute; top: 10px; left: 10px; z-index: 1000; }
</style>
</head>
<body>
<button id="doneTurn">Done Turn</button>
<div id="game-container"></div>
<script>
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: 0x228B22,
    parent: 'game-container',
    scene: { preload, create, update }
};

const game = new Phaser.Game(config);

let playerHands = [[], []];
let currentPlayer = 0;
let cardGroup;
let selectedCards = [];

const suits = ["Hearts", "Diamonds", "Clubs", "Spades"];
const values = ["Ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King"];

function preload() {
    // We'll generate card graphics dynamically
}

function create() {
    cardGroup = this.add.group();

    // Create player name texts
    this.playerTexts = [
        this.add.text(100, 520, 'Player 1', { font: '24px Arial', fill: '#ffffff' }),
        this.add.text(100, 50, 'Player 2', { font: '24px Arial', fill: '#ffffff' })
    ];

    // Create a deck
    let deck = [];
    suits.forEach(suit => {
        values.forEach(value => {
            deck.push({ suit, value });
        });
    });

    Phaser.Utils.Array.Shuffle(deck);

    // Deal 5 cards each
    for (let i = 0; i < 5; i++) {
        playerHands[0].push(deck.pop());
        playerHands[1].push(deck.pop());
    }

    drawHands(this);

    // Make cards draggable
    this.input.on('dragstart', (pointer, gameObject) => {
        gameObject.setTint(0x999999);
        if (!selectedCards.includes(gameObject)) selectedCards.push(gameObject);
    });

    this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
        gameObject.x = dragX;
        gameObject.y = dragY;
    });

    this.input.on('dragend', (pointer, gameObject) => {
        gameObject.clearTint();
    });

    document.getElementById('doneTurn').addEventListener('click', () => {
        finishTurn();
    });
}

function drawHands(scene) {
    // Clear previous cards
    cardGroup.clear(true, true);

    const spacing = 60;
    const yPositions = [500, 100];

    playerHands.forEach((hand, playerIndex) => {
        let x = 50;
        hand.forEach(card => {
            let cardContainer = scene.add.container(x, yPositions[playerIndex]);

            // Card backing
            let rect = scene.add.rectangle(0, 0, 60, 90, 0xffffff);
            rect.setStrokeStyle(2, 0x000000);

            // Card text
            let cardText = scene.add.text(-25, -20, `${card.value}\n${card.suit}`, { font: '14px Arial', fill: '#000000' });

            cardContainer.add([rect, cardText]);
            cardContainer.setSize(60, 90);
            cardContainer.setInteractive();
            scene.input.setDraggable(cardContainer);

            cardContainer.playerIndex = playerIndex; // track owner
            cardGroup.add(cardContainer);

            x += spacing;
        });
    });
}

function finishTurn() {
    // Check if current player is playing
    if (selectedCards.length === 0) return;

    // Validate selected cards belong to current player
    for (let c of selectedCards) {
        if (c.playerIndex !== currentPlayer) {
            alert("You can only play your own cards!");
            selectedCards = [];
            drawHands(game.scene.scenes[0]);
            return;
        }
    }

    // Remove selected cards from hand
    selectedCards.forEach(c => {
        playerHands[currentPlayer] = playerHands[currentPlayer].filter(card => {
            return !(card.value + card.suit === c.list[1].text.replace('\n',''));
        });
    });

    console.log(`Player ${currentPlayer + 1} played:`, selectedCards.map(c => c.list[1].text));

    selectedCards = [];
    currentPlayer = (currentPlayer + 1) % 2;
    drawHands(game.scene.scenes[0]);
}

function update() {}

</script>
</body>
</html>
