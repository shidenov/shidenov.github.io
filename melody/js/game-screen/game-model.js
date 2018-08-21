var gameModel = (function () {
'use strict';

const TIMER = 300; // 5 min

const GAME = Object.freeze({
  lives: 2,
  currentTimer: TIMER,
  score: 0,
  currentLevel: 0,
  nextLevel: 1
});

const createTimer = (time) => {
  if (typeof time === `undefined`) {
    throw new Error(`Не указан аргумент`);
  }

  if (typeof time !== `number`) {
    throw new Error(`Не верный тип данных, аргументом функции может быть только число`);
  }

  return {
    time,
    tick() {
      if (this.time !== 0) {
        this.time = this.time - 1;
      }
      this._timeout(this.time);
    },

    _timeout(currentTime) {
      if (currentTime === 0) {
        this.state = `timeout`;
      }
    }
  };
};

class GameModel {
  constructor(data) {
    this.data = data;
    this.newGame();
  }

  get gameState() {
    return this._gameState;
  }

  set gameState(gameState) {
    this._gameState = Object.assign({}, gameState);
  }

  newGame() {
    this._gameState = Object.assign({}, GAME);
    this._gameState.answers = [];
    this._gameState.timer = createTimer(this._gameState.currentTimer); // 300
  }

  resultGame(status) {
    this._gameState.resultGame = status;
  }

  lossLive() {
    this._gameState.lives = this._gameState.lives - 1;
  }

  nextLevel() {
    this._gameState.nextLevel = this._gameState.nextLevel + 1;
  }

  changeCurrentLevel() {
    this._gameState.currentLevel = this._gameState.nextLevel; // назначаем новый текущий уровнь
  }

  addResultAnswer(result) {
    const currentAnswerTime = this._gameState.currentTimer - this._gameState.timer.time;
    this._gameState.answers.push({result, timer: currentAnswerTime}); // запишим ответ в массив ответов
    this._gameState.currentTimer = this._gameState.timer.time;
  }

  getLevelGameData() {
    const gameData = this.data[this._gameState.currentLevel];
    return gameData !== undefined ? gameData : false;
  }

  checkLives() {
    return this._gameState.lives < 0;
  }

  checkTimerStatus() {
    return this._gameState.timer.state === `timeout`;
  }

  tick() {
    this._gameState.timer.tick();
  }
}

return GameModel;

}());

//# sourceMappingURL=game-model.js.map
