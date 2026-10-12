
const body = document.body;

const themeBtn = document.getElementById("themeBtn");
const weatherBtn = document.getElementById("weatherBtn");
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");

themeBtn.addEventListener("click", () => {
  body.classList.toggle("night");

  themeBtn.textContent = body.classList.contains("night")
    ? "☀️"
    : "🌙";
});

menuBtn.addEventListener("click", () => {
  nav.classList.toggle("open");
});

nav.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
  });
});

const weatherModes = [
  { name: "rain", icon: "🌧️" },
  { name: "sakura", icon: "🌸" },
  { name: "autumn", icon: "🍂" },
  { name: "snow", icon: "❄️" },
  { name: "storm", icon: "⛈️" }
];

let currentWeather = 0;

weatherBtn.addEventListener("click", () => {
  currentWeather = (currentWeather + 1) % weatherModes.length;

  const weather = weatherModes[currentWeather];

  body.dataset.weather = weather.name;
  weatherBtn.textContent = weather.icon;

  createParticles();
});

// Scroll reveal animation using Intersection Observer
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12
});

document.querySelectorAll(".reveal").forEach(element => {
  observer.observe(element);
});

// Snow, sakura and autumn particles
const snowLayer = document.getElementById("snowLayer");

function createParticles() {
  snowLayer.innerHTML = "";

  const weather = body.dataset.weather || "rain";

  const symbols = {
    snow: "❄",
    sakura: "🌸",
    autumn: "🍂"
  };

  const symbol = symbols[weather];

  if (!symbol) return;

  const count = window.innerWidth < 700 ? 15 : 30;

  for (let i = 0; i < count; i++) {
    const particle = document.createElement("span");

    particle.className = "snowflake";
    particle.textContent = symbol;

    particle.style.left = Math.random() * 100 + "%";
    particle.style.fontSize = 9 + Math.random() * 12 + "px";
    particle.style.animationDuration =
      8 + Math.random() * 14 + "s";
    particle.style.animationDelay =
      -Math.random() * 15 + "s";

    particle.style.setProperty(
      "--drift",
      Math.random() * 140 - 70 + "px"
    );

    snowLayer.appendChild(particle);
  }
}

createParticles();

// Animated weather using HTML canvas
const canvas = document.getElementById("weatherCanvas");
const ctx = canvas.getContext("2d");

let width;
let height;
let particles = [];

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;

  width = canvas.width = window.innerWidth * ratio;
  height = canvas.height = window.innerHeight * ratio;

  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";

  particles = Array.from({ length: 80 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    speed: 1 + Math.random() * 2,
    size: 1 + Math.random() * 2,
    alpha: 0.2 + Math.random() * 0.5
  }));
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function animateWeather() {
  ctx.clearRect(0, 0, width, height);

  const weather = body.dataset.weather || "rain";
  const ratio = window.devicePixelRatio || 1;

  particles.forEach(particle => {
    ctx.globalAlpha = particle.alpha;

    if (weather === "snow") {
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();

      ctx.arc(
        particle.x,
        particle.y,
        particle.size * ratio,
        0,
        Math.PI * 2
      );

      ctx.fill();

      particle.y += particle.speed * 0.6;
      particle.x += Math.sin(particle.y * 0.01) * 0.5 * ratio;
    } else if (weather === "sakura" || weather === "autumn") {
      ctx.fillStyle = weather === "sakura" ? "#ef9fc5" : "#d9a05d";

      ctx.beginPath();
      ctx.ellipse(
        particle.x,
        particle.y,
        particle.size * 2 * ratio,
        particle.size * ratio,
        particle.y * 0.01,
        0,
        Math.PI * 2
      );
      ctx.fill();

      particle.y += particle.speed * ratio;
      particle.x += Math.sin(particle.y * 0.01) * ratio;
    } else {
      ctx.strokeStyle =
        weather === "storm" ? "#8fb8d7" : "#8bd3e0";

      ctx.lineWidth = ratio;
      ctx.beginPath();

      ctx.moveTo(particle.x, particle.y);
      ctx.lineTo(
        particle.x - 2 * ratio,
        particle.y + 9 * ratio
      );

      ctx.stroke();

      particle.y += particle.speed * 4 * ratio;
      particle.x -= particle.speed * 0.6 * ratio;
    }

    if (particle.y > height) {
      particle.y = -10;
      particle.x = Math.random() * width;
    }

    if (particle.x < 0) {
      particle.x = width;
    }
  });

  ctx.globalAlpha = 1;
  requestAnimationFrame(animateWeather);
}

animateWeather();
