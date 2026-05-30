let imageTrack = document.getElementById("imageTrack");
let imageSet = document.getElementById("imageSet");

while (imageTrack.offsetWidth < window.innerWidth * 2) {
  imageTrack.appendChild(imageSet.cloneNode(true));
}

let imageX = 0;
let imageSpeed = 1;

let resetPoint = imageSet.offsetWidth;

function animateImages() {
  imageX -= imageSpeed;

  if (Math.abs(imageX) >= resetPoint) {
    imageX += resetPoint;
  }

  imageTrack.style.transform =
    "translateX(" + imageX + "px)";

  requestAnimationFrame(animateImages);
}

animateImages();
