const MODULES = [
  {
    id: 1,
    name: "Conducteur",
    url: "https://zerotracas.permisecole.com/qcm-indexSpeMma.php?mma_sId=1",
  },
  {
    id: 2,
    name: "Réglementation générale",
    url: "https://zerotracas.permisecole.com/qcm-indexSpeMma.php?mma_sId=2",
  },
  {
    id: 3,
    name: "Respect de l’environnement",
    url: "https://zerotracas.permisecole.com/qcm-indexSpeMma.php?mma_sId=3",
  },
  {
    id: 4,
    name: "Circulation routière",
    url: "https://zerotracas.permisecole.com/qcm-indexSpeMma.php?mma_sId=4",
  },
  {
    id: 5,
    name: "Mécanique",
    url: "https://zerotracas.permisecole.com/qcm-indexSpeMma.php?mma_sId=5",
  },
  {
    id: 6,
    name: "Quitter et s’installer dans le véhicule",
    url: "https://zerotracas.permisecole.com/qcm-indexSpeMma.php?mma_sId=6",
  },
  {
    id: 7,
    name: "Premiers secours",
    url: "https://zerotracas.permisecole.com/qcm-indexSpeMma.php?mma_sId=7",
  },
  {
    id: 8,
    name: "La route",
    url: "https://zerotracas.permisecole.com/qcm-indexSpeMma.php?mma_sId=8",
  },
  {
    id: 9,
    name: "Équipements de sécurité",
    url: "https://zerotracas.permisecole.com/qcm-indexSpeMma.php?mma_sId=9",
  },
  {
    id: 10,
    name: "Autres usagers",
    url: "https://zerotracas.permisecole.com/qcm-indexSpeMma.php?mma_sId=10",
  },
];

const STORAGE_KEY = "codeRevision.pwa.state.v1";

const state = loadState();
let selectedModuleId = null;
let iframeModuleId = null;

const views = Array.from(document.querySelectorAll(".view"));
const navButtons = Array.from(document.querySelectorAll(".nav-btn"));
const testsList = document.getElementById("tests-list");
const progressList = document.getElementById("progress-list");
const progressSummary = document.getElementById("progress-summary");
const homeValidatedCount = document.getElementById("home-validated-count");
const homeProgressPercent = document.getElementById("home-progress-percent");
const homeStreak = document.getElementById("home-streak");

const pretestModal = document.getElementById("pretest-modal");
const cancelPretestBtn = document.getElementById("cancel-pretest-btn");
const startPretestBtn = document.getElementById("start-pretest-btn");

const iframeOverlay = document.getElementById("iframe-overlay");
const closeIframeBtn = document.getElementById("close-iframe-btn");
const testIframe = document.getElementById("test-iframe");
const iframeTitle = document.getElementById("iframe-title");

const validationModal = document.getElementById("validation-modal");
const validationForm = document.getElementById("validation-form");
const validationFinished = document.getElementById("validation-finished");
const validationScore = document.getElementById("validation-score");
const validationMessage = document.getElementById("validation-message");
const cancelValidationBtn = document.getElementById("cancel-validation-btn");

const themeToggle = document.getElementById("theme-toggle");
const resetProgressBtn = document.getElementById("reset-progress-btn");
const toast = document.getElementById("toast");

init();

function init() {
  applyTheme(state.theme || "light");
  themeToggle.checked = state.theme === "dark";
  attachEvents();
  renderAll();
  registerServiceWorker();
}

function createDefaultState() {
  return {
    theme: "light",
    modules: {},
    totalValidated: 0,
    streak: {
      count: 0,
      lastValidationDate: null,
    },
  };
}

function loadState() {
  const fallback = createDefaultState();
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(raw);
    return {
      ...fallback,
      ...parsed,
      modules: {
        ...fallback.modules,
        ...(parsed.modules || {}),
      },
      streak: {
        ...fallback.streak,
        ...(parsed.streak || {}),
      },
    };
  } catch (_error) {
    return fallback;
  }
}

