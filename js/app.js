"use strict";
const gameBoard = document.getElementById("game-box"),
   gameBlocks = Array.from(document.getElementsByClassName("box")),
   playerModeRadioBtns = Array.from(
      document.getElementsByClassName("player-radio-btn")
   ),
   scoreBoxes = Array.from(document.querySelectorAll(".score-box")),
   playAgainBtn = document.getElementById("play-again-btn"),
   hvsh = "hvsh",
   hvsc = "hvsc";

let gameBoardArray = new Array(9),
   p2Move = false,
   p2Start = false,
   computerStart = false,
   initEventIsSet = false,
   currentPlayMode = null,
   previousPlayMode = null,
   currentAssginedEL = null;
init();

function init() {
   for (let i = 0; i < gameBoardArray.length; i++) gameBoardArray[i] = null;
   previousPlayMode = currentPlayMode;
   // get game mode
   playerModeRadioBtns.forEach(function (btn) {
      btn.addEventListener("click", init);
      if (btn.checked) currentPlayMode = btn.value;
   });
   if (currentAssginedEL !== null) removeEL(currentAssginedEL);
   if (currentPlayMode !== previousPlayMode) resetScore();
   // set game mode
   if (currentPlayMode === hvsh) {
      setGameBlocksEL(humanVsHuman);
      scoreBoxes[0].firstElementChild.textContent = "Player 1 :";
      scoreBoxes[1].firstElementChild.textContent = "Player 2 :";
      computerStart = false;
      p2Move = p2Start;
   } else if (currentPlayMode === hvsc) {
      setGameBlocksEL(humanVsComputer);
      scoreBoxes[0].firstElementChild.textContent = "You : ";
      scoreBoxes[1].firstElementChild.textContent = "Computer :";
      p2Start = false;
   }
   // hide play again button
   playAgainBtn.style.visibility = "hidden";
   // add event listener to play again button
   playAgainBtn.addEventListener("click", init);
   // game start by computer check
   if (computerStart && currentPlayMode === hvsc) computerPlay();
}

// set Event Listener to Blocks
function setGameBlocksEL(el) {
   gameBlocks.forEach(function (box) {
      box.addEventListener("click", el);
      box.firstElementChild.className = "";
      box.firstElementChild.style.color = "#fffafa";
      box.firstElementChild.classList.remove("animate");
      box.style.pointerEvents = "auto";
   });
   currentAssginedEL = el;
}

function humanVsHuman() {
   if (p2Move) {
      this.firstElementChild.style.color = "#ff6933";
      this.firstElementChild.className = "fas fa-times";
      addValueInBoard(this, "p2");
   } else {
      this.firstElementChild.style.color = "#3359ff";
      this.firstElementChild.className = "far fa-circle";
      addValueInBoard(this, "p1");
   }
   this.style.pointerEvents = "none";
   const currentStatusArr = gameStatus(gameBoardArray);
   // gameOver check
   if (currentStatusArr[0] === true) showResult(currentStatusArr.slice(1));
   // change player turn
   p2Move = p2Move ? false : true;
}

function humanVsComputer() {
   this.firstElementChild.style.color = "#3359ff";
   this.firstElementChild.className = "far fa-circle";
   addValueInBoard(this, "h");
   // disable click event on current block
   this.style.pointerEvents = "none";
   const currentStatusArr = gameStatus(gameBoardArray);
   // gameOver check
   if (currentStatusArr[0] === true) showResult(currentStatusArr.slice(1));
   else {
      computerPlay();
      const currentStatusArr = gameStatus(gameBoardArray);
      if (currentStatusArr[0] === true) showResult(currentStatusArr.slice(1));
   }
}

function computerPlay() {
   const cMove = computerMove(gameBoardArray);
   gameBlocks[cMove].firstElementChild.style.color = "#ff6933";
   gameBlocks[cMove].firstElementChild.className = "fas fa-times";
   addValueInBoard(gameBlocks[cMove], "c");
   gameBlocks[cMove].style.pointerEvents = "none";
}

function addValueInBoard(box, value) {
   const id = box.id;
   if (id === "box0") gameBoardArray[0] = value;
   else if (id === "box1") gameBoardArray[1] = value;
   else if (id === "box2") gameBoardArray[2] = value;
   else if (id === "box3") gameBoardArray[3] = value;
   else if (id === "box4") gameBoardArray[4] = value;
   else if (id === "box5") gameBoardArray[5] = value;
   else if (id === "box6") gameBoardArray[6] = value;
   else if (id === "box7") gameBoardArray[7] = value;
   else if (id === "box8") gameBoardArray[8] = value;
}

