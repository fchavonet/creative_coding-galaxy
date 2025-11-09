/*********************
* RESPONSIVE WARNING *
*********************/

const responsiveWarning = document.getElementById("responsive-warning");
// "true" if the site is optimized for responsive design, "false" if not.
const responsiveDesign = true;

// Show mobile warning if the user is on mobile and responsive-design is false.
if (!responsiveDesign && window.innerWidth <= 768) {
  responsiveWarning.classList.add("show");
}


/***********************
* MODE TOGGLE BEHAVIOR *
***********************/

// Get elements that change with the mode.
const toggleModeBtn = document.getElementById("toggle-mode-btn");
const portfolioLink = document.getElementById("portfolio-link");
const body = document.body;

let currentMode = "light-mode";

// Function to apply mode.
function applyMode(mode) {
  body.classList.remove("light-mode", "dark-mode");
  body.classList.add(mode);

  currentMode = mode;

  if (mode === "dark-mode") {
    // Set dark mode styles.
    toggleModeBtn.style.color = "rgb(245, 245, 245)";
    toggleModeBtn.innerHTML = '<i class="bi bi-sun-fill"></i>';

    portfolioLink.style.color = "rgb(245, 245, 245)";

    responsiveWarning.style.backgroundColor = "rgb(2, 4, 8)";
  } else {
    // Set light mode styles.
    toggleModeBtn.style.color = "rgb(2, 4, 8)";
    toggleModeBtn.innerHTML = '<i class="bi bi-moon-stars-fill"></i>';

    portfolioLink.style.color = "rgb(2, 4, 8)";

    responsiveWarning.style.backgroundColor = "rgb(245, 245, 245)";
  }
}

// Check and apply saved mode on page load
let savedMode = localStorage.getItem("mode");

if (savedMode === null) {
  savedMode = "light-mode"; // Default mode.
}
applyMode(savedMode);

// Toggle mode and save preference.
toggleModeBtn.addEventListener("click", function () {
  let newMode;

  if (body.classList.contains("light-mode")) {
    newMode = "dark-mode";
  } else {
    newMode = "light-mode";
  }

  applyMode(newMode);

  // Save choice.
  localStorage.setItem("mode", newMode);
});


/******************
* GALAXY BEHAVIOR *
******************/

// Array to store all star data.
let stars = [];
let totalStars = 8000;
let galaxyArms = 3;
let coreRadius = 25;

// Setup the canvas and initialize the galaxy.
function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();
  blendMode(ADD);

  // Generate individual stars.
  for (let i = 0; i < totalStars; i++) {
    let armIndex = floor(random(galaxyArms));

    // Define base angle and distance from core.
    let baseAngle = armIndex * (TWO_PI / galaxyArms) + random(-0.25, 0.25);
    let distanceFromCore = coreRadius + pow(random(), 0.5) * (500 - coreRadius);
    baseAngle += distanceFromCore * 0.025;

    // Define depth and motion parameters.
    let depthZ = random(-90, 90) * pow(1 - distanceFromCore / 600, 1.5);
    let angularSpeed = map(distanceFromCore, 0, 600, 0.0045, 0.0006);
    let inwardSpeed = map(distanceFromCore, 0, 600, 0, 0.05);

    // Define color and size based on position.
    let hue = random(190, 280);
    let saturation = random(50, 100);
    let brightness = map(distanceFromCore, 0, 600, 100, 30);
    let starSize = map(random(), 0, 1, 0.2, 1.2);

    // Store star data.
    stars.push({
      distanceFromCore,
      baseAngle,
      depthZ,
      hue,
      saturation,
      brightness,
      angularSpeed,
      inwardSpeed,
      starSize,
    });
  }
}

// Draw and animate the galaxy.
function draw() {
  // Set the background depending on the current mode.
  if (currentMode === "dark-mode") {
    background(0, 0, 0, 20);
  } else {
    background(0, 0, 100, 20);
  }

  ambientLight(255);

  // Adjust camera position and angle.
  translate(0, 0, 150);
  rotateX(PI / 3.5);

  // Enable additive blending for glowing effect.
  blendMode(ADD);
  colorMode(HSB, 360, 100, 100, 100);

  // Draw each star.
  for (let star of stars) {
    let x = cos(star.baseAngle) * star.distanceFromCore;
    let y = sin(star.baseAngle) * star.distanceFromCore;

    // Add depth and twinkle effects.
    let depthFade = map(star.depthZ, -90, 90, 0.3, 1);
    let twinkle = 0.8 + 0.2 * sin(frameCount * 0.03 + star.distanceFromCore * 0.01);

    push();
    translate(x, y, star.depthZ);

    // Adjust star color depending on the current mode.
    if (currentMode === "dark-mode") {
      fill(star.hue, star.saturation, star.brightness * twinkle, 100 * depthFade);
    } else {
      fill(30, 80, 60 * twinkle, 100 * depthFade);
    }

    sphere(star.starSize * depthFade);
    pop();

    // Update star position and rotation.
    star.baseAngle -= star.angularSpeed;
    star.distanceFromCore -= star.inwardSpeed * 0.05;

    // Reset stars that reach the galactic core.
    if (star.distanceFromCore < coreRadius) {
      star.distanceFromCore = random(500, 600);
      star.baseAngle = random(TWO_PI);
    }
  }

  // Restore normal blend and color modes for core rendering.
  blendMode(BLEND);
  colorMode(RGB, 255);

  // Draw the galactic core.
  push();
  noStroke();

  // Adjust core color depending on the mode.
  if (currentMode === "dark-mode") {
    fill(255, 255, 255, 255);
  } else {
    fill(0, 0, 0, 255);
  }

  sphere(25);
  pop();
}

// Adjust the canvas size dynamically on window resize.
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
