(function (chai) {
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

describe(`Функция подсчёта набранных баллов игрока`, () => {
  it(`Проверка на количество ответов меньше десяти`, () => {
    chai.assert.equal(calculateScore([
      {result: false, timer: 60},
      {result: false, timer: 60},
      {result: false, timer: 60}
    ], -1), -1);

    chai.assert.equal(calculateScore([
      {result: true, timer: 60},
      {result: true, timer: 60},
      {result: false, timer: 60},
      {result: false, timer: 60},
      {result: false, timer: 60}
    ], -1), -1);

    chai.assert.equal(calculateScore([
      {result: true, timer: 30},
      {result: false, timer: 31},
      {result: true, timer: 30},
      {result: true, timer: 60},
      {result: true, timer: 60},
      {result: false, timer: 28},
      {result: true, timer: 60},
      {result: true, timer: 60},
      {result: true, timer: 60},
      {result: false, timer: 20}
    ], -1), -1);
  });

  it(`Проверка результатов - ответы даны за время больше 30 секунд`, () => {
    chai.assert.equal(calculateScore([
      {result: true, timer: 60},
      {result: true, timer: 60},
      {result: true, timer: 60},
      {result: true, timer: 60},
      {result: true, timer: 60},
      {result: true, timer: 60},
      {result: true, timer: 60},
      {result: true, timer: 60},
      {result: true, timer: 60},
      {result: true, timer: 60}
    ], 2), 10);

    chai.assert.equal(calculateScore([
      {result: true, timer: 60},
      {result: true, timer: 60},
      {result: true, timer: 60},
      {result: true, timer: 60},
      {result: true, timer: 60},
      {result: true, timer: 60},
      {result: false, timer: 60},
      {result: true, timer: 60},
      {esult: true, timer: 60},
      {result: true, timer: 60}
    ], 1), 7);

    chai.assert.equal(calculateScore([
      {result: false, timer: 60},
      {result: true, timer: 60},
      {result: true, timer: 60},
      {result: true, timer: 60},
      {result: false, timer: 60},
      {result: true, timer: 60},
      {result: true, timer: 60},
      {result: true, timer: 60},
      {result: true, timer: 60},
      {result: true, timer: 60}
    ], 0), 4);
  });

  it(`Проверка результатов - разные варианты ответов`, () => {
    chai.assert.equal(calculateScore([
      {result: true, timer: 30},
      {result: true, timer: 31},
      {result: true, timer: 30},
      {result: true, timer: 60},
      {result: true, timer: 60},
      {result: true, timer: 28},
      {result: true, timer: 60},
      {result: true, timer: 60},
      {result: true, timer: 60},
      {result: true, timer: 20}
    ], 2), 14);

    chai.assert.equal(calculateScore([
      {result: true, timer: 24},
      {result: true, timer: 60},
      {result: true, timer: 30},
      {result: true, timer: 62},
      {result: false, timer: 58},
      {result: true, timer: 30},
      {result: true, timer: 64},
      {result: true, timer: 40},
      {result: true, timer: 60},
      {result: true, timer: 15}
    ], 1), 11);

    chai.assert.equal(calculateScore([
      {result: true, timer: 27},
      {result: true, timer: 65},
      {result: true, timer: 30},
      {result: true, timer: 60},
      {result: false, timer: 60},
      {result: true, timer: 30},
      {result: true, timer: 40},
      {result: true, timer: 70},
      {result: true, timer: 55},
      {result: false, timer: 10}
    ], 0), 7);
  });
});

describe(`Функция подсчёта результатов игры`, () => {
  const timeout = `Время вышло! Вы не успели отгадать все мелодии`;
  const attemptsEnd = `У вас закончились все попытки. Ничего, повезёт в следующий раз!`;

  it(`Подсчёт результатов: Проигрышь - закончилось время`, () => {
    chai.assert.equal(calculateResult([4, 5, 8, 11], {score: 10, lives: 2, timer: {time: 0}}), timeout);
    chai.assert.equal(calculateResult([4, 12, 8, 11, 5], {score: 5, lives: 0, timer: {time: 0}}), timeout);
    chai.assert.equal(calculateResult([10, 5], {score: 8, lives: 1, timer: {time: 0}}), timeout);
  });

  it(`Подсчёт результатов: Проигрышь - закончились все попытки`, () => {
    chai.assert.equal(calculateResult([4, 5, 8, 11], {score: 10, lives: -1, timer: {time: 60}}), attemptsEnd);
    chai.assert.equal(calculateResult([4, 12, 8, 11, 5], {score: 5, lives: -1, timer: {time: 100}}), attemptsEnd);
    chai.assert.equal(calculateResult([10, 5], {score: 8, lives: -1, timer: 120}), attemptsEnd);
  });

  it(`Подсчёт результатов: Проигрышь - закончились все попытки и время`, () => {
    chai.assert.equal(calculateResult([4, 12, 5], {score: 10, lives: -1, timer: {time: 0}}), timeout);
    chai.assert.equal(calculateResult([4, 2, 8, 11], {score: 8, lives: -1, timer: {time: 0}}), timeout);
  });

  it(`Подсчёт результатов: Выигрыш`, () => {
    chai.assert.equal(calculateResult([4, 5, 8, 11], {score: 10, lives: 2, timer: {time: 60}}
    ), `Вы заняли 2 место из 5. Это лучше чем у 60% игроков`);
    chai.assert.equal(calculateResult([4, 12, 8, 11, 5], {score: 5, lives: 0, timer: {time: 360}}
    ), `Вы заняли 4 место из 6. Это лучше чем у 33% игроков`);
    chai.assert.equal(calculateResult([10, 5], {score: 8, lives: 1, timer: {time: 120}}
    ), `Вы заняли 2 место из 3. Это лучше чем у 33% игроков`);
  });
});

describe(`Таймер`, () => {
  it(`Таймер: создание`, () => {
    chai.assert.isObject(createTimer(300));
    chai.assert.throws(() => createTimer(`300`), Error, `Не верный тип данных, аргументом функции может быть только число`);
    chai.assert.throws(() => createTimer({}), Error, `Не верный тип данных, аргументом функции может быть только число`);
    chai.assert.throws(() => createTimer([]), Error, `Не верный тип данных, аргументом функции может быть только число`);
    chai.assert.throws(() => createTimer(), Error, `Не указан аргумент`);
  });

  it(`Таймер: проверка на значения`, () => {
    const timer = createTimer(100);
    chai.assert.equal(timer.time, 100);
  });

  it(`Таймер: метод tick`, () => {
    const timer = createTimer(3);
    timer.tick();
    chai.assert.equal(timer.time, 2);
    timer.tick();
    chai.assert.equal(timer.time, 1);
    timer.tick();
    chai.assert.equal(timer.time, 0);
    chai.assert.equal(timer.state, `timeout`);
  });

  it(`Таймер: проверка tick при timeout`, () => {
    const timer = createTimer(2);
    timer.tick();
    timer.tick();
    timer.tick();
    timer.tick();

    chai.assert.equal(timer.time, 0);
    chai.assert.equal(timer.state, `timeout`);
  });
});

describe(`Жизни, попытки`, () => {
  it(`Жизни, попытки: Проверка формы существительного ошибки`, () => {
    chai.assert.equal(convertText(0, `ошиб`, `ку`, `ки`, `ок`), `ошибок`);
    chai.assert.equal(convertText(1, `ошиб`, `ку`, `ки`, `ок`), `ошибку`);
    chai.assert.equal(convertText(2, `ошиб`, `ку`, `ки`, `ок`), `ошибки`);
    chai.assert.equal(convertText(3, `ошиб`, `ку`, `ки`, `ок`), `ошибки`);
    chai.assert.equal(convertText(4, `ошиб`, `ку`, `ки`, `ок`), `ошибки`);
    chai.assert.equal(convertText(5, `ошиб`, `ку`, `ки`, `ок`), `ошибок`);
    chai.assert.equal(convertText(6, `ошиб`, `ку`, `ки`, `ок`), `ошибок`);
  });
});

describe(`Таймер - конвертация`, () => {
  it(`Таймер: Проверка функции конвертации`, () => {
    chai.assert.deepEqual(timerConverToMinAndSec(300), {min: `5`, sec: `00`});
    chai.assert.deepEqual(timerConverToMinAndSec(22), {min: `0`, sec: `22`});
    chai.assert.deepEqual(timerConverToMinAndSec(150), {min: `2`, sec: `30`});
    chai.assert.deepEqual(timerConverToMinAndSec(48), {min: `0`, sec: `48`});
    chai.assert.deepEqual(timerConverToMinAndSec(188), {min: `3`, sec: `08`});
  });

  it(`Таймер: Проверка формы склонения минут и секунд`, () => {
    const time1 = timerConverToMinAndSec(300);
    chai.assert.equal(showTimeResult(time1), `5 минут и 0 секунд`);

    const time2 = timerConverToMinAndSec(22);
    chai.assert.equal(showTimeResult(time2), `0 минут и 22 секунды`);

    const time3 = timerConverToMinAndSec(150);
    chai.assert.equal(showTimeResult(time3), `2 минуты и 30 секунд`);

    const time4 = timerConverToMinAndSec(48);
    chai.assert.equal(showTimeResult(time4), `0 минут и 48 секунд`);

    const time5 = timerConverToMinAndSec(188);
    chai.assert.equal(showTimeResult(time5), `3 минуты и 8 секунд`);

    const time6 = timerConverToMinAndSec(61);
    chai.assert.equal(showTimeResult(time6), `1 минуту и 1 секунду`);

    const time7 = timerConverToMinAndSec(71);
    chai.assert.equal(showTimeResult(time7), `1 минуту и 11 секунд`);

    const time8 = timerConverToMinAndSec(151);
    chai.assert.equal(showTimeResult(time8), `2 минуты и 31 секунду`);
  });
});

describe(`Function should correctly calculate circle length`, () => {
  describe(`Normal cases`, () => {
    it(`Should return full length and 0 in initial state`, () => {
      // 2 * 3.14 * 100 = 6.28 * 100 = 628
      chai.assert.equal(getRadius(1, 100).stroke, 628);
      chai.assert.equal(getRadius(1, 100).offset, 0);
    });

    it(`Should return 0 and full length in the final state`, () => {
      // 2 * 3.14 * 100 = 6.28 * 100 = 628
      chai.assert.equal(getRadius(0, 100).stroke, 628);
      chai.assert.equal(getRadius(0, 100).offset, 628);
    });

    it(`Offset and length should be equal on a half`, () => {
      // 2 * 3.14 * 100 / 2 = 3.14 * 100 = 314
      chai.assert.equal(getRadius(0.5, 100).stroke, 628);
      chai.assert.equal(getRadius(0.5, 100).offset, 314);
    });
  });
});

}(chai));

//# sourceMappingURL=game-data.test.js.map