function gameStatus(gameState) {
   // rows check
   if (
      gameState[0] === gameState[1] &&
      gameState[0] === gameState[2] &&
      gameState[0] !== null
   )
      return [true, gameState[0], 0, 1, 2];
   if (
      gameState[3] === gameState[4] &&
      gameState[3] === gameState[5] &&
      gameState[3] !== null
   )
      return [true, gameState[3], 3, 4, 5];
   if (
      gameState[6] === gameState[7] &&
      gameState[6] === gameState[8] &&
      gameState[6] !== null
   )
      return [true, gameState[6], 6, 7, 8];
   // columns check
   if (
      gameState[0] === gameState[3] &&
      gameState[0] === gameState[6] &&
      gameState[0] !== null
   )
      return [true, gameState[0], 0, 3, 6];
   if (
      gameState[1] === gameState[4] &&
      gameState[1] === gameState[7] &&
      gameState[1] !== null
   )
      return [true, gameState[1], 1, 4, 7];
   if (
      gameState[2] === gameState[5] &&
      gameState[2] === gameState[8] &&
      gameState[2] !== null
   )
      return [true, gameState[2], 2, 5, 8];
   // diagonals check
   if (
      gameState[0] === gameState[4] &&
      gameState[0] === gameState[8] &&
      gameState[0] !== null
   )
      return [true, gameState[0], 0, 4, 8];
   if (
      gameState[2] === gameState[4] &&
      gameState[2] === gameState[6] &&
      gameState[2] !== null
   )
      return [true, gameState[2], 2, 4, 6];
   // tie condition check
   for (let i = 0; i < gameState.length; i++)
      if (gameState[i] === null) return [false, null];
   return [true, "t"];
}

function showResult(resultArr) {
   const winnerName = resultArr[0];
   const tieGame = winnerName === "t" ? true : false;
   const winningBlocksArr = resultArr.slice(1);
   // update score
   updateScore(winnerName);
   // Color Icons
   if (tieGame) {
      gameBlocks.forEach(function (block) {
         block.firstElementChild.classList.add("animate");
      });
   } else {
      winningBlocksArr.forEach(function (i) {
         gameBlocks[i].firstElementChild.classList.add("animate");
      });
   }
   // Change Turns
   if (currentPlayMode === hvsh) p2Start = p2Start ? false : true;
   else computerStart = computerStart ? false : true;
   // Show Play Again Button
   playAgainBtn.style.visibility = "visible";
   removeEL();
}

function updateScore(winner) {
   const scoreBox1 = scoreBoxes[0].firstElementChild.nextSibling;
   const scoreBox2 = scoreBoxes[1].firstElementChild.nextSibling;

   if (winner === "h" || winner === "p1") {
      let score = parseInt(scoreBox1.textContent) + 1;
      if (score < 10) scoreBox1.textContent = "0" + score;
      else scoreBox1.textContent = score + 1;
   } else if (winner === "c" || winner === "p2") {
      let score = parseInt(scoreBox2.textContent) + 1;
      if (score < 10) scoreBox2.textContent = "0" + score;
      else scoreBox2.textContent = score;
   }
}

function resetScore() {
   const scoreBox1 = scoreBoxes[0].firstElementChild.nextSibling.textContent = "00";
   const scoreBox2 = scoreBoxes[1].firstElementChild.nextSibling.textContent = "00";
}

// Remove Event Listener
function removeEL() {

   gameBlocks.forEach(function (box) {
      box.removeEventListener("click", currentAssginedEL);
      box.style.pointerEvents = "none";
   });
}

// MiniMax
function computerMove(gameState) {
   const currentMoveArr = maxValue(
      gameState,
      Number.NEGATIVE_INFINITY,
      Number.POSITIVE_INFINITY,
      1
   );
   return currentMoveArr[currentMoveArr.length - 1];
}

function maxValue(gameState, alpha, beta, iteration) {
   const currentStatusArr = gameStatus(gameState);
   if (currentStatusArr[0] === true) return utility(currentStatusArr[1]);
   let bestMovePos;
   let currentVal = Number.NEGATIVE_INFINITY;
   const nextStates = nextPossibleStates(gameState, "c", iteration);
   for (let i = 0; i < nextStates.length; i++) {
      const newVal = minValue(nextStates[i], alpha, beta);
      if (newVal > currentVal) {
         currentVal = newVal;
         bestMovePos = nextStates[i];
      }
      if (newVal >= beta) break;
      if (newVal > alpha) alpha = newVal;
   }
   if (iteration == 1) return [currentVal, bestMovePos[bestMovePos.length - 1]];
   else return currentVal;
}

function minValue(gameState, alpha, beta) {
   const currentStatusArr = gameStatus(gameState);
   if (currentStatusArr[0] === true) return utility(currentStatusArr[1]);
   let currentVal = Number.POSITIVE_INFINITY;
   const nextStates = nextPossibleStates(gameState, "h", null);
   nextStates.forEach(function (current) {
      const newVal = maxValue(current, alpha, beta, null);
      if (newVal < currentVal) currentVal = newVal;
      if (newVal <= alpha) return currentVal;
      if (newVal < beta) beta = newVal;
   });
   return currentVal;
}

function utility(resultArr) {
   if (resultArr === "c") return 2;
   else if (resultArr === "h") return 0;
   else return 1;
}

function nextPossibleStates(gameState, movePlayedBy, iteration) {
   const possibleStates = [];
   const availablePositions = [];
   for (let i = 0; i < gameState.length; i++) {
      if (gameState[i] === null) availablePositions.push(i);
   }
   availablePositions.forEach(function (pos) {
      let tempArr = [...gameState];
      tempArr[pos] = movePlayedBy;
      if (iteration === 1) tempArr.push(pos);
      possibleStates.push(tempArr);
   });
   return possibleStates;
}
