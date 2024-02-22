
//Initial Classes and functions//

class Deck {
    constructor() {
        this.cards = [];
        for (let suit in Suit) {
            for (let faceValue in FaceValue) {
                this.cards.push({ suit: suit, faceValue: faceValue });
            }
        }
    }

    shuffle() {
        let n = this.cards.length;
        while (n > 1) {
            n--;
            let k = Math.floor(Math.random() * (n + 1));
            let value = this.cards[k];
            this.cards[k] = this.cards[n];
            this.cards[n] = value;
        }
    }

    dealCard() {
        return this.cards.shift();
    }
}

const Suit = {
    Spades: 'Spades',
    Hearts: 'Hearts',
    Diamonds: 'Diamonds',
    Clubs: 'Clubs'
};

const FaceValue = {
    Ace: 'Ace',
    Two: 'Two',
    Three: 'Three',
    Four: 'Four',
    Five: 'Five',
    Six: 'Six',
    Seven: 'Seven',
    Eight: 'Eight',
    Nine: 'Nine',
    Ten: 'Ten',
    Jack: 'Jack',
    Queen: 'Queen',
    King: 'King'
};

function prompt(question) {
    return new Promise((resolve) => {
        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });

        readline.question(question, (answer) => {
            resolve(answer);
            readline.close();
        });
    });
}

//Prompt user for their name and Buy-In Value//

let playerName = prompt("Hello, what is your name? ");
updateGameText(`Welcome to Blackjack, ${playerName}!`);

const readline = require('readline');

async function buyIn() {
    updateGameText("Do you want to buy in at $10, $25, $50, or $100?");
    let buyInValue;

    while (true) {
        buyInValue = parseInt(await prompt("Please enter [10], [25], [50], or [100]: "));
        if (![10, 25, 50, 100].includes(buyInValue)) {
            updateGameText("Invalid response. Please enter [10], [25], [50], or [100].");
        } else {
            break;
        }
    }

    return buyInValue;
}

async function prompt(question) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise(resolve => {
        rl.question(question, answer => {
            resolve(answer);
            rl.close();
        });
    });
}

