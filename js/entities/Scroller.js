let track = document.getElementById("scrollTrack");
let original = document.getElementById("original");

if (track && original) {
  while (track.offsetWidth < window.innerWidth * 2) {
    let clone = original.cloneNode(true);
    track.appendChild(clone);
  }

  let x = 0;
  let speed = 2;

  let singleWidth = original.offsetWidth;

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
