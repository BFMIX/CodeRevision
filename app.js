const MODULES = [
  {
    id: 1,
    name: "Conducteur",
    url: "https://zerotracas.permisecole.com/qcm-indexSpeMma.php?mma_sId=1",
    icon: "directions_car",
  },
  {
    id: 2,
    name: "Réglementation générale",
    url: "https://zerotracas.permisecole.com/qcm-indexSpeMma.php?mma_sId=2",
    icon: "gavel",
  },
  {
    id: 3,
    name: "Respect de l’environnement",
    url: "https://zerotracas.permisecole.com/qcm-indexSpeMma.php?mma_sId=3",
    icon: "eco",
  },
  {
    id: 4,
    name: "Circulation routière",
    url: "https://zerotracas.permisecole.com/qcm-indexSpeMma.php?mma_sId=4",
    icon: "alt_route",
  },
  {
    id: 5,
    name: "Mécanique",
    url: "https://zerotracas.permisecole.com/qcm-indexSpeMma.php?mma_sId=5",
    icon: "build",
  },
  {
    id: 6,
    name: "Quitter et s’installer dans le véhicule",
    url: "https://zerotracas.permisecole.com/qcm-indexSpeMma.php?mma_sId=6",
    icon: "airline_seat_recline_normal",
  },
  {
    id: 7,
    name: "Premiers secours",
    url: "https://zerotracas.permisecole.com/qcm-indexSpeMma.php?mma_sId=7",
    icon: "medical_services",
  },
  {
    id: 8,
    name: "La route",
    url: "https://zerotracas.permisecole.com/qcm-indexSpeMma.php?mma_sId=8",
    icon: "signpost",
  },
  {
    id: 9,
    name: "Équipements de sécurité",
    url: "https://zerotracas.permisecole.com/qcm-indexSpeMma.php?mma_sId=9",
    icon: "health_and_safety",
  },
  {
    id: 10,
    name: "Autres usagers",
    url: "https://zerotracas.permisecole.com/qcm-indexSpeMma.php?mma_sId=10",
    icon: "groups",
  },
];

const MODULE_VISUALS = {
  1: { bg: "rgba(59,130,246,0.18)", color: "#6ab8ff", border: "rgba(59,130,246,0.34)" },
  2: { bg: "rgba(139,92,246,0.18)", color: "#b99dff", border: "rgba(139,92,246,0.34)" },
  3: { bg: "rgba(16,185,129,0.18)", color: "#62d8a5", border: "rgba(16,185,129,0.34)" },
  4: { bg: "rgba(14,165,233,0.18)", color: "#62d4ff", border: "rgba(14,165,233,0.34)" },
  5: { bg: "rgba(245,158,11,0.18)", color: "#f8ca76", border: "rgba(245,158,11,0.34)" },
  6: { bg: "rgba(248,113,113,0.18)", color: "#fca0a0", border: "rgba(248,113,113,0.34)" },
  7: { bg: "rgba(236,72,153,0.18)", color: "#f79ccc", border: "rgba(236,72,153,0.34)" },
  8: { bg: "rgba(56,189,248,0.18)", color: "#7ad9ff", border: "rgba(56,189,248,0.34)" },
  9: { bg: "rgba(34,197,94,0.18)", color: "#75e1a1", border: "rgba(34,197,94,0.34)" },
  10: { bg: "rgba(244,114,182,0.18)", color: "#f5a6d0", border: "rgba(244,114,182,0.34)" },
};

const ROUTES = ["home", "tests", "progress", "settings"];
const ROUTE_META = {
  home: { kicker: "Session du jour", title: "Tableau de bord" },
  tests: { kicker: "Entraînement", title: "Séries de tests" },
  progress: { kicker: "Suivi", title: "Progression" },
  settings: { kicker: "Préférences", title: "Paramètres" },
};

const PRETEST_STEPS = [
  "Lis bien chaque question jusqu’au bout",
  "Si tu oublies une bonne case, c’est faux ❌",
  "Refais tant que tu dépasses 3 fautes 🔁",
  "Objectif examen : 35/40 💪",
];

const MASCOT_QUESTIONS = ["As-tu terminé le test en entier ?", "As-tu eu au moins 35/40 ?"];

