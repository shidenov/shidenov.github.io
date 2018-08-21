import AbstractView from './abstract-view';
import {development} from './main';
import {getAudioTrack} from './data/music-data';

export default class GenreView extends AbstractView {
  constructor(game) {
    super();
    this.game = game;
  }

  get template() {
    const answers = [];
    for (let i = 0; this.game.answers.length > i; i++) {
      const status = (development) ? `<span style="color: black">${this.game.answers[i].result()}</span>` : ``;
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
      answers.push(item);
    }

    return `
      <section class="main main--level main--level-${this.game.gameType}">
        <div class="main-wrap">
          <h2 class="title">${this.game.title}</h2>
          <form class="genre">
            ${answers.join(``)}
            <button class="genre-answer-send" type="submit">Ответить</button>
          </form>
        </div>
      </section>
    `;
  }

  onResult() { }

  bind() {
    const players = this.element.querySelectorAll(`.player`);
    const audioTracks = [];

    this.game.answers.forEach((answer, i) => {
      const track = getAudioTrack(answer.src);
      audioTracks.push(track);

      const buttonControl = players[i].querySelector(`.player-control`);
      if (i === 0) {
        track.play();
        buttonControl.classList.remove(`player-control--play`);
        buttonControl.classList.add(`player-control--pause`);
      }

      buttonControl.addEventListener(`click`, (event) => {
        const e = event || window.event;
        const target = e.target || e.srcElement;

        // отключать все треки и включать выбранный
        audioTracks.forEach((audio) => audio.pause());
        // добавить всем кнопкам класс play
        for (let player of players) {
          const control = player.querySelector(`.player-control`);
          control.classList.remove(`player-control--pause`);
          control.classList.add(`player-control--play`);
        }

        if ([...target.classList].indexOf(`player-control--pause`) !== -1) {
          target.classList.remove(`player-control--pause`);
          target.classList.add(`player-control--play`);
        } else {
          target.classList.remove(`player-control--play`);
          target.classList.add(`player-control--pause`);
          track.play();
        }

        e.preventDefault();
      });
    });

    const submitButton = this.element.querySelector(`.genre-answer-send`);
    submitButton.disabled = true;

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

        submitButton.disabled = Object.keys(resultAnswers).length === 0;
      });
    }

    submitButton.addEventListener(`click`, (e) => {
      e.preventDefault();
      for (let key in resultAnswers) {
        if (!resultAnswers[key]) {
          return this.onResult(false);
        }
      }

      audioTracks.forEach((audio) => audio.pause());
      return this.onResult(true);
    });
  }
}

//# sourceMappingURL=game-genre-view.js.map
