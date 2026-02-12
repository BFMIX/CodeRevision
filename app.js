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

const ROUTES = ["home", "tests", "progress", "settings"];
const STORAGE_KEY = "codeRevision.local.ui.v2";
const RING_CIRCUMFERENCE = 326.73;

const state = loadState();
let selectedModuleId = null;
let iframeModuleId = null;
let toastTimeout = null;

const views = Array.from(document.querySelectorAll(".view"));
const navLinks = Array.from(document.querySelectorAll("[data-route-link]"));
const testsList = document.getElementById("tests-list");
const progressList = document.getElementById("progress-list");
const homeCount = document.getElementById("home-count");
const homePercent = document.getElementById("home-percent");

const ringFill = document.getElementById("ring-fill");
const ringPercent = document.getElementById("ring-percent");
const ringCount = document.getElementById("ring-count");
const progressSummary = document.getElementById("progress-summary");

const darkModeToggle = document.getElementById("darkmode-toggle");
const resetBtn = document.getElementById("reset-btn");

const pretestModal = document.getElementById("pretest-modal");
const pretestModuleName = document.getElementById("pretest-module-name");
const cancelPretestBtn = document.getElementById("cancel-pretest-btn");
const startTestBtn = document.getElementById("start-test-btn");

const iframeScreen = document.getElementById("iframe-screen");
const iframeBackBtn = document.getElementById("iframe-back-btn");
const iframeScreenTitle = document.getElementById("iframe-screen-title");
const moduleIframe = document.getElementById("module-iframe");

const validationModal = document.getElementById("validation-modal");
const validationForm = document.getElementById("validation-form");
const cancelValidationBtn = document.getElementById("cancel-validation-btn");
const checkFinished = document.getElementById("check-finished");
const checkScore = document.getElementById("check-score");
const validationFeedback = document.getElementById("validation-feedback");

const toast = document.getElementById("toast");

initialize();

function initialize() {
  hydrateModules();
  applyTheme(state.darkMode);
  darkModeToggle.checked = state.darkMode;
  attachEvents();
  renderAll();
  ensureHashRoute();
  syncRoute();
  registerServiceWorker();
}

function createDefaultState() {
  return {
    darkMode: false,
    modules: {},
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
      darkMode:
        typeof parsed.darkMode === "boolean"
          ? parsed.darkMode
          : parsed.theme === "dark",
      modules: parsed.modules || {},
    };
  } catch (_error) {
    return fallback;
  }
}

function persistState() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      darkMode: state.darkMode,
      modules: state.modules,
    })
  );
}

function hydrateModules() {
  MODULES.forEach((module) => {
    ensureModuleState(module.id);
  });
  persistState();
}

function ensureModuleState(moduleId) {
  const key = String(moduleId);
  const current = state.modules[key];

  if (!current || typeof current !== "object") {
    state.modules[key] = {
      validated: false,
      validatedAt: null,
    };
    return state.modules[key];
  }

  state.modules[key] = {
    validated: Boolean(current.validated),
    validatedAt: current.validatedAt || null,
  };

  return state.modules[key];
}

