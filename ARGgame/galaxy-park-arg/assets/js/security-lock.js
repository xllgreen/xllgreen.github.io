(function () {
  "use strict";

  try {
    var progress = JSON.parse(localStorage.getItem("galaxyParkArgProgressV1") || "{}");
    if (progress.securityFlagged) {
      window.location.replace("/ARGgame/galaxy-park-arg/archive/security-lock.html");
    }
  } catch (error) {}
}());
