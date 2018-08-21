var gameWelcome = (function () {
'use strict';

const render = (html) => {
  const template = document.createElement(`template`);
  template.innerHTML = html;
  if (template.content.children.length > 1) {
    return template.content;
  }
  return template.content.firstElementChild;
};

class AbstractView {
  constructor() {
    if (new.target === AbstractView) {
      throw new Error(`Нельзя просто так взять и cоздать экземпляр класса :)`);
    }
  }

  get template() {
    throw new Error(`Переопредели геттер template!`);
  }

  get element() {
    if (this._element) {
      return this._element;
    }

    this._element = this.render();
    this.bind(this._element);
    return this._element;
  }

  render() {
    return render(this.template);
  }

  bind() {
    // nothing to do
  }
}

class WelcomeView extends AbstractView {
  constructor() {
    super();
  }

  get template() {
    return `
      <section class="main main--welcome">
        <section class="logo" title="Угадай мелодию">
          <h1>Угадай мелодию</h1>
        </section>
        <button class="main-play">Начать игру</button>
        <h2 class="title main-title">Правила игры</h2>
        <p class="text main-text">
          Правила просты&nbsp;— за&nbsp;5 минут ответить на все вопросы.<br>
            Ошибиться можно 3 раза.<br>
              Удачи!
          </p>
      </section>
    `;
  }

  onClick() { }

  bind() {
    this.buttonStartElement = this.element.querySelector(`.main-play`);
    this.buttonStartElement.classList.add(`disable`);
  }
}

const renderScreen = (screen) => {
  const mainAppWrapElement = document.querySelector(`.main`);
  mainAppWrapElement.innerHTML = ``;
  mainAppWrapElement.appendChild(screen);
};

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

/* header template */
class HeaderView extends AbstractView {
  constructor(state) {
    super();
    this.state = state;
  }

  get template() {
    const svg = this.getSvgAttrOptions();
    const timer = this.convertTime();

    return `
      <a class="play-again play-again__wrap" href="#">
          <img class="play-again__img" src="/img/melody-logo-ginger.png" alt="logo" width="177" height="76">
      </a>
      <svg xmlns="http://www.w3.org/2000/svg" class="timer" viewBox="0 0 780 780">
        <circle cx="390" cy="390" r="370" class="timer-line" stroke-dasharray="${svg.stroke}" stroke-dashoffset="${svg.offset}" style="filter: url(.#blur); transform: rotate(-90deg) scaleY(-1); transform-origin: center"></circle>
        <div class="timer-value" xmlns="http://www.w3.org/1999/xhtml">
          <span class="timer-value-mins">${timer.min}</span><!--
        --><span class="timer-value-dots">:</span><!--
        --><span class="timer-value-secs">${timer.sec}</span>
        </div>
      </svg>
      <div class="main-mistakes">
        ${new Array((this.state.lives - 2) * -1).fill(`<img class="main-mistake" src="img/wrong-answer.png" width="35" height="49">`).join(``)}
      </div>
    `;
  }

  onClick() { }

  bind() {
    this.minElement = this.element.querySelector(`.timer-value-mins`);
    this.secElement = this.element.querySelector(`.timer-value-secs`);
    this.circleElement = this.element.querySelector(`circle`);
    this.timerElement = this.element.querySelector(`.timer-value`);
    const playAgainButton = this.element.querySelector(`.play-again`);
    playAgainButton.addEventListener(`click`, this.onClick);
  }

  // публичный метод, используется в game-screen
  convertTime() {
    return timerConverToMinAndSec(this.state.timer.time);
  }

  // публичный метод, используется в game-screen
  getSvgAttrOptions() {
    const timerRelation = this.state.timer.time / TIMER;
    return getRadius(timerRelation, 370);
  }
}

const audioDataSet = [];
const audioLoad = (src) => {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audioDataSet.push(audio);

    audio.addEventListener(`canplaythrough`, () => {
      resolve(audio);
    }, false);

    audio.addEventListener(`error`, () => {
      reject(`Не удалось загрузить аудио трек: ${src}`);
    });

    audio.src = src;
  });
};

