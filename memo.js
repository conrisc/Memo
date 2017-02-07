var IMAGES_FOLDER = "images";
var REVERSE_IMAGE = "reverseImage.png";
var OBVERSE_IMAGES = [
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
var GAME_BOARD_ID = "gameBoard";
var MOVES_ID = "moves";
function randomizeAnArray(array) {
    var l = array.length, r, temp;
    while (l) {
        r = Math.random() * l-- | 0;
        temp = array[l];
        array[l] = array[r];
        array[r] = temp;
    }
}
//CARD***********************************************
var Card = (function () {
    function Card($HTMLElement, imageURL) {
        this.$HTMLCard = $HTMLElement;
        this.revealed = false;
        this.imageURL = imageURL;
        this.$HTMLCard.addClass('card');
    }
    Card.prototype.revealACard = function () {
        var $elem = $(this.$HTMLCard);
        var img = this.imageURL;
        $({ deg: 0 }).animate({ deg: 180 }, {
            duration: 500,
            step: function (now) {
                $elem.css({
                    transform: 'rotateY(' + now + 'deg)'
                });
                if (now >= 90) {
                    $elem.css({ background: "url('" + IMAGES_FOLDER + '/' + img + "') no-repeat" });
                }
            }
        }, "linear");
        this.revealed = true;
    };
    Card.prototype.concealACard = function () {
        var $elem = $(this.$HTMLCard);
        var img = this.imageURL;
        $({ deg: 180 }).animate({ deg: 0 }, {
            duration: 500,
            step: function (now) {
                $elem.css({
                    transform: 'rotateY(' + now + 'deg)'
                });
                if (now <= 90) {
                    $elem.css({ background: "url('" + IMAGES_FOLDER + '/' + REVERSE_IMAGE + "') no-repeat" });
                }
            }
        }, "linear");
        this.revealed = false;
    };
    Card.prototype.hideACard = function () {
        var $elem = $(this.$HTMLCard);
        $({ opa: 1 }).animate({ opa: 0 }, {
            duration: 500,
            step: function (now) {
                $elem.css({
                    opacity: now
                });
            }
        }, "linear");
    };
    return Card;
}());
//GAME***********************************************
var Game = (function () {
    function Game(boardID, movesID, obverseArray) {
        this.$HTMLBoard = $("#" + boardID);
        this.$HTMLMoves = $("#" + movesID);
        this.obverseImages = obverseArray;
    }
    Game.prototype.play = function () {
        this.pair = new Array();
        this.moves = 0;
        this.setTheGame();
    };
    Game.prototype.setTheGame = function () {
        this.createCards();
        randomizeAnArray(this.board);
        this.clearHTMLBoradAndAppendCardsToDOM();
        this.concealAllCards();
        this.updateMoves();
    };
    Game.prototype.createCards = function () {
        this.board = new Array();
        for (var i = 0; i < 2 * this.obverseImages.length; i++) {
            var imageURL = this.obverseImages[Math.floor(i / 2)];
            this.createACard(imageURL);
        }
    };
    Game.prototype.createACard = function (imageURL) {
        var card = new Card($('<div></div>'), imageURL);
        var _this = this;
        card.$HTMLCard.on('click', function () {
            if (!card.revealed)
                _this.updateBoard(card);
        });
        this.board.push(card);
    };
    Game.prototype.updateBoard = function (card) {
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
    };
    Game.prototype.concealThePair = function () {
        this.pair.pop().concealACard();
        this.pair.pop().concealACard();
    };
    Game.prototype.incrMoves = function (incr) {
        this.moves += incr;
        this.updateMoves();
    };
    Game.prototype.updateMoves = function () {
        this.$HTMLMoves.text(this.moves);
    };
    Game.prototype.hideThePair = function (timeout) {
        var c1 = this.pair.pop();
        var c2 = this.pair.pop();
        setTimeout(function () {
            c1.hideACard();
            c2.hideACard();
        }, timeout);
    };
    Game.prototype.clearHTMLBoradAndAppendCardsToDOM = function () {
        this.$HTMLBoard.empty();
        for (var _i = 0, _a = this.board; _i < _a.length; _i++) {
            var card = _a[_i];
            this.$HTMLBoard.append(card.$HTMLCard);
        }
    };
    Game.prototype.concealAllCards = function () {
        for (var _i = 0, _a = this.board; _i < _a.length; _i++) {
            var item = _a[_i];
            item.concealACard();
        }
    };
    return Game;
}());
//MAIN***********************************************
$(function () {
    var game = new Game(GAME_BOARD_ID, MOVES_ID, OBVERSE_IMAGES);
    game.play();
});