function attachEvents() {
  window.addEventListener("hashchange", syncRoute);

  testsList.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const actionElement = target.closest("[data-action]");
    if (!(actionElement instanceof HTMLElement)) {
      return;
    }

    const moduleId = Number(actionElement.dataset.moduleId);
    if (!Number.isFinite(moduleId)) {
      return;
    }

    const action = actionElement.dataset.action;
    if (action === "open") {
      openPretest(moduleId);
    }

    if (action === "validate") {
      openValidation(moduleId);
    }
  });

  cancelPretestBtn.addEventListener("click", closePretest);
  startTestBtn.addEventListener("click", () => {
    if (!selectedModuleId) {
      return;
    }
    closePretest();
    openIframeScreen(selectedModuleId);
  });

  iframeBackBtn.addEventListener("click", () => {
    const moduleId = iframeModuleId;
    closeIframeScreen();
    if (moduleId) {
      openValidation(moduleId);
    }
  });

  cancelValidationBtn.addEventListener("click", closeValidation);

  validationForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!selectedModuleId) {
      return;
    }

    const moduleState = ensureModuleState(selectedModuleId);

    if (checkScore.checked) {
      moduleState.validated = true;
      moduleState.validatedAt = new Date().toISOString();
      persistState();
      renderAll();
      closeValidation();
      showToast("Module validé ✅");
      setRoute("progress");
      return;
    }

    if (!moduleState.validated) {
      moduleState.validated = false;
      moduleState.validatedAt = null;
      persistState();
      renderAll();
    }

    validationFeedback.textContent = "Tu peux le refaire 💪";
  });

  darkModeToggle.addEventListener("change", () => {
    state.darkMode = darkModeToggle.checked;
    applyTheme(state.darkMode);
    persistState();
    showToast(state.darkMode ? "Mode sombre activé" : "Mode clair activé");
  });

  resetBtn.addEventListener("click", () => {
    const confirmed = window.confirm(
      "Supprimer toute ta progression locale ?"
    );

    if (!confirmed) {
      return;
    }

    localStorage.removeItem(STORAGE_KEY);
    state.modules = {};
    hydrateModules();
    renderAll();
    showToast("Progression réinitialisée");
  });

  pretestModal.addEventListener("click", (event) => {
    if (event.target === pretestModal) {
      closePretest();
    }
  });

  validationModal.addEventListener("click", (event) => {
    if (event.target === validationModal) {
      closeValidation();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }

    if (!iframeScreen.classList.contains("hidden")) {
      const moduleId = iframeModuleId;
      closeIframeScreen();
      if (moduleId) {
        openValidation(moduleId);
      }
      return;
    }

    if (!pretestModal.classList.contains("hidden")) {
      closePretest();
      return;
    }

    if (!validationModal.classList.contains("hidden")) {
      closeValidation();
    }
  });
}

function ensureHashRoute() {
  const route = routeFromHash();
  if (!route) {
    setRoute("home", true);
  }
}

function routeFromHash() {
  const raw = window.location.hash.replace(/^#\/?/, "").split("?")[0];
  return ROUTES.includes(raw) ? raw : null;
}

function setRoute(route, replace = false) {
  const normalized = ROUTES.includes(route) ? route : "home";
  const target = `#/${normalized}`;

  if (replace) {
    window.history.replaceState(null, "", target);
    syncRoute();
    return;
  }

  if (window.location.hash !== target) {
    window.location.hash = target;
  } else {
    syncRoute();
  }
}

function syncRoute() {
  const activeRoute = routeFromHash() || "home";

  views.forEach((view) => {
    view.classList.toggle("active", view.dataset.view === activeRoute);
  });

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.dataset.routeLink === activeRoute);
  });
}

function renderAll() {
  renderHome();
  renderTests();
  renderProgress();
}

function renderHome() {
  const validatedCount = getValidatedCount();
  const percent = getProgressPercent(validatedCount);

  homeCount.textContent = `${validatedCount}/${MODULES.length}`;
  homePercent.textContent = `${percent}%`;
}

function renderTests() {
  testsList.innerHTML = "";

  MODULES.forEach((module) => {
    const moduleState = ensureModuleState(module.id);
    const validated = moduleState.validated;

    const card = document.createElement("article");
    card.className = `module-card${validated ? " validated" : ""}`;

    card.innerHTML = `
      <div class="module-top">
        <div>
          <p class="module-title">${module.id}. ${module.name}</p>
          <p class="module-sub">Test officiel intégré en iframe.</p>
        </div>
        <span class="badge ${validated ? "ok" : "pending"}">
          ${validated ? "✅ validé" : "⏳ à faire"}
        </span>
      </div>
      <div class="module-actions">
        <button class="btn btn-primary" type="button" data-action="open" data-module-id="${module.id}">Ouvrir le test</button>
        <button class="btn btn-secondary" type="button" data-action="validate" data-module-id="${module.id}">Valider ce module</button>
      </div>
    `;

    testsList.appendChild(card);
  });
}

