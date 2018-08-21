var modalConfirmView = (function () {
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

return ModalConfirmView;

}());

//# sourceMappingURL=modal-confirm-view.js.map
