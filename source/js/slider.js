'use strict';

$(document).ready(function () {
  $('.concert-halls__slideshow').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    asNavFor: '.concert-halls__slider',
  });

  $('.concert-halls__slider').slick({
    asNavFor: '.concert-halls__slideshow',
    slidesToShow: 1,
    slidesToScroll: 1,
    variableWidth: true,
    infinite: false,
  });
});
