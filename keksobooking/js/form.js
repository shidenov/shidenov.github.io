'use strict';

(function () {
  // Исходные координаты ползунка
  const INITIAL_ADDRESS_X = 570;
  const INITIAL_ADDRESS_Y = 375;

  var map = document.querySelector('.map');
  var addressPointer = map.querySelector('.map__pin--main');
  var adForm = document.querySelector('.ad-form');
  var mapPins = map.querySelector('.map__pins');
  var adFieldsets = adForm.querySelectorAll('fieldset');
  var popup = document.querySelector('.popup');
  var filterField = document.querySelector('.map__filters');
  // Находим Инпуты в форме
  var titleAd = adForm.querySelector('#title');
  var homesType = adForm.querySelector('#type');
  var price = adForm.querySelector('#price');
  var timeIn = adForm.querySelector('#timein');
  var timeOut = adForm.querySelector('#timeout');
  var roomNumber = adForm.querySelector('#room_number');
  var capacity = adForm.querySelector('#capacity');
  var adressInput = adForm.querySelector('#address');
  var resetButton = adForm.querySelector('.ad-form__reset');
  var successSendForm = document.querySelector('.success');

  // Валидация заголовка
  var setTitleInvalid = function () {
    if (titleAd.validity.tooShort) {
      titleAd.setCustomValidity('Минимальное число символов: ' + titleAd.minLength);
    } else if (titleAd.validity.tooLong) {
      titleAd.setCustomValidity('Максимальное число символов: ' + titleAd.maxLength);
    } else if (titleAd.validity.valueMissing) {
      titleAd.setCustomValidity('Обязательное поле');
    } else {
      titleAd.setCustomValidity('');
    }
  };

  titleAd.addEventListener('invalid', setTitleInvalid);
  titleAd.addEventListener('change', function (evt) {
    evt.target.checkValidity();
  });

  // Минимальная цена в зависимости от типа жилья
  var setPrice = function () {
    price.min = window.card.TYPES[homesType.value].minPrice;
    price.placeholder = window.card.TYPES[homesType.value].minPrice;
  };

  homesType.addEventListener('change', setPrice);

  // Валидация цены
  var setPriceInvalid = function () {
    if (price.validity.rangeUnderflow) {
      price.setCustomValidity('Минимальная цена: ' + price.min);
    } else if (price.validity.rangeOverflow) {
      price.setCustomValidity('Максимальная цена: ' + price.max);
    } else if (price.validity.valueMissing) {
      price.setCustomValidity('Обязательное поле');
    } else {
      price.setCustomValidity('');
    }
  };

  price.addEventListener('invalid', setPriceInvalid);
  price.addEventListener('change', function (evt) {
    evt.target.checkValidity();
  });

  // Синхронизация времени въезда и выезда
  timeIn.addEventListener('change', function () {
    timeOut.value = timeIn.value;
  });

  timeOut.addEventListener('change', function () {
    timeIn.value = timeOut.value;
  });

  // Синхронизация количества гостей и количества комнат
  var setRoomsToGuests = function () {
    if (+roomNumber.value < roomNumber.length) {
      capacity.value = roomNumber.value;
    } else {
      capacity.value = 0;
    }

    for (var i = 0; i < capacity.length; i++) {
      var option = capacity.options[i];
      var notForGuests = +option.value === 0;

      if (+roomNumber.value === 100) {
        option.disabled = !notForGuests;
      } else {
        option.disabled = notForGuests || +option.value > +roomNumber.value;
      }
    }
  };
  roomNumber.addEventListener('change', setRoomsToGuests);

  // Получаем координаты ползунка
  var getCoordinations = function () {
    var left = addressPointer.offsetLeft - Math.round(addressPointer.offsetWidth / 2);
    var top = addressPointer.offsetTop;

    adressInput.value = left + ', ' + top;
  };

  // Кнопка сброса
  var resetClickHandler = function () {
    adForm.reset();
    filterField.reset();

    map.classList.add('map--faded');
    adForm.classList.add('ad-form--disabled');
    adFieldsets.forEach(function (item) {
      item.disabled = true;
    });

    var pins = mapPins.querySelectorAll('.map__pin:not(.map__pin--main)');
    for (var j = 0; j < pins.length; j++) {
      mapPins.removeChild(pins[j]);
    }
    addressPointer.style.left = INITIAL_ADDRESS_X + 'px';
    addressPointer.style.top = INITIAL_ADDRESS_Y + 'px';

    getCoordinations();

    window.card.closeAdvert();

    setPrice();

    window.previewPhotos.resetAvatarLoad();
    window.previewPhotos.resetPhotoContainer();
  };

  resetButton.addEventListener('click', resetClickHandler);

//Отправка формы
adForm.addEventListener('submit', function (evt) {
  evt.preventDefault();

  window.backend.upload(new FormData(adForm), function () {
    successSendForm.classList.remove('hidden');
    resetClickHandler();
  }, window.backend.error)
});

  var closeSuccessEsc = function (evtClose) {
    window.support.closePopup(evtClose,closeSuccess);
  };

  var closeSuccess = function () {
    successSendForm.classList.add('hidden');
  };

  document.addEventListener('keydown', closeSuccessEsc);
  document.addEventListener('click', closeSuccess);

  window.form = {
    getCoordinations: getCoordinations,
    setPrice: setPrice,
    setRoomsToGuests: setRoomsToGuests
  };
})();
