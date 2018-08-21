var gameHeaderView = (function () {
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

  convertTime() {
    return timerConverToMinAndSec(this.state.timer.time);
  }

  getSvgAttrOptions() {
    const timerRelation = this.state.timer.time / 300;
    return getRadius(timerRelation, 370);
  }
}

return HeaderView;

}());

//# sourceMappingURL=game-header-view.js.map
