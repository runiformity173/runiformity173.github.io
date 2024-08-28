let DATA = {
    "money":100,
    "playerHand":[],
    "playerAltHand":[],
    "onAltHand":false,
    "playerChips":500,
    "currentBet":5,
    "dealerHand":[],
    "deck":[]
  }
  class Card {
    constructor(value,suit) {
      this.value = value;
      this.suit = suit;
    }
    toString() {
      return this.value[0].toUpperCase() + this.value.slice(1) + " of " + this.suit[0].toUpperCase() + this.suit.slice(1);
    }
    static countHand(hand) {
      let total = 0;
      let aces = 0;
      for (const val of hand) {
        if (val.value == "ace") aces += 1;
        else total += valueMap[val.value];
      }
      if (aces > 0) {
        if (aces + 10 + total < 22) {
          return aces+10+total
        }
        return aces + total;
      }
      return total;
    }
  }
  const valueMap = {"2":2,"3":3,"4":4,"5":5,"6":6,"7":7,"8":8,"9":9,"10":10,"jack":10,"queen":10,"king":10};
  const SUITS = ["diamonds","hearts","clubs","spades"];
  const VALUES = ["ace","2","3","4","5","6","7","8","9","10","jack","queen","king"];
  const deck = [];
  function resetDeck() {
    DATA.deck = [];
    for (const suit of SUITS) {
      for (const value of VALUES) {
        DATA.deck.push(new Card(value,suit));
      }
    }
    shuffle(DATA.deck);
  }
  const shuffle=a=>{for(let b=a.length-1;0<b;b--){const c=Math.floor(Math.random()*(b+1));[a[b],a[c]]=[a[c],a[b]]}return a};
  function hit(hand) {
    hand.push(DATA.deck.pop());
  }
  function doubleDown() {
    DATA.currentBet *= 2;
    if (!hitPlayer()) {
      stand();
    }
  }
  function splitPairs() {
    document.getElementById("doubleDownButton").style.display = "none";
    document.getElementById("splitPairsButton").style.display = "none";
    DATA.playerAltHand.push(DATA.playerHand.pop());
    displayHands();
    if (DATA.playerHand[0].value == "ace") {
      hitPlayer();
      stand();
      hitPlayer();
      stand()
    }
  }
  function hitPlayer() {
    document.getElementById("doubleDownButton").style.display = "none";
    document.getElementById("splitPairsButton").style.display = "none";
    hit(DATA.playerHand);
    if (Card.countHand(DATA.playerHand) > 21) {stand(true);return true;}
    displayHands();
  }
  function hitDealer() {
    hit(DATA.dealerHand);
    displayHands(true);
  }
  function stand(playerBust=false) {
    if (DATA.playerAltHand.length && !DATA.onAltHand) {
      [DATA.playerHand,DATA.playerAltHand] = [DATA.playerAltHand,DATA.playerHand];
      DATA.onAltHand = true;
      displayHands();
      return;
    }
    if (!playerBust) {
      while (Card.countHand(DATA.dealerHand) < 17) {
        hitDealer();
      }
    }
    endGame();
  }
  function endGame(gameData={}) {
    let player = Card.countHand(DATA.playerHand);
    let playerAlt = Card.countHand(DATA.playerAltHand);
    if (player > 21) {
      gameData.playerBust = true;
      player = -1;
    } if (playerAlt > 21) {
      gameData.playerBustAlt = true;
      playerAlt = -1;
    }
    let dealer = Card.countHand(DATA.dealerHand);
    if (dealer > 21) {
      gameData.dealerBust = true;
      dealer = -1;
    }
    if (player > dealer) {
      gameData.result = "player";
      DATA.playerChips += DATA.currentBet;
      if (player == 21 && DATA.playerHand.length == 2 && !DATA.onAltHand) DATA.playerChips += Math.floor(DATA.currentBet/2);
  
    } else if (player < dealer) {
      DATA.playerChips -= DATA.currentBet;
      gameData.result = "dealer"
      if (DATA.playerChips < 5) {
        alert("You just lost all your money. Now you're starting again from scratch.");
        DATA.playerChips = 500;
      }
    } else {
      gameData.result = "push";
    }
    if (DATA.onAltHand) {
      if (playerAlt > dealer) {
        DATA.playerChips += DATA.currentBet;
        gameData.resultAlt = "player"
      } else if (playerAlt < dealer) {
        DATA.playerChips -= DATA.currentBet;
        gameData.resultAlt = "dealer"
        if (DATA.playerChips < 5) {
          alert("You just lost all your money. Now you're starting again from scratch.");
          DATA.playerChips = 500;
        }
      } else {
        gameData.resultAlt = "push";
      }
    }
    displayEndGame(gameData);
  }
  function newGame() {
    DATA.currentBet = Number(document.getElementById("playerBet").value);
    if (DATA.currentBet > DATA.playerChips) {
      alert("You're too broke to bet "+DATA.currentBet+" chips");
      return;
    }
    resetDeck();
    DATA.playerHand = [];
    DATA.playerAltHand = [];
    DATA.onAltHand = false;
    DATA.dealerHand = [];
    hit(DATA.playerHand);hit(DATA.playerHand);
    hit(DATA.dealerHand);hit(DATA.dealerHand);
    let playerHand = Card.countHand(DATA.playerHand);
    const playerNatural = playerHand == 21;
    const dealerNatural = Card.countHand(DATA.dealerHand) == 21;
    document.getElementById("gameButtons").style.display = "inline";
    if (playerHand < 12 && playerHand > 8 && DATA.playerChips >= 2*DATA.currentBet) {
      document.getElementById("doubleDownButton").style.display = "inline";
    } else {
      document.getElementById("doubleDownButton").style.display = "none";
    }
    if (DATA.playerHand[0].value == DATA.playerHand[1].value && DATA.playerChips >= 2*DATA.currentBet) {
      document.getElementById("splitPairsButton").style.display = "inline";
    } else {
      document.getElementById("splitPairsButton").style.display = "none";
    }
    document.getElementById("newGameSpan").style.display = "none";
    displayHands();
    if (playerNatural || dealerNatural) {
      endGame({playerNatural:playerNatural,dealerNatural:dealerNatural});
    }
  }
  document.getElementById("playerChips").innerHTML = DATA.playerChips;