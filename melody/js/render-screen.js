var renderScreen = (function (exports) {
'use strict';

const renderScreen = (screen) => {
  const mainAppWrapElement = document.querySelector(`.main`);
  mainAppWrapElement.innerHTML = ``;
  mainAppWrapElement.appendChild(screen);
};

exports.renderScreen = renderScreen;

return exports;

}({}));

//# sourceMappingURL=render-screen.js.map