class Music {
  static loadAudioTracks(data) {
    const audioUrls = new Set();
    for (let item of data) {
      for (let answer of item.answers) {
        audioUrls.add(answer.src);
      }
    }

    const audioTracks = [];
    audioUrls.forEach((src) => audioTracks.push(audioLoad(src)));
    return audioTracks;
  }

  static stopPlayAllTracks() {
    for (let track of audioDataSet) {
      track.pause();
      track.currentTime = 0;
    }
  }

  static getAudioTrack(src) {
    let audio;
    Music.stopPlayAllTracks();
    for (let track of audioDataSet) {
      if (track.src === src) {
        audio = track;
      }
    }
    return audio;
  }
}

/* Импорт Модулей */

/* start game */
const development = true;
Application.start();

class ArtistView extends AbstractView {
  constructor(game) {
    super();
    this.game = game;
  }

  get template() {
    const answers = [];
    this.game.answers.forEach((answer, i) => {
      const status = (development) ? `<span style="color: black">${answer.result()}</span>` : ``;
      const item = `
        <div class="main-answer-wrapper">
          <input class="main-answer-r" type="radio" id="answer-${i}" name="answer" value="val-${i}"/>
          <label class="main-answer" for="answer-${i}">
            <img class="main-answer-preview" src="${answer.image}" alt="${answer.artist}" width="134" height="134">
            ${answer.artist}
            ${status}
          </label>
        </div>
      `;

      item.trim();
      answers.push(item);
    });

    return `
    <section class="main main--level main--level-${this.game.gameType}">
      <div class="main-wrap">
        <h2 class="title main-title">${this.game.title}</h2>
        <div class="player-wrapper">
          <div class="player">
            <button class="player-control player-control--pause"></button>
            <div class="player-track">
              <span class="player-status"></span>
            </div>
            </div>
          </div>
        <form class="main-list">
        ${answers.join(``)}
        </form>
      </div>
    </section>
  `;
  }

  onResult() { }

  bind() {
    let track;
    for (let answer of this.game.answers) {
      if (answer.result()) {
        track = Music.getAudioTrack(answer.src);
        track.play();
      }
    }

    const buttonControlElement = this.element.querySelector(`.player-control`);
    buttonControlElement.addEventListener(`click`, (event) => {
      const e = event || window.event;
      const target = e.target || e.srcElement;

      track.pause();

      if ([...target.classList].indexOf(`player-control--pause`) !== -1) {
        target.classList.remove(`player-control--pause`);
        target.classList.add(`player-control--play`);
      } else {
        target.classList.remove(`player-control--play`);
        target.classList.add(`player-control--pause`);
        track.play();
      }
    });

    const inputElements = this.element.querySelectorAll(`input`);
    for (let input of inputElements) {
      input.addEventListener(`click`, (event) => {
        const e = event || window.event;
        const target = e.target || e.srcElement;

        const currentAnswerIndex = target.value.slice(target.value.length - 1, target.value.length);
        const result = this.game.answers[currentAnswerIndex].result();

        this.onResult(result);
      });
    }
  }
}

class GenreView extends AbstractView {
  constructor(game) {
    super();
    this.game = game;
  }

  get template() {
    const answersTemplate = [];
    this.game.answers.forEach((answer, i) => {
      const status = (development) ? `<span style="color: black">${answer.result()}</span>` : ``;
      const item = `
      <div class="genre-answer">
        <div class="player-wrapper">
          <div class="player">
            <button class="player-control player-control--play"></button>
            <div class="player-track">
              <span class="player-status"></span>
            </div>
          </div>
        </div>
        <input type="checkbox" name="answer" value="answer-${i}" id="a-${i}">
        <label class="genre-answer-check" for="a-${i}">${status}</label>
      </div>
      `;

      item.trim();
      answersTemplate.push(item);
    });

    return `
      <section class="main main--level main--level-${this.game.gameType}">
        <div class="main-wrap">
          <h2 class="title">${this.game.title}</h2>
          <form class="genre">
            ${answersTemplate.join(``)}
            <button class="genre-answer-send" type="submit">Ответить</button>
          </form>
        </div>
      </section>
    `;
  }

