// Creating the Deck of Cards
const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const deck = suits.reduce((acc, suit) => {
    values.forEach(value => acc.push({ suit, value }));
    return acc;
}, []);

// Shuffling the Deck of Cards
function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

// Drawing a Card from the Deck
function drawCard(deck) {
    return deck.pop();
}

// Defining the Game
function game() {
    shuffleDeck(deck);
    let player = { score: 0, hand: [] };
    let dealer = { score: 0, hand: [] };

    // Player's Turn
    player.hand.push(drawCard(deck));
    player.hand.push(drawCard(deck));
    player.score = player.hand.reduce((acc, card) => acc + getCardValue(card), 0);
    let playerCard1 = document.querySelector('#playerCard1');
    let playerCard2 = document.querySelector('#playerCard2');
    // Dealer's Turn

    dealer.hand.push(drawCard(deck));
    dealer.hand.push(drawCard(deck));
    dealer.score = dealer.hand.reduce((acc, card) => acc + getCardValue(card), 0);

    // Determining the Winner
    while (player.score <= 21 && dealer.score <= 21) {
        if (player.score > dealer.score) {
            console.log('Player wins!');
            break;
        } else if (dealer.score > player.score) {
            console.log('Dealer wins!');
            break;
        } else {
            console.log('It\'s a tie!');
            break;
        }
    }

    // Outputting the Final Scores
    console.log(`Player's Hand: ${player.hand.map(card => card.value).join(', ')}`);
    console.log(`Dealer's Hand: ${dealer.hand.map(card => card.value).join(', ')}`);
    console.log(`Player's Score: ${player.score}`);
    console.log(`Dealer's Score: ${dealer.score}`);
}

// Defining the Function to Get the Card Value
function getCardValue(card) {
    if (isNaN(card.value)) {
        return 10;
    } else {
        return Number(card.value);
    }
}
document.getElementById('play-again').addEventListener('click', function () {
    // Playing the Game
    game();
});
// Playing the Game
game();

// Defining the Game
function game() {
    // ... (The rest of the game logic remains the same)

    // Displaying the Player's Cards
    playerCard1.innerHTML = player.hand[0].value;
    playerCard2.innerHTML = player.hand[1].value;
}

// Playing the Game
game();