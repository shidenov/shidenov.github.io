/* Модуль: Игра на выбор исполнителя */
import {renderScreen} from './render-screen';

import Application from './application';
import HeaderView from './game-header-view';
import ArtistView from './game-artist-view';
import GenreView from './game-genre-view';
import ModalConfirmView from './modal-confirm-view';

const ONE_SECOND = 1000;

export default class GameScreen {
  constructor(model) {
    this.model = model;
    this.header = null;
    this.screen = null;
    this._intervalId = null;
  }

  updateHeader() {
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

  tickTimer() {
    const timeout = this.model.checkTimerStatus();
    if (timeout) {
      this.stopTimer();
      this.stopGame();
      return;
    }

    this._intervalId = setTimeout(() => {
      this.model.tick();
      this.tickTimer();
      this.updateHeader();
    }, ONE_SECOND);
  }

  stopTimer() {
    clearTimeout(this._intervalId);
  }

  startGame() {
    const currentGameData = this.model.getLevelGameData();
    this.gameScreen(currentGameData);
    this.tickTimer();
    renderScreen(this.screen.element);
  }

  stopGame() {
    this.model.gameResult();
    Application.showResult(this.model.gameState);
  }

  gameScreen(currentGameData) {
    this.header = new HeaderView(this.model.gameState);
    this.modalConfirm = new ModalConfirmView();

    this.modalConfirm.onClickOk = (event) => {
      const e = event || window.event;
      this.stopTimer();
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

    if (currentGameData.gameType === `artist`) {
      this.screen = new ArtistView(currentGameData);
      this.screen.onResult = (result) => this.changeLevel(result, this.model.gameState);
    }

    if (currentGameData.gameType === `genre`) {
      this.screen = new GenreView(currentGameData);
      this.screen.onResult = (result) => this.changeLevel(result, this.model.gameState);
    }

    this.screen.element.appendChild(this.header.element);
  }

  changeLevel(result, game) {
    this.model.gameState = game;

    if (!result) {
      this.model.lossLive();
    }

    this.stopTimer();
    this.model.addResultAnswer(result);
    this.model.changeCurrentLevel(); // назначаем новый текущий уровнь

    const nextLevelGameData = this.model.getLevelGameData();
    const noLives = this.model.checkLives();

    if (!nextLevelGameData) {
      // вывод результатов закончились все уровни
      this.stopGame();
      return;
    }

    if (noLives) {
      // вывод результатов закончились жизни
      this.stopGame();
      return;
    }

    this.model.nextLevel(); // следующий уровень

    this.gameScreen(nextLevelGameData);
    renderScreen(this.screen.element);
    this.tickTimer(); // запуск таймера
  }
}

//# sourceMappingURL=game-screen.js.map
