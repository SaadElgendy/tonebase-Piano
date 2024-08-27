// === HANDLE LESSON SLIDER SECTION v2 ===
$(document).ready(function () {
  console.log("pbl loaded => 06.03");
  // ==============================
  // ==============================
  // ==============================
  // HANDLE BACKGROUND VIDEO
  if ($("#header-bg-video video").length) {
    var video = $("#header-bg-video video")[0];
    video.muted = true;
    video.play();
  }

  // ==============================
  // ==============================
  // ==============================
  // HIDE/SHOW FLOATING CTA BASED ON PRICING VIEWED
  function hideBanner() {
    $("#pbl-banner").fadeOut();
  }

  function showBanner() {
    $("#pbl-banner").fadeIn();
  }

  // ==============================
  // ==============================
  // ==============================
  // HANDLE UVP TAB AUTO PLAY

  // Define vars.
  var tabTimeout;
  clearTimeout(tabTimeout);
  tabLoop();
  var allowLoop = true;

  // Define loop - cycle through all tabs
  function tabLoop() {
    tabTimeout = setTimeout(function () {
      var $next = $(".w-tab-menu.uvp").children(".w--current:first").next();

      if ($next.length && $("input:focus").length == 0) {
        $next.trigger("click"); // click resets timeout, so no need for interval
      } else {
        $(".w-tab-link.uvp:first").trigger("click");
      }
    }, 5500); // 5 second tab loop
  }

  // Stop timeout on input focus and restart timeout on blur
  $("body").on("focus", "textarea, input", function () {
    clearTimeout(tabTimeout);
  });

  $("body").on("blur", "textarea, input", function () {
    if (allowLoop) tabLoop();
  });

  // Stop timeout for iframe elements
  $(window).blur(function () {
    if ($("iframe").is(":focus")) {
      clearTimeout(tabTimeout);
    }
  });

  $(window).focus(function () {
    tabLoop();
  });

  // reset timeout if a tab is clicked
  $(".w-tab-link.uvp").click(function (event) {
    event.preventDefault();

    // Make sure we don't scroll down at the top of the screen
    if (window.scrollY <= 5) {
      window.scrollTo(0, 1);
    }

    clearTimeout(tabTimeout);
    tabLoop();
  });

  // ==============================
  // ==============================
  // ==============================
  // HANDLE CAROUSEL SCROLLING

  $(".pbl-slider-arrow----pseudo.pbl-left").click(function (event) {
    var category = $(this).data("category");
    var element = $(
      ".pbl-slider-left-arrow.pbl-catalog[data-category=" + category + "]"
    );
    $(element).trigger("click");
  });
  $(".pbl-slider-arrow----pseudo.pbl-right").click(function () {
    var category = $(this).data("category");
    var element = $(
      ".pbl-slider-right-arrow.pbl-catalog[data-category=" + category + "]"
    );
    $(element).trigger("click");
  });

  // ==============================
  // ==============================
  // ==============================
  // Organize the carousel sections (tabs)
  var sliderTypes = ["technique", "repertoire", "special-features"];
  $(sliderTypes).each(function (index, item) {
    // ==============================
    // Append the sliders into the carousel
    var sliderId = item + "-slider";
    var sliderDOM = $("#" + sliderId);
    $(".pbl-tab-content-wrapper[data-category=" + item + "]").append(sliderDOM);

    // ==============================
    // Hide the sliders at the start
    $(".pbl-catalog-slider").hide();

    // ==============================
    // Get content for carousel sections

    // Get platform
    var PLATFORM = "general";
    if (window.location.href.indexOf("guitar") > -1) PLATFORM = "guitar";
    if (window.location.href.indexOf("piano") > -1) PLATFORM = "piano";

    function runAfterPersonaExists() {
      // Get persona
      var PERSONA = window.tb_pg && window.tb_pg.storedPersonaValue;

      if (!PERSONA || PERSONA === undefined) {
        setTimeout(runAfterPersonaExists, 2500);
        return;
      }

      if (PERSONA === -1) {
        PERSONA = 3;
      }

      var SERVER_URL = window.location.href.includes("webflow.io")
        ? "//tonebase-api-staging.herokuapp.com/v2/"
        : "//tonebase-api-production.herokuapp.com/v2/";

      // Take action
      // Assemble the URL param
      var API_BASE_URL = SERVER_URL + PLATFORM;
      var REQUEST_URL =
        API_BASE_URL + "/lessons/pbl?persona=" + PERSONA + "&type=" + item;

      // Get slide data
      getData(REQUEST_URL).then(function (data) {
        var lessons = data;

        // Init the indices
        var lessonNumber = 1;
        var carouselNumber = 1;

        // Loop through lessons
        $.each(lessons, function (index, lesson) {
          // Clear the carousel of the default data
          if (index % 3 === 0) {
            if (index !== 0) {
              // Increment carousel number so we know where to append the item
              carouselNumber++;
              console.log("INCREMENTED CAROUSEL NUMBER =>", carouselNumber);
            }
          }

          // Find the current grid we are appending to
          var currentCarouselGrid = $(
            "#" +
              sliderId +
              " .pbl-catalog-slider-slide[aria-label='" +
              carouselNumber +
              " of 4'] .pbl-grid-thirds"
          );

          // Create the lesson DOM
          var lessonDOM = "";
          if (lesson && lesson.slug) {
            var lessonDOM = getLessonDOM(lesson, PLATFORM);
          }

          // Empty the carousel if this is an increment of 3 -- so we don't have the default content
          if (index % 3 === 0) {
            $(currentCarouselGrid).empty();
          }

          // Append lesson DOM to carousel
          if (lessonNumber !== 12) {
            $(currentCarouselGrid).append(lessonDOM);
          }

          // Increment lesson index
          lessonNumber++;
        });
      });
    }
    runAfterPersonaExists();

    // ==============================
    // Show the sliders at the start
    $(".pbl-catalog-slider").show();
  });

  // ==============================
  // ==============================
  // ==============================
  // === DATA FETCHING FUNCTIONS ===
  function getData(url) {
    return $.getJSON(url, function (data) {
      return data;
    });
  }

  // ==============================
  // ==============================
  // ==============================
  // === CREATE LESSON DOM ===
  function getLessonDOM(lesson, platform) {
    // Create the lesson image URL
    var lessonImageURL = `https://tonebase-${
      platform === "guitar" ? "nightingale" : "piano-client"
    }.s3.us-east-2.amazonaws.com/images/lessons/backgrounds/lg/${
      platform === "guitar" ? lesson.slug : lesson.id
    }.jpg`;

    // Add the lessons into the slider
    lessonDOM = `
        <a href="#" class="pbl-card-lightbox-link w-inline-block w-lightbox" id="${
          lesson.slug
        }"
          data-video="${lesson.preview_url}"
        >
          <div class="card">
            <div class="pbl-card-image-wrapper"
              style="width:100%;height:0;padding-top:60%;margin-top:0;position:relative;border-top-right-radius:4px;border-top-left-radius:4px;overflow:hidden;z-index:1;"
            >
              <div class="pbl-card-preview-btn" style="display:inline-block;padding:6px 14px;color:#fff;font-family:'Oswald';font-size:12px;letter-spacing:0.05em;line-height:1.32em;background-color:#333;border-radius:4px;position:absolute;top:12px;right:12px;z-index:2;">PREVIEW</div>
              <div class="pbl-card-image"
                style="background-image:url(${lessonImageURL});background-size:cover;background-position:center;background-repeat:no-repeat;position:absolute;top:0;left:0;right:0;bottom:0;width:100%;height:100%;"
              ></div>
            </div>
            <div class="pbl-card-body pbl-lesson-preview">
              <h6 class="pbl-h6 pbl-text-bold preview-lesson-text" style="max-width:85%;">${
                lesson.title
              }</h6>
              <h6 class="pbl-h6 preview-lesson-text" style="margin-top:4px;">by ${lesson.artist_slug
                .replace(/([A-ZÃ‡]+)/g, " $1")
                .trim()}</h6>
            </div>
          </div>
          <script type="application/json" class="w-json"></script>
        </a>
      `;

    return lessonDOM;
  }

  // ==============================
  // ==============================
  // ==============================
  // === LIGHTBOX OPEN FUNCTIONALITY ===
  $(".pbl-catalog-slider").on(
    "click",
    ".pbl-card-lightbox-link",
    function (event) {
      event.preventDefault();

      // Get the video info.
      var video = $(this).data("video");

      // Construct + append the DOM
      if (video) {
        var iframeWrapper = `
      <div class="iframeWrapper" style="position:fixed;top:0;left:0;right:0;bottom:0;z-index:9999999999;width: 100%;width:100vw;height:100%;height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;">
        <!-- IFRAME -->
        <iframe style="z-index:2;max-width:100%;" class="embedly-embed" src="//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fplayer.vimeo.com%2Fvideo%2F${video}%3Fapp_id%3D122963&dntp=1&url=https%3A%2F%2Fvimeo.com%2F${video}&key=96f1f04c5f4143bcb0f2e68c87d65feb&type=text%2Fhtml&schema=vimeo" width="940" height="529" scrolling="no" frameborder="0" allow="autoplay; fullscreen" allowfullscreen="true"></iframe>
        <!-- CLOSE ICON -->
        <div class="w-lightbox-control w-lightbox-close" onClick="$('.iframeWrapper').remove()" style="z-index:3"></div>
        <!-- CLOSE -->
        <div class="closeWrapper" onClick="$('.iframeWrapper').remove()" style="position:absolute;top:0;left:0;right:0;bottom:0;z-index:1;width: 100%;height:100%;background-color:rgba(0,0,0,0.85);"></div>
        <!-- UPGRADE -->
        <div class="lightbox-cta-wrapper" style="z-index:999;max-width:90%;">
          <a class="pbl-button pbl-button-large pbl-button-block-mobile w-button" onClick="$('.iframeWrapper').remove()" href="#pricing">Unlock Full Lesson &rarr;</a>
        </div>
      </div>
    `;
        //  <span class="">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        //   <a class="pbl-button pbl-button-off pbl-button-large pbl-button-block-mobile w-button" href="https://app.tonebase.co/guitar/lessons?utm_source=webpage&utm_medium=landing_pages&utm_campaign=pbl_v2" target="_blank">See All Lessons</a>

        $("body").append(iframeWrapper);
      }
    }
  );

  // ==============================
  // ==============================
  // ==============================
  // === INTERSECTION OBSERVER FOR ANALYTICS ===
  var observer = new IntersectionObserver(
    function (entries) {
      // isIntersecting is true when element and viewport are overlapping
      // isIntersecting is false when element and viewport don't overlap
      if (entries[0].isIntersecting === true) {
        // Hide floating CTA if pricing is in view
        hideBanner();
        if (window.analytics)
          window.analytics.track("pbl_pricing_scrolled_into_view");
      } else {
        // Show floating CTA if pricing leaves view
        showBanner();
      }
    },
    { threshold: [0] }
  );
  observer.observe(document.querySelector("#pricing"));
});
