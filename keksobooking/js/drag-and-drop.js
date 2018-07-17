'use strict';

(function () {
  const ADDRESS_Y_MIN = 130;
  const ADDRESS_Y_MAX = 630;

  var map = document.querySelector('.map');
  var addressPointer = map.querySelector('.map__pin--main');
  var adForm = document.querySelector('.ad-form');
  var adressInput = adForm.querySelector('#address');

  // Перемещение
  addressPointer.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: moveEvt.clientX - startCoords.x,
        y: moveEvt.clientY - startCoords.y
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var newX = addressPointer.offsetLeft + shift.x;
      var newY = addressPointer.offsetTop + shift.y;

      if (newX < 0) {
        newX = 0;
      }

      if (newX > addressPointer.parentElement.offsetWidth - addressPointer.offsetWidth) {
        newX = addressPointer.parentElement.offsetWidth - addressPointer.offsetWidth;
      }

      if (newY < ADDRESS_Y_MIN) {
        newY = ADDRESS_Y_MIN;
      }
      if (newY > ADDRESS_Y_MAX) {
        newY = ADDRESS_Y_MAX;
      }

      addressPointer.style.left = newX + 'px';
      addressPointer.style.top = newY + 'px';

      var locationX = newX + Math.round(addressPointer.offsetWidth / 2);
      var locationY = newY + addressPointer.offsetHeight;

      adressInput.value = locationX + ', ' + locationY;
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
})();
