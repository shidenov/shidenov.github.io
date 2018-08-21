var musicData = (function () {
'use strict';

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

return Music;

}());

//# sourceMappingURL=music-data.js.map
