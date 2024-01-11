const gameMessagesContainer = document.getElementById('game-messages');
const playerHandContainer = document.getElementById('player-hand');
const dealerHandContainer = document.getElementById('dealer-hand');
const gameUpdatesContainer = document.getElementById('game-updates');

function displayMessage(message) {
    if (gameMessagesContainer) {
        gameMessagesContainer.textContent = message;
    }
}

function displayPlayerHand(hand, total) {
    if (playerHandContainer) {
        playerHandContainer.textContent = `Player's hand: ${displayHand(hand)} (${total})`;
    }
}

function displayDealerHand(hand, revealAll) {
    if (dealerHandContainer) {
        dealerHandContainer.textContent = `Dealer's hand: ${displayHand(hand, revealAll)}`;
    }
}

function displayGameUpdates(message) {
    if (gameUpdatesContainer) {
        const listItem = document.createElement('li');
        listItem.textContent = message;
        gameUpdatesContainer.appendChild(listItem);
    }
}

// Your existing game logic functions go here


const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

class Deck {
    constructor() {
        this.cards = [];
        for (const suit in Suit) {
            for (const faceValue in FaceValue) {
                this.cards.push({ suit: suit.toLowerCase(), faceValue: faceValue.toLowerCase() });
            }
        }
    }

    shuffle(rng) {
        let n = this.cards.length;
        while (n > 1) {
            n--;
            const k = rng.nextInt(n + 1);
            const value = this.cards[k];
            this.cards[k] = this.cards[n];
            this.cards[n] = value;
        }
    }

    dealCard() {
        const card = this.cards[0];
        this.cards.splice(0, 1);
        return card;
    }
}

class Card {
    constructor(suit, faceValue) {
        this.suit = suit;
        this.faceValue = faceValue;
    }
}

const FaceValue = {
    Two: 2,
    Three: 3,
    Four: 4,
    Five: 5,
    Six: 6,
    Seven: 7,
    Eight: 8,
    Nine: 9,
    Ten: 10,
    Jack: 'jack',
    Queen: 'queen',
    King: 'king',
    Ace: 'ace'
};

const Suit = {
    Hearts: 'hearts',
    Diamonds: 'diamonds',
    Clubs: 'clubs',
    Spades: 'spades'
};

const deck = new Deck();

function shuffleDeck(rng) {
    deck.shuffle(rng);
}

function dealCard() {
    return deck.dealCard();
}

function calculateHandValue(hand) {
    let total = 0;
    let numAces = 0;
    for (const card of hand) {
        if (card.faceValue === FaceValue.Ace) {
            numAces++;
            total += 11;
        } else if (card.faceValue >= FaceValue.Two && card.faceValue <= FaceValue.Ten) {
            total += card.faceValue;
        } else {
            total += 10;
        }
    }
    while (numAces > 0 && total > 21) {
        total -= 10;
        numAces--;
    }
    return total;
}

function displayCard(card) {
    return `${card.faceValue} of ${card.suit}`;
}

function displayHand(hand, revealAll = false) {
    const cardStrings = [];
    for (let i = 0; i < hand.length; i++) {
        if (i === 0 && !revealAll) {
            cardStrings.push('Hidden');
        } else {
            cardStrings.push(displayCard(hand[i]));
        }
    }
    return cardStrings.join(', ');
}

