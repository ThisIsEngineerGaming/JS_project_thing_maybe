// Fills #scrollTrack with clones of #original until the track is at least twice the viewport width,
// then continuously scrolls it leftward, looping seamlessly once a full original-width has been scrolled past

let track = document.getElementById("scrollTrack");
let original = document.getElementById("original");

if (track && original) {
  // Clone the original element until the track is wide enough for a seamless loop
  while (track.offsetWidth < window.innerWidth * 2) {
    let clone = original.cloneNode(true);
    track.appendChild(clone);
  }

  let x = 0;
  let speed = 2;

  let singleWidth = original.offsetWidth;

  // Moves the track left by speed pixels each frame; resets to 0 once a full original-width has been scrolled past
  function animate() {
    x -= speed;

    if (Math.abs(x) >= singleWidth) {
      x = 0;
    }

    track.style.transform = "translateX(" + x + "px)";

    requestAnimationFrame(animate);
  }

  animate();
}
