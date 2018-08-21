var gameData = (function (exports) {
'use strict';

const TIMER = 300; // 5 min

const GAME = Object.freeze({
  lives: 2,
  currentTimer: TIMER,
  score: 0,
  currentLevel: 0,
  nextLevel: 1
});

const QuestionType = {
  GENRE: `genre`,
  ARTIST: `artist`
};

const ResultGame = {
  WIN: `win`,
  NOLIVES: `noLives`,
  TIMEOUT: `timeout`
};

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

const convertText = (number, word, one, many, multi) => {
  const checkNumber = (num) => {
    return (num > 21) ? +(num.toString()[1]) : num;
  };

  number = checkNumber(number);
  if (number === 1) {
    return word + one;
  }

  if (number > 1 && number < 5) {
    return word + many;
  }
  return (number > 1 && number < 5) ? word + many : word + multi;
};

const showTimeResult = (time) => {
  const {min, sec} = time;

  const minutesText = convertText(+min, `минут`, `у`, `ы`, ``);
  const secondsText = convertText(+sec, `секунд`, `у`, `ы`, ``);
  const seconds = (sec[0] === `0`) ? sec[1] : sec;
  return `${min} ${minutesText} и ${seconds} ${secondsText}`;
};

const timerConverToMinAndSec = (timer) => {
  const minutes = Math.floor(timer / 60);
  const seconds = ((timer % 60) / 1).toFixed(0);
  const convertSeconds = (seconds < 10) ? `0${seconds}` : seconds;

  return {
    min: minutes.toString(),
    sec: convertSeconds
  };
};

const getRadius = (relation, radius) => {
  const stroke = +(2 * Math.PI * radius).toFixed();
  const offset = +((1 - relation) * stroke).toFixed();
  return {stroke, offset};
};

exports.TIMER = TIMER;
exports.GAME = GAME;
exports.QuestionType = QuestionType;
exports.ResultGame = ResultGame;
exports.calculateScore = calculateScore;
exports.calculateResult = calculateResult;
exports.createTimer = createTimer;
exports.convertText = convertText;
exports.showTimeResult = showTimeResult;
exports.timerConverToMinAndSec = timerConverToMinAndSec;
exports.getRadius = getRadius;

return exports;

}({}));

//# sourceMappingURL=game-data.js.map
