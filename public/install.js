/************************************************************************

App setup

*************************************************************************/
// force https
if (location.protocol === "http:") location.protocol = "https:";

// handle the service worker registration
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("service-worker.js")
    .then((reg) => console.log("Service Worker registered", reg))
    .catch((err) => console.error("Service Worker **not** registered", err));
} else {
  console.warn("Service Worker not supported in this browser");
}

/************************************************************************

Set a few booleans, detect install

*************************************************************************/
// Set isInstalledPWA if we're in app mode 😎
const isInstalledPWA = window.matchMedia("(display-mode: standalone)").matches;
// Check the user agent for iOS & Android (only for minor fixes — don't rely on user agent!)
const isIOS = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
const isAndroid = /android/i.test(navigator.userAgent);

// add a helper class for ".show-for-installed" and ".show-for-browser"
function showInstalledBlocks() {
  if (!isInstalledPWA) {
    document.querySelectorAll(".show-for-browser").forEach((el) => {
      el.style.display = "block";
    });
    document.querySelectorAll(".show-for-installed").forEach((el) => {
      el.style.display = "none";
    });
  } else {
    document.querySelectorAll(".show-for-browser").forEach((el) => {
      el.style.display = "none";
    });
    document.querySelectorAll(".show-for-installed").forEach((el) => {
      el.style.display = "block";
    });
  }
}

let installPrompt = null;

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  installPrompt = event;
  installButton.removeAttribute("hidden");
});

const installButton = document.getElementsByClassName('install')[0];

installButton.addEventListener("click", async () => {
  if (!installPrompt) {
    return;
  }
  const result = await installPrompt.prompt();
  console.log(`Install prompt was: ${result.outcome}`);
  installPrompt = null;
  installButton.setAttribute("hidden", "");
});

showInstalledBlocks();

/************************************************************************

Feature: Install reminder

*************************************************************************/
// figure out if we should show the install nudges
const installNudge = document.querySelector("#install-nudge");
const closeButton = document.getElementById("close-button");
const hideBanner = localStorage.getItem("hide-install-nudge");

function handleCloseButton() {
  localStorage.setItem("hide-install-nudge", true);
  installNudge.style.display = "none";
}

if (!isInstalledPWA && installNudge && !hideBanner) {
  installNudge.style.display = "block";
  closeButton.addEventListener("click", handleCloseButton);
} else {
  installNudge.style.display = "none";
}

/************************************************************************

Feature: Orientation changes

*************************************************************************/

// just an example of what can be done detecting orientation
// sets up helper classes `.show-for-portrait` and `.show-for-landscape`
// also good for taking video fullscreen, moving nav elements, etc.
// note: most desktop browsers always say "landscape"
function showOrientationBlocks() {
  if (
    screen.orientation.type == "portrait-primary" ||
    screen.orientation.type == "portrait-secondary" // this means "upside down" lol
  ) {
    document.querySelectorAll(".show-for-portrait").forEach((el) => {
      el.style.display = "block";
    });
    document.querySelectorAll(".show-for-landscape").forEach((el) => {
      el.style.display = "none";
    });
  } else if (
    screen.orientation.type == "landscape-primary" ||
    screen.orientation.type == "landscape-secondary" // upsie downsies again
  ) {
    document.querySelectorAll(".show-for-portrait").forEach((el) => {
      el.style.display = "none";
    });
    document.querySelectorAll(".show-for-landscape").forEach((el) => {
      el.style.display = "block";
    });
  }
}

// fix for iPhone zoom issues after orientation changes
// see: http://www.menucool.com/McMenu/prevent-page-content-zooming-on-mobile-orientation-change
function rotateWithNoScale() {
  let viewport = document.querySelector("meta[name=viewport]");
  if (viewport) {
    let content = viewport.getAttribute("content");
    viewport.setAttribute("content", content + ", maximum-scale=1.0");
    setTimeout(function () {
      viewport.setAttribute("content", content);
    }, 100);
  }
}

// actually detect the orientation changes and reapply
screen.orientation.addEventListener("change", function (e) {
  if (isIOS) {
    rotateWithNoScale();
  }
  showOrientationBlocks();
});

// show/hide orientation classes
showOrientationBlocks();
