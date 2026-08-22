(function () {
  "use strict";

  var saveKey = "galaxyParkArgProgressV1";
  var status = document.getElementById("notice-status");

  function readProgress() {
    try {
      return JSON.parse(localStorage.getItem(saveKey) || "{}");
    } catch (error) {
      return {};
    }
  }

  document.getElementById("enter-site").addEventListener("click", function () {
    var progress = readProgress();
    progress.disclaimerAccepted = true;
    progress.disclaimerAcceptedAt = new Date().toISOString();
    localStorage.setItem(saveKey, JSON.stringify(progress));
    window.location.href = progress.securityFlagged ?
      "archive/security-lock.html" :
      "park/index.html";
  });

  document.getElementById("clear-progress").addEventListener("click", function () {
    localStorage.removeItem(saveKey);
    status.textContent = "本地游玩进度已清除。";
  });
}());