  onResult() { }

  bind() {
    const playerElements = this.element.querySelectorAll(`.player`);
    const audioTracks = [];

    this.game.answers.forEach((answer, i) => {
      const track = Music.getAudioTrack(answer.src);
      audioTracks.push(track);
      const buttonControlElement = playerElements[i].querySelector(`.player-control`);

      if (i === 0) {
        buttonControlElement.classList.remove(`player-control--play`);
        buttonControlElement.classList.add(`player-control--pause`);
      }

      buttonControlElement.addEventListener(`click`, (event) => {
        const e = event || window.event;
        const target = e.target || e.srcElement;

        // отключать все треки и включать выбранный
        audioTracks.forEach((audio) => audio.pause());
        // добавить всем кнопкам класс play
        for (let player of playerElements) {
          const control = player.querySelector(`.player-control`);
          if (target !== control) {
            control.classList.remove(`player-control--pause`);
            control.classList.add(`player-control--play`);
          }
        }

        if ([...target.classList].indexOf(`player-control--pause`) !== -1) {
          target.classList.remove(`player-control--pause`);
          target.classList.add(`player-control--play`);
          track.pause();
        } else {
          target.classList.remove(`player-control--play`);
          target.classList.add(`player-control--pause`);
          track.play();
        }

        e.preventDefault();
      });
    });

    audioTracks[0].play();

    const submitButtonElement = this.element.querySelector(`.genre-answer-send`);
    submitButtonElement.disabled = true;

    const resultAnswers = {};
    const answerItems = [...this.element.querySelectorAll(`.genre-answer-check`)];

    for (let item of answerItems) {
      item.addEventListener(`click`, (event) => {
        const e = event || window.event;
        const target = e.target || e.srcElement;

        const currentAnswerIndex = target.control.value.slice(target.control.value.length - 1, target.control.value.length);
        const result = this.game.answers[currentAnswerIndex].result();

        if (!target.control.checked) {
          resultAnswers[currentAnswerIndex] = result;
        } else {
          delete resultAnswers[currentAnswerIndex];
        }

        submitButtonElement.disabled = Object.keys(resultAnswers).length === 0;
      });
    }

    submitButtonElement.addEventListener(`click`, (e) => {
      e.preventDefault();
      for (let key in resultAnswers) {
        if (!resultAnswers[key]) {
          return this.onResult(false);
        }
      }

      if (Object.keys(resultAnswers).length !== this.game.correct.length) {
        return this.onResult(false);
      }

      return this.onResult(true);
    });
  }
}

class ModalConfirmView extends AbstractView {
  constructor() {
    super();
  }

  get template() {
    return `
      <section class="modal-confirm modal-confirm__wrap">
      <form class="modal-confirm__inner">
        <button class="modal-confirm__close" type="button">Закрыть</button>
        <h2 class="modal-confirm__title">Подтверждение</h2>
        <p class="modal-confirm__text">Вы уверены что хотите начать игру заново?</p>
        <div class="modal-confirm__btn-wrap">
          <button class="modal-confirm__btn">Ок</button>
          <button class="modal-confirm__btn">Отмена</button>
        </div>
      </form>
    </section>
  `;
  }

  onClickOk() { }

  onClickCancel() { }

  bind() {
    const buttonOk = this.element.querySelector(`.modal-confirm__btn-wrap`).children[0];
    const buttonCancel = this.element.querySelector(`.modal-confirm__btn-wrap`).children[1];
    const buttonClose = this.element.querySelector(`.modal-confirm__close`);

    buttonOk.addEventListener(`click`, this.onClickOk);
    buttonCancel.addEventListener(`click`, this.onClickCancel);
    buttonClose.addEventListener(`click`, this.onClickCancel);
  }
}

