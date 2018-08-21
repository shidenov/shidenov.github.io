var gameResultView = (function () {
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

const TIMER = 300; // 5 min

const GAME = Object.freeze({
  lives: 2,
  currentTimer: TIMER,
  score: 0,
  currentLevel: 0,
  nextLevel: 1
});

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

class ResultView extends AbstractView {
  constructor(game) {
    super();
    this.game = game;
  }

  get template() {
    let template;

    if (this.game.score !== -1) {
      const timer = timerConverToMinAndSec(300 - this.game.timer.time);
      const timeText = showTimeResult(timer);

      const lives = (this.game.lives - 2) * -1;
      const livesDeclination = convertText(lives, `ошиб`, `ку`, `ки`, `ок`);
      const livesText = `${lives} ${livesDeclination}`;

      template = `
        <section class="main main--result">
          <section class="logo" title="Угадай мелодию"><h1>Угадай мелодию</h1></section>
          <h2 class="title">Вы настоящий меломан!</h2>
          <div class="main-stat">${timeText}
            <br>вы&nbsp;набрали ${this.game.score} баллов (${this.game.fastAnswers.length} быстрых)
            <br>совершив ${livesText}</div>
          <span class="main-comparison">${this.game.resultGame}</span>
          <span role="button" tabindex="0" class="main-replay">Сыграть ещё раз</span>
        </section>
      `;
    }

    if (this.game.resultGame === `У вас зако��чились все попытки. Ничего, повезёт в следующий раз!`) {
      template = `
        <section class="main main--result">
          <section class="logo" title="Угадай мелодию"><h1>Угадай мелодию</h1></section>
          <h2 class="title">Какая жалость!</h2>
          <div class="main-stat">У вас закончились все попытки.<br>Ничего, повезёт в следующий раз!</div>
          <span role="button" tabindex="0" class="main-replay">Попробовать ещё раз</span>
        </section>
      `;
    }

    if (this.game.resultGame === `Время вышло! Вы не успели отгадать все мелодии`) {
      template = `
        <section class="main main--result">
          <section class="logo" title="Угадай мелодию"><h1>Угадай мелодию</h1></section>
          <h2 class="title">Увы и ах!</h2>
          <div class="main-stat">Время вышло!<br>Вы не успели отгадать все мелодии</div>
          <span role="button" tabindex="0" class="main-replay">Попробовать ещё раз</span>
        </section>
      `;
    }

    if (typeof template === `undefined`) {
      throw new Error(`Не могу отобразить результат, ошибка данных`);
    }

    return template;
  }

  onClick() { }

  bind() {
    const playAgainButton = this.element.querySelector(`.main-replay`);
    playAgainButton.addEventListener(`click`, this.onClick);
  }
}

return ResultView;

}());

//# sourceMappingURL=game-result-view.js.map
