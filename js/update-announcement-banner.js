function replaceBannerText() {
  // Grabs ?promo_bar_text=X or &promo_bar_text=X
  var passedText = window.tb_pg && window.tb_pg.getUrlParam && window.tb_pg.getUrlParam("promo_bar_text");
  passedText = passedText && passedText.length ? decodeURIComponent(passedText) + " " : null;
  if (passedText) $(".announcement-bar-text .pbl-text-white").text(passedText);
}

$(function() {
  if (window.tb_pg) replaceBannerText();
  else setTimeout(replaceBannerText, 1000);
});