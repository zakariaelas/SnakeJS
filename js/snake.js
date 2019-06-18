//DOM elements
var startScreen = document.getElementsByClassName('start-screen')[0];
var box = document.getElementsByClassName('box')[0];
var board = document.getElementsByClassName('board')[0];
var pauseModal = document.getElementsByClassName('modal')[0];
var gameOverModal = document.getElementsByClassName('modal')[1];
var startButton = document.getElementsByTagName('button')[0];
var playAgainButton = document.getElementsByTagName('button')[1];
var footer = document.getElementsByClassName('footer')[0];
var lengthDOM = document.getElementById('length');

var food = {
  dom: document.getElementsByClassName('point-box')[0],
  top: 0,
  left: 0
};

var length = 1,
  box_arr = [],
  paused = false,
  pressed = {};

var keys = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40
};

function newGame() {
  length = 1;
  lengthDOM.innerText = length;
  box_arr = [];
  paused = false;
  pressed = {};
  document.addEventListener('keydown', keydownListener);
  init();
  randomBox();
}

startButton.addEventListener('click', () => {
  startScreen.classList.toggle('hide');
  board.classList.toggle('show');
  board.classList.toggle('hide');
  footer.classList.toggle('show');
  footer.classList.toggle('hide');
  newGame();
});

playAgainButton.addEventListener('click', () => {
  gameOverModal.classList.toggle('modal');
  gameOverModal.classList.toggle('pause-modal');
  box_arr.forEach((element, idx) => {
    if (idx === 0) return;
    board.removeChild(element);
  });
  box.classList.toggle('deadblock');
  newGame();
});

//Listener callback function
const keydownListener = event => {
  if (event.keyCode === 32) {
    pauseModal.classList.toggle('pause-modal');
    pauseModal.classList.toggle('modal');
    paused = !paused;
    return;
  }
  // if (
  //   !paused &&
  //   length === 1 &&
  //   (event.keyCode === keys.LEFT ||
  //     event.keyCode === keys.RIGHT ||
  //     event.keyCode === keys.UP ||
  //     event.keyCode === keys.DOWN)
  // ) {
  //   pressed = {};
  //   pressed[event.keyCode] = true;
  //   return;
  // }
  if (
    !paused &&
    ((event.keyCode === keys.LEFT && !pressed[keys.RIGHT]) ||
      (event.keyCode === keys.RIGHT && !pressed[keys.LEFT]) ||
      (event.keyCode === keys.UP && !pressed[keys.DOWN]) ||
      (event.keyCode === keys.DOWN && !pressed[keys.UP]))
  ) {
    pressed = {};
    pressed[event.keyCode] = true;
  }
};

function init() {
  box.style.left = '20px';
  box.style.top = '20px';
  box_arr.push(box);
  randomBox();
}

function randomBox() {
  var left = Math.floor(Math.random() * (board.offsetWidth - box.offsetWidth));
  var top = Math.floor(Math.random() * (board.offsetHeight - box.offsetHeight));
  food.left = (Math.floor(left / 20) + 1) * 20;
  food.top = (Math.floor(top / 20) + 1) * 20;
  food.dom.style.left = food.left + 'px';
  food.dom.style.top = food.top + 'px';
  food.dom.style.display = 'block';
}

function move(left = 0, top = 0, right = 0, bottom = 0) {
  for (var i = box_arr.length - 1; i > 0; i--) {
    box_arr[i].style.left = box_arr[i - 1].style.left;
    box_arr[i].style.top = box_arr[i - 1].style.top;
  }
  box.style.left = left
    ? box.offsetLeft + left + 'px'
    : box.offsetLeft - right + 'px';
  box.style.top = top
    ? box.offsetTop + top + 'px'
    : box.offsetTop - bottom + 'px';
  );

  checkCollision();
  checkOutOfBound();
  checkFood();
}

function checkFood() {
  if (box.offsetLeft === food.left && box.offsetTop === food.top) {
    food.dom.style.display = 'none';
    createBox();
    randomBox();
  }
}

function checkCollision() {
  for (let i = box_arr.length - 1; i > 0; i--) {
    if (
      box.offsetLeft === box_arr[i].offsetLeft &&
      box.offsetTop === box_arr[i].offsetTop
    ) {
      box.className = 'box deadblock';
      pressed = {};
      gameOver();
    }
  }
}

function checkOutOfBound() {
  if (
    box.offsetLeft + 10 < 0 ||
    box.offsetTop < 0 ||
    box.offsetLeft > board.offsetWidth - box.offsetWidth ||
    box.offsetTop > board.offsetHeight - box.offsetHeight
  ) {
    box.className = 'box deadblock';
    pressed = {};
    gameOver();
  }
}

function gameOver() {
  gameOverModal.classList.toggle('modal');
  gameOverModal.classList.toggle('pause-modal');
  document.removeEventListener('keydown', keydownListener);
}

function createBox() {
  for (
    let newBox = document.createElement('div'), i = 0;
    i < 3;
    newBox = document.createElement('div'), i++
  ) {
    newBox.className = 'box new';
    board.appendChild(newBox);
    box_arr.push(newBox);
    length += 1;
  }
  lengthDOM.innerText = length;
}

function detect() {
  if (paused) {
    return;
  }
  if (pressed[keys.RIGHT]) {
    move(20);
  } else if (pressed[keys.DOWN]) {
    move(0, 20);
  } else if (pressed[keys.LEFT]) {
    move(0, 0, 20);
  } else if (pressed[keys.UP]) {
    move(0, 0, 0, 20);
  }
}

setInterval(detect, 80);