function saveState() {
  state.totalValidated = computeTotalValidated();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function attachEvents() {
  navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activateView(button.dataset.target);
    });
  });

  testsList.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    if (target.matches("[data-action='open']")) {
      const moduleId = Number(target.dataset.moduleId);
      openPretestModal(moduleId);
    }

    if (target.matches("[data-action='validate']")) {
      const moduleId = Number(target.dataset.moduleId);
      openValidationModal(moduleId);
    }
  });

  cancelPretestBtn.addEventListener("click", closePretestModal);
  startPretestBtn.addEventListener("click", () => {
    if (!selectedModuleId) {
      return;
    }
    closePretestModal();
    openIframe(selectedModuleId);
  });

  closeIframeBtn.addEventListener("click", () => {
    const moduleId = iframeModuleId;
    closeIframe();
    if (moduleId) {
      openValidationModal(moduleId);
    }
  });

  cancelValidationBtn.addEventListener("click", closeValidationModal);
  validationForm.addEventListener("submit", handleValidationSubmit);

  themeToggle.addEventListener("change", () => {
    const nextTheme = themeToggle.checked ? "dark" : "light";
    state.theme = nextTheme;
    applyTheme(nextTheme);
    saveState();
    showToast("Thème mis à jour");
  });

  resetProgressBtn.addEventListener("click", () => {
    const accepted = window.confirm(
      "Confirmer la réinitialisation ? Toute ta progression locale sera supprimée."
    );

    if (!accepted) {
      return;
    }

    localStorage.removeItem(STORAGE_KEY);
    const freshState = createDefaultState();
    state.modules = freshState.modules;
    state.totalValidated = freshState.totalValidated;
    state.streak = freshState.streak;
    state.theme = freshState.theme;
    themeToggle.checked = false;
    applyTheme("light");
    saveState();
    renderAll();
    showToast("Progression réinitialisée");
  });
}

function activateView(viewName) {
  views.forEach((view) => {
    view.classList.toggle("active", view.dataset.view === viewName);
  });

  navButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.target === viewName);
  });
}

function renderAll() {
  renderTests();
  renderProgress();
  renderHome();
}

function renderTests() {
  testsList.innerHTML = "";

  MODULES.forEach((module) => {
    const moduleState = getModuleState(module.id);
    const card = document.createElement("article");
    card.className = "module-card";

    const statusClass = moduleState.validated ? "ok" : "pending";
    const statusText = moduleState.validated ? "✅ validé" : "⏳ à faire";

    card.innerHTML = `
      <div class="module-header">
        <div>
          <p class="module-title">${module.id}. ${module.name}</p>
          <p class="muted">Module officiel intégré via iframe.</p>
        </div>
        <span class="badge ${statusClass}">${statusText}</span>
      </div>
      <div class="module-actions">
        <button type="button" data-action="open" data-module-id="${module.id}">Ouvrir le test</button>
        <button type="button" class="ghost-btn" data-action="validate" data-module-id="${module.id}">Valider ce module</button>
      </div>
    `;

    testsList.appendChild(card);
  });
}

function renderProgress() {
  progressList.innerHTML = "";

  const validatedTotal = computeTotalValidated();
  const percent = Math.round((validatedTotal / MODULES.length) * 100);

  progressSummary.textContent = `${validatedTotal}/${MODULES.length} validés - ${percent}%`;

  MODULES.forEach((module) => {
    const moduleState = getModuleState(module.id);
    const item = document.createElement("article");
    item.className = "progress-item";

    const statusClass = moduleState.validated ? "ok" : "pending";
    const statusText = moduleState.validated ? "✅ validé" : "⏳ à faire";
    const dateText = moduleState.validatedAt
      ? `Validé le ${formatDate(moduleState.validatedAt)}`
      : "Pas encore validé";

    item.innerHTML = `
      <div class="progress-header">
        <div>
          <p class="progress-title">${module.id}. ${module.name}</p>
          <p class="validation-date">${dateText}</p>
        </div>
        <span class="badge ${statusClass}">${statusText}</span>
      </div>
    `;

    progressList.appendChild(item);
  });
}

