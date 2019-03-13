(function($) {
  var $window = $(window),
    $body = $("body"),
    $wrapper = $("#wrapper"),
    $header = $("#header"),
    $footer = $("#footer"),
    $main = $("#main"),
    $main_articles = $main.children("article");

  // Breakpoints.
  breakpoints({
    xlarge: ["1281px", "1680px"],
    large: ["981px", "1280px"],
    medium: ["737px", "980px"],
    small: ["481px", "736px"],
    xsmall: ["361px", "480px"],
    xxsmall: [null, "360px"]
  });

  // Play initial animations on page load.
  $window.on("load", function() {
    window.setTimeout(function() {
      $body.removeClass("is-preload");
    }, 100);
  });

  // Fix: Flexbox min-height bug on IE.
  if (browser.name == "ie") {
    var flexboxFixTimeoutId;

    $window
      .on("resize.flexbox-fix", function() {
        clearTimeout(flexboxFixTimeoutId);

        flexboxFixTimeoutId = setTimeout(function() {
          if ($wrapper.prop("scrollHeight") > $window.height())
            $wrapper.css("height", "auto");
          else $wrapper.css("height", "100vh");
        }, 250);
      })
      .triggerHandler("resize.flexbox-fix");
  }

  // MENU BUTTON
  const toggleMenu = () => {
    // Toggle the "menu--open" class on your menu refence.
    menu.classList.toggle("menu--open");
  };

  const menu = document.querySelector(".menu");

  const menuButton = document.querySelector(".menu-button");

  menuButton.addEventListener("click", function() {
    toggleMenu();
  });

  //LOGO
  TweenMax.to($(".logo"), 40, {
    css: {
      rotation: 360
    },

    ease: Linear.easeNone,
    repeat: -1,
    paused: false
  });

  // Nav.
  var $nav = $header.children("nav"),
    $nav_li = $nav.find("li");

  // Add "middle" alignment classes if we're dealing with an even number of items.
  if ($nav_li.length % 2 == 0) {
    $nav.addClass("use-middle");
    $nav_li.eq($nav_li.length / 2).addClass("is-middle");
  }

  // Main.
  var delay = 325,
    locked = false;

  // Methods.
  $main._show = function(id, initial) {
    var $article = $main_articles.filter("#" + id);

    // No such article? Bail.
    if ($article.length == 0) return;

    // Handle lock.

    // Already locked? Speed through "show" steps w/o delays.
    if (locked || (typeof initial != "undefined" && initial === true)) {
      // Mark as switching.
      $body.addClass("is-switching");

      // Mark as visible.
      $body.addClass("is-article-visible");

      // Deactivate all articles (just in case one's already active).
      $main_articles.removeClass("active");

      // Hide header, footer.
      $header.hide();
      $footer.hide();

      // Show main, article.
      $main.show();
      $article.show();

      // Activate article.
      $article.addClass("active");

      // Unlock.
      locked = false;

      // Unmark as switching.
      setTimeout(
        function() {
          $body.removeClass("is-switching");
        },
        initial ? 1000 : 0
      );

      return;
    }

    // Lock.
    locked = true;

    // Article already visible? Just swap articles.
    if ($body.hasClass("is-article-visible")) {
      // Deactivate current article.
      var $currentArticle = $main_articles.filter(".active");

      $currentArticle.removeClass("active");

      // Show article.
      setTimeout(function() {
        // Hide current article.
        $currentArticle.hide();

        // Show article.
        $article.show();

        // Activate article.
        setTimeout(function() {
          $article.addClass("active");

          // Window stuff.
          $window.scrollTop(0).triggerHandler("resize.flexbox-fix");

          // Unlock.
          setTimeout(function() {
            locked = false;
          }, delay);
        }, 25);
      }, delay);
    }

    // Otherwise, handle as normal.
    else {
      // Mark as visible.
      $body.addClass("is-article-visible");

      // Show article.
      setTimeout(function() {
        // Hide header, footer.
        $header.hide();
        $footer.hide();

        // Show main, article.
        $main.show();
        $article.show();

        // Activate article.
        setTimeout(function() {
          $article.addClass("active");

          // Window stuff.
          $window.scrollTop(0).triggerHandler("resize.flexbox-fix");

          // Unlock.
          setTimeout(function() {
            locked = false;
          }, delay);
        }, 25);
      }, delay);
    }
  };

  $main._hide = function(addState) {
    var $article = $main_articles.filter(".active");

    // Article not visible? Bail.
    if (!$body.hasClass("is-article-visible")) return;

    if (typeof addState != "undefined" && addState === true)
      history.pushState(null, null, "#");

    if (locked) {
      $body.addClass("is-switching");

      $article.removeClass("active");

      $article.hide();
      $main.hide();

      $footer.show();
      $header.show();

      // Unmark as visible.
      $body.removeClass("is-article-visible");

      // Unlock.
      locked = false;

      // Unmark as switching.
      $body.removeClass("is-switching");

      // Window stuff.
      $window.scrollTop(0).triggerHandler("resize.flexbox-fix");

      return;
    }

    locked = true;

    $article.removeClass("active");

    setTimeout(function() {
      $article.hide();
      $main.hide();

      $footer.show();
      $header.show();

      setTimeout(function() {
        $body.removeClass("is-article-visible");

        $window.scrollTop(0).triggerHandler("resize.flexbox-fix");

        setTimeout(function() {
          locked = false;
        }, delay);
      }, 25);
    }, delay);
  };

  $main_articles.each(function() {
    var $this = $(this);

    $('<div class="close">Close</div>')
      .appendTo($this)
      .on("click", function() {
        location.hash = "";
      });

    $this.on("click", function(event) {
      event.stopPropagation();
    });
  });

  $body.on("click", function(event) {
    // Article visible? Hide.
    if ($body.hasClass("is-article-visible")) $main._hide(true);
  });

  $window.on("keyup", function(event) {
    switch (event.keyCode) {
      case 27:
        if ($body.hasClass("is-article-visible")) $main._hide(true);

        break;

      default:
        break;
    }
  });

  $window.on("hashchange", function(event) {
    if (location.hash == "" || location.hash == "#") {
      event.preventDefault();
      event.stopPropagation();

      $main._hide();
    } else if ($main_articles.filter(location.hash).length > 0) {
      event.preventDefault();
      event.stopPropagation();

      $main._show(location.hash.substr(1));
    }
  });

  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  else {
    var oldScrollPos = 0,
      scrollPos = 0,
      $htmlbody = $("html,body");

    $window
      .on("scroll", function() {
        oldScrollPos = scrollPos;
        scrollPos = $htmlbody.scrollTop();
      })
      .on("hashchange", function() {
        $window.scrollTop(oldScrollPos);
      });
  }

  $main.hide();
  $main_articles.hide();

  if (location.hash != "" && location.hash != "#")
    $window.on("load", function() {
      $main._show(location.hash.substr(1), true);
    });
})(jQuery);
