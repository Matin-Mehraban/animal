const effectHost = document.getElementById("meteor-layer");
const menuToggle = document.querySelector(".menu-toggle");
const menuBackdrop = document.querySelector(".menu-backdrop");
const headerActions = document.querySelector(".header-actions");
const menuLinks = document.querySelectorAll(".header-actions a");

let rainLoopTimer = null;
let rainBurstTimer = null;
const activeDrops = new Set();

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function randomInt(min, max) {
  return Math.floor(randomBetween(min, max + 1));
}

function createDrop(isHero = false) {
  if (!effectHost) return;

  const drop = document.createElement("div");
  drop.className = "meteor-js";
  activeDrops.add(drop);

  const width = isHero ? randomBetween(160, 220) : randomBetween(110, 170);
  const height = isHero ? randomBetween(2.2, 2.8) : randomBetween(1.6, 2.2);
  const startTop = randomBetween(-180, -20);
  const startRight = randomBetween(0, window.innerWidth);
  const travelY = isHero
    ? randomBetween(window.innerHeight * 0.95, window.innerHeight * 1.15)
    : randomBetween(window.innerHeight * 0.9, window.innerHeight * 1.08);
  const duration = isHero ? randomBetween(1700, 2300) : randomBetween(1900, 2800);
  const fadeStart = duration * 0.8;

  drop.style.top = `${startTop}px`;
  drop.style.right = `${startRight}px`;
  drop.style.width = `${width}px`;
  drop.style.height = `${height}px`;
  drop.style.transform = "translate3d(0, 0, 0) rotate(90deg)";
  drop.style.transition = `transform ${duration}ms linear, opacity 220ms ease-out`;

  if (isHero) {
    drop.style.setProperty("--meteor-core", "rgba(255,255,255,1)");
    drop.style.setProperty("--meteor-mid", "rgba(188,170,255,0.82)");
    drop.style.setProperty("--meteor-tail", "rgba(136,112,255,0.24)");
    drop.style.setProperty(
      "--meteor-glow",
      "0 0 10px rgba(173,148,255,0.32), 0 0 24px rgba(173,148,255,0.22), 0 0 40px rgba(173,148,255,0.14)"
    );
  }

  effectHost.appendChild(drop);

  const startTimer = window.setTimeout(() => {
    drop.style.opacity = "1";
    drop.style.transform = `translate3d(0, ${travelY}px, 0) rotate(90deg)`;
  }, 20);

  const fadeTimer = window.setTimeout(() => {
    drop.style.opacity = isHero ? "0.14" : "0";
  }, fadeStart);

  const removeTimer = window.setTimeout(() => {
    activeDrops.delete(drop);
    drop.remove();
    window.clearTimeout(startTimer);
    window.clearTimeout(fadeTimer);
    window.clearTimeout(removeTimer);
  }, duration + 260);
}

function createRainBurst() {
  const count = randomInt(2, 4);

  for (let i = 0; i < count; i += 1) {
    const delay = i * randomBetween(90, 160);
    const heroChance = Math.random() < 0.14;

    window.setTimeout(() => {
      createDrop(heroChance);
    }, delay);
  }
}

function scheduleNextRain() {
  createRainBurst();
  const nextDelay = randomBetween(420, 760);
  rainBurstTimer = window.setTimeout(scheduleNextRain, nextDelay);
}

function startRainLoop() {
  stopRainLoop();
  createRainBurst();
  rainLoopTimer = window.setTimeout(scheduleNextRain, 420);
}

function stopRainLoop() {
  if (rainLoopTimer) {
    window.clearTimeout(rainLoopTimer);
    rainLoopTimer = null;
  }

  if (rainBurstTimer) {
    window.clearTimeout(rainBurstTimer);
    rainBurstTimer = null;
  }

  activeDrops.forEach((drop) => drop.remove());
  activeDrops.clear();
}

function openMenu() {
  document.body.classList.add("menu-open");
  if (menuToggle) {
    menuToggle.setAttribute("aria-expanded", "true");
  }
}

function closeMenu() {
  document.body.classList.remove("menu-open");
  if (menuToggle) {
    menuToggle.setAttribute("aria-expanded", "false");
  }
}

function toggleMenu() {
  if (document.body.classList.contains("menu-open")) {
    closeMenu();
  } else {
    openMenu();
  }
}

if (menuToggle) {
  menuToggle.addEventListener("click", toggleMenu);
}

if (menuBackdrop) {
  menuBackdrop.addEventListener("click", closeMenu);
}

menuLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

window.addEventListener("resize", () => {
  if (window.innerWidth >= 768) {
    closeMenu();
  }
});

if (headerActions) {
  headerActions.addEventListener("click", (event) => {
    event.stopPropagation();
  });
}

startRainLoop();

window.addEventListener("beforeunload", stopRainLoop);
window.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    stopRainLoop();
  } else {
    startRainLoop();
  }
});