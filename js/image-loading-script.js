var loadingImage = $("#pbl-free-lesson-1-image").attr("src");
$(window).scroll(function (event) {
  checkImage(window, "scroll");
});
$("body").mousemove(function (event) {
  checkImage("body", "mousemove");
});
function checkImage(selector, event) {
  var currentImage = $("#pbl-free-lesson-1-image").attr("src");
  if (loadingImage !== currentImage) {
    $(".fl-card").css("filter", "none");
    $(selector).off(event);
  }
}