(function () {
  "use strict";

  var saveKey = "galaxyParkArgProgressV1";
  var status = document.querySelector("[data-thanks-status]");

  document.querySelector("[data-thanks-reset]").addEventListener("click", function () {
    localStorage.removeItem(saveKey);
    window.location.href = "/ARGgame/galaxy-park-arg/galaxy-park-arg.html";
  });

  document.querySelector("[data-thanks-back]").addEventListener("click", function () {
    if (document.referrer && document.referrer.indexOf("/archive/ending-") !== -1) {
      history.back();
      return;
    }
    try {
      var progress = JSON.parse(localStorage.getItem(saveKey) || "{}");
      var destination = {
        neutral: "archive/ending-neutral.html",
        good: "archive/ending-good.html",
        bad: "archive/ending-bad-epilogue.html"
      }[progress.finalChoice];
      if (destination) {
        window.location.href = destination;
        return;
      }
    } catch (error) {}
    status.textContent = "未找到上一页结局记录。";
  });
}());
