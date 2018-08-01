$(document).ready(function() {

  $(".header__button").click(function() {
    $(this).toggleClass("on");
    $(".header__menu").slideToggle();
    return false;
  });

  $(".header__arrow").click(function() {
    $("html, body").animate({ scrollTop: $(".header").height() +250}, "slow");
    return false;
  });

  $(".top").click(function() {
    $("html, body").animate({ scrollTop: 0}, "slow");
    return false;
  });

  $(".assessment .assessment__content .assessment__item").equalHeights();
  $(".assessment__bottom .assessment__item").equalHeights();
  $(".services .services__content .services__item").equalHeights();
  $(".advantages__card").equalHeights();
  $(".contacts__card").equalHeights();

  $(".home__head--advantages").waypoint(function() {
    $(".advantages__card").each(function (index) {
      var ths = $(this);
      setInterval(function () {
        ths.removeClass("advantages__card--off").addClass("advantages__card--on");
      }, 150 * index);
    })
  });

  $(".home__head--contacts").waypoint(function() {
    $(".contacts__card").each(function (index) {
      var ths = $(this);
      setInterval(function () {
        ths.removeClass("contacts__card--off").addClass("contacts__card--on");
      }, 150 * index);
    })
  });

  var waypointsvg = new Waypoint({
    element: $(".about"),
    handler: function(dir) {
      if (dir === "down") {
        $(".about .about__item").each(function(index) {
          var ths = $(this);
          setTimeout(function() {
            var myAnimation = new DrawFillSVG({
              elementId: "about-svg" + index
            });
            ths.children(".about__text").addClass("about__text--on");
          }, 500*index);
        });
      };
      this.destroy();
    },
    offset: '35%'
  });

  $(".reviews__slider").owlCarousel({
    items: 1,
    nav: true,
    navText: "",
    loop: true
  });

  $(".home__head h2, .home__head p").animated("fadeIn");
  $(".assessment__item-wrap").animated("zoomIn");
  $(".services__item-wrap").animated("zoomIn");
  $(".reviews__slider .reviews__slide").animated("fadeIn");

  $(".deal").waypoint(function() {
    $(".deal__item-wrap").each(function (index) {
      var ths = $(this);
      setInterval(function () {
        ths.addClass("on");
      }, 200 * index);
    });
  });

  $(".awards").waypoint(function() {
    $(".awards__item").each(function (index) {
      var ths = $(this);
      setInterval(function () {
        ths.addClass("on");
      }, 200 * index);
    });
  });

  $(".home__bottom .button").click(function() {
    $("#callback h4").html($(this).text());
  }).magnificPopup({
    type:"inline"
  });


  //Цели для Яндекс.Метрики и Google Analytics
  $(".count_element").on("click", (function() {
    ga("send", "event", "goal", "goal");
    yaCounterXXXXXXXX.reachGoal("goal");
    return true;
  }));

  //SVG Fallback
  if (!Modernizr.svg) {
    $("img[src*='svg']").attr("src", function() {
      return $(this).attr("src").replace(".svg", ".png");
    });
  };

  //Аякс отправка форм
  //Документация: http://api.jquery.com/jquery.ajax/
  $("#form").submit(function() {
    $.ajax({
      type: "POST",
      url: "mail.php",
      data: $(this).serialize()
    }).done(function() {
      alert("Спасибо за заявку!");
      setTimeout(function() {

        $("#form").trigger("reset");
      }, 1000);
    });
    return false;
  });

  //Chrome Smooth Scroll
  try {
    $.browserSelector();
    if ($("html").hasClass("chrome")) {
      $.smoothScroll();
    }
  } catch (err) {
  };

  $("img, a").on("dragstart", function(event) { event.preventDefault(); });

});