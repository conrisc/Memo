let IMAGES_FOLDER = "images";
let REVERSE_IMAGE = "reverseImage.png"
let OBVERSE_IMAGES = [
  'obverse_1.png',
  'obverse_2.png',
  'obverse_3.png',
  'obverse_4.png',
  'obverse_5.png',
  'obverse_6.png',
  'obverse_7.png',
  'obverse_8.png',
  'obverse_9.png',
  'obverse_10.png'
];
let GAME_BOARD_ID = "gameBoard";
let MOVES_ID = "moves";

function randomizeAnArray(array) {
  let l = array.length,r,temp;
  while(l) {
    r = Math.random()*l--|0;
    temp = array[l];
    array[l] = array[r];
    array[r] = temp;
  }
}

//CARD***********************************************
class Card {
  $HTMLCard;
  revealed: boolean;
  imageURL: string;

  constructor($HTMLElement, imageURL: string) {
    this.$HTMLCard = $HTMLElement;
    this.revealed = false;
    this.imageURL = imageURL;
    this.$HTMLCard.addClass('card');
  }

  revealACard() {
    let $elem = $(this.$HTMLCard);
    let img = this.imageURL;
    $({deg: 0}).animate({deg: 180}, {
        duration: 500,
        step: function(now) {
            $elem.css({
                transform: 'rotateY(' + now + 'deg)'
            });
            if (now>=90) {
              $elem.css({background: "url('" + IMAGES_FOLDER + '/' + img + "') no-repeat"});
            }
        }
    },"linear");
    this.revealed = true;
  }

  concealACard() {
    let $elem = $(this.$HTMLCard);
    let img = this.imageURL;
    $({deg: 180}).animate({deg: 0}, {
        duration: 500,
        step: function(now) {
            $elem.css({
                transform: 'rotateY(' + now + 'deg)'
            });
            if (now<=90) {
              $elem.css({background: "url('"+IMAGES_FOLDER+'/'+REVERSE_IMAGE+"') no-repeat"});
            }
        }
    },"linear");
    this.revealed = false;
  }

  hideACard() {
    let $elem = $(this.$HTMLCard);
    $({opa: 1}).animate({opa: 0}, {
        duration: 500,
        step: function(now) {
            $elem.css({
                opacity: now
            });
        }
    },"linear");
  }

}

//GAME***********************************************
class Game {
  $HTMLBoard;
  $HTMLMoves;
  board: Array<Card>;
  obverseImages: Array<string>;
  pair: Array<Card>;
  moves: number;

  constructor(boardID: string, movesID: string, obverseArray: Array<string>) {
    this.$HTMLBoard = $("#"+boardID);
    this.$HTMLMoves = $("#"+movesID);
    this.obverseImages = obverseArray;
  }

  play() {
    this.pair = new Array<Card>();
    this.moves = 0;
    this.setTheGame();
  }

  private setTheGame() {
    this.createCards();
    randomizeAnArray(this.board);
    this.clearHTMLBoradAndAppendCardsToDOM();
    this.concealAllCards();
    this.updateMoves();
  }

  private createCards() {
    this.board = new Array<Card>();
    for (var i=0;i<2*this.obverseImages.length;i++) {
      let imageURL = this.obverseImages[Math.floor(i/2)];
      this.createACard(imageURL);
    }
  }

  private createACard(imageURL: string) {
    let card = new Card( $('<div></div>'),imageURL);
    let _this = this;
    card.$HTMLCard.on('click',function() {
      if (!card.revealed) _this.updateBoard(card);
    });
    this.board.push(card);
  }

  private updateBoard(card: Card) {
    if (this.pair.length === 2) {
      this.concealThePair();
    }
    this.pair.push(card);
    card.revealACard();
    if (this.pair.length === 2) {
      this.incrMoves(1);
      if (this.pair[0].imageURL === this.pair[1].imageURL) {
        this.hideThePair(1000);
      }
    }
  }

  private concealThePair() {
    this.pair.pop().concealACard();
    this.pair.pop().concealACard();
  }

  private incrMoves(incr: number) {
    this.moves+=incr;
    this.updateMoves();
  }

  private updateMoves() {
    this.$HTMLMoves.text(this.moves);
  }

  private hideThePair(timeout: number) {
    let c1 = this.pair.pop();
    let c2 = this.pair.pop();
    setTimeout(function() {
      c1.hideACard();
      c2.hideACard();
    },timeout);
  }

  private clearHTMLBoradAndAppendCardsToDOM() {
    this.$HTMLBoard.empty();
    for (let card of this.board) {
      this.$HTMLBoard.append(card.$HTMLCard);
    }
  }

  private concealAllCards() {
    for (let item of this.board) {
      item.concealACard();
    }
  }

}

//MAIN***********************************************
$(function(){
  let game = new Game(GAME_BOARD_ID,MOVES_ID,OBVERSE_IMAGES);
  game.play();
});
