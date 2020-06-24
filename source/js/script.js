'use strict';

(function () {
  var ESC_KEYCODE = 27;

  var errors = {
    noname: 'не заполнено имя',
    nophone: 'не заполнен телефон',
    noconfirmation: 'подтвердите согласие'
  };

  var htmlGlobal = document.querySelector('html');
  var bodyGlobal = document.querySelector('body');

  var pageHeader = document.querySelector('.page-header');
  var menuButton = pageHeader.querySelector('.js-open-menu');

  var openDiscussPopupButtons = document.querySelectorAll('.js-open-discuss-popup');
  var discussPopup = document.querySelector('.discuss');
  var closeDiscussButton = discussPopup.querySelector('.js-discuss-close');
  var blackout = document.querySelector('.blackout');

  var inputName = discussPopup.querySelector('#discuss-name');
  var inputPhone = discussPopup.querySelector('#discuss-phone');
  var checkBox = discussPopup.querySelector('#discuss-confirmation');

  var gallery = document.querySelector('.gallery');
  var openDescriptionButton = gallery.querySelector('.js-open-description');
  var closeDescriptionButton = gallery.querySelector('.js-close-description');
  var descriptionPopup = gallery.querySelector('.gallery__description-popup');

  var successPopup = document.querySelector('.success');

  var blockBackground = function () {
    htmlGlobal.style.paddingLeft = '17px';
    bodyGlobal.style.overflow = 'hidden';
    bodyGlobal.style.touchAction = 'none';

    if (blackout.classList.contains('blackout--hidden')) {
      blackout.classList.remove('blackout--hidden');
    }
  };

  var returnBackround = function () {
    htmlGlobal.style.paddingLeft = '';
    bodyGlobal.style.overflow = '';
    bodyGlobal.style.touchAction = '';

    if (!blackout.classList.contains('blackout--hidden')) {
      blackout.classList.add('blackout--hidden');
    }
  };

  var resetErrorOnInput = function (input, errorClass) {
    if (input.classList.contains(errorClass)) {
      input.classList.remove(errorClass);
    }
  };

  var resetDiscussForm = function () {
    inputName.value = '';
    inputPhone.value = '';
    checkBox.checked = false;

    resetErrorOnInput(inputPhone, 'discuss__input--error');
    resetErrorOnInput(inputName, 'discuss__input--error');
    resetErrorOnInput(checkBox, 'discuss__checkbox-input--error');
  };

  var closeDiscuss = function () {
    if (!discussPopup.classList.contains('discuss--hidden')) {
      discussPopup.classList.add('discuss--hidden');
    }

    returnBackround();

    document.removeEventListener('keydown', onEscPressDiscussPopup);
    blackout.removeEventListener('click', closeDiscussOnButtonClick);

    resetDiscussForm();
  };

  var closeSuccess = function () {
    if (!successPopup.classList.contains('success--hidden')) {
      successPopup.classList.add('success--hidden');
    }

    document.removeEventListener('keydown', onEscPressSuccessPopup);
    blackout.removeEventListener('click', closeSuccessOnButtonClick);
    returnBackround();
  };

  successPopup.addEventListener('click', function (evt) {
    var target = evt.target;
    if (target.closest('button').classList.contains('js-success-ok') || target.closest('button').classList.contains('js-close-success')) {
      closeSuccess();
    }
  });

  var onEscPressDiscussPopup = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      closeDiscuss();
    }
  };

  var closeDiscussOnButtonClick = function () {
    blackout.addEventListener('click', closeDiscuss());
  };

  var onEscPressSuccessPopup = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      closeSuccess();
    }
  };

  var closeSuccessOnButtonClick = function () {
    blackout.addEventListener('click', closeSuccess());
  };

  var openPopup = function (popup, hiddenClass) {
    if (popup.classList.contains(hiddenClass)) {
      popup.classList.remove(hiddenClass);
    }
  };

  menuButton.addEventListener('click', function () {
    if (pageHeader.classList.contains('page-header--menu-closed')) {
      pageHeader.classList.remove('page-header--menu-closed');
    } else {
      pageHeader.classList.add('page-header--menu-closed');
    }
  });

  openDiscussPopupButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      openPopup(discussPopup, 'discuss--hidden');

      blockBackground();

      document.addEventListener('keydown', onEscPressDiscussPopup);
      blackout.addEventListener('click', closeDiscussOnButtonClick);
    });
  });

  closeDiscussButton.addEventListener('click', closeDiscuss);

  var validateName = function (input, errorClass) {
    var name = input.value;

    if (!name) {
      input.setCustomValidity(errors.noname);
      input.classList.add(errorClass);
      return false;
    } else {
      input.setCustomValidity('');
      if (input.classList.contains(errorClass)) {
        input.classList.remove(errorClass);
      }
      return true;
    }
  };

  var validatePhone = function (input, errorClass) {
    var phone = input.value;
    var regEx = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/;

    if (regEx.test(phone) === false) {
      input.setCustomValidity(errors.nophone);
      input.classList.add(errorClass);
      return false;
    } else {
      input.setCustomValidity('');
      if (input.classList.contains(errorClass)) {
        input.classList.remove(errorClass);
      }
      return true;
    }
  };

  var validateCheckbox = function (check, errorClass) {
    if (check.checked === false) {
      check.setCustomValidity(errors.noconfirmation);
      check.classList.add(errorClass);
      return false;
    } else {
      check.setCustomValidity('');
      if (check.classList.contains(errorClass)) {
        check.classList.remove(errorClass);
      }
      return true;
    }
  };

  var discussForm = discussPopup.querySelector('.discuss__form');

  var TIMEOUT = 1000;
  var OK_CODE = 200;

  var createXhr = function (url, method, onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === OK_CODE) {
        onLoad(xhr.response);
      } else {
        onError('Cтатус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = TIMEOUT;

    xhr.open(method, url);
    return xhr;
  };


  var send = function (data, onLoad, onError) {
    var url = '';
    var xhr = createXhr(url, 'POST', onLoad, onError);
    xhr.send(data);
  };

  var activateSucces = function () {
    closeDiscuss();
    openPopup(successPopup, 'success--hidden');
    blockBackground();
    document.addEventListener('keydown', onEscPressSuccessPopup);
    blackout.addEventListener('click', closeSuccessOnButtonClick);
  };

  discussForm.addEventListener('submit', function (evt) {
    if (validateName(inputName, 'discuss__input--error') && validatePhone(inputPhone, 'discuss__input--error') && validateCheckbox(checkBox, 'discuss__checkbox-input--error')) {

      var formData = new FormData(discussForm);


      send(formData, activateSucces(), activateSucces());
      evt.preventDefault();
    }
  });

  var closeDescriptionPopup = function () {
    if (!descriptionPopup.classList.contains('gallery__description-popup--hidden')) {
      descriptionPopup.classList.add('gallery__description-popup--hidden');
    }

    blackout.classList.remove('blackout--transparent');
  };

  var closeDescriptionOnButtonClick = function () {
    blackout.addEventListener('click', closeDescriptionPopup());
  };

  openDescriptionButton.addEventListener('click', function () {
    blackout.classList.add('blackout--transparent');
    openPopup(descriptionPopup, 'gallery__description-popup--hidden');

    blackout.addEventListener('click', closeDescriptionOnButtonClick);
  });

  closeDescriptionButton.addEventListener('click', function () {
    closeDescriptionPopup();
  });

  var changeHeaderStyle = function () {
    if (pageYOffset >= 20) {
      pageHeader.classList.add('page-header--transparent');
    }

    if (pageYOffset >= 90) {
      pageHeader.classList.add('page-header--hidden');
    }

    if (pageYOffset < 5 && (pageHeader.classList.contains('page-header--transparent') || pageHeader.classList.contains('page-header--hidden'))) {
      pageHeader.classList.remove('page-header--transparent');
      pageHeader.classList.remove('page-header--hidden');
    }
  };

  window.addEventListener('scroll', changeHeaderStyle);

  if (!pageHeader.classList.contains('page-header--menu-closed')) {
    window.removeEventListener('scroll', changeHeaderStyle);
  }
})();
