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

const Point = {
  CORRECT_ANSWER: 1,
  CORRECT_FAST_ANSWER: 2,
  LIVE: 2
};

const calculateScore = (answers, lives) => {
  const trueAnswers = answers.filter((item) => item.result !== false);
  if (answers.length !== 10 || trueAnswers.length < 8) {
    return -1;
  }

  const fastAnswers = trueAnswers.filter((item) => item.timer <= 30);
  const pointAnswers = ((trueAnswers.length - fastAnswers.length) * Point.CORRECT_ANSWER) + (fastAnswers.length * Point.CORRECT_FAST_ANSWER);
  const pointLives = (GAME.lives > lives) ? (GAME.lives - lives) * Point.LIVE : 0;

  return pointAnswers - pointLives;
};

const calculateResult = (results, currentGame) => {
  if (currentGame.timer.time <= 0) {
    return `Время вышло! Вы не успели отгадать все мелодии`;
  }

  if (currentGame.lives < 0) {
    return `У вас закончились все попытки. Ничего, повезёт в следующий раз!`;
  }

  // добавим результат игры в массив
  results.push(currentGame.score);
  const sortResults = results.sort((a, b) => b - a);
  const place = sortResults.indexOf(currentGame.score) + 1; // место которое занял игрок
  const totalGamers = sortResults.length;
  const winPercent = ((totalGamers - place) / totalGamers * 100).toFixed(0);

  return `Вы заняли ${place} место из ${sortResults.length}. Это лучше чем у ${winPercent}% игроков`;
};

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

  gameResult() {
    this._gameState.score = calculateScore(this._gameState.answers, this._gameState.lives); // запишим текущий счёт в объект с игрой
    this._gameState.resultGame = calculateResult([4, 12, 8, 11, 5], this._gameState);
    this._gameState.fastAnswers = this._gameState.answers.filter((item) => item.timer <= 30);
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
