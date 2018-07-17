'use strict';

(function(){
  const FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  const DEFAULT_AVATAR_SRC = 'img/muffin-grey.svg';

  var adForm = document.querySelector('.ad-form');
  var avatarLoadInput = adForm.querySelector('.ad-form-header__input');
  var avatarPreview = adForm.querySelector('.ad-form-header__preview').querySelector('img');
  var photoLoadInput = adForm.querySelector('.ad-form__input');
  var photoContainer = adForm.querySelector('.ad-form__photo-container');

  var avatarLoadChangeHandler = function() {
    var file = avatarLoadInput.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function(it) {
      return fileName.endsWith(it);
    });

    if(matches) {
      var reader = new FileReader();
      reader.addEventListener('load',function() {
        avatarPreview.src=reader.result;
      });

      reader.readAsDataURL(file);
    }
};

  var createAvatarContainer = function(src) {
    var newContainer = document.createElement('div');
    var newPhoto = document.createElement('img');

    newContainer.classList.add('ad-form__photo');
    newPhoto.alt = 'Фотографии жилья';
    newPhoto.src = src;
    newPhoto.style = 'width: 70px';
    newPhoto.style.overflow = 'hidden';

    newContainer.appendChild(newPhoto);
    photoContainer.appendChild(newContainer);
  };

  var photoLoadChangeHandler = function() {
    var file = photoLoadInput.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function(it) {
      return fileName.endsWith(it);
    });

    if(matches) {
      var reader = new FileReader();

      reader.addEventListener('load',function() {
        createAvatarContainer(reader.result);
      });

      reader.readAsDataURL(file);
    }
  };

  var resetAvatarLoad = function() {
    avatarPreview.src = DEFAULT_AVATAR_SRC;
  };

  var resetPhotoContainer = function() {
    var descriptionPhotos = document.querySelectorAll('.ad-form__photo');

    descriptionPhotos.forEach(function(item) {
      photoContainer.removeChild(item);
    });
  };

  avatarLoadInput.addEventListener('change',avatarLoadChangeHandler);
  photoLoadInput.addEventListener('change',photoLoadChangeHandler);

  window.previewPhotos = {
    resetAvatarLoad: resetAvatarLoad,
    resetPhotoContainer: resetPhotoContainer
  };
})();