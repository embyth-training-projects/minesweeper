'use strict';

(function () {
  // DOM Elements
  var flagsCounter = document.querySelector('.flags-counter span');
  var field = document.querySelector('.game-field');
  var winClose = document.querySelector('.win-message__close');
  var loseClose = document.querySelector('.lose-message__close');
  var loseAgain = document.querySelector('.lose-message__again');
  var resetButton = document.querySelector('.reset');

  // Game variables
  var WIDTH = 10;
  var BOMB_AMOUNT = 20;
  var squares = [];
  var isGameOver = false;
  var flags = 0;

  // Checking square position on left edge
  function isLeftEdge(pos) {
    return (pos % WIDTH === 0);
  }

  // Checking square position on right edge
  function isRightEdge(pos) {
    return (pos % WIDTH === WIDTH - 1);
  }

  // Create game field
  function createBoard() {
    var bombArray = Array(BOMB_AMOUNT).fill('bomb');
    var emptyArray = Array(WIDTH * WIDTH - BOMB_AMOUNT).fill('valid');
    var gameArray = emptyArray.concat(bombArray);
    var shuffledArray = gameArray.sort(function () {
      return Math.random() - 0.5;
    });

    for (var i = 0; i < WIDTH * WIDTH; i++) {
      var square = document.createElement('div');
      square.setAttribute('id', i);
      square.setAttribute('tabindex', 0);
      square.classList.add(shuffledArray[i]);
      field.appendChild(square);
      squares.push(square);

      square.addEventListener('click', onSquareLeftClick);
      square.addEventListener('keydown', onSquareEnterKeyDown);
      square.addEventListener('contextmenu', onSquareRightClick);
      square.addEventListener('keydown', onSquareCtrlKeyDown);
    }

    for (var j = 0; j < squares.length; j++) {
      var total = 0;

      if (squares[j].classList.contains('valid')) {
        // [x][B][ ]
        if (j > 0 && !isLeftEdge(j) && squares[j - 1].classList.contains('bomb')) {
          total++;
        }
        // [ ][ ][x]
        // [ ][B][ ]
        if (j > WIDTH - 1 && !isRightEdge(j) && squares[j + 1 - WIDTH].classList.contains('bomb')) {
          total++;
        }
        // [ ][x][ ]
        // [ ][B][ ]
        if (j >= WIDTH && squares[j - WIDTH].classList.contains('bomb')) {
          total++;
        }
        // [x][ ][ ]
        // [ ][B][ ]
        if (j >= WIDTH + 1 && !isLeftEdge(j) && squares[j - 1 - WIDTH].classList.contains('bomb')) {
          total++;
        }
        // [ ][B][x]
        if (j <= WIDTH * WIDTH - 2 && !isRightEdge(j) && squares[j + 1].classList.contains('bomb')) {
          total++;
        }
        // [ ][B][ ]
        // [x][ ][ ]
        if (j < WIDTH * WIDTH - WIDTH && !isLeftEdge(j) && squares[j - 1 + WIDTH].classList.contains('bomb')) {
          total++;
        }
        // [ ][B][ ]
        // [ ][ ][x]
        if (j <= WIDTH * WIDTH - WIDTH - 2 && !isRightEdge(j) && squares[j + 1 + WIDTH].classList.contains('bomb')) {
          total++;
        }
        // [ ][B][ ]
        // [ ][x][ ]
        if (j <= WIDTH * WIDTH - WIDTH - 1 && squares[j + WIDTH].classList.contains('bomb')) {
          total++;
        }

        switch (total) {
          case 1:
            squares[j].classList.add('one');
            break;
          case 2:
            squares[j].classList.add('two');
            break;
          case 3:
            squares[j].classList.add('three');
            break;
          case 4:
            squares[j].classList.add('four');
            break;
          case 5:
            squares[j].classList.add('five');
            break;
          default:
            squares[j].classList.add('six-seven-eight');
            break;
        }
        squares[j].setAttribute('data', total);
      }
    }
  }

  // Parsing neighbor squares
  function parseSquare(id) {
    setTimeout(function () {
      if (id > 0 && !isLeftEdge(id)) {
        var newId = parseInt(id, 10) - 1;
        var newSquare = document.getElementById(newId);
        checkSquare(newSquare);
      }
      if (id > WIDTH - 1 && !isRightEdge(id)) {
        newId = parseInt(id, 10) + 1 - WIDTH;
        newSquare = document.getElementById(newId);
        checkSquare(newSquare);
      }
      if (id >= WIDTH) {
        newId = parseInt(id, 10) - WIDTH;
        newSquare = document.getElementById(newId);
        checkSquare(newSquare);
      }
      if (id >= WIDTH + 1 && !isLeftEdge(id)) {
        newId = parseInt(id, 10) - 1 - WIDTH;
        newSquare = document.getElementById(newId);
        checkSquare(newSquare);
      }
      if (id <= WIDTH * WIDTH - 2 && !isRightEdge(id)) {
        newId = parseInt(id, 10) + 1;
        newSquare = document.getElementById(newId);
        checkSquare(newSquare);
      }
      if (id < WIDTH * WIDTH - WIDTH && !isLeftEdge(id)) {
        newId = parseInt(id, 10) - 1 + WIDTH;
        newSquare = document.getElementById(newId);
        checkSquare(newSquare);
      }
      if (id <= WIDTH * WIDTH - WIDTH - 2 && !isRightEdge(id)) {
        newId = parseInt(id, 10) + 1 + WIDTH;
        newSquare = document.getElementById(newId);
        checkSquare(newSquare);
      }
      if (id <= WIDTH * WIDTH - WIDTH - 1) {
        newId = parseInt(id, 10) + WIDTH;
        newSquare = document.getElementById(newId);
        checkSquare(newSquare);
      }
    }, 10);
  }

  // Checking square on bordering bomb
  function checkSquare(square) {
    var currentId = square.id;

    if (isGameOver) {
      return;
    }
    if (square.classList.contains('checked') || square.classList.contains('flag')) {
      return;
    }

    if (square.classList.contains('bomb')) {
      gameOver();
    } else {
      var total = parseInt(square.getAttribute('data'), 10);
      if (total !== 0) {
        square.classList.add('checked');
        square.textContent = total;
        return;
      }
      parseSquare(currentId);
    }
    square.classList.add('checked');
  }

  // Game over function
  function gameOver() {
    isGameOver = true;

    squares.forEach(function (square) {
      if (square.classList.contains('bomb')) {
        square.textContent = '💣';
      }
    });

    var loseNode = document.querySelector('.lose-message');
    loseNode.classList.remove('hidden');

    loseClose.addEventListener('click', onCloseClick);
    loseAgain.addEventListener('click', onTryAgainButtonClick);
    document.addEventListener('keydown', onCloseKeyDown);
  }

  // Check game on win state
  function checkForWin() {
    var matches = 0;

    for (var i = 0; i < squares.length; i++) {
      if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
        matches++;
      }
      if (matches === BOMB_AMOUNT) {
        gameWin();
      }
    }
  }

  // Game winning function
  function gameWin() {
    isGameOver = true;
    var winNode = document.querySelector('.win-message');
    winNode.classList.remove('hidden');

    winClose.addEventListener('click', onCloseClick);
    document.addEventListener('keydown', onCloseKeyDown);
  }

  // Adding flag on square
  function addFlag(square) {
    if (isGameOver) {
      return;
    }

    if (!square.classList.contains('checked') && square.classList.contains('flag') && (flags === BOMB_AMOUNT)) {
      square.classList.remove('flag');
      square.textContent = '';
      flags--;
    } else if (!square.classList.contains('checked') && (flags < BOMB_AMOUNT)) {
      if (!square.classList.contains('flag')) {
        square.classList.add('flag');
        square.textContent = '🚩';
        flags++;
        checkForWin();
      } else {
        square.classList.remove('flag');
        square.textContent = '';
        flags--;
      }
    }

    flagsCounter.textContent = BOMB_AMOUNT - flags;
  }

  // Close messages
  function closeGameStateMessage() {
    document.querySelectorAll('.message').forEach(function (item) {
      if (!item.classList.contains('hidden')) {
        item.classList.add('hidden');
      }
    });

    document.removeEventListener('keydown', onCloseKeyDown);
    winClose.removeEventListener('click', onCloseClick);
    loseClose.removeEventListener('click', onCloseClick);
    loseAgain.removeEventListener('click', onTryAgainButtonClick);
  }

  // Close message click handler
  function onCloseClick(evt) {
    evt.preventDefault();

    closeGameStateMessage();
  }

  // Close message keydown handler
  function onCloseKeyDown(evt) {
    if (evt.keyCode === 27) { // Keycode of Esc is 27
      evt.preventDefault();

      closeGameStateMessage();
    }
  }

  // Reseting game field
  function onResetClick() {
    while (field.firstChild) {
      field.firstChild.remove();
    }

    isGameOver = false;
    squares.length = 0;
    flags = 0;
    flagsCounter.textContent = BOMB_AMOUNT;
    resetButton.blur();
    closeGameStateMessage();
    createBoard();
  }

  // Try again button handler
  function onTryAgainButtonClick(evt) {
    evt.preventDefault();

    onResetClick();
  }

  // Square right button click handler
  function onSquareRightClick(evt) {
    evt.preventDefault();
    if (evt.button === 2) { // Left Mouse Button is 2
      var target = evt.target;
      addFlag(target);
    }
  }

  // Square ctrl keydown handler
  function onSquareCtrlKeyDown(evt) {
    if (evt.keyCode === 17) { // Keycode of Ctrl is 17
      var target = evt.target;
      addFlag(target);
    }
  }

  // Square main click handler
  function onSquareLeftClick(evt) {
    if (evt.button === 0) { // Left Mouse Button is 0
      var target = evt.target;
      checkSquare(target);
    }
  }

  // Square enter keydown handler
  function onSquareEnterKeyDown(evt) {
    if (evt.keyCode === 13) { // Keycode of Enter is 13
      var target = evt.target;

      checkSquare(target);
    }
  }

  // Render game field after dom loaded
  document.addEventListener('DOMContentLoaded', function () {
    createBoard();
    resetButton.addEventListener('click', onResetClick);
  });
})();