const STORAGE_KEY = "codeRevision.stitch.ui.v1";
const LEGACY_KEY = "codeRevision.local.ui.v2";
const RING_CIRCUMFERENCE = 339.29;

const state = loadState();
let testsQuery = "";
let selectedModuleId = null;
let activeTestModuleId = null;
let pretestStep = 0;
let mascotStep = 0;
let mascotAnswers = [false, false];
let mascotResult = false;
let toastTimer = null;

const views = Array.from(document.querySelectorAll(".view"));
const routeLinks = Array.from(document.querySelectorAll(".route-link[data-route-link]"));

const topbarKicker = document.getElementById("topbar-kicker");
const topbarTitle = document.getElementById("topbar-title");
const headerSettingsBtn = document.getElementById("header-settings-btn");

const homeGreeting = document.getElementById("home-greeting");
const homeSubtitle = document.getElementById("home-subtitle");
const homeProgressText = document.getElementById("home-progress-text");
const homeRingFill = document.getElementById("home-ring-fill");
const homeRingValue = document.getElementById("home-ring-value");
const homeContinueBtn = document.getElementById("home-continue-btn");
const homeActivityMain = document.getElementById("home-activity-main");
const homeActivitySub = document.getElementById("home-activity-sub");
const homeStreak = document.getElementById("home-streak");
const homeLastDate = document.getElementById("home-last-date");

const testsSearch = document.getElementById("tests-search");
const testsMeta = document.getElementById("tests-meta");
const testsModules = document.getElementById("tests-modules");

const progressScoreValue = document.getElementById("progress-score-value");
const progressBadge = document.getElementById("progress-badge");
const progressBarFill = document.getElementById("progress-bar-fill");
const progressMessage = document.getElementById("progress-message");
const progressFraction = document.getElementById("progress-fraction");
const progressList = document.getElementById("progress-list");

const settingsNameInput = document.getElementById("settings-name-input");
const settingsNameSave = document.getElementById("settings-name-save");
const darkmodeToggle = document.getElementById("darkmode-toggle");
const resetProgressBtn = document.getElementById("reset-progress-btn");

const nameModal = document.getElementById("name-modal");
const nameInput = document.getElementById("name-input");
const nameSaveBtn = document.getElementById("name-save-btn");

const pretestModal = document.getElementById("pretest-modal");
const pretestModuleName = document.getElementById("pretest-module-name");
const pretestStepIndex = document.getElementById("pretest-step-index");
const pretestStepCard = document.getElementById("pretest-step-card");
const pretestDots = document.getElementById("pretest-dots");
const pretestCancelBtn = document.getElementById("pretest-cancel-btn");
const pretestNextBtn = document.getElementById("pretest-next-btn");

const mascotModal = document.getElementById("mascot-modal");
const mascotModuleName = document.getElementById("mascot-module-name");
const mascotQuestion = document.getElementById("mascot-question");
const mascotActions = document.getElementById("mascot-actions");
const mascotCloseBtn = document.getElementById("mascot-close-btn");
const mascotFeedback = document.getElementById("mascot-feedback");

const testScreen = document.getElementById("test-screen");
const testBackBtn = document.getElementById("test-back-btn");
const testRefreshBtn = document.getElementById("test-refresh-btn");
const testModuleTitle = document.getElementById("test-module-title");
const testProgressFill = document.getElementById("test-progress-fill");
const testFrame = document.getElementById("test-frame");

const toast = document.getElementById("toast");

initialize();

function initialize() {
  hydrateModules();
  applyTheme(state.darkMode);
  darkmodeToggle.checked = state.darkMode;
  attachEvents();
  renderAll();
  ensureHashRoute();
  syncRoute();
  registerServiceWorker();

  if (!state.userName) {
    openNameModal();
  }
}

function createDefaultState() {
  return {
    userName: "",
    darkMode: true,
    modules: {},
    lastActivity: null,
  };
}

