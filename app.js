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

const MODULE_ICONS = {
  1: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="7"></circle><circle cx="12" cy="12" r="2"></circle><path d="M12 5v2M12 17v2M5 12h2M17 12h2"></path></svg>',
  2: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h10a2 2 0 0 1 2 2v14l-4-2-4 2-4-2-4 2V6a2 2 0 0 1 2-2h2"></path><path d="M8 8h6M8 12h6"></path></svg>',
  3: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3c4 3 6 5.4 6 8.3A6 6 0 1 1 6 11.3C6 8.4 8 6 12 3Z"></path><path d="M9 14c.9 1 2 1.5 3 1.5s2.1-.5 3-1.5"></path></svg>',
  4: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20c1.5-6 4-9 8-9s6.5 3 8 9"></path><path d="M12 11V4"></path><path d="M12 4l-2 2M12 4l2 2"></path><path d="M12 20v-5"></path></svg>',
  5: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M14 6 6 14"></path><path d="M3 8l3-3 4 4-3 3z"></path><path d="M14 10l7 7-3 3-7-7"></path></svg>',
  6: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="4" width="14" height="16" rx="2"></rect><path d="M9 7h6M9 11h6M12 14v4"></path></svg>',
  7: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="5" width="16" height="14" rx="2"></rect><path d="M12 8v8M8 12h8"></path></svg>',
  8: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4h4v16H6zM14 7h4v13h-4z"></path><path d="M10 8h4"></path></svg>',
  9: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 5 6v5c0 4.2 2.8 8 7 10 4.2-2 7-5.8 7-10V6l-7-3Z"></path><path d="m9.5 12 1.6 1.6 3.4-3.4"></path></svg>',
  10: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="9" r="3"></circle><circle cx="16" cy="9" r="3"></circle><path d="M3 20c.8-3 2.8-5 5-5s4.2 2 5 5"></path><path d="M11 20c.8-2.4 2.4-4 5-4s4.2 1.6 5 4"></path></svg>',
};

const state = loadState();
let selectedModuleId = null;
let iframeModuleId = null;
let testsQuery = "";
let testsFilter = "all";
let toastTimeout = null;

const views = Array.from(document.querySelectorAll(".view"));
const navLinks = Array.from(document.querySelectorAll("[data-route-link]"));

const testsList = document.getElementById("tests-list");
const testsSearch = document.getElementById("tests-search");
const filterChips = Array.from(document.querySelectorAll(".filter-chip"));
const testsResultsMeta = document.getElementById("tests-results-meta");

