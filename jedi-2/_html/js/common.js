$(document).ready(function() {

  $(".reviews__photo").magnificPopup({type:"image"});
  $(".popup-content").magnificPopup();


  $.stellar({
    responsive: true,
    horizontalOffset: 50
  });

  $(".carousel").owlCarousel({
    loop : false,
    responsive :{
      0:{
        items : 1,
        nav : true
      }
    },
    navText : ""
  });


  function wResize() {
    $("header").css("min-height", $(window).height());
  };
  wResize();
  $(window).resize(function() {
    wResize()
  });

  $(".top-line__tab-item").not(":first").hide();
  $(".top-line__tab").click(function() {
    $(".top-line__tab").removeClass("active").eq($(this).index()).addClass("active");
    $(".top-line__tab-item").hide().eq($(this).index()).fadeIn()
  }).eq(0).addClass("active");

  $(".top-tabs__tab-item").not(":first").hide();
  $(".top-tabs__tab").click(function() {
    $(".top-tabs__tab").removeClass("active").eq($(this).index()).addClass("active");
    $(".top-tabs__tab-item").hide().eq($(this).index()).fadeIn()
  }).eq(0).addClass("active");

  $(".contacts__tab-item").not(":first").hide();
  $(".contacts__tab").click(function() {
    $(".contacts__tab").removeClass("active").eq($(this).index()).addClass("active");
    $(".contacts__tab-item").hide().eq($(this).index()).fadeIn()
  }).eq(0).addClass("active");

  $(".footer__tab-item").not(":first").hide();
  $(".footer__tab").click(function() {
    $(".footer__tab").removeClass("active").eq($(this).index()).addClass("active");
    $(".footer__tab-item").hide().eq($(this).index()).fadeIn()
  }).eq(0).addClass("active");

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
  $("form").submit(function(e) {
    e.preventDefault;
    $.ajax({
      type: "POST",
      url: "mail.php",
      data: $(this).serialize()
    }).done(function() {
      alert("Спасибо за заявку!");
      setTimeout(function() {
      }, 1000);
    });
  });

});


$(window).load(function() {
  $(".top-header").animated("fadeInDown","fadeOut");
  $(".top-tabs__wrapper").animated("flipInY","fadeOut");
  $(".services__item").animated("fadeInRight","fadeOut");
  $(".services form").animated("zoomInRight","fadeOut");
  $(".footer").animated("fadeInUp","fadeOut");
});