function loadState() {
  const fallback = createDefaultState();
  const currentRaw = localStorage.getItem(STORAGE_KEY);

  if (currentRaw) {
    try {
      const parsed = JSON.parse(currentRaw);
      return {
        userName: typeof parsed.userName === "string" ? parsed.userName : "",
        darkMode: typeof parsed.darkMode === "boolean" ? parsed.darkMode : true,
        modules: parsed.modules && typeof parsed.modules === "object" ? parsed.modules : {},
        lastActivity: parsed.lastActivity || null,
      };
    } catch (_error) {
      return fallback;
    }
  }

  const legacyRaw = localStorage.getItem(LEGACY_KEY);
  if (!legacyRaw) {
    return fallback;
  }

  try {
    const legacy = JSON.parse(legacyRaw);
    return {
      userName: "",
      darkMode:
        typeof legacy.darkMode === "boolean"
          ? legacy.darkMode
          : legacy.theme === "dark" || fallback.darkMode,
      modules: legacy.modules && typeof legacy.modules === "object" ? legacy.modules : {},
      lastActivity: null,
    };
  } catch (_error) {
    return fallback;
  }
}

function persistState() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      userName: state.userName,
      darkMode: state.darkMode,
      modules: state.modules,
      lastActivity: state.lastActivity,
    })
  );
}

function hydrateModules() {
  MODULES.forEach((module) => ensureModuleState(module.id));
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

  routeLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (nameModal.classList.contains("hidden")) {
        return;
      }

      if (!state.userName) {
        openNameModal();
      }
    });
  });

  headerSettingsBtn.addEventListener("click", () => setRoute("settings"));

  homeContinueBtn.addEventListener("click", () => {
    const nextModule = getNextModule();

    if (!nextModule) {
      setRoute("progress");
      return;
    }

    setRoute("tests");
    openPretest(nextModule.id);
  });

  testsSearch.addEventListener("input", () => {
    testsQuery = testsSearch.value.trim();
    renderTests();
  });

  testsModules.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const launchButton = target.closest("[data-action='launch']");
    if (!(launchButton instanceof HTMLElement)) {
      return;
    }

    const moduleId = Number(launchButton.dataset.moduleId);
    if (!Number.isFinite(moduleId)) {
      return;
    }

    openPretest(moduleId);
  });

  settingsNameSave.addEventListener("click", () => {
    saveUserName(settingsNameInput.value);
  });

  darkmodeToggle.addEventListener("change", () => {
    state.darkMode = darkmodeToggle.checked;
    applyTheme(state.darkMode);
    persistState();
    showToast(state.darkMode ? "Mode sombre activé" : "Mode clair activé");
  });

  resetProgressBtn.addEventListener("click", () => {
    const confirmed = window.confirm("Réinitialiser la progression sur cet appareil ?");
    if (!confirmed) {
      return;
    }

    MODULES.forEach((module) => {
      const moduleState = ensureModuleState(module.id);
      moduleState.validated = false;
      moduleState.validatedAt = null;
    });

    state.lastActivity = null;
    persistState();
    renderAll();
    showToast("Progression réinitialisée");
  });

  nameSaveBtn.addEventListener("click", () => {
    saveUserName(nameInput.value, true);
  });

  nameInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      saveUserName(nameInput.value, true);
    }
  });

  pretestCancelBtn.addEventListener("click", closePretest);
  pretestNextBtn.addEventListener("click", handlePretestNext);

  mascotActions.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const answerButton = target.closest("[data-answer]");
    if (!(answerButton instanceof HTMLElement)) {
      return;
    }

    const answer = answerButton.dataset.answer;
    if (!answer) {
      return;
    }

    handleMascotAnswer(answer === "yes");
  });

  mascotCloseBtn.addEventListener("click", () => {
    closeMascotModal();
    setRoute(mascotResult ? "progress" : "tests");
  });

  testBackBtn.addEventListener("click", () => {
    closeTestScreen(true);
  });

  testRefreshBtn.addEventListener("click", refreshTestFrame);

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }

    if (!testScreen.classList.contains("hidden")) {
      closeTestScreen(true);
      return;
    }

    if (!pretestModal.classList.contains("hidden")) {
      closePretest();
    }
  });
}

function saveUserName(rawValue, fromWelcome = false) {
  const cleaned = normalizeUserName(rawValue);

  if (!cleaned) {
    showToast("Ajoute ton prénom pour continuer");
    return;
  }

  state.userName = cleaned;
  persistState();
  renderAll();

  if (fromWelcome) {
    closeNameModal();
  }

  settingsNameInput.value = cleaned;
  showToast(`Bienvenue ${cleaned} !`);
}

function normalizeUserName(value) {
  const trimmed = value.trim().replace(/\s+/g, " ");
  if (!trimmed) {
    return "";
  }

  const lower = trimmed.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

function ensureHashRoute() {
  const route = getRouteFromHash();
  if (!route) {
    setRoute("home", true);
  }
}

function getRouteFromHash() {
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
  const activeRoute = getRouteFromHash() || "home";

  views.forEach((view) => {
    view.classList.toggle("active", view.dataset.view === activeRoute);
  });

  routeLinks.forEach((link) => {
    link.classList.toggle("active", link.dataset.routeLink === activeRoute);
  });

  const routeMeta = ROUTE_META[activeRoute];
  if (routeMeta) {
    topbarKicker.textContent = routeMeta.kicker;
    topbarTitle.textContent = routeMeta.title;
  }
}

function renderAll() {
  renderHome();
  renderTests();
  renderProgress();
  renderSettings();
}

function renderHome() {
  const userName = getUserName();
  const validatedCount = getValidatedCount();
  const progressPercent = getProgressPercent(validatedCount);
  const nextModule = getNextModule();

  homeGreeting.textContent = `Salut ${userName} 👋`;

  if (nextModule) {
    homeSubtitle.textContent = `Prêt pour le prochain thème : ${nextModule.name} ?`;
    homeContinueBtn.textContent = `Reprendre`;
    homeActivityMain.textContent = `Prochain module conseillé : ${nextModule.id}. ${nextModule.name}`;
    homeActivitySub.textContent = "Lance ta prochaine série et garde le rythme.";
  } else {
    homeSubtitle.textContent = "Tu as validé tous les modules, excellent travail.";
    homeContinueBtn.textContent = "Voir ma progression";
    homeActivityMain.textContent = "Tous les modules sont validés";
    homeActivitySub.textContent = "Tu peux relancer des séries pour consolider tes acquis.";
  }

  homeProgressText.textContent = `${progressPercent}% du code complété`;
  homeRingValue.textContent = `${progressPercent}%`;
  homeRingFill.style.strokeDashoffset = String(RING_CIRCUMFERENCE * (1 - progressPercent / 100));

  homeStreak.textContent = String(getStreakDays());
  homeLastDate.textContent = state.lastActivity ? formatDate(state.lastActivity) : "-";
}

function renderTests() {
  testsModules.innerHTML = "";

  const filtered = MODULES.filter((module) =>
    normalizeSearch(`${module.id} ${module.name}`).includes(normalizeSearch(testsQuery))
  );

  testsMeta.textContent = `${filtered.length} module${filtered.length > 1 ? "s" : ""} affiché${filtered.length > 1 ? "s" : ""}`;

  if (filtered.length === 0) {
    const empty = document.createElement("article");
    empty.className = "module-empty";
    empty.textContent = "Aucun module trouvé avec cette recherche.";
    testsModules.appendChild(empty);
    return;
  }

  filtered.forEach((module) => {
    const moduleState = ensureModuleState(module.id);
    const done = moduleState.validated;
    const visual = MODULE_VISUALS[module.id] || MODULE_VISUALS[1];

    const article = document.createElement("article");
    article.className = "module-card";

    article.innerHTML = `
      <div class="module-main">
        <span class="module-icon" style="background:${visual.bg}; color:${visual.color}; border-color:${visual.border};">
          <span class="material-symbols-outlined">${module.icon}</span>
        </span>

        <div class="module-copy">
          <div class="module-state-row">
            <span class="module-badge ${done ? "done" : "todo"}">${done ? "Validé" : "À faire"}</span>
            <span class="module-id">Module ${module.id}</span>
          </div>

          <h4 class="module-title">${module.id}. ${module.name}</h4>
          <p class="module-sub">${
            done && moduleState.validatedAt
              ? `Validé le ${formatDate(moduleState.validatedAt)}`
              : "40 questions • 20 min"
          }</p>
        </div>
      </div>

      <button class="module-launch" type="button" data-action="launch" data-module-id="${module.id}">
        ${done ? "Rejouer" : "Lancer"}
        <span class="material-symbols-outlined">play_arrow</span>
      </button>
    `;

    testsModules.appendChild(article);
  });
}

function renderProgress() {
  progressList.innerHTML = "";

  const userName = getUserName();
  const validatedCount = getValidatedCount();
  const percent = getProgressPercent(validatedCount);

  progressScoreValue.textContent = `${validatedCount}/${MODULES.length}`;
  progressFraction.textContent = `${validatedCount}/${MODULES.length}`;
  progressBarFill.style.width = `${percent}%`;

  if (validatedCount === MODULES.length) {
    progressBadge.textContent = "Objectif atteint";
    progressMessage.textContent = `Bravo ${userName} ! Tous les modules sont validés.`;
  } else if (validatedCount === 0) {
    progressBadge.textContent = "En cours";
    progressMessage.textContent = `On démarre ensemble, ${userName}. L'objectif est proche.`;
  } else {
    progressBadge.textContent = "En cours";
    progressMessage.textContent = `Super ${userName}, encore ${MODULES.length - validatedCount} module${
      MODULES.length - validatedCount > 1 ? "s" : ""
    } à valider.`;
  }

  MODULES.forEach((module) => {
    const moduleState = ensureModuleState(module.id);
    const done = moduleState.validated;
    const visual = MODULE_VISUALS[module.id] || MODULE_VISUALS[1];

    const item = document.createElement("article");
    item.className = "progress-item";

    item.innerHTML = `
      <div class="progress-item-main">
        <span class="progress-item-icon" style="background:${visual.bg}; color:${visual.color};">
          <span class="material-symbols-outlined">${module.icon}</span>
        </span>
        <div>
          <p class="progress-item-title">${module.id}. ${module.name}</p>
          <p class="progress-item-sub">${
            done && moduleState.validatedAt
              ? `Validé le ${formatDate(moduleState.validatedAt)}`
              : "À valider"
          }</p>
        </div>
      </div>
      <span class="progress-dot ${done ? "done" : ""}" aria-hidden="true"></span>
    `;

    progressList.appendChild(item);
  });
}

function renderSettings() {
  settingsNameInput.value = state.userName;
  darkmodeToggle.checked = state.darkMode;
}

function openNameModal() {
  nameModal.classList.remove("hidden");
  nameInput.value = state.userName;
  window.setTimeout(() => {
    nameInput.focus();
  }, 80);
}

function closeNameModal() {
  nameModal.classList.add("hidden");
}

function openPretest(moduleId) {
  const module = MODULES.find((item) => item.id === moduleId);
  if (!module) {
    return;
  }

  selectedModuleId = moduleId;
  pretestStep = 0;
  pretestModuleName.textContent = `${module.id}. ${module.name}`;
  pretestModal.classList.remove("hidden");
  renderPretestStep(true);
}

function closePretest() {
  pretestModal.classList.add("hidden");
}

function renderPretestStep(initial = false) {
  const total = PRETEST_STEPS.length;
  const current = PRETEST_STEPS[pretestStep];

  pretestStepIndex.textContent = `Étape ${pretestStep + 1}/${total}`;

  if (!initial) {
    pretestStepCard.classList.add("step-change");
    window.setTimeout(() => {
      pretestStepCard.textContent = current;
      pretestStepCard.classList.remove("step-change");
    }, 120);
  } else {
    pretestStepCard.textContent = current;
  }

  pretestDots.innerHTML = PRETEST_STEPS.map(
    (_, index) => `<span class="${index === pretestStep ? "active" : ""}"></span>`
  ).join("");

  pretestNextBtn.textContent = pretestStep === total - 1 ? "C’est parti 🚀" : "Suivant";
}

function handlePretestNext() {
  if (pretestStep < PRETEST_STEPS.length - 1) {
    pretestStep += 1;
    renderPretestStep();
    return;
  }

  const moduleId = selectedModuleId;
  closePretest();
  if (moduleId) {
    openTestScreen(moduleId);
  }
}

function openTestScreen(moduleId) {
  const module = MODULES.find((item) => item.id === moduleId);
  if (!module) {
    return;
  }

  activeTestModuleId = moduleId;
  testModuleTitle.textContent = `${module.id}. ${module.name}`;
  testProgressFill.style.width = `${Math.max(10, Math.round((module.id / MODULES.length) * 100))}%`;
  testFrame.src = module.url;

  testScreen.classList.remove("hidden");
  testScreen.setAttribute("aria-hidden", "false");
}

function closeTestScreen(openValidation) {
  const moduleId = activeTestModuleId;

  testScreen.classList.add("hidden");
  testScreen.setAttribute("aria-hidden", "true");
  testFrame.src = "about:blank";
  activeTestModuleId = null;

  if (openValidation && moduleId) {
    openMascotModal(moduleId);
  }
}

function refreshTestFrame() {
  if (!activeTestModuleId) {
    return;
  }

  const module = MODULES.find((item) => item.id === activeTestModuleId);
  if (!module) {
    return;
  }

  testFrame.src = "about:blank";
  window.setTimeout(() => {
    testFrame.src = module.url;
  }, 80);
}

function openMascotModal(moduleId) {
  const module = MODULES.find((item) => item.id === moduleId);
  if (!module) {
    return;
  }

  selectedModuleId = moduleId;
  mascotStep = 0;
  mascotAnswers = [false, false];
  mascotResult = false;

  mascotModuleName.textContent = `Module ${module.id} : ${module.name}`;
  mascotFeedback.textContent = "";
  mascotFeedback.classList.remove("success", "fail");
  mascotActions.classList.remove("hidden");
  mascotCloseBtn.classList.add("hidden");

  renderMascotQuestion();
  mascotModal.classList.remove("hidden");
}

function closeMascotModal() {
  mascotModal.classList.add("hidden");
}

function renderMascotQuestion() {
  mascotQuestion.textContent = MASCOT_QUESTIONS[mascotStep] || "";
}

function handleMascotAnswer(answer) {
  if (!selectedModuleId) {
    return;
  }

  mascotAnswers[mascotStep] = answer;

  if (mascotStep < MASCOT_QUESTIONS.length - 1) {
    mascotStep += 1;
    renderMascotQuestion();
    return;
  }

  const success = mascotAnswers.every(Boolean);
  mascotResult = success;
  const userName = getUserName();

  if (success) {
    const moduleState = ensureModuleState(selectedModuleId);
    moduleState.validated = true;
    moduleState.validatedAt = new Date().toISOString();
    state.lastActivity = moduleState.validatedAt;

    persistState();
    renderAll();

    mascotFeedback.textContent = `Bravo ${userName} !`;
    mascotFeedback.classList.add("success");
    showToast("Module validé");
    mascotCloseBtn.textContent = "Voir ma progression";
  } else {
    const moduleState = ensureModuleState(selectedModuleId);
    if (!moduleState.validated) {
      moduleState.validated = false;
      moduleState.validatedAt = null;
      persistState();
      renderAll();
    }

    mascotFeedback.textContent = `Tu vas l’avoir ${userName} 💪`;
    mascotFeedback.classList.add("fail");
    showToast("Continue, tu progresses");
    mascotCloseBtn.textContent = "Continuer l'entraînement";
  }

  mascotActions.classList.add("hidden");
  mascotCloseBtn.classList.remove("hidden");
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

function getStreakDays() {
  const uniqueDays = Array.from(
    new Set(
      Object.values(state.modules)
        .filter((module) => module && module.validated && module.validatedAt)
        .map((module) => toDayKey(module.validatedAt))
    )
  )
    .filter(Boolean)
    .sort((a, b) => (a > b ? -1 : 1));

  if (uniqueDays.length === 0) {
    return 0;
  }

  let streak = 1;
  for (let index = 1; index < uniqueDays.length; index += 1) {
    const previous = new Date(`${uniqueDays[index - 1]}T00:00:00`);
    const current = new Date(`${uniqueDays[index]}T00:00:00`);
    const diffDays = Math.round((previous.getTime() - current.getTime()) / 86400000);

    if (diffDays !== 1) {
      break;
    }

    streak += 1;
  }

  return streak;
}

function toDayKey(dateInput) {
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getUserName() {
  return state.userName || "pilote";
}

function applyTheme(isDark) {
  document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute("content", isDark ? "#0f172a" : "#f8f8f5");
  }
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.remove("hidden");

  if (toastTimer) {
    window.clearTimeout(toastTimer);
  }

  toastTimer = window.setTimeout(() => {
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

function normalizeSearch(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
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
      // L'application reste utilisable sans cache hors ligne.
    });
  });
}