/* Модуль: Игра на выбор исполнителя */

const ONE_SECOND = 1000;

class GameScreen {
  constructor(model) {
    this.model = model;
    this.header = null;
    this.screen = null;
    this._intervalId = null;
  }

  startGame() {
    const currentGameData = this.model.getLevelGameData();
    this.gameScreen(currentGameData);
    this._tickTimer();
    renderScreen(this.screen.element);
  }

  gameScreen(currentGameData) {
    this.header = new HeaderView(this.model.gameState);
    this.modalConfirm = new ModalConfirmView();

    this.modalConfirm.onClickOk = (event) => {
      const e = event || window.event;
      this._stopTimer();
      Music.stopPlayAllTracks();
      Application.showWelcome();
      document.body.removeChild(this.modalConfirm.element);
      e.preventDefault();
    };

    this.modalConfirm.onClickCancel = (event) => {
      const e = event || window.event;
      document.body.removeChild(this.modalConfirm.element);
      e.preventDefault();
    };

    this.header.onClick = () => {
      document.body.appendChild(this.modalConfirm.element);
    };

    if (currentGameData.gameType === QuestionType.ARTIST) {
      this.screen = new ArtistView(currentGameData);
      this.screen.onResult = (result) => this._changeLevel(result, this.model.gameState);
    }

    if (currentGameData.gameType === QuestionType.GENRE) {
      this.screen = new GenreView(currentGameData);
      this.screen.onResult = (result) => this._changeLevel(result, this.model.gameState);
    }

    this.screen.element.appendChild(this.header.element);
  }

  _changeLevel(result, game) {
    Music.stopPlayAllTracks();
    this.model.gameState = game;

    if (!result) {
      this.model.lossLive();
    }

    this._stopTimer();
    this.model.addResultAnswer(result);
    this.model.changeCurrentLevel(); // назначаем новый текущий уровнь

    const nextLevelGameData = this.model.getLevelGameData();
    const noLives = this.model.checkLives();

    if (!nextLevelGameData) {
      // вывод результатов закончились все уровни
      this._stopGame(ResultGame.WIN);
      return;
    }

    if (noLives) {
      // вывод результатов закончились жизни
      this._stopGame(ResultGame.NOLIVES);
      return;
    }

    this.model.nextLevel(); // следующий уровень

    this.gameScreen(nextLevelGameData);
    renderScreen(this.screen.element);
    this._tickTimer(); // запуск таймера
  }

  _updateHeader() {
    const time = this.header.convertTime();
    this.header.minElement.textContent = time.min;
    this.header.secElement.textContent = time.sec;

    const svg = this.header.getSvgAttrOptions();
    this.header.circleElement.setAttribute(`stroke-dashoffset`, svg.offset);

    if (+time.sec <= 30 && +time.sec % 2 === 0 && +time.min === 0) {
      this.header.timerElement.style.color = `red`;
    } else {
      this.header.timerElement.style.color = ``;
    }
  }

  _stopGame(status) {
    this.model.resultGame(status);
    Application.showResult(this.model.gameState);
  }

  _tickTimer() {
    const timeout = this.model.checkTimerStatus();
    if (timeout) {
      this._stopTimer();
      this._stopGame(ResultGame.TIMEOUT);
      Music.stopPlayAllTracks();
      return;
    }

    this._intervalId = setTimeout(() => {
      this.model.tick();
      this._tickTimer();
      this._updateHeader();
    }, ONE_SECOND);
  }

  _stopTimer() {
    clearTimeout(this._intervalId);
  }
}

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

