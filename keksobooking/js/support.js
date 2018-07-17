'use strict';

(function() {
  const ESC_KEYCODE = 27;
  const DEBOUNCE_INTERVAL = 500;
  var lastTimeout;
  var debounce = function (fun) {
    window.clearTimeout(lastTimeout);
    lastTimeout = window.setTimeout(fun, DEBOUNCE_INTERVAL);
  };

  var closePopup = function(evt, action) {
    if(evt.keyCode === ESC_KEYCODE) {
      action();
    }
  };

  window.support = {
    debounce: debounce,
    closePopup: closePopup
  }
})();