var loaderData = (function () {
'use strict';

const TIMER = 300; // 5 min

const GAME = Object.freeze({
  lives: 2,
  currentTimer: TIMER,
  score: 0,
  currentLevel: 0,
  nextLevel: 1
});

const QuestionType = {
  GENRE: `genre`,
  ARTIST: `artist`
};

const getAnswersArtist = (data, item) => {
  item.answers.forEach((answer) => {
    const adaptAnswer = {
      artist: answer.title,
      image: answer.image.url,
      name: answer.title,
      src: item.src
    };

    if (answer.isCorrect) {
      adaptAnswer.result = () => true;
      data.correct.push(adaptAnswer);
    } else {
      adaptAnswer.result = () => false;
    }

    data.answers.push(adaptAnswer);
  });
};

const getGenreArtist = (data, item) => {
  item.answers.forEach((answer) => {
    const adaptAnswer = {
      src: answer.src,
      genre: answer.genre
    };

    if (answer.genre === item.genre) {
      adaptAnswer.result = () => true;
      data.correct.push(adaptAnswer);
    } else {
      adaptAnswer.result = () => false;
    }

    data.answers.push(adaptAnswer);
  });
};

const adapterData = (serverData) => {
  const adaptData = [];
  serverData.forEach((item) => {
    const itemData = {
      gameType: item.type,
      title: item.question,
      answers: [],
      correct: []
    };

    if (item.type === QuestionType.ARTIST) {
      getAnswersArtist(itemData, item);
    }

    if (item.type === QuestionType.GENRE) {
      getGenreArtist(itemData, item);
    }

    adaptData.push(itemData);
  });

  return adaptData;
};

const URL = `https://es.dump.academy/guess-melody`;
const MY_API_ID = 338829;

const convertJSON = (response) => response.json();

const checkStatusResponse = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else if (response.status === 404) {
    return [];
  }
  throw new Error(`${response.status}, ${response.statusText}`);
};

class LoaderApi {
  static loadQuestions() {
    return fetch(`${URL}/questions`).then(checkStatusResponse).then(convertJSON).then(adapterData);
  }

  static loadResults() {
    return fetch(`${URL}/stats/${MY_API_ID}`).then(checkStatusResponse).then((response) => (response.length !== 0) ? convertJSON(response) : response);
  }

  static saveResults(data) {
    data = Object.assign({}, data);
    const reuqestOptions = {
      method: `POST`,
      headers: {
        'Content-Type': `application/json`
      },
      body: JSON.stringify(data)
    };

    return fetch(`${URL}/stats/${MY_API_ID}`, reuqestOptions).then(checkStatusResponse);
  }
}

return LoaderApi;

}());

//# sourceMappingURL=loader-data.js.map
