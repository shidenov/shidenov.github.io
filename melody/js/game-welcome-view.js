var gameWelcomeView = (function () {
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
    this.buttonStartElement.style.borderLeftColor = `#bbb`;
  }
}

return WelcomeView;

}());

//# sourceMappingURL=game-welcome-view.js.map