const progressList = document.getElementById("progress-list");
const homeCount = document.getElementById("home-count");
const homePercent = document.getElementById("home-percent");
const homeContinueBtn = document.getElementById("home-continue-btn");
const homeContinueLabel = document.getElementById("home-continue-label");
const homeNextHint = document.getElementById("home-next-hint");

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
const iframeValidateBtn = document.getElementById("iframe-validate-btn");
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
      darkMode: typeof parsed.darkMode === "boolean" ? parsed.darkMode : parsed.theme === "dark",
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

  testsSearch.addEventListener("input", () => {
    testsQuery = testsSearch.value.trim();
    renderTests();
  });

  filterChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      testsFilter = chip.dataset.filter || "all";
      filterChips.forEach((button) => {
        button.classList.toggle("active", button === chip);
      });
      renderTests();
    });
  });

  homeContinueBtn.addEventListener("click", () => {
    const nextModule = getNextModule();
    if (!nextModule) {
      setRoute("progress");
      return;
    }

    setRoute("tests");
    openPretest(nextModule.id);
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

  iframeValidateBtn.addEventListener("click", () => {
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

    if (checkFinished.checked && checkScore.checked) {
      moduleState.validated = true;
      moduleState.validatedAt = new Date().toISOString();
      persistState();
      renderAll();
      closeValidation();
      showToast("Thème validé");
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
    const confirmed = window.confirm("Supprimer toute ta progression sur cet appareil ?");

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
  const nextModule = getNextModule();

  homeCount.textContent = `${validatedCount}/${MODULES.length}`;
  homePercent.textContent = `${percent}%`;

  if (!nextModule) {
    homeContinueLabel.textContent = "Voir ma progression";
    homeContinueBtn.disabled = false;
    homeNextHint.textContent = "Excellent travail, tous les thèmes sont validés.";
    return;
  }

  homeContinueLabel.textContent = `Continuer : ${nextModule.name}`;
  homeContinueBtn.disabled = false;
  homeNextHint.textContent = "Prochain thème recommandé pour avancer.";
}

function renderTests() {
  testsList.innerHTML = "";

  const filteredModules = MODULES.filter((module) => {
    const moduleState = ensureModuleState(module.id);
    const matchesQuery = normalizedText(module.name).includes(normalizedText(testsQuery));

    if (!matchesQuery) {
      return false;
    }

    if (testsFilter === "done") {
      return moduleState.validated;
    }

    if (testsFilter === "todo") {
      return !moduleState.validated;
    }

    return true;
  });

  testsResultsMeta.textContent = `${filteredModules.length} thème${filteredModules.length > 1 ? "s" : ""} affiché${filteredModules.length > 1 ? "s" : ""}.`;

  if (filteredModules.length === 0) {
    const emptyState = document.createElement("article");
    emptyState.className = "module-card";
    emptyState.innerHTML = `
      <p class="module-title">Aucun thème trouvé</p>
      <p class="module-sub">Essaie un autre mot-clé ou change le filtre.</p>
    `;
    testsList.appendChild(emptyState);
    return;
  }

  filteredModules.forEach((module) => {
    const moduleState = ensureModuleState(module.id);
    const validated = moduleState.validated;

    const card = document.createElement("article");
    card.className = `module-card${validated ? " validated" : ""}`;
    card.dataset.moduleId = module.id;

    const visualStyle = `background: linear-gradient(135deg, var(--brand), var(--accent));`;

    card.innerHTML = `
      <div class="module-visual" style="${visualStyle}">
         <!-- Image will go here later -->
         <span class="module-icon-overlay" aria-hidden="true">${getModuleIcon(module.id)}</span>
      </div>
      <div class="module-content">
        <div class="module-header">
           <span class="badge ${validated ? "ok" : "pending"}">
            ${validated ? "Validé" : "À faire"}
          </span>
          <p class="module-id">Module ${module.id}</p>
        </div>
        <h3 class="module-title">${module.name}</h3>
        <p class="module-sub">Entraînement en 40 questions</p>
        
        <div class="module-actions">
          <button class="btn btn-primary" type="button" data-action="open" data-module-id="${module.id}">Ouvrir le test</button>
          <button class="btn btn-secondary-icon" type="button" data-action="validate" data-module-id="${module.id}" aria-label="Valider ce thème">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </button>
        </div>
      </div>
    `;

    testsList.appendChild(card);
  });
}

function renderProgress() {
  progressList.innerHTML = "";

  const validatedCount = getValidatedCount();
  const percent = getProgressPercent(validatedCount);

  ringFill.style.strokeDashoffset = String(RING_CIRCUMFERENCE * (1 - percent / 100));
  ringPercent.textContent = `${percent}%`;
  ringCount.textContent = `${validatedCount}/${MODULES.length}`;

  progressSummary.textContent =
    validatedCount === 0
      ? "Tu n'as pas encore validé de thème."
      : `${validatedCount} thème${validatedCount > 1 ? "s" : ""} validé${validatedCount > 1 ? "s" : ""}.`;

  MODULES.forEach((module) => {
    const moduleState = ensureModuleState(module.id);
    const validated = moduleState.validated;

    const item = document.createElement("article");
    item.className = `progress-item${validated ? " validated" : ""}`;

    const dateLabel =
      validated && moduleState.validatedAt
        ? `Validé le ${formatDate(moduleState.validatedAt)}`
        : "Pas encore validé";

    item.innerHTML = `
      <div class="progress-top">
        <div class="progress-identity">
          <span class="progress-icon" aria-hidden="true">${getModuleIcon(module.id)}</span>
          <div>
            <p class="progress-title">${module.id}. ${module.name}</p>
            <p class="progress-sub">${dateLabel}</p>
          </div>
        </div>
        <span class="badge ${validated ? "ok" : "pending"}">
          ${validated ? "Validé" : "À faire"}
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

function getNextModule() {
  return (
    MODULES.find((module) => {
      const moduleState = ensureModuleState(module.id);
      return !moduleState.validated;
    }) || null
  );
}

function getModuleIcon(moduleId) {
  return MODULE_ICONS[moduleId] || MODULE_ICONS[1];
}

function normalizedText(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
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
    themeMeta.setAttribute("content", isDark ? "#07101f" : "#f5f7ff");
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

  const isLocalHost =
    window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

  if (isLocalHost) {
    return;
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {
      // L'application reste utilisable même sans cache hors ligne.
    });
  });
}