async function playBlackjack() {
    let deck = new Deck();
    let playAgain = true;
    let bankRollAmount = 0;

    //After the first round, every sequential round will prompt user to ask if they want to play again//

    while (playAgain) {

        function dealCards()

        deck.shuffle();
        let playerHand = [];
        let dealerHand = [];

        playerHand.push(deck.dealCard());
        dealerHand.push(deck.dealCard());
        playerHand.push(deck.dealCard());
        dealerHand.push(deck.dealCard());

        // Update game messages
        updateGameText("Cards dealt.");
        updateGameText(`Player's hand: ${displayHand(playerHand)}`);
        updateGameText(`Dealer's hand: ${displayHand(dealerHand)}`);
    }

    // Function to update game messages
    function updateGameText(message) {
        // Get the container for game updates
        let gameUpdatesText = document.getElementById('gameUpdatesText');

        // Append the new message to the existing content
        gameUpdatesText.innerHTML += message + "<br>";
    }

        let buyInValue = await buyIn();
        bankRollAmount += buyInValue;

        while (bankRollAmount > 0) {

            if (bankRollAmount <= 0) {
                updateGameText("Sorry! You have bust out. Better luck next time!");
                return;
            }

            let playerTotal = calculateHandValue(playerHand);
            let dealerTotal = calculateHandValue(dealerHand);

            // Function to update the bet amount when the dropdown value changes
            updateGameText('Please submit your bet now.')

            function updateBetAmount() {
                let betDropdown = document.getElementById('betAmountDropdown');
                betValue = parseInt(betDropdown.value); // Get the selected value from the dropdown
            }

            // Function to handle submitting the bet
            function submitBet() {
                if (isNaN(betValue) || betValue < 1 || betValue > 50 || betValue > bankRollAmount) {
                    return; // Exit the function early if the bet amount is invalid
                }


                updateGameText(`You're betting $${betValue}. Good Luck, ${playerName}!`);
                updateGameText("");
                bankRollAmount - betValue;
            }

            updateGameText(`Player's hand: ${displayHand(playerHand, true)} (${playerTotal})`);
            updateGameText(`Dealer lays one card facedown. Dealer's face-up card: ${displayCard(dealerHand[1])}`);


            // Get the element where you want to display game updates
            const gameUpdatesElement = document.getElementById('game-updates');

            // Attach event listeners to buttons
            document.getElementById('hit-button').addEventListener('click', hit);
            document.getElementById('stand-button').addEventListener('click', stand);
            document.getElementById('play-again').addEventListener('click', playAgain);

            async function hit() {
                if (playerTotal < 21) {
                    let newCard = deck.dealCard();
                    playerHand.push(newCard);
                    playerTotal = calculateHandValue(playerHand);
                    updateGameText(`${playerName} drew ${displayCard(newCard)}. Player's hand: ${displayHand(playerHand, true)} (${playerTotal})`);

                    if (dealerTotal < 17) {
                        let newCardDealer = deck.dealCard();
                        dealerHand.push(newCardDealer);
                        dealerTotal = calculateHandValue(dealerHand);
                        updateGameText(`Dealer has to hit. Dealer draws ${displayCard(newCardDealer)}. Dealer's hand: FaceDown, ${displayCard(dealerHand[1])}, ${displayCard(newCard)}`);
                    }
                }
            }

            function StandButtonClick() {
                if (playerTotal < 21) {
                    updateGameText(`${playerName} stands with a total of ${playerTotal}.`);

                    // Dealer's turn
                    while (dealerTotal < 17) {
                        let newCardDealer = deck.dealCard();
                        dealerHand.push(newCardDealer);
                        dealerTotal = calculateHandValue(dealerHand);
                        updateGameText(`Dealer draws ${displayCard(newCardDealer)}. Dealer's hand: ${displayHand(dealerHand, true)} (${dealerTotal})`);
                    }

                    // Determine the winner
                    determineWinner(playerTotal, dealerTotal, playerName);
                }
            }

            //End of round, ask user if they want to play again so long as they still have funds//
            function playAgainPlayButtonClick() {
                if (bankRollAmount > 0) {
                    updateGameText("Would you like to play another round? [Y] [N]");
                    let anotherRound = (prompt()).toUpperCase().charAt(0);

                    if (anotherRound === 'Y') {
                        playAgain = true;
                        continue;

                    }
                    if (anotherRound !== 'Y' && anotherRound) {
                        updateGameText("Invalid Response. Please enter [Y] to play another round or [N] to quit the game.");

                    }
                    if (anotherRound === 'N') {
                        updateGameText("Okay, see ya again next time!");
                        playAgain = false;
                        break;

                    }
                    else {
                        updateGameText(`Sorry, you have busted out of the game. You are at ${bankRollAmount}. Better luck next time!`);
                        break;
                    }
                }
            }


            //***********************************************************************************************//

            // Function to update the game updates container
            function updateGameText(gameString) {
                document.getElementById('gameUpdatesText').innerHTML = gameString + "<br />" + document.getElementById('gameUpdatesText').innerHTML;
            }
        }
    }
}

//Functions for gameplay//
function displayHand(hand, revealAll = false) {
    let cardStrings = [];

    for (let i = 0; i < hand.length; i++) {
        if (i === 0 && !revealAll) {
            cardStrings.push("Hidden");
        } else {
            cardStrings.push(displayCard(hand[i]));
        }
    }
    return cardStrings.join(", ");
}

function calculateHandValue(hand) {
    let total = 0;
    let numAces = 0;

    for (let card of hand) {
        let faceValue = FaceValue[card.faceValue];
        if (faceValue === FaceValue.Ace) {
            numAces++;
            total += 11;
        } else if (faceValue >= FaceValue.Two && faceValue <= FaceValue.Ten) {
            total += faceValue;
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

function determineWinner(playerTotal, dealerTotal, playerName) {
    if (playerTotal > 21) {
        updateGameText("Player busts! Dealer wins!");
        bankRollAmount -= betValue;
        updateGameText('${betValue}\nBankroll.');
        updateGameText(`Bankroll Amount: ' $${bankRollAmount}.`);
    }

playBlackjack();
