import AbstractView from './abstract-view';
import {development} from './main';
import {getAudioTrack} from './data/music-data';

export default class ArtistView extends AbstractView {
  constructor(game) {
    super();
    this.game = game;
  }

  get template() {
    const answers = [];
    for (let i = 0; this.game.answers.length > i; i++) {
      const status = (development) ? `<span style="color: black">${this.game.answers[i].result()}</span>` : ``;
      const item = `
        <div class="main-answer-wrapper">
          <input class="main-answer-r" type="radio" id="answer-${i}" name="answer" value="val-${i}"/>
          <label class="main-answer" for="answer-${i}">
            <img class="main-answer-preview" src="${this.game.answers[i].image}" alt="${this.game.answers[i].artist}" width="134" height="134">
            ${this.game.answers[i].artist}
            ${status}
          </label>
        </div>
      `;

      item.trim();
      answers.push(item);
    }

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
        track = getAudioTrack(answer.src);
        track.play();
      }
    }

    const buttonControl = this.element.querySelector(`.player-control`);
    buttonControl.addEventListener(`click`, (event) => {
      const e = event || window.event;
      const target = e.target || e.srcElement;

      if ([...target.classList].indexOf(`player-control--pause`) !== -1) {
        target.classList.remove(`player-control--pause`);
        target.classList.add(`player-control--play`);
        track.pause();
      } else {
        target.classList.remove(`player-control--play`);
        target.classList.add(`player-control--pause`);
        track.play();
      }
    });

    const inputItems = this.element.querySelectorAll(`input`);
    for (let input of inputItems) {
      input.addEventListener(`click`, (event) => {
        const e = event || window.event;
        const target = e.target || e.srcElement;

        const currentAnswerIndex = target.value.slice(target.value.length - 1, target.value.length);
        const result = this.game.answers[currentAnswerIndex].result();

        // stop audio
        track.pause();
        this.onResult(result);
      });
    }
  }
}

//# sourceMappingURL=game-artist-view.js.map