const templates = {
  [ResultGame.WIN]: (data) => `
    <section class="main main--result">
      <section class="logo" title="Угадай мелодию"><h1>Угадай мелодию</h1></section>
      <h2 class="title">Вы настоящий меломан!</h2>
      <div class="main-stat">${data.time}
        <br>вы&nbsp;набрали ${data.score} баллов (${data.totalFast} быстрых)
        <br>совершив ${data.lives}</div>
      <span class="main-comparison">Подождите, загружаем результаты!</span>
      <span role="button" tabindex="0" class="main-replay">Сыграть ещё раз</span>
    </section>`,

  [ResultGame.NOLIVES]: () => `
    <section class="main main--result">
      <section class="logo" title="Угадай мелодию"><h1>Угадай мелодию</h1></section>
      <h2 class="title">Какая жалость!</h2>
      <div class="main-stat">У вас закончились все попытки.<br>Ничего, повезёт в следующий раз!</div>
      <span role="button" tabindex="0" class="main-replay">Попробовать ещё раз</span>
    </section>
    `,

  [ResultGame.TIMEOUT]: () => `
    <section class="main main--result">
      <section class="logo" title="Угадай мелодию"><h1>Угадай мелодию</h1></section>
      <h2 class="title">Увы и ах!</h2>
      <div class="main-stat">Время вышло!<br>Вы не успели отгадать все мелодии</div>
      <span role="button" tabindex="0" class="main-replay">Попробовать ещё раз</span>
    </section>
  `
};

class ResultView extends AbstractView {
  constructor(game) {
    super();
    this.game = game;
  }

  get template() {
    return templates[this.game.status](this.game);
  }

  onClick() { }

  bind() {
    const replayButtonElement = this.element.querySelector(`.main-replay`);
    replayButtonElement.addEventListener(`click`, this.onClick);

    this.scoresElement = this.element.querySelector(`.main-comparison`);
  }
}

class ResultScreen {
  constructor(model) {
    this.model = model;
    this.view = new ResultView(this.model.resultState);
    this.view.onClick = () => Application.showWelcome();
  }

  getPlayerResult() {
    return this.model.getPlayerResult();
  }

  showScores(data) {
    const scores = this.model.getScores(data);
    this.view.scoresElement.textContent = scores;
  }
}

class ResultModel {
  constructor(gameState) {
    this._gameState = Object.assign({}, gameState);
    this._calculateResult();
  }

  get resultState() {
    if (this._gameState.resultGame === ResultGame.WIN) {
      const timer = timerConverToMinAndSec(TIMER - this._gameState.timer.time);
      const timeText = showTimeResult(timer);

      const lives = (this._gameState.lives - 2) * -1;
      const livesDeclination = convertText(lives, `ошиб`, `ку`, `ки`, `ок`);
      const livesText = `${lives} ${livesDeclination}`;

      // вернем данные для view
      return {
        lives: livesText,
        time: timeText,
        score: this._gameState.score,
        totalFast: this._gameState.fastAnswers,
        status: this._gameState.resultGame
      };
    }
    return {
      status: this._gameState.resultGame
    };
  }

  getPlayerResult() {
    if (this._gameState.resultGame === ResultGame.WIN) {
      return {
        date: new Date(),
        lives: this._gameState.lives,
        time: this._gameState.currentTimer,
        score: this._gameState.score,
        totalfastAnswers: this._gameState.fastAnswers
      };
    }
    return false;
  }

  getScores(data) {
    const scores = [];
    data.forEach((result) => scores.push(result.score));
    return calculateResult(scores, this._gameState);
  }

  _calculateResult() {
    if (this._gameState.resultGame === ResultGame.WIN) {
      this._gameState.score = calculateScore(this._gameState.answers, this._gameState.lives);
      this._gameState.fastAnswers = (this._gameState.answers.filter((item) => item.timer <= 30)).length;
    }
  }
}

class ModalErrorView extends AbstractView {
  constructor(error) {
    super();
    this.error = error;
  }

  get template() {
    const message = this.error.message.split(`, `);
    return `
      <section class="modal-error modal-error__wrap">
        <div class="modal-error__inner">
          <h2 class="modal-error__title">Произошла ошибка!</h2>
          <p class="modal-error__text">Статус: ${message[0]} Пожалуйста, перезагрузите страницу.</p>
        </div>
      </section>
    `;
  }
}

