// game board refesh every second and paint too.
// control speed to currentTime
var lastPaintTime = 0;
let snakeSpeed = 2;
let inputDirection = { 
    x:0, y: 0 
};
let lastInputDirection = inputDirection;
let gameOver = false;

const expend_amount = 1; // increase snake by one
var score = 0;
const snakeBody = [
  { x: 8, y: 8 },
];
let food = getFoodRandomPosition(); // once you refesh page change the food positon.
const gameBoard = document.querySelector(".game-board");
const scoreBox = document.getElementById("score");



function paint(currentTime) {
  var TimeSeconds = (currentTime - lastPaintTime) / 1000; // convert milliseconds into seconds
  requestAnimationFrame(paint); // It will create a loop.
  if (TimeSeconds < 1 / snakeSpeed) {
    return;
  }
  lastPaintTime = currentTime;
  if(gameOver != true){
    update();
    draw();
  }
}
// call paint function. it predefine window animation function in javascript.
window.requestAnimationFrame(paint);

function draw() {
    drawFood();
    drawSnake();
}

function update() {
  gameBoard.innerHTML = "";
  snakeMove();
  // snake eat food.
  snakeEatFood();
}

// create snake (increase size too here!)
function drawSnake() {
  snakeBody.forEach((segment, index) => {
    var snakeElement = document.createElement("div");
    snakeElement.style.gridColumnStart = segment.x;
    snakeElement.style.gridRowStart = segment.y;
    // snakeElement.innerHTML = index;
    snakeElement.style.transform = "rotate(0deg)";
    if (index == 0) {
      snakeElement.classList.add("head");
      // for head control
      if ((inputDirection.x == 1)) {
        snakeElement.style.transform = "rotate(-90deg)";
      } else if ((inputDirection.x == -1)) {
        snakeElement.style.transform = "rotate(90deg)";
      } else if ((inputDirection.y == -1)) {
        snakeElement.style.transform = "rotate(180deg)";
      } else if ((inputDirection.y == 1)) {
        snakeElement.style.transform = "rotate(0deg)";
      }
    } else {
      snakeElement.classList.add("snake");
    }
    gameBoard.appendChild(snakeElement);
  });
}

// draw food
function drawFood(){
    var foodElement = document.createElement("div");
    foodElement.style.gridColumnStart = food.x;
    foodElement.style.gridRowStart = food.y;
    foodElement.classList.add("food");
    gameBoard.appendChild(foodElement);     

}

// snake movement (change direction)
function snakeMove() {
  inputDirection = getInputDirection();
  for (var i = snakeBody.length - 2; i >= 0; i--) {
    snakeBody[i + 1] = { ...snakeBody[i] };
  }
  snakeBody[0].x += inputDirection.x;
  snakeBody[0].y += inputDirection.y;
  checkGameOver();
}

// snake movement (change direction) event
function getInputDirection() {
  window.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "ArrowUp":
        if (lastInputDirection.y == 1) break;
        inputDirection = { x: 0, y: -1 }
        break;
      case "ArrowDown":
        if (lastInputDirection.y == -1) break;
        inputDirection = { x: 0, y: 1 }
        break;
      case "ArrowLeft":
        if(lastInputDirection.x == 1) break;
        inputDirection = { x: -1, y: 0 }
        break;
      case "ArrowRight":
        if(lastInputDirection.x == -1) break;
        inputDirection = { x: 1, y: 0 };
        break;
      default:
        inputDirection = { x: 0, y: 0 };
    }
  });
  lastInputDirection = inputDirection;
  return inputDirection;
}

function snakeEatFood(){
    // check food position and snake head position if same then food eat.
    if(isEat()){
        score += 10;
        scoreBox.innerHTML = score;
        food = getFoodRandomPosition();
        snakeSpeed++;  // increase speed after eating food.
        expendSnake();
    }
    
}

function isEat(){
    return snakeBody[0].x === food.x && snakeBody[0].y === food.y;
}

function getFoodRandomPosition(){
    let a,b,myCondition = true;
    while(myCondition){
        a = Math.ceil(Math.random() *16);
        b = Math.ceil(Math.random() *16);
        myCondition = snakeBody.some(segment=>{
            return segment.x === a && segment.y === b;
        })
    }
    return {// create position base on grid position 16.
        x : a , 
        y: b
    }
}

function expendSnake(){
    for(var i=0; i < expend_amount; i++){
        snakeBody.push(snakeBody[snakeBody.length-1]); // push the last position of the snake
    }
}

function checkGameOver(){
    // In both function any one has true then game over.
    if(snakeOutOfGrid() || snakeBitItself()){
        gameOver = true;
        alert("Game Over: You Lost");
        location.reload();
    }
}

function snakeOutOfGrid(){
    return snakeBody[0].x < 0 || snakeBody[0].x > 16 || snakeBody[0].y < 0 || snakeBody[0].y > 16;
}

function snakeBitItself(){
    for(var i=1; i<snakeBody.length; i++){
        if(snakeBody[0].x === snakeBody[i].x && snakeBody[0].y === snakeBody[i].y){ 
            return true;
        }
    }
}