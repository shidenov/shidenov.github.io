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

const ResultGame = {
  WIN: `win`,
  NOLIVES: `noLives`,
  TIMEOUT: `timeout`
};

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

return ResultView;

}());

//# sourceMappingURL=game-result-view.js.map