const getAnswersArtist = (data, item) => {
  item.answers.forEach((answer) => {
    const adaptAnswer = {
      artist: answer.title,
      image: answer.image.url,
      name: answer.title,
      src: item.src
    };

    if (answer.isCorrect) {
      adaptAnswer.result = () => true;
      data.correct.push(adaptAnswer);
    } else {
      adaptAnswer.result = () => false;
    }

    data.answers.push(adaptAnswer);
  });
};

const getGenreArtist = (data, item) => {
  item.answers.forEach((answer) => {
    const adaptAnswer = {
      src: answer.src,
      genre: answer.genre
    };

    if (answer.genre === item.genre) {
      adaptAnswer.result = () => true;
      data.correct.push(adaptAnswer);
    } else {
      adaptAnswer.result = () => false;
    }

    data.answers.push(adaptAnswer);
  });
};

const adapterData = (serverData) => {
  const adaptData = [];
  serverData.forEach((item) => {
    const itemData = {
      gameType: item.type,
      title: item.question,
      answers: [],
      correct: []
    };

    if (item.type === QuestionType.ARTIST) {
      getAnswersArtist(itemData, item);
    }

    if (item.type === QuestionType.GENRE) {
      getGenreArtist(itemData, item);
    }

    adaptData.push(itemData);
  });

  return adaptData;
};

const URL = `https://es.dump.academy/guess-melody`;
const MY_API_ID = 338829;

const convertJSON = (response) => response.json();

const checkStatusResponse = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else if (response.status === 404) {
    return [];
  }
  throw new Error(`${response.status}, ${response.statusText}`);
};

class LoaderApi {
  static loadQuestions() {
    return fetch(`${URL}/questions`).then(checkStatusResponse).then(convertJSON).then(adapterData);
  }

  static loadResults() {
    return fetch(`${URL}/stats/${MY_API_ID}`).then(checkStatusResponse).then((response) => (response.length !== 0) ? convertJSON(response) : response);
  }

  static saveResults(data) {
    data = Object.assign({}, data);
    const reuqestOptions = {
      method: `POST`,
      headers: {
        'Content-Type': `application/json`
      },
      body: JSON.stringify(data)
    };

    return fetch(`${URL}/stats/${MY_API_ID}`, reuqestOptions).then(checkStatusResponse);
  }
}

let gameData;
const welcomeScreen = new WelcomeScreen();

class Application {
  static start() {
    LoaderApi.loadQuestions()
      .then((data) => {
        gameData = data;
        Application.showWelcome();
        return Music.loadAudioTracks(data);
      })
      .then((audioTracks) => Promise.all(audioTracks))
      .then((audioElements) => {
        audioElements.forEach((track) => {
          track.pause();
          track.currentTime = 0;
        });
        welcomeScreen.activeButtonStart();
      })
      .catch(Application.showError);
  }

  static showWelcome() {
    renderScreen(welcomeScreen.view.element);
  }

  static showGame() {
    const model = new GameModel(gameData);
    const gameScreen = new GameScreen(model);
    gameScreen.startGame();
  }

  static showResult(gameState) {
    const model = new ResultModel(gameState);
    const resultScreen = new ResultScreen(model);
    renderScreen(resultScreen.view.element);

    const result = resultScreen.getPlayerResult();
    if (result) {
      LoaderApi.loadResults()
        .then((data) => resultScreen.showScores(data))
        .then(() => LoaderApi.saveResults(result))
        .catch(Application.showError);
    }
  }

  static showError(error) {
    const modalError = new ModalErrorView(error);
    document.body.appendChild(modalError.element);
  }
}

class WelcomeScreen {
  constructor() {
    this.view = new WelcomeView();
    this.view.onClick = () => Application.showGame();
  }

  activeButtonStart() {
    this.view.buttonStartElement.style.borderLeftColor = ``;
    this.view.buttonStartElement.classList.remove(`disable`);
    this.view.buttonStartElement.addEventListener(`click`, this.view.onClick);
  }
}

return WelcomeScreen;

}());

//# sourceMappingURL=game-welcome.js.map