function determineWinner(playerTotal, dealerTotal) {
    if (playerTotal > 21) {
        console.log('Player busts! Dealer wins!');
        bankRollAmount -= betValue;
        console.log(`- $${betValue}\nBankroll: $${bankRollAmount}`);
    } else if (dealerTotal > 21) {
        console.log(`Dealer busts! ${playerName} wins!`);
        bankRollAmount += betValue * 2;
        console.log(`+ $${betValue * 2}\nBankroll: $${bankRollAmount}`);
    } else if (playerTotal === 21 && playerTotal !== dealerTotal) {
        console.log(`${playerName} has Blackjack!`);
        bankRollAmount += betValue * 2;
        console.log(`+ $${betValue * 2}\nBankroll: $${bankRollAmount}`);
    } else if (dealerTotal === 21) {
        console.log('Dealer has Blackjack!');
        bankRollAmount -= betValue;
        console.log(`- $${betValue}\nBankroll: $${bankRollAmount}`);
        return;
    } else if (playerTotal > dealerTotal) {
        console.log(`${playerName} wins!`);
        bankRollAmount += betValue * 2;
        console.log(`+ $${betValue * 2}\nBankroll: $${bankRollAmount}`);
    } else if (playerTotal < dealerTotal) {
        console.log('Dealer wins!');
        bankRollAmount -= betValue;
        console.log(`- $${betValue}\nBankroll: $${bankRollAmount}`);
    } else if (playerTotal === dealerTotal) {
        console.log('It\'s a tie!');
        console.log(`All bets returned. Bankroll: ${bankRollAmount}`);
    } else if (dealerTotal === 21) {
        console.log('Dealer has Blackjack! You lose!');
        bankRollAmount -= betValue;
        console.log(`- $${betValue}\nBankroll: $${bankRollAmount}`);
        return;
    }
}

function promptUserForDecision(playerName) {
    return new Promise((resolve, reject) => {
        rl.question(`Are you ready to play, ${playerName}? [Y] [N] `, (answer) => {
            const keyChar = answer.toUpperCase();
            if (keyChar === 'Y') {
                console.log();
                resolve(true);
            } else if (keyChar === 'N') {
                console.log();
                resolve(false);
            } else {
                console.log('\nInvalid input. Please press [Y] to play or [N] to exit.');
                reject();
            }
        });
    });
}

function promptUserForBet() {
    return new Promise((resolve, reject) => {
        rl.question('How much would you like to bet? Min ($1) Max ($10000) ', (answer) => {
            const betValue = parseInt(answer);
            if (isNaN(betValue) || betValue < 0 || betValue > 10000) {
                console.log('Invalid bet amount. Please enter an amount between $1.00 and $10000.');
                reject();
            } else if (betValue > buyInValue) {
                console.log('You cannot bet more money than you have. Try again.');
                reject();
            } else {
                resolve(betValue);
            }
        });
    });
}

function promptUserForBuyIn() {
    return new Promise((resolve, reject) => {
        rl.question('Do you want to buy in at $10, $25, $50, or $100? ', (answer) => {
            const buyInValue = parseInt(answer);
            if (isNaN(buyInValue) || (buyInValue !== 10 && buyInValue !== 25 && buyInValue !== 50 && buyInValue !== 100)) {
                console.log('Invalid response. Please enter [10], [25], [50], or [100].');
                reject();
            } else {
                resolve(buyInValue);
            }
        });
    });
}

function promptUserForAnotherRound() {
    return new Promise((resolve, reject) => {
        rl.question('Would you like to play another round? [Y] [N] ', (answer) => {
            const anotherRoundUpper = answer.toUpperCase();
            const playAnotherRound = anotherRoundUpper === 'Y';
            if (playAnotherRound) {
                resolve(true);
            } else if (playAnotherRound !== true && playAnotherRound) {
                console.log('Invalid Response. Please enter [Y] to play another round or [N] to quit the game.');
                reject();
            } else {
                console.log('Okay, see you again next time!');
                resolve(false);
            }
        });
    });
}