function renderHome() {
  const validatedTotal = computeTotalValidated();
  const percent = Math.round((validatedTotal / MODULES.length) * 100);

  homeValidatedCount.textContent = `${validatedTotal}/${MODULES.length}`;
  homeProgressPercent.textContent = `${percent}%`;
  homeStreak.textContent = String(state.streak.count || 0);
}

function getModuleState(moduleId) {
  const key = String(moduleId);
  if (!state.modules[key]) {
    state.modules[key] = {
      validated: false,
      validatedAt: null,
    };
  }
  return state.modules[key];
}

function computeTotalValidated() {
  return MODULES.reduce((count, module) => {
    const moduleState = state.modules[String(module.id)];
    return count + (moduleState && moduleState.validated ? 1 : 0);
  }, 0);
}

function openPretestModal(moduleId) {
  selectedModuleId = moduleId;
  pretestModal.classList.remove("hidden");
}

function closePretestModal() {
  pretestModal.classList.add("hidden");
}

function openIframe(moduleId) {
  const module = MODULES.find((item) => item.id === moduleId);
  if (!module) {
    return;
  }

  iframeModuleId = moduleId;
  iframeTitle.textContent = `${module.id}. ${module.name}`;
  testIframe.src = module.url;
  iframeOverlay.classList.remove("hidden");
  iframeOverlay.setAttribute("aria-hidden", "false");
}

function closeIframe() {
  iframeOverlay.classList.add("hidden");
  iframeOverlay.setAttribute("aria-hidden", "true");
  testIframe.src = "about:blank";
  iframeModuleId = null;
}

function openValidationModal(moduleId) {
  selectedModuleId = moduleId;
  validationFinished.checked = false;
  validationScore.checked = false;
  validationMessage.textContent = "";
  validationModal.classList.remove("hidden");
}

function closeValidationModal() {
  validationModal.classList.add("hidden");
}

function handleValidationSubmit(event) {
  event.preventDefault();

  if (!selectedModuleId) {
    return;
  }

  const moduleState = getModuleState(selectedModuleId);

  if (validationFinished.checked && validationScore.checked) {
    const now = new Date();

    moduleState.validated = true;
    moduleState.validatedAt = now.toISOString();
    updateStreak(now);

    saveState();
    renderAll();
    closeValidationModal();
    showToast("Module validé ✅");
    activateView("progress");
    return;
  }

  if (!moduleState.validated) {
    moduleState.validated = false;
    moduleState.validatedAt = null;
  }
  saveState();
  renderAll();
  validationMessage.textContent = "entraîne-toi encore, tu vas l’avoir 💪";
}

function updateStreak(validationDate) {
  const today = toDateKey(validationDate);
  const lastDate = state.streak.lastValidationDate;

  if (!lastDate) {
    state.streak.count = 1;
    state.streak.lastValidationDate = today;
    return;
  }

  if (lastDate === today) {
    return;
  }

  const previousDay = new Date(validationDate);
  previousDay.setDate(previousDay.getDate() - 1);

  if (lastDate === toDateKey(previousDay)) {
    state.streak.count += 1;
    state.streak.lastValidationDate = today;
    return;
  }

  state.streak.count = 1;
  state.streak.lastValidationDate = today;
}

function toDateKey(dateInput) {
  const date = new Date(dateInput);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDate(isoDate) {
  const date = new Date(isoDate);
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const themeColor = theme === "dark" ? "#0b1220" : "#fffaf2";
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  if (themeMeta) {
    themeMeta.setAttribute("content", themeColor);
  }
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.remove("hidden");

  window.setTimeout(() => {
    toast.classList.add("hidden");
  }, 2400);
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {
      // L'app reste utilisable sans service worker.
    });
  });
}
