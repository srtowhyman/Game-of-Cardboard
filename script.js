const cards = document.querySelectorAll(".game-card");
const navLinks = [...document.querySelectorAll(".nav-link")];
const pagePanels = [...document.querySelectorAll("[data-page-panel]")];
const welcomeGate = document.querySelector("[data-welcome-gate]");
const welcomeEnter = document.querySelector("[data-welcome-enter]");
const welcomeSeenKey = "gameOfCardboardIntroSeen";
let welcomeIntroReady = false;

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

function showPage(pageName, shouldPush = true) {
  const target = pagePanels.find((panel) => panel.dataset.pagePanel === pageName) || pagePanels[0];
  if (!target) return;

  document.documentElement.dataset.page = target.dataset.pagePanel;

  pagePanels.forEach((panel) => {
    panel.classList.toggle("active", panel === target);
  });

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.dataset.page === target.dataset.pagePanel);
  });

  target.scrollTop = 0;
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  window.scrollTo(0, 0);
  requestAnimationFrame(() => {
    target.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo(0, 0);
  });

  if (shouldPush) {
    history.pushState({ page: target.dataset.pagePanel }, "", `#${target.dataset.pagePanel}`);
  }
}

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    showPage(link.dataset.page);
  });
});

window.addEventListener("popstate", () => {
  const page = location.hash.replace("#", "") || "inicio";
  showPage(page, false);
});

showPage("inicio", false);
history.replaceState({ page: "inicio" }, "", "#inicio");

function closeWelcomeGate() {
  if (!welcomeGate) return;
  sessionStorage.setItem(welcomeSeenKey, "true");
  welcomeGate.classList.add("is-hidden");
  welcomeGate.setAttribute("aria-hidden", "true");
  showPage("inicio", false);
  history.replaceState({ page: "inicio" }, "", "#inicio");
}

function initWelcomeGate() {
  if (!welcomeGate) return;

  if (sessionStorage.getItem(welcomeSeenKey) === "true") {
    welcomeIntroReady = true;
    welcomeGate.classList.add("is-hidden");
    welcomeGate.setAttribute("aria-hidden", "true");
    return;
  }

  setTimeout(() => {
    welcomeIntroReady = true;
    welcomeEnter?.focus();
  }, 5350);
  welcomeEnter?.addEventListener("click", closeWelcomeGate);

  document.addEventListener("keydown", (event) => {
    const canClose = event.key === "Escape" || event.key === "Enter";
    if (canClose && welcomeIntroReady && !welcomeGate.classList.contains("is-hidden")) {
      closeWelcomeGate();
    }
  });
}

initWelcomeGate();

cards.forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 8;
    const rotateX = ((y / rect.height) - 0.5) * -8;
    card.style.transform = `translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
});