function playBlackjack() {
    console.log('Hello, what is your name?');
    rl.question('Welcome to Blackjack! ', (answer) => {
        const playerName = answer;
        console.log();
        console.log(`Let's play Blackjack!`);
        promptUserForDecision(playerName)
            .then((readyToPlay) => {
                if (readyToPlay) {
                    console.log('Let\'s play Blackjack!');
                } else {
                    console.log('Maybe next time. Goodbye!');
                    rl.close();
                    return;
                }
                promptUserForBuyIn()
                    .then((buyInValue) => {
                        let roundOutcome = 0;
                        let bankRollAmount = buyInValue + -roundOutcome;
                        console.log(`Great! You've bought in at ${buyInValue}. Your Bankroll is $${bankRollAmount}.`);
                        let playAgain = true;
                        while (playAgain) {
                            shuffleDeck(Math.random);
                            const playerHand = [];
                            const dealerHand = [];
                            playerHand.push(dealCard());
                            dealerHand.push(dealCard());
                            playerHand.push(dealCard());
                            dealerHand.push(dealCard());
                            if (bankRollAmount <= 0) {
                                console.log('Sorry! You have bust out. Better luck next time!');
                                rl.close();
                                return;
                            }
                            let playerTotal = calculateHandValue(playerHand);
                            let dealerTotal = calculateHandValue(dealerHand);
                            promptUserForBet()
                                .then((betValue) => {
                                    console.log(`You're betting $${betValue}. Good Luck, ${playerName}!`);
                                    console.log();
                                    console.log(`Player's hand: ${displayHand(playerHand, true)} (${playerTotal})`);
                                    console.log(`Dealer lays one card facedown. Dealer's face-up card: ${displayCard(dealerHand[1])}`);
                                    while (playerTotal < 21) {
                                        console.log('Do you want to hit [H] or stand [S]?');
                                        const choice = readline.keyIn('', { hideEchoBack: true, mask: '' }).toUpperCase();
                                        if (choice === 'H' && playerTotal < 21) {
                                            const newCard = dealCard();
                                            playerHand.push(newCard);
                                            playerTotal = calculateHandValue(playerHand);
                                            console.log(`\n${playerName} drew ${displayCard(newCard)}`);
                                            console.log(`Player's hand: ${displayHand(playerHand, true)} (${playerTotal})`);
                                            if (dealerTotal < 17) {
                                                const newCardDealer = dealCard();
                                                dealerHand.push(newCardDealer);
                                                dealerTotal = calculateHandValue(dealerHand);
                                                console.log(`\nDealer has to hit. Dealer draws ${displayCard(newCardDealer)}`);
                                                console.log(`Dealer hand: FaceDown, ${displayCard(dealerHand[1])}, ${displayCard(newCard)}`);
                                                continue;
                                            }
                                            continue;
                                        }
                                        if (choice === 'S') {
                                            console.log(`\nYou Stand. ${displayHand(playerHand, true)} (${playerTotal})`);
                                            while (dealerTotal <= 17) {
                                                const newCard = dealCard();
                                                dealerHand.push(newCard);
                                                dealerTotal = calculateHandValue(dealerHand);
                                                console.log(`\nDealer has to hit. Dealer draws ${displayCard(newCard)}`);
                                                console.log(`Dealer hand: FaceDown, ${displayCard(dealerHand[1])}, ${displayCard(newCard)}`);
                                            }
                                            break;
                                        } else if (choice !== 'H' && choice !== 'S') {
                                            console.log('Invalid Response.\nPlease enter \'H\' to Hit or \'S\' to Stand.');
                                            continue;
                                        }
                                    }
                                    determineWinner(playerTotal, dealerTotal);
                                    if (bankRollAmount > 0) {
                                        promptUserForAnotherRound()
                                            .then((playAnotherRound) => {
                                                if (playAnotherRound) {
                                                    playAgain = true;
                                                    return;
                                                } else {
                                                    console.log('Okay, see ya again next time!');
                                                    playAgain = false;
                                                    rl.close();
                                                    return;
                                                }
                                            })
                                            .catch(() => {
                                                playAgain = true;
                                            });
                                    }
                                })
                                .catch(() => {
                                    playAgain = true;
                                });
                        }
                    })
                    .catch(() => {
                        rl.close();
                    });
            })
            .catch(() => {
                rl.close();
            });
    });
}

playBlackjack();
