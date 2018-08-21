var modalErrorView = (function () {
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

return ModalErrorView;

}());

//# sourceMappingURL=modal-error-view.js.map
