'use strict';

(function () {
  var TYPES = {
    flat: {
      minPrice: 1000,
      title: 'Квартира'
    },
    bungalo: {
      minPrice: 0,
      title: 'Бунгало'
    },
    house: {
      minPrice: 5000,
      title: 'Дом'
    },
    palace: {
      minPrice: 10000,
      title: 'Дворец'
    }
  };

  var map = document.querySelector('.map');
  var mapFiltersContainer = map.querySelector('.map__filters-container');
  var mapAdvertTemplate = document.querySelector('template').content.querySelector('.map__card');

  var createAdvert = function (advertParametr) {
    var advert = mapAdvertTemplate.cloneNode(true);
    var featureHtml = '';
    var photosHtml = '';

    // В html документ добавляем список удобств с модификатором
    for (var i = 0; i < advertParametr.offer.features.length; i++) {
      featureHtml += '<li class="popup__feature popup__feature--' + advertParametr.offer.features[i] + '"></li>';
    }

    // В html добавляем адрес изображения жилища
    for (var j = 0; j < advertParametr.offer.photos.length; j++) {
      photosHtml += '<img src="' + advertParametr.offer.photos[j] + '" class="popup__photo" width="45" height="40" alt="Жилье">';
    }

    advert.querySelector('.popup__title').textContent = advertParametr.offer.title;
    advert.querySelector('.popup__text--address').textContent = advertParametr.offer.address;
    advert.querySelector('.popup__text--price').innerHTML = advertParametr.offer.price + '&#8381;/ночь';
    advert.querySelector('.popup__type').textContent = TYPES[advertParametr.offer.type].title;
    advert.querySelector('.popup__text--capacity').textContent = advertParametr.offer.rooms + ' комнаты для ' + advertParametr.offer.guests + ' гостей';
    advert.querySelector('.popup__text--time').textContent = 'Заезд после ' + advertParametr.offer.checkin + ', выезд до ' + advertParametr.offer.checkout;
    advert.querySelector('.popup__features').innerHTML = featureHtml;
    advert.querySelector('.popup__description').textContent = advertParametr.offer.description;
    advert.querySelector('.popup__photos').innerHTML = photosHtml;
    advert.querySelector('.popup__avatar').src = advertParametr.author.avatar;

    // Закрытие карточки
    var popupClose = advert.querySelector('.popup__close');
    popupClose.addEventListener('click', closeAdvert);
    document.addEventListener('keydown', escPressHandler);

    return advert;
  };

  // Вставка DOM карточки
  var showAdvert = function (parent, advert) {
    var mapAdvert = parent.querySelector('.map__card');
    if (parent.querySelector('.map__card')) {
      parent.replaceChild(createAdvert(advert), parent.querySelector('.map__card'));
    }
    if (mapAdvert) {
      closeAdvert();
    }
    map.insertBefore(createAdvert(advert), mapFiltersContainer);
  };

  // Функция закрытия карточки
  var closeAdvert = function () {
    var popup = map.querySelector('.map__card');
    if (!popup) {
      return;
    }
    var popupClose = popup.querySelector('.popup__close');

    map.removeChild(popup);
    document.removeEventListener('keydown', escPressHandler);
    popupClose.removeEventListener('click', closeAdvert);
    popupClose.removeEventListener('keydown', closeAdvert);
  };

  // Закрытие при нажатии на Escape
  var escPressHandler = function (evt) {
    window.support.closePopup(evt, closeAdvert);
  };

  window.card = {
    showAdvert: showAdvert,
    closeAdvert: closeAdvert,
    TYPES: TYPES
  };
})();