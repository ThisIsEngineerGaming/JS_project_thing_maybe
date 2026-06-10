// Fills the #imageTrack element with enough clones of #imageSet to cover at least twice the viewport width,
// then continuously scrolls the track leftward at a fixed speed, looping seamlessly by resetting position once
// a full set-width has been scrolled past

let imageTrack = document.getElementById("imageTrack");
let imageSet = document.getElementById("imageSet");

// Clone the image set until the track is wide enough for a seamless loop
while (imageTrack.offsetWidth < window.innerWidth * 2) {
  imageTrack.appendChild(imageSet.cloneNode(true));
}

let imageX = 0;
let imageSpeed = 1;

let resetPoint = imageSet.offsetWidth;

// Moves the track left by imageSpeed pixels each frame; resets position by one set-width to create an infinite loop
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