function renderProgress() {
  progressList.innerHTML = "";

  const validatedCount = getValidatedCount();
  const percent = getProgressPercent(validatedCount);

  ringFill.style.strokeDashoffset = String(
    RING_CIRCUMFERENCE * (1 - percent / 100)
  );
  ringPercent.textContent = `${percent}%`;
  ringCount.textContent = `${validatedCount}/${MODULES.length}`;

  progressSummary.textContent =
    validatedCount === 0
      ? "Aucun module validé pour l'instant."
      : `${validatedCount} module${validatedCount > 1 ? "s" : ""} validé${validatedCount > 1 ? "s" : ""}.`;

  MODULES.forEach((module) => {
    const moduleState = ensureModuleState(module.id);
    const validated = moduleState.validated;

    const item = document.createElement("article");
    item.className = `progress-item${validated ? " validated" : ""}`;

    const dateLabel = validated && moduleState.validatedAt
      ? `Validé le ${formatDate(moduleState.validatedAt)}`
      : "Pas encore validé";

    item.innerHTML = `
      <div class="progress-top">
        <div>
          <p class="progress-title">${module.id}. ${module.name}</p>
          <p class="progress-sub">${dateLabel}</p>
        </div>
        <span class="badge ${validated ? "ok" : "pending"}">
          ${validated ? "✅ validé" : "⏳ à faire"}
        </span>
      </div>
    `;

    progressList.appendChild(item);
  });
}

function getValidatedCount() {
  return MODULES.reduce((count, module) => {
    const moduleState = ensureModuleState(module.id);
    return count + (moduleState.validated ? 1 : 0);
  }, 0);
}

function getProgressPercent(validatedCount) {
  return Math.round((validatedCount / MODULES.length) * 100);
}

function openPretest(moduleId) {
  const module = MODULES.find((item) => item.id === moduleId);
  if (!module) {
    return;
  }

  selectedModuleId = moduleId;
  pretestModuleName.textContent = `${module.id}. ${module.name}`;
  pretestModal.classList.remove("hidden");
}

function closePretest() {
  pretestModal.classList.add("hidden");
}

function openIframeScreen(moduleId) {
  const module = MODULES.find((item) => item.id === moduleId);
  if (!module) {
    return;
  }

  iframeModuleId = moduleId;
  iframeScreenTitle.textContent = `${module.id}. ${module.name}`;
  moduleIframe.src = module.url;
  iframeScreen.classList.remove("hidden");
  iframeScreen.setAttribute("aria-hidden", "false");
}

function closeIframeScreen() {
  iframeScreen.classList.add("hidden");
  iframeScreen.setAttribute("aria-hidden", "true");
  moduleIframe.src = "about:blank";
  iframeModuleId = null;
}

function openValidation(moduleId) {
  selectedModuleId = moduleId;
  checkFinished.checked = false;
  checkScore.checked = false;
  validationFeedback.textContent = "";
  validationModal.classList.remove("hidden");
}

function closeValidation() {
  validationModal.classList.add("hidden");
}

function applyTheme(isDark) {
  document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");

  const themeMeta = document.querySelector('meta[name="theme-color"]');
  if (themeMeta) {
    themeMeta.setAttribute("content", isDark ? "#090d18" : "#f5f7ff");
  }
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.remove("hidden");

  if (toastTimeout) {
    window.clearTimeout(toastTimeout);
  }

  toastTimeout = window.setTimeout(() => {
    toast.classList.add("hidden");
  }, 2200);
}

function formatDate(input) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(input));
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {
      // Application utilisable sans cache offline.
    });
  });
}
