'use strict';

(function () {
  var MIN_PRICE = 10000;
  var MAX_PRICE = 50000;

  var filterField = document.querySelector('.map__filters');
  var houseFilter = filterField.querySelector('#housing-type');
  var priceFilter = filterField.querySelector('#housing-price');
  var roomsFilter = filterField.querySelector('#housing-rooms');
  var guestsFilter = filterField.querySelector('#housing-guests');
  var featuresFilters = filterField.querySelectorAll('.map__checkbox');

  var filteredData;
  var pin = [];

  var filterValue = function (inputField, property) {
    filteredData = filteredData.filter(function (item) {
      return inputField.value === 'any' || item.offer[property].toString() === inputField.value;
    });
    return filteredData;
  };

  var filterFeatures = function () {
    for (var i = 0; i < featuresFilters.length; i++) {
      if (featuresFilters[i].checked) {
        filteredData = filteredData.filter(function (item) {
          return item.offer.features.includes(featuresFilters[i].value);
        });
      }
    }
    return filteredData;
  };

  var filterPrice = function () {
    if (priceFilter.value !== 'any') {
      filteredData = filteredData.filter(function (item) {
        var priceFilterValues = {
          'low': item.offer.price < MIN_PRICE,
          'middle': item.offer.price >= MIN_PRICE && item.offer.price < MAX_PRICE,
          'high': item.offer.price >= MAX_PRICE
        };
        return priceFilterValues[priceFilter.value];
      });
    }
    return filteredData;
  };

  var updatePins = function () {
    filteredData = pin;
    window.pin.removePins();
    window.card.closeAdvert();

    filterValue(houseFilter, 'type');
    filterValue(roomsFilter, 'rooms');
    filterValue(guestsFilter, 'guests');
    filterFeatures();
    filterPrice();

    window.pin.renderAllPins(filteredData);
  };

  filterField.addEventListener('change', function () {
    window.support.debounce(updatePins);
    filterField.removeEventListener('input', function () {
    });
  });

  var downloadOffers = function (data) {
    pin = data.slice();
  };

  window.filters = {
    updatePins: updatePins,
    downloadOffers: downloadOffers
  };
})();