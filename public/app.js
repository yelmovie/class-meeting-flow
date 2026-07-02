(() => {
  "use strict";

  const SCHEMA_VERSION = 4;
  const APP_VERSION = "2026.06.13-static-mvp";
  const DB_NAME = "class-meeting-flow-db";
  const DB_VERSION = 1;
  const SNAPSHOT_KEY = "class-meeting-current-snapshot-v4";
  const SETTINGS_KEY = "class-meeting-settings-v4";

  const asset = (folder, name) => `./assets/${folder}/${name}`;

  const ASSETS = {
    backgrounds: [
      asset("backgrounds", "bg-1.jpg"),
      asset("backgrounds", "bg-2.jpg"),
      asset("backgrounds", "bg-3.jpg"),
      asset("backgrounds", "bg-4.jpg"),
      asset("backgrounds", "bg-5.jpg"),
      asset("backgrounds", "bg-6.jpg")
    ],
    characters: {
      rabbit: asset("icons/discuss", "1.png"),
      plannerRabbit: asset("icons/discuss", "6.png"),
      fox: asset("icons/discuss", "14.png"),
      squirrel: asset("icons/discuss", "30.png"),
      owl: asset("icons/discuss", "24.png"),
      penguin: asset("icons/discuss", "51.png"),
      koala: asset("icons/discuss", "74.png")
    },
    icons: {
      clipboard: asset("icons/discuss", "3.png"),
      pencil: asset("icons/discuss", "5.png"),
      megaphone: asset("icons/discuss", "8.png"),
      check: asset("icons/discuss", "53.png"),
      x: asset("icons/discuss", "54.png"),
      pause: asset("icons/discuss", "55.png"),
      chart: asset("icons/discuss", "56.png"),
      lock: asset("icons/discuss", "52.png"),
      question: asset("icons/discuss", "46.png"),
      hands: asset("icons/discuss", "22.png"),
      heart: asset("icons/discuss", "35.png"),
      target: asset("icons/discuss", "43.png"),
      calendar: asset("icons", "calendar.png"),
      report: asset("icons/discuss", "59.png"),
      plane: asset("icons/discuss", "64.png"),
      board: asset("icons/discuss", "75.png"),
      megaphoneBig: asset("icons/discuss", "44.png"),
      mail: asset("icons/discuss", "57.png")
    }
  };

  const SOUNDS = {
    click: { path: asset("sound/sfx", "freesound_community-ui-click-43196.mp3"), volume: 0.5 },
    open: { path: asset("sound/sfx", "litupsubway-ui-open-sfx-513358.mp3"), volume: 0.55 },
    reward: { path: asset("sound/sfx", "freesound_community-badge-coin-win-14675.mp3"), volume: 0.6 },
    success: { path: asset("sound/sfx", "meldix-success-340660.mp3"), volume: 0.7 },
    fail: { path: asset("sound/sfx", "floraphonic-brass-fail-7-a-207129.mp3"), volume: 0.45 }
  };

  const ACTION_SOUNDS = {
    "add-opinion": "reward",
    "like-opinion": "reward",
    "save-report": "success",
    "timer-start": "open",
    "select-topic": "open",
    "delete-opinion": "fail"
  };

  const audioCache = {};

  function playSound(name) {
    try {
      if (!state.meeting.soundEnabled || !SOUNDS[name]) return;
      if (!audioCache[name]) {
        audioCache[name] = new Audio(SOUNDS[name].path);
        audioCache[name].preload = "auto";
      }
      const node = audioCache[name].cloneNode();
      node.volume = SOUNDS[name].volume;
      node.play().catch(() => {});
    } catch (error) {
      console.warn("sound skipped", error);
    }
  }

  const PAGES = [
    { id: "main", title: "학급회의 시간", subtitle: "30분 안에 의견, 토론, 투표, 결정, 회의록까지 이어가는 초등 심화 학급회의 도구", theme: "#19a78d", bg: ASSETS.backgrounds[0] },
    { id: "page_01_meeting_prepare", step: 1, short: "시작", title: "회의 준비 입력", subtitle: "안건과 문제 상황을 초등 심화 수준으로 정리합니다.", theme: "#159f84", bg: ASSETS.backgrounds[0], mascot: ASSETS.characters.rabbit },
    { id: "page_02_flow_setup", step: 2, short: "설정", title: "회의 흐름 설정", subtitle: "회의 단계, 역할, 결정 기준을 먼저 정합니다.", theme: "#6d50dc", bg: ASSETS.backgrounds[1], mascot: ASSETS.characters.plannerRabbit },
    { id: "page_03_start_guide", step: 3, short: "의견", title: "회의 시작 안내", subtitle: "목표와 규칙을 확인하고 30분 회의를 시작합니다.", theme: "#2372df", bg: ASSETS.backgrounds[2], mascot: ASSETS.characters.fox },
    { id: "page_04_reflection", step: 4, short: "정리", title: "지난 회의 실천 반성", subtitle: "잘했는지보다 왜 그랬는지 분석합니다.", theme: "#e54b79", bg: ASSETS.backgrounds[2], mascot: asset("icons/discuss", "23.png") },
    { id: "page_05_opinion_board", step: 5, short: "의견 게시판", title: "의견 게시판", subtitle: "의견은 이유와 걱정되는 점까지 함께 적습니다.", theme: "#159f84", bg: ASSETS.backgrounds[2], mascot: ASSETS.characters.squirrel },
    { id: "page_06_opinion_summary", step: 6, short: "의견 모아보기", title: "의견 모아보기", subtitle: "공감순이 아니라 기준 비교로 토론 주제를 정합니다.", theme: "#6d50dc", bg: ASSETS.backgrounds[1], mascot: ASSETS.characters.owl },
    { id: "page_07_discussion", step: 7, short: "토론", title: "토론 진행", subtitle: "질문, 찬성 이유, 걱정되는 점, 수정 제안을 균형 있게 다룹니다.", theme: "#f28a16", bg: ASSETS.backgrounds[3], mascot: ASSETS.characters.rabbit },
    { id: "page_08_vote", step: 8, short: "투표", title: "투표하기 / 거수 수합", subtitle: "찬성, 반대, 보류를 기록하고 결과를 해석합니다.", theme: "#2f80ed", bg: ASSETS.backgrounds[3], mascot: ASSETS.characters.penguin },
    { id: "page_09_decision", step: 9, short: "결정사항 정리", title: "결정사항 정리", subtitle: "결정을 실천 계획과 다음 회의 확인 기준으로 바꿉니다.", theme: "#159f84", bg: ASSETS.backgrounds[4], mascot: asset("icons/discuss", "66.png") },
    { id: "page_10_report", step: 10, short: "회의록", title: "결과 공유 / 회의록", subtitle: "과정과 결정 근거를 저장하고 다음 회의로 연결합니다.", theme: "#6d50dc", bg: ASSETS.backgrounds[5], mascot: ASSETS.characters.koala }
  ];

  const STEP_COLORS = ["#19b999", "#a78bfa", "#2f80ed", "#f48fb1", "#7ccfff", "#ffb23e", "#14a889", "#7857d9", "#159f84", "#e54b79"];

  const DEFAULT_MEETING = {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    schemaVersion: SCHEMA_VERSION,
    appVersion: APP_VERSION,
    currentPage: 1,
    title: "6월 1주 학급회의",
    date: new Date().toISOString().slice(0, 10),
    totalStudents: 25,
    depthMode: "advanced",
    soundEnabled: true,
    reducedMotion: false,
    roles: {
      host: "김하늘",
      recorder: "이서준",
      timeKeeper: "박지우",
      encourager: "최민준",
      teacher: "담임 선생님"
    },
    flow: {
      stepLabels: ["시작", "반성", "의견", "정리", "토론", "투표", "결정", "회의록", "공유", "마무리"],
      durationMinutes: 30,
      completedPages: []
    },
    decisionRules: {
      agreeThreshold: 60,
      holdThreshold: 30,
      safetyRule: "안전 문제가 있으면 조건을 다시 검토해요.",
      feasibilityRule: "투표 후 실천 가능성을 확인해요."
    },
    timer: {
      startedAt: null,
      pausedAt: null,
      accumulatedMs: 0,
      running: false,
      durationMinutes: 30
    },
    agenda: {
      title: "우리 반 청소 역할 공정하게 정하기",
      problemContext: "청소 역할이 한쪽으로 치우쳐 공정하지 않다고 느끼는 친구들이 있어요.",
      expectedOutcome: "청소 역할을 모두가 납득할 수 있게 나누는 방법을 정해요.",
      selectedTopic: "청소 구역을 매주 바꾸는 것이 좋을까요?"
    },
    previous: {
      promise: "급식 줄을 조용히 서기",
      handRaise: { good: 18, normal: 5, hard: 2 },
      evidence: "친구들이 줄에서 조용히 서려고 노력했어요.",
      cause: "금요일에는 쉬는 시간이 짧아 이동이 급했어요.",
      improvement: "급식 이동 시간을 조금 더 여유 있게 해요."
    },
    opinions: [
      {
        id: "op-1",
        text: "청소 구역을 돌아가며 정하면 좋겠어요.",
        reason: "모두가 여러 역할을 경험할 수 있어서요.",
        expectedEffect: "역할이 한쪽에 치우치지 않아요.",
        concern: "처음에는 헷갈릴 수 있어요.",
        category: "청소와 역할",
        likes: 12
      },
      {
        id: "op-2",
        text: "힘든 청소는 친구와 함께하면 좋겠어요.",
        reason: "혼자 하면 시간이 오래 걸릴 수 있어요.",
        expectedEffect: "서로 도와 청소 시간이 줄어요.",
        concern: "친구끼리만 하려 할 수 있어요.",
        category: "친구와 관계",
        likes: 9
      },
      {
        id: "op-3",
        text: "청소 체크표를 만들면 좋겠어요.",
        reason: "누가 했는지 확인할 수 있어요.",
        expectedEffect: "빠뜨린 역할을 확인하기 쉬워요.",
        concern: "기록자가 부담될 수 있어요.",
        category: "학급 생활",
        likes: 7
      }
    ],
    opinionDraft: {
      text: "청소 구역을 매주 바꾸면 좋겠어요.",
      reason: "모두가 다양한 역할을 경험할 수 있어요.",
      expectedEffect: "공정하다고 느끼는 친구가 늘어요.",
      concern: "처음 한 주는 안내표가 필요해요.",
      category: "청소와 역할"
    },
    opinionPresenterHands: 6,
    topicSelection: {
      candidates: [
        { id: "topic-1", label: "청소 구역을 매주 바꾸기", hands: 15 },
        { id: "topic-2", label: "힘든 역할은 짝과 함께하기", hands: 7 },
        { id: "topic-3", label: "청소 체크표 만들기", hands: 3 }
      ],
      criteriaScores: {
        fairness: 5,
        feasibility: 4,
        safety: 5,
        preparation: 3,
        burden: 2
      },
      selectedTopic: "청소 구역을 매주 바꾸는 것이 좋을까요?"
    },
    discussion: {
      proposal: "구역을 바꾸면 모두가 여러 역할을 경험할 수 있어요.",
      questions: "구역표는 누가 정하고 어디에 붙이나요?",
      agreeReasons: "같은 친구만 힘든 구역을 맡지 않아 공정해요.",
      concerns: "매주 바뀌면 헷갈릴 수 있어 안내가 필요해요.",
      revisionSuggestion: "처음 한 주는 안내표와 함께 시작해요.",
      handRaise: { presenters: 5, questions: 3, agreeSpeakers: 4, concernSpeakers: 2 }
    },
    vote: {
      question: "청소 구역을 매주 바꾸는 것이 좋을까요?",
      mode: "handRaise",
      agree: 18,
      disagree: 4,
      hold: 3
    },
    decision: {
      text: "청소 구역을 매주 바꾸기로 했어요.",
      practiceMethod: "월요일마다 청소 구역표를 확인해요.",
      owner: "반장 김하늘, 부반장 이서준",
      period: "6월 3일 ~ 6월 17일",
      successCriteria: "청소 역할이 한쪽에 치우치지 않아요.",
      nextReview: "역할 분담이 잘 지켜졌는지 확인해요.",
      volunteerHands: 4
    },
    teacherComment: "서로 의견을 존중하며 잘 참여했어요. 다음 회의에서는 실천 결과를 함께 확인해요.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    archived: false
  };

  const state = {
    meeting: structuredClone(DEFAULT_MEETING),
    recentMeetings: [],
    dbReady: false,
    dbFailed: false,
    saveTimer: null,
    renderTimer: null,
    lastRenderedPage: null
  };

  const root = document.getElementById("app");

  window.addEventListener("error", showRecovery);
  window.addEventListener("unhandledrejection", showRecovery);
  window.addEventListener("beforeunload", () => saveSnapshot());

  init();

  async function init() {
    try {
      state.meeting = migrate(loadSnapshot() || structuredClone(DEFAULT_MEETING));
      const requestedPage = Number(new URLSearchParams(location.search).get("page"));
      if (requestedPage >= 0 && requestedPage <= 10) state.meeting.currentPage = requestedPage;
      bindGlobalEvents();
      render();
      startTimerLoop();
      const db = await openDb();
      state.dbReady = Boolean(db);
      if (db) {
        await saveMeetingNow();
        state.recentMeetings = await getAllMeetings();
        if (state.meeting.currentPage === 0) render();
      }
    } catch (error) {
      console.warn("storage init failed", error);
      state.dbFailed = true;
      if (!root.innerHTML) render();
    }
  }

  function bindGlobalEvents() {
    document.addEventListener("input", (event) => {
      const field = event.target.closest("[data-field]");
      if (!field) return;
      const value = normalizeInputValue(field);
      setPath(state.meeting, field.dataset.field, value);
      state.meeting.updatedAt = new Date().toISOString();
      queueSave();
      updateDependentText();
    });

    document.addEventListener("change", async (event) => {
      const field = event.target.closest("[data-field]");
      if (field) {
        setPath(state.meeting, field.dataset.field, normalizeInputValue(field));
        queueSave();
      }

      if (event.target.matches("[data-import-json]")) {
        await importJson(event.target.files?.[0]);
        event.target.value = "";
      }
    });

    document.addEventListener("click", async (event) => {
      const button = event.target.closest("[data-action]");
      if (!button) return;
      const action = button.dataset.action;
      const path = button.dataset.path;

      playSound(ACTION_SOUNDS[action] || "click");

      if (action === "toggle-sound") {
        state.meeting.soundEnabled = !state.meeting.soundEnabled;
        queueSave();
        render();
        if (state.meeting.soundEnabled) playSound("open");
        return;
      }

      if (action === "go") goTo(Number(button.dataset.page));
      if (action === "home") goTo(0);
      if (action === "next") goTo(Math.min(10, state.meeting.currentPage + 1));
      if (action === "prev") goTo(Math.max(1, state.meeting.currentPage - 1));
      if (action === "sample") loadSample();
      if (action === "new") await newMeeting();
      if (action === "continue") await continueLatest();
      if (action === "load-meeting") await loadMeeting(button.dataset.id);
      if (action === "counter-minus") updateCounter(path, -1);
      if (action === "counter-plus") updateCounter(path, 1);
      if (action === "add-step") addStep();
      if (action === "remove-step") removeStep(Number(button.dataset.index));
      if (action === "add-opinion") addOpinion();
      if (action === "delete-opinion") deleteOpinion(button.dataset.id);
      if (action === "like-opinion") likeOpinion(button.dataset.id);
      if (action === "select-topic") selectTopic(button.dataset.label);
      if (action === "set-criteria") setCriteria(button.dataset.key, Number(button.dataset.score));
      if (action === "timer-start") timerStart();
      if (action === "timer-pause") timerPause();
      if (action === "timer-extend") timerExtend();
      if (action === "export-json") exportJson();
      if (action === "print") window.print();
      if (action === "copy-report") copyReport();
      if (action === "save-report") await finalizeMeeting();
    });
  }

  function render() {
    try {
      const page = PAGES[state.meeting.currentPage] || PAGES[1];
      const pageChanged = state.lastRenderedPage !== state.meeting.currentPage;
      state.lastRenderedPage = state.meeting.currentPage;
      root.innerHTML = page.id === "main" ? renderLanding(page) : renderPage(page);
      if (pageChanged) root.firstElementChild?.classList.add("page-enter");
      updateDependentText();
    } catch (error) {
      console.error(error);
      showRecovery(error);
    }
  }

  function renderLanding(page) {
    const recent = state.recentMeetings.slice(0, 4).map((meeting) => `
      <button class="recent-item" type="button" data-action="load-meeting" data-id="${escapeHtml(meeting.id)}">
        <strong>${escapeHtml(meeting.title || "저장된 회의")}</strong>
        <span class="muted small-text">${escapeHtml(meeting.date || "")} · ${escapeHtml(meeting.decision?.text || meeting.agenda?.title || "회의 이어하기")}</span>
      </button>
    `).join("") || `<div class="recent-item"><strong>저장된 회의가 아직 없어요</strong><span class="muted small-text">샘플 회의로 바로 시작할 수 있습니다.</span></div>`;

    return `
      <main class="app-page landing" style="--bg:url('${page.bg}'); --theme:${page.theme}">
        <button class="sound-chip" type="button" data-action="toggle-sound" aria-label="${state.meeting.soundEnabled ? "소리 끄기" : "소리 켜기"}">${state.meeting.soundEnabled ? "🔊" : "🔇"}</button>
        <div class="landing-content">
          <section>
            <p class="page-kicker">초등 4~6학년 심화형 회의 진행</p>
            <h1>학급회의<br />시간</h1>
            <p>의견을 모으고, 기준으로 비교하고, 투표 결과를 실천 계획과 회의록으로 연결합니다.</p>
            <div class="actions" style="justify-content:flex-start">
              <button class="btn primary" data-action="new">새 회의 시작</button>
              <button class="btn secondary" data-action="continue">이어하기</button>
              <button class="btn mint" data-action="sample">샘플 회의</button>
            </div>
          </section>
          <section class="panel">
            <div class="with-icon">
              ${img(ASSETS.icons.board, "회의 기록 아이콘", "asset-icon large")}
              <div>
                <p class="page-kicker">저장과 백업</p>
                <h2>회의 기록 관리</h2>
              </div>
            </div>
            <div class="grid" style="margin-top:18px">${recent}</div>
            <div class="actions">
              <label class="btn secondary" for="jsonImport">JSON 불러오기</label>
              <input id="jsonImport" class="hidden-input" type="file" accept="application/json" data-import-json />
              <button class="btn secondary" data-action="export-json">현재 회의 백업</button>
            </div>
            ${state.dbFailed ? `<div class="warning">IndexedDB를 사용할 수 없어 현재 브라우저 snapshot 중심으로 저장 중입니다.</div>` : ""}
          </section>
        </div>
      </main>
    `;
  }

  function renderPage(page) {
    return `
      <main class="app-page" style="--bg:url('${page.bg}'); --theme:${page.theme}">
        <button class="home-chip" type="button" data-action="home" aria-label="처음으로">⌂</button>
        <button class="sound-chip" type="button" data-action="toggle-sound" aria-label="${state.meeting.soundEnabled ? "소리 끄기" : "소리 켜기"}">${state.meeting.soundEnabled ? "🔊" : "🔇"}</button>
        <div class="app-shell">
          <header class="topbar">
            <section class="page-heading">
              <h1 class="page-title">${page.step}. ${escapeHtml(page.title)}</h1>
              <p class="page-subtitle">${escapeHtml(page.subtitle)}</p>
            </section>
            ${renderProgress(page.step)}
          </header>
          <section class="page-body">
            ${page.mascot ? img(page.mascot, `${page.title} 안내 캐릭터`, "mascot") : ""}
            ${renderContent(page)}
          </section>
          ${renderNav(page.step)}
        </div>
        ${renderToolbar(page.step)}
      </main>
    `;
  }

  function renderProgress(currentStep) {
    return `
      <nav class="progress" aria-label="회의 진행 단계">
        ${Array.from({ length: 10 }, (_, index) => {
          const step = index + 1;
          const label = state.meeting.flow.stepLabels[index] || PAGES[step].short;
          const status = step < currentStep ? "done" : step === currentStep ? "active" : "";
          return `
            <button class="progress-item ${status}" style="--step-color:${STEP_COLORS[index]}" type="button" data-action="go" data-page="${step}" aria-label="${step}단계 ${escapeHtml(label)}로 이동">
              <span class="step-dot"><span class="step-number">${step}</span></span>
              <span class="progress-label">${escapeHtml(label)}</span>
            </button>
          `;
        }).join("")}
      </nav>
    `;
  }

  function renderContent(page) {
    const renderers = {
      page_01_meeting_prepare: renderPrepare,
      page_02_flow_setup: renderFlowSetup,
      page_03_start_guide: renderStartGuide,
      page_04_reflection: renderReflection,
      page_05_opinion_board: renderOpinionBoard,
      page_06_opinion_summary: renderOpinionSummary,
      page_07_discussion: renderDiscussion,
      page_08_vote: renderVote,
      page_09_decision: renderDecision,
      page_10_report: renderReport
    };
    return renderers[page.id]();
  }

  function renderPrepare() {
    return `
      <div class="workspace">
        <section class="panel stack">
          <div class="grid two">
            ${infoField("회의 제목", "title", "📝", "#19b999")}
            ${infoField("학급 인원", "totalStudents", "👥", "#2f80ed", { type: "number", attrs: { min: 1, max: 40 } })}
          </div>
          ${infoField("오늘의 안건", "agenda.title", "📣", "#ef4f85")}
          ${infoField("문제 상황", "agenda.problemContext", "⚠️", "#8b5cf6", { type: "textarea" })}
          ${infoField("기대하는 변화", "agenda.expectedOutcome", "🌈", "#2f80ed", { type: "textarea" })}
          <div class="grid two">
            ${infoField("지난 회의 약속", "previous.promise", "🤝", "#f59e0b")}
            ${infoField("날짜", "date", "📅", "#ef4f85", { type: "date" })}
          </div>
          <div class="info-row" style="border-color:#ded4f8; background:#f8f5ff">
            ${chip("⭐", "#7857d9")}
            <div class="info-body">
              <span class="info-label" style="color:#7857d9">회의 수준</span>
              <div style="display:flex; flex-wrap:wrap; gap:12px; align-items:center">
                <select class="mini-select" data-field="depthMode">
                  <option value="basic" ${state.meeting.depthMode === "basic" ? "selected" : ""}>기본형</option>
                  <option value="advanced" ${state.meeting.depthMode === "advanced" ? "selected" : ""}>심화형</option>
                </select>
                <span style="font-size:15px; font-weight:800"><b style="color:#7857d9">심화형:</b> 의견에는 이유 · 기대 효과 · 걱정되는 점을 함께 기록합니다.</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    `;
  }

  function renderFlowSetup() {
    const roles = [
      ["host", "사회자", "🧑", "#19b999"],
      ["recorder", "기록자", "✏️", "#2f80ed"],
      ["timeKeeper", "시간관리자", "🕐", "#7857d9"],
      ["encourager", "격려자", "❤️", "#ef4f85"]
    ];
    return `
      <div class="workspace wide">
        <div class="grid main">
          <section class="panel">
            <h2 class="panel-title" style="color:#7857d9">단계 이름</h2>
            <ul class="list">
              ${state.meeting.flow.stepLabels.map((label, index) => `
                <li class="step-row">
                  <span class="badge" style="--badge:${STEP_COLORS[index] || "#7857d9"}">${index + 1}</span>
                  <input data-field="flow.stepLabels.${index}" value="${escapeAttr(label)}" aria-label="${index + 1}단계 이름" />
                  <button class="row-x" data-action="remove-step" data-index="${index}" aria-label="단계 삭제">×</button>
                </li>
              `).join("")}
            </ul>
            <button class="add-row" data-action="add-step">＋ 단계 추가</button>
          </section>
          <section class="panel">
            <h2 class="panel-title" style="color:var(--mint)">오늘의 역할</h2>
            <div class="stack">
              ${roles.map(([key, label, emoji, color]) => `
                <div class="info-row slim">
                  ${chip(emoji, color)}
                  <div class="info-body">
                    <span class="info-label" style="color:${color}">${label}</span>
                    <input class="row-input" data-field="roles.${key}" value="${escapeAttr(state.meeting.roles[key])}" aria-label="${label} 이름" />
                  </div>
                </div>
              `).join("")}
            </div>
            <div class="rule-band">
              ${chip("⭐", "#f59e0b")}
              <div class="info-body">
                <span class="info-label" style="color:var(--amber-deep)">결정 기준</span>
                <div class="rule-line">
                  찬성 <input class="mini-num" type="number" min="1" max="100" data-field="decisionRules.agreeThreshold" value="${escapeAttr(state.meeting.decisionRules.agreeThreshold)}" aria-label="찬성 기준 퍼센트" />% 이상 채택 후보 ·
                  보류 <input class="mini-num" type="number" min="1" max="100" data-field="decisionRules.holdThreshold" value="${escapeAttr(state.meeting.decisionRules.holdThreshold)}" aria-label="보류 재논의 기준 퍼센트" />% 이상 재논의
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    `;
  }

  function renderStartGuide() {
    const rules = [
      ["👂", "끝까지 듣고 말해요"],
      ["💬", "의견에는 이유를 붙여요"],
      ["👥", "반대는 사람 말고 의견에 해요"],
      ["✅", "결정 후 실천 방법까지 정해요"]
    ];
    const timer = state.meeting.timer;
    return `
      <div class="workspace">
        <div class="grid main">
          <section class="panel">
            <h2 class="panel-title" style="color:var(--mint)">우리 반 회의 약속</h2>
            <ul class="list">
              ${rules.map(([emoji, rule]) => `
                <li class="list-row">${chip(emoji, "#19b999")}<strong>${rule}</strong></li>
              `).join("")}
            </ul>
          </section>
          <section class="panel">
            <div class="panel-head">
              ${chip("📣", "#7857d9")}
              <span style="color:var(--violet)">오늘의 안건</span>
            </div>
            <input class="row-input xl" data-field="agenda.title" value="${escapeAttr(state.meeting.agenda.title)}" aria-label="오늘의 안건" />
            <hr class="soft" />
            <span class="info-label" style="color:var(--violet)">회의 목표</span>
            <textarea class="row-input" data-field="agenda.expectedOutcome" rows="2" aria-label="회의 목표">${escapeHtml(state.meeting.agenda.expectedOutcome)}</textarea>
          </section>
        </div>
        <div class="note-band">
          ${chip("💬", "#f59e0b")}
          <div class="info-body">
            <span class="info-label" style="color:var(--amber-deep)">진행자 멘트</span>
            <p class="band-text">지금부터 오늘의 학급회의를 시작하겠습니다. 오늘은 "${escapeHtml(state.meeting.agenda.title)}"에 대해 이야기하겠습니다.</p>
          </div>
        </div>
        <div class="note-band blue">
          ${chip("⏱️", "#2f80ed")}
          <div class="info-body">
            <span class="info-label" style="color:var(--blue)">타이머 · ${timer.durationMinutes}분 회의</span>
            <p class="band-text big" id="timerDisplay">${formatTime(getRemainingMs())}</p>
          </div>
          <div class="timer-actions">
            <button class="btn primary sm" data-action="timer-start">타이머 시작</button>
            <button class="btn ghost sm" data-action="timer-pause">${timer.running ? "일시정지" : "재개"}</button>
            <button class="btn ghost sm" data-action="timer-extend">＋1분</button>
          </div>
        </div>
      </div>
    `;
  }

  function renderReflection() {
    const hr = state.meeting.previous.handRaise;
    const total = hr.good + hr.normal + hr.hard;
    return `
      <div class="workspace wide">
        ${heroBand("#ef4f85", img(ASSETS.icons.clipboard, "지난 약속 아이콘", "hero-img"), "지난 회의 약속",
          `<input class="hero-input" data-field="previous.promise" value="${escapeAttr(state.meeting.previous.promise)}" aria-label="지난 회의 약속" />`)}
        <div class="grid reflect mt">
          ${faceCard("잘 지켜졌어요", hr.good, "🙂", "#19b999")}
          ${faceCard("보통이에요", hr.normal, "😐", "#f59e0b")}
          ${faceCard("조금 어려웠어요", hr.hard, "😥", "#ef4f85")}
          <section class="panel side">
            <div class="panel-head">${chip("✋", "#2f80ed")}<span style="color:var(--blue); font-size:17px">손들기 결과</span></div>
            ${sideCount("🙂", "잘 지킴", "previous.handRaise.good", "#19b999")}
            ${sideCount("😐", "보통", "previous.handRaise.normal", "#f59e0b")}
            ${sideCount("😥", "어려움", "previous.handRaise.hard", "#ef4f85")}
          </section>
        </div>
        ${total > state.meeting.totalStudents ? `<div class="warning">거수 합계 ${total}명이 학급 인원 ${state.meeting.totalStudents}명을 넘었어요. 수를 다시 확인해 주세요.</div>` : ""}
        <div class="grid three mt">
          ${noteCard("실천 근거", "previous.evidence", "🔍", "#19b999")}
          ${noteCard("어려웠던 원인", "previous.cause", "❓", "#ef4f85")}
          ${noteCard("개선 제안", "previous.improvement", "💡", "#2f80ed")}
        </div>
      </div>
    `;
  }

  function renderOpinionBoard() {
    return `
      <div class="workspace wide">
        ${heroBand("#19b999", img(ASSETS.icons.clipboard, "안건 아이콘", "hero-img"), "오늘의 안건",
          `<input class="hero-input" data-field="agenda.title" value="${escapeAttr(state.meeting.agenda.title)}" aria-label="오늘의 안건" />`)}
        <div class="grid three mt">
          ${state.meeting.opinions.map((opinion, index) => renderOpinionCard(opinion, index)).join("")}
        </div>
        <section class="panel mt">
          <div class="split-side">
            <div>
              <span class="info-label" style="color:var(--blue)">내 의견</span>
              <input class="row-input xl" data-field="opinionDraft.text" value="${escapeAttr(state.meeting.opinionDraft.text)}" placeholder="의견을 적어 보세요" aria-label="내 의견" />
              <input class="row-input" data-field="opinionDraft.reason" value="${escapeAttr(state.meeting.opinionDraft.reason)}" placeholder="이유: 왜 그렇게 생각하나요?" aria-label="이유" style="font-size:16px; font-weight:800" />
              <div class="grid three" style="gap:10px; margin-top:12px">
                ${miniField("기대 효과", "opinionDraft.expectedEffect")}
                ${miniField("걱정되는 점", "opinionDraft.concern")}
                ${miniField("카테고리", "opinionDraft.category")}
              </div>
            </div>
            <div style="display:grid; gap:10px; justify-items:center; align-content:center; text-align:center">
              <span class="info-label" style="color:var(--blue)">발표 희망 거수</span>
              ${pillCounter("✋", "opinionPresenterHands", "#2f80ed", "발표 희망 거수")}
              <button class="btn mint sm" data-action="add-opinion" style="width:100%">＋ 의견 등록</button>
              <span class="muted small-text">손을 들면 발표 기회가 더 생겨요!</span>
            </div>
          </div>
        </section>
      </div>
    `;
  }

  function renderOpinionSummary() {
    const top = [...state.meeting.opinions].sort((a, b) => b.likes - a.likes).slice(0, 3);
    const rankColors = ["#ef4f85", "#2f80ed", "#7857d9"];
    const criteria = [
      ["공정성", "fairness", "⚖️", "#19b999"],
      ["실현 가능성", "feasibility", "🎯", "#2f80ed"],
      ["안전성", "safety", "🛡️", "#f59e0b"],
      ["준비물 필요", "preparation", "📦", "#7857d9"],
      ["담당자 부담", "burden", "🧑", "#ef4f85"]
    ];
    return `
      <div class="workspace wide">
        <div class="grid two">
          <section class="panel">
            <div class="panel-head">${chip("❤️", "#ef4f85")}<span style="color:var(--pink)">공감 많은 의견</span></div>
            <ul class="list">
              ${top.map((opinion, index) => `
                <li class="rank-row" style="--rank:${rankColors[index]}">
                  <span class="rank-badge">${index + 1}</span>
                  <span class="rank-text">${escapeHtml(opinion.text)}</span>
                  <button class="like-pill" data-action="like-opinion" data-id="${opinion.id}" aria-label="공감하기">♥ ${opinion.likes}</button>
                </li>
              `).join("")}
            </ul>
            <div class="hint-band">💡 하트를 누르면 의견에 공감을 표현할 수 있어요!</div>
          </section>
          <section class="panel">
            <div class="panel-head">${chip("⚖️", "#7857d9")}<span style="color:var(--violet)">기준 비교</span></div>
            ${criteria.map(([label, key, emoji, color]) => criteriaRow(label, key, emoji, color)).join("")}
            <div class="hint-band violet">✨ 점을 눌러 기준 점수를 바꿀 수 있어요!</div>
          </section>
        </div>
        <section class="hero-band mt" style="--band:#f59e0b">
          <div class="hero-body">
            <span class="info-label" style="color:var(--amber-deep)">✨ 선택된 토론 주제</span>
            <input class="hero-input" data-field="topicSelection.selectedTopic" value="${escapeAttr(state.meeting.topicSelection.selectedTopic)}" aria-label="선택된 토론 주제" />
            <span class="muted small-text">모두가 공정하게 참여하고, 책임감을 키울 수 있는 방법을 함께 찾아봅시다! 💙</span>
          </div>
        </section>
        <div class="grid three mt">
          ${state.meeting.topicSelection.candidates.map((candidate, index) => `
            <div class="card candidate-card">
              <strong>${escapeHtml(candidate.label)}</strong>
              ${pillCounter("후보 거수", `topicSelection.candidates.${index}.hands`, "#19b999")}
              <button class="btn secondary sm" data-action="select-topic" data-label="${escapeAttr(candidate.label)}">토론 주제로 선택</button>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }

  function renderDiscussion() {
    return `
      <div class="workspace wide">
        ${heroBand("#f59e0b", img(ASSETS.icons.megaphoneBig, "토론 확성기", "hero-img"), "토론 주제",
          `<input class="hero-input" data-field="topicSelection.selectedTopic" value="${escapeAttr(state.meeting.topicSelection.selectedTopic)}" aria-label="토론 주제" />`)}
        <div class="split-side mt">
          <div class="grid two">
            ${pastelNote("제안 설명", "discussion.proposal", "📄", "#2f80ed")}
            ${pastelNote("궁금한 점", "discussion.questions", "❓", "#7857d9")}
            ${pastelNote("찬성 이유", "discussion.agreeReasons", "👍", "#19b999")}
            ${pastelNote("걱정되는 점", "discussion.concerns", "😟", "#ef4f85")}
            <div style="grid-column:1 / -1">
              ${pastelNote("수정 제안", "discussion.revisionSuggestion", "💡", "#f59e0b")}
            </div>
          </div>
          <section class="panel side">
            <div class="panel-head">${chip("✋", "#2f80ed")}<span style="color:var(--blue); font-size:17px">발언 거수</span></div>
            ${sideCount("🧑", "발표 희망", "discussion.handRaise.presenters", "#2f80ed")}
            ${sideCount("❓", "질문 있음", "discussion.handRaise.questions", "#7857d9")}
            ${sideCount("👍", "찬성 발언", "discussion.handRaise.agreeSpeakers", "#19b999")}
            ${sideCount("😟", "걱정 발언", "discussion.handRaise.concernSpeakers", "#ef4f85")}
          </section>
        </div>
      </div>
    `;
  }

  function renderVote() {
    const { agree, disagree, hold } = state.meeting.vote;
    const total = agree + disagree + hold;
    const agreeRate = total ? Math.round((agree / total) * 100) : 0;
    const holdRate = total ? Math.round((hold / total) * 100) : 0;
    const warning = total > state.meeting.totalStudents ? `<div class="warning">투표 합계 ${total}명이 학급 인원 ${state.meeting.totalStudents}명을 넘었어요.</div>` : "";
    const interpretation = holdRate >= state.meeting.decisionRules.holdThreshold
      ? "보류가 많아 조건 수정이나 재논의를 먼저 권장합니다."
      : agreeRate >= state.meeting.decisionRules.agreeThreshold
        ? "찬성 기준을 넘었지만 반대와 보류 이유도 확인해요."
        : "찬성 기준에 아직 부족해 다른 조건을 더 논의해요.";

    return `
      <div class="workspace wide">
        <div class="split-side" style="grid-template-columns:1fr 300px">
          <div>
            ${heroBand("#ef4f85", "", "투표 질문",
              `<input class="hero-input" data-field="vote.question" value="${escapeAttr(state.meeting.vote.question || state.meeting.topicSelection.selectedTopic)}" aria-label="투표 질문" />`)}
            <div class="grid three mt">
              ${voteCard("찬성", "좋다고 생각해요", "vote.agree", ASSETS.icons.check, "#19b999")}
              ${voteCard("반대", "다른 방법이 필요해요", "vote.disagree", ASSETS.icons.x, "#e54b79")}
              ${voteCard("보류", "조금 더 생각해요", "vote.hold", ASSETS.icons.pause, "#8b5cf6")}
            </div>
            ${warning}
          </div>
          <section class="panel side result-panel">
            ${img(ASSETS.icons.mail, "결과 해석 아이콘", "result-img")}
            <span class="info-label" style="color:var(--blue)">결과 해석</span>
            <p class="rate-line">찬성률 <b class="rate" style="color:var(--mint-deep)">${agreeRate}%</b></p>
            <div class="bar"><span style="--value:${agreeRate}%"></span></div>
            <p class="interp">${interpretation}</p>
            <hr class="soft" style="width:100%" />
            <ul class="mini-rules">
              <li>✅ 찬성 ${state.meeting.decisionRules.agreeThreshold}% 이상이면 채택 후보</li>
              <li>⏸️ 보류 ${state.meeting.decisionRules.holdThreshold}% 이상이면 재논의 권장</li>
              <li>⚠️ 안전 문제가 있으면 조건 검토</li>
            </ul>
          </section>
        </div>
      </div>
    `;
  }

  function renderDecision() {
    return `
      <div class="workspace wide">
        ${heroBand("#19b999", `<span class="chip" style="--chip:#19b999">📊</span>`, "투표 결과 요약",
          `<p class="hero-static">찬성 ${state.meeting.vote.agree}명 · 반대 ${state.meeting.vote.disagree}명 · 보류 ${state.meeting.vote.hold}명</p>`)}
        <div class="grid two mt">
          ${infoField("오늘의 결정", "decision.text", "🎯", "#19b999")}
          ${infoField("실천 방법", "decision.practiceMethod", "🧹", "#2f80ed")}
          ${infoField("담당자", "decision.owner", "🧑", "#7857d9")}
          ${infoField("실천 기간", "decision.period", "📅", "#ef4f85")}
          ${infoField("성공 기준", "decision.successCriteria", "🏅", "#f59e0b")}
          ${infoField("다음 회의 확인", "decision.nextReview", "📋", "#19b999")}
        </div>
        <div class="cta-row" style="justify-content:center; margin-top:20px">
          ${pillCounter("담당자 지원 거수", "decision.volunteerHands", "#19b999")}
          <span class="muted small-text" style="max-width:260px">ℹ️ 담당자를 응원하는 친구들의 거수를 확인하고 기록해요.</span>
        </div>
      </div>
    `;
  }

  function renderReport() {
    const rows = [
      ["회의 제목", state.meeting.title],
      ["날짜", `${state.meeting.date} · ${state.meeting.totalStudents}명`],
      ["오늘의 역할", `사회자 ${state.meeting.roles.host}, 기록자 ${state.meeting.roles.recorder}, 시간관리자 ${state.meeting.roles.timeKeeper}, 격려자 ${state.meeting.roles.encourager}`],
      ["지난 약속 반성", `${state.meeting.previous.promise} · 잘 지킴 ${state.meeting.previous.handRaise.good} / 보통 ${state.meeting.previous.handRaise.normal} / 어려움 ${state.meeting.previous.handRaise.hard}`],
      ["주요 의견", state.meeting.opinions.slice(0, 3).map((op) => op.text).join(" / ")],
      ["토론 요약", `제안: ${state.meeting.discussion.proposal} / 걱정: ${state.meeting.discussion.concerns} / 수정: ${state.meeting.discussion.revisionSuggestion}`],
      ["투표 결과", `찬성 ${state.meeting.vote.agree} / 반대 ${state.meeting.vote.disagree} / 보류 ${state.meeting.vote.hold}`],
      ["오늘의 결정", state.meeting.decision.text],
      ["실천 방법", state.meeting.decision.practiceMethod],
      ["담당자", `${state.meeting.decision.owner} · ${state.meeting.decision.period}`],
      ["다음 확인", state.meeting.decision.nextReview]
    ];

    return `
      <div class="workspace wide">
        <div class="grid main">
          <section class="panel">
            <div class="panel-head">
              ${chip("📒", "#19b999")}
              <span style="color:var(--mint-deep); font-size:24px">오늘의 회의록</span>
            </div>
            <div id="reportText" class="report-list">
              ${rows.map(([label, value]) => `
                <div class="report-row"><b class="report-key">${escapeHtml(label)}</b><span>${escapeHtml(value || "아직 입력하지 않았어요.")}</span></div>
              `).join("")}
            </div>
          </section>
          <div class="stack">
            <section class="card decision-card">
              ${img(ASSETS.icons.report, "오늘의 결정 아이콘", "decision-img")}
              <div class="info-body">
                <span class="info-label" style="color:var(--pink)">오늘의 결정</span>
                <p class="band-text big" style="font-size:clamp(20px, 2vw, 26px)">${escapeHtml(state.meeting.decision.text)}</p>
                <p class="muted small-text">다음 회의에서 "${escapeHtml(state.meeting.decision.nextReview)}"를 확인해요.</p>
              </div>
            </section>
            <section class="card">
              <div class="panel-head">
                ${chip("💬", "#7857d9")}
                <span style="color:var(--violet)">선생님 한마디</span>
              </div>
              <textarea class="row-input" data-field="teacherComment" rows="3" aria-label="선생님 한마디">${escapeHtml(state.meeting.teacherComment)}</textarea>
            </section>
          </div>
        </div>
      </div>
    `;
  }

  function renderNav(step) {
    const nextLabels = {
      1: "흐름 설정으로",
      2: "회의 시작으로",
      3: "지난 약속 반성으로",
      4: "의견 게시로 이동",
      5: "의견 모아보기",
      6: "토론으로 이동",
      7: "투표로 이동",
      8: "결정사항 정리",
      9: "결과 공유하기"
    };
    return `
      <div class="cta-row">
        ${step > 1 ? `<button class="btn ghost" data-action="prev">← 이전</button>` : ""}
        ${step < 10 ? `<button class="btn primary xl" data-action="next">${nextLabels[step] || "다음 단계"} →</button>` : `
          <button class="btn primary" data-action="save-report">💾 회의 저장</button>
          <button class="btn secondary" data-action="print">📄 PDF 저장</button>
          <button class="btn mint" data-action="export-json">{ } JSON 백업</button>
          <button class="btn dark" data-action="home">⌂ 처음으로</button>
        `}
      </div>
    `;
  }

  function renderToolbar(step) {
    if (step === 10) {
      return `
        <div class="toolbar" aria-label="빠른 도구">
          <button type="button" data-action="copy-report" title="회의록 복사">📋</button>
        </div>
      `;
    }
    return `
      <div class="toolbar" aria-label="빠른 도구">
        <button type="button" data-action="export-json" title="JSON 백업">JS</button>
        <button type="button" data-action="print" title="PDF 저장">PDF</button>
      </div>
    `;
  }

  function chip(emoji, color) {
    return `<span class="chip" style="--chip:${color}">${emoji}</span>`;
  }

  function infoField(label, path, emoji, color, opts = {}) {
    const value = getPath(state.meeting, path) ?? "";
    const attrText = Object.entries(opts.attrs || {}).map(([key, val]) => `${key}="${escapeAttr(val)}"`).join(" ");
    const control = opts.type === "textarea"
      ? `<textarea class="row-input" data-field="${path}" rows="2" aria-label="${escapeAttr(label)}">${escapeHtml(value)}</textarea>`
      : `<input class="row-input" type="${opts.type || "text"}" data-field="${path}" value="${escapeAttr(value)}" aria-label="${escapeAttr(label)}" ${attrText} />`;
    return `
      <div class="info-row">
        ${chip(emoji, color)}
        <div class="info-body">
          <span class="info-label" style="color:${color}">${label}</span>
          ${control}
        </div>
      </div>
    `;
  }

  function miniField(label, path) {
    const value = getPath(state.meeting, path) ?? "";
    return `
      <div class="info-body">
        <span class="info-label" style="color:var(--muted)">${label}</span>
        <input class="row-input" data-field="${path}" value="${escapeAttr(value)}" aria-label="${escapeAttr(label)}" style="font-size:15px; font-weight:800" />
      </div>
    `;
  }

  function heroBand(color, media, label, contentHtml) {
    return `
      <section class="hero-band" style="--band:${color}">
        ${media}
        <div class="hero-body">
          <span class="info-label" style="color:${color}">${label}</span>
          ${contentHtml}
        </div>
      </section>
    `;
  }

  function pillCounter(label, path, color, ariaLabel) {
    const value = Number(getPath(state.meeting, path) || 0);
    const aria = ariaLabel || label || "인원";
    return `
      <div class="pill-counter" style="--pc:${color || "var(--blue)"}">
        ${label ? `<span class="pc-label">${label}</span>` : ""}
        <button class="pc-btn" type="button" data-action="counter-minus" data-path="${path}" aria-label="${escapeAttr(aria)} 줄이기">−</button>
        <input class="pc-input" type="number" min="0" data-field="${path}" value="${value}" aria-label="${escapeAttr(aria)}" /><span class="pc-unit">명</span>
        <button class="pc-btn plus" type="button" data-action="counter-plus" data-path="${path}" aria-label="${escapeAttr(aria)} 늘리기">＋</button>
      </div>
    `;
  }

  function sideCount(emoji, label, path, color) {
    const value = Number(getPath(state.meeting, path) || 0);
    return `
      <div class="side-count" style="--sc:${color}">
        <span class="sc-emoji">${emoji}</span>
        <span class="sc-label">${label}</span>
        <button class="sc-btn" type="button" data-action="counter-minus" data-path="${path}" aria-label="${escapeAttr(label)} 줄이기">−</button>
        <span class="sc-value">${value}명</span>
        <button class="sc-btn plus" type="button" data-action="counter-plus" data-path="${path}" aria-label="${escapeAttr(label)} 늘리기">＋</button>
      </div>
    `;
  }

  function faceCard(label, value, emoji, color) {
    return `
      <section class="card face-card" style="--fc:${color}">
        <span class="face">${emoji}</span>
        <span class="face-label">${label}</span>
        <span class="face-num">${Number(value) || 0}명</span>
      </section>
    `;
  }

  function noteCard(title, path, emoji, color) {
    const value = getPath(state.meeting, path) ?? "";
    return `
      <section class="card">
        <div class="panel-head" style="margin-bottom:8px">
          ${chip(emoji, color)}
          <span style="color:${color}; font-size:18px">${title}</span>
        </div>
        <textarea class="row-input" data-field="${path}" rows="3" aria-label="${escapeAttr(title)}">${escapeHtml(value)}</textarea>
      </section>
    `;
  }

  function pastelNote(title, path, emoji, color) {
    const value = getPath(state.meeting, path) ?? "";
    return `
      <section class="pastel-note" style="--note:${color}">
        <div class="panel-head">
          ${chip(emoji, color)}
          <span class="head-title">${title}</span>
        </div>
        <textarea class="row-input" data-field="${path}" rows="2" aria-label="${escapeAttr(title)}">${escapeHtml(value)}</textarea>
      </section>
    `;
  }

  function voteCard(title, subtitle, path, icon, color) {
    return `
      <section class="card vote-card" style="--vc:${color}">
        ${img(icon, `${title} 아이콘`, "vote-img")}
        <h3 class="vote-title">${title}</h3>
        <p class="vote-sub">${subtitle}</p>
        ${pillCounter("", path, color, title)}
      </section>
    `;
  }

  function renderOpinionCard(opinion, index) {
    const notes = ["#ef4f85", "#2f80ed", "#7857d9"];
    const note = notes[index % notes.length];
    return `
      <article class="opinion-card" style="--note:${note}">
        <span class="op-label">의견 · ${escapeHtml(opinion.category)}</span>
        <span class="op-text">${escapeHtml(opinion.text)}</span>
        <span class="op-sub"><b>이유</b> ${escapeHtml(opinion.reason)}</span>
        <span class="op-sub muted"><b>기대 효과</b> ${escapeHtml(opinion.expectedEffect || "함께 더 생각해요.")}</span>
        <div class="op-foot">
          <button class="like-pill" data-action="like-opinion" data-id="${opinion.id}" aria-label="공감하기">♥ ${opinion.likes}</button>
          <button class="row-x" data-action="delete-opinion" data-id="${opinion.id}" aria-label="의견 삭제">×</button>
        </div>
      </article>
    `;
  }

  function criteriaRow(label, key, emoji, color) {
    const score = Number(state.meeting.topicSelection.criteriaScores[key] || 0);
    return `
      <div class="criteria-row" style="--cr:${color}">
        <span class="chip sm" style="--chip:${color}">${emoji}</span>
        <span class="criteria-name">${label}</span>
        <div class="score-dots">
          ${Array.from({ length: 5 }, (_, index) => `
            <button type="button" class="${index < score ? "on" : ""}" data-action="set-criteria" data-key="${key}" data-score="${index + 1}" aria-label="${label} ${index + 1}점"></button>
          `).join("")}
        </div>
        <strong class="criteria-verdict">${score >= 4 ? "높음" : score >= 3 ? "보통" : "낮음"}</strong>
      </div>
    `;
  }

  function img(src, alt, className) {
    const loading = className.includes("mascot") ? "eager" : "lazy";
    return `<img class="${className}" src="${src}" alt="${escapeAttr(alt)}" loading="${loading}" onerror="this.classList.add('missing'); this.removeAttribute('src')" />`;
  }

  function goTo(pageNumber) {
    if (pageNumber > 0) {
      const current = state.meeting.currentPage;
      if (!state.meeting.flow.completedPages.includes(PAGES[current]?.id)) {
        state.meeting.flow.completedPages.push(PAGES[current]?.id);
      }
    }
    state.meeting.currentPage = pageNumber;
    queueSave();
    render();
  }

  async function newMeeting() {
    if (!confirm("현재 진행 중인 회의를 저장하고 새 회의를 시작할까요?")) return;
    await saveMeetingNow();
    const nextReview = state.meeting.decision?.nextReview || DEFAULT_MEETING.previous.promise;
    state.meeting = structuredClone(DEFAULT_MEETING);
    state.meeting.id = crypto.randomUUID ? crypto.randomUUID() : String(Date.now());
    state.meeting.createdAt = new Date().toISOString();
    state.meeting.updatedAt = new Date().toISOString();
    state.meeting.previous.promise = nextReview;
    state.meeting.currentPage = 1;
    queueSave();
    render();
  }

  function loadSample() {
    state.meeting = structuredClone(DEFAULT_MEETING);
    state.meeting.id = crypto.randomUUID ? crypto.randomUUID() : String(Date.now());
    state.meeting.currentPage = 1;
    queueSave();
    render();
  }

  async function continueLatest() {
    const snapshot = loadSnapshot();
    if (snapshot) {
      state.meeting = migrate(snapshot);
    } else if (state.recentMeetings[0]) {
      state.meeting = migrate(state.recentMeetings[0]);
    }
    state.meeting.currentPage = Math.max(1, state.meeting.currentPage || 1);
    render();
  }

  async function loadMeeting(id) {
    const meeting = await getMeeting(id);
    if (!meeting) return;
    state.meeting = migrate(meeting);
    state.meeting.currentPage = Math.max(1, state.meeting.currentPage || 1);
    queueSave();
    render();
  }

  function updateCounter(path, delta) {
    const next = Math.max(0, Number(getPath(state.meeting, path) || 0) + delta);
    setPath(state.meeting, path, next);
    queueSave();
    render();
  }

  function addStep() {
    if (state.meeting.flow.stepLabels.length >= 10) return;
    state.meeting.flow.stepLabels.push(`새 단계 ${state.meeting.flow.stepLabels.length + 1}`);
    queueSave();
    render();
  }

  function removeStep(index) {
    if (state.meeting.flow.stepLabels.length <= 6) return;
    state.meeting.flow.stepLabels.splice(index, 1);
    queueSave();
    render();
  }

  function addOpinion() {
    const draft = state.meeting.opinionDraft;
    if (!draft.text?.trim() || !draft.reason?.trim()) {
      playSound("fail");
      toast("✏️ 의견과 이유를 먼저 적어 주세요.", "warn");
      return;
    }
    state.meeting.opinions.push({
      id: crypto.randomUUID ? crypto.randomUUID() : `op-${Date.now()}`,
      text: draft.text.trim(),
      reason: draft.reason.trim(),
      expectedEffect: draft.expectedEffect.trim(),
      concern: draft.concern.trim(),
      category: draft.category.trim() || "학급 생활",
      likes: 0
    });
    state.meeting.opinionDraft = { text: "", reason: "", expectedEffect: "", concern: "", category: "학급 생활" };
    queueSave();
    render();
  }

  function deleteOpinion(id) {
    state.meeting.opinions = state.meeting.opinions.filter((opinion) => opinion.id !== id);
    queueSave();
    render();
  }

  function likeOpinion(id) {
    const opinion = state.meeting.opinions.find((item) => item.id === id);
    if (opinion) opinion.likes += 1;
    queueSave();
    render();
  }

  function selectTopic(label) {
    state.meeting.topicSelection.selectedTopic = `${label}가 좋을까요?`;
    state.meeting.vote.question = state.meeting.topicSelection.selectedTopic;
    queueSave();
    render();
  }

  function setCriteria(key, score) {
    if (!key || !score) return;
    state.meeting.topicSelection.criteriaScores[key] = score;
    queueSave();
    render();
  }

  function timerStart() {
    state.meeting.timer.running = true;
    state.meeting.timer.startedAt = Date.now();
    state.meeting.timer.pausedAt = null;
    queueSave();
    render();
  }

  function timerPause() {
    const timer = state.meeting.timer;
    if (timer.running) {
      timer.accumulatedMs += Date.now() - Number(timer.startedAt || Date.now());
      timer.running = false;
      timer.pausedAt = Date.now();
    } else {
      timer.running = true;
      timer.startedAt = Date.now();
      timer.pausedAt = null;
    }
    queueSave();
    render();
  }

  function timerExtend() {
    state.meeting.timer.durationMinutes += 1;
    queueSave();
    updateDependentText();
  }

  function startTimerLoop() {
    setInterval(() => {
      const node = document.getElementById("timerDisplay");
      if (node) node.textContent = formatTime(getRemainingMs());
    }, 1000);
  }

  function getRemainingMs() {
    const timer = state.meeting.timer;
    const elapsed = timer.accumulatedMs + (timer.running ? Date.now() - Number(timer.startedAt || Date.now()) : 0);
    return Math.max(0, timer.durationMinutes * 60 * 1000 - elapsed);
  }

  function formatTime(ms) {
    const totalSeconds = Math.ceil(ms / 1000);
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  }

  async function finalizeMeeting() {
    state.meeting.archived = false;
    state.meeting.updatedAt = new Date().toISOString();
    await saveMeetingNow();
    state.recentMeetings = await getAllMeetings();
    launchConfetti();
    toast("🎉 회의가 저장되었어요! PDF 또는 JSON으로도 백업해 주세요.");
  }

  function toast(message, tone = "info") {
    document.querySelectorAll(".toast").forEach((node) => node.remove());
    const node = document.createElement("div");
    node.className = `toast ${tone}`;
    node.setAttribute("role", "status");
    node.textContent = message;
    document.body.appendChild(node);
    setTimeout(() => node.classList.add("show"), 20);
    setTimeout(() => {
      node.classList.remove("show");
      setTimeout(() => node.remove(), 350);
    }, 2800);
  }

  function launchConfetti() {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const colors = ["#19b999", "#2f80ed", "#7857d9", "#ef4f85", "#f59e0b", "#7ccfff", "#ffb3cd"];
    const layer = document.createElement("div");
    layer.className = "confetti-layer";
    layer.setAttribute("aria-hidden", "true");
    for (let i = 0; i < 44; i += 1) {
      const piece = document.createElement("span");
      piece.className = "confetti-piece";
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.background = colors[i % colors.length];
      piece.style.animationDelay = `${Math.random() * 0.7}s`;
      piece.style.animationDuration = `${2 + Math.random() * 1.4}s`;
      piece.style.setProperty("--drift", `${(Math.random() - 0.5) * 220}px`);
      piece.style.setProperty("--spin", `${540 + Math.random() * 540}deg`);
      if (i % 3 === 0) piece.style.borderRadius = "50%";
      layer.appendChild(piece);
    }
    document.body.appendChild(layer);
    setTimeout(() => layer.remove(), 4200);
  }

  function exportJson() {
    const payload = {
      schemaVersion: SCHEMA_VERSION,
      exportedAt: new Date().toISOString(),
      appVersion: APP_VERSION,
      meetings: [state.meeting],
      settings: loadSettings()
    };
    downloadJson(payload, `class-meeting-${state.meeting.date || "backup"}.json`);
  }

  async function importJson(file) {
    if (!file) return;
    try {
      const text = await file.text();
      const payload = JSON.parse(text);
      const meeting = payload.meetings?.[0] || payload.meeting || payload;
      state.meeting = migrate(meeting);
      state.meeting.currentPage = Math.max(1, state.meeting.currentPage || 1);
      await saveMeetingNow();
      state.recentMeetings = await getAllMeetings();
      render();
    } catch (error) {
      console.warn(error);
      alert("JSON 파일을 불러오지 못했어요. 파일 형식을 확인해 주세요.");
    }
  }

  function downloadJson(payload, filename) {
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function copyReport() {
    const rows = Array.from(document.querySelectorAll(".report-row"));
    if (!rows.length) {
      toast("회의록(10단계) 화면에서 사용할 수 있어요.", "warn");
      return;
    }
    const text = rows.map((row) => row.innerText.replace(/\n/g, " ")).join("\n");
    await navigator.clipboard?.writeText(text);
    toast("📋 회의록 텍스트를 복사했어요.");
  }

  function queueSave() {
    saveSnapshot();
    clearTimeout(state.saveTimer);
    state.saveTimer = setTimeout(() => saveMeetingNow().catch(console.warn), 500);
  }

  function saveSnapshot() {
    try {
      localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(state.meeting));
      localStorage.setItem(SETTINGS_KEY, JSON.stringify({ schemaVersion: SCHEMA_VERSION, lastMeetingId: state.meeting.id }));
    } catch (error) {
      console.warn("snapshot save failed", error);
    }
  }

  function loadSnapshot() {
    try {
      const raw = localStorage.getItem(SNAPSHOT_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      console.warn("snapshot parse failed", error);
      return null;
    }
  }

  function loadSettings() {
    try {
      return JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}");
    } catch {
      return {};
    }
  }

  function openDb() {
    return new Promise((resolve, reject) => {
      if (!("indexedDB" in window)) {
        resolve(null);
        return;
      }
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains("meetings")) {
          const store = db.createObjectStore("meetings", { keyPath: "id" });
          store.createIndex("date", "date");
          store.createIndex("archived", "archived");
          store.createIndex("updatedAt", "updatedAt");
        }
        if (!db.objectStoreNames.contains("settings")) db.createObjectStore("settings", { keyPath: "id" });
        if (!db.objectStoreNames.contains("backupLogs")) {
          const logs = db.createObjectStore("backupLogs", { keyPath: "id" });
          logs.createIndex("createdAt", "createdAt");
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async function withStore(storeName, mode, callback) {
    const db = await openDb();
    if (!db) return null;
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, mode);
      const store = transaction.objectStore(storeName);
      const request = callback(store);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
      transaction.oncomplete = () => db.close();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async function saveMeetingNow() {
    saveSnapshot();
    const meeting = structuredClone(state.meeting);
    meeting.updatedAt = new Date().toISOString();
    await withStore("meetings", "readwrite", (store) => store.put(meeting));
  }

  async function getMeeting(id) {
    return withStore("meetings", "readonly", (store) => store.get(id));
  }

  async function getAllMeetings() {
    const meetings = await withStore("meetings", "readonly", (store) => store.getAll());
    return (meetings || []).sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)));
  }

  function migrate(input) {
    const meeting = deepMerge(structuredClone(DEFAULT_MEETING), input || {});
    meeting.schemaVersion = SCHEMA_VERSION;
    meeting.opinions = Array.isArray(meeting.opinions) ? meeting.opinions.map((opinion) => ({
      id: opinion.id || (crypto.randomUUID ? crypto.randomUUID() : `op-${Date.now()}`),
      text: opinion.text || "의견 미입력",
      reason: opinion.reason || "이유 미입력",
      expectedEffect: opinion.expectedEffect || "",
      concern: opinion.concern || "",
      category: opinion.category || "학급 생활",
      likes: Number(opinion.likes || 0)
    })) : [];
    meeting.flow.stepLabels = (meeting.flow.stepLabels || DEFAULT_MEETING.flow.stepLabels).slice(0, 10);
    while (meeting.flow.stepLabels.length < 10) meeting.flow.stepLabels.push(PAGES[meeting.flow.stepLabels.length + 1]?.short || "단계");
    meeting.currentPage = Number(meeting.currentPage || 1);
    return meeting;
  }

  function deepMerge(target, source) {
    for (const [key, value] of Object.entries(source || {})) {
      if (value && typeof value === "object" && !Array.isArray(value)) {
        target[key] = deepMerge(target[key] || {}, value);
      } else {
        target[key] = value;
      }
    }
    return target;
  }

  function getPath(object, path) {
    return path.split(".").reduce((acc, key) => acc?.[key], object);
  }

  function setPath(object, path, value) {
    const keys = path.split(".");
    const last = keys.pop();
    const target = keys.reduce((acc, key) => {
      if (acc[key] == null) acc[key] = /^\d+$/.test(keys[keys.indexOf(key) + 1]) ? [] : {};
      return acc[key];
    }, object);
    target[last] = value;
  }

  function normalizeInputValue(input) {
    if (input.type === "number") return Math.max(Number(input.min || 0), Number(input.value || 0));
    return input.value;
  }

  function updateDependentText() {
    const voteTotal = Number(state.meeting.vote.agree) + Number(state.meeting.vote.disagree) + Number(state.meeting.vote.hold);
    const agreeRate = voteTotal ? Math.round((Number(state.meeting.vote.agree) / voteTotal) * 100) : 0;
    const page = PAGES[state.meeting.currentPage];
    if (page?.id === "page_08_vote") {
      const display = document.querySelector(".rate");
      if (display) display.textContent = `${agreeRate}%`;
      const bar = document.querySelector(".result-panel .bar span");
      if (bar) bar.style.setProperty("--value", `${agreeRate}%`);
    }
  }

  function showRecovery(error) {
    console.warn("recovery screen", error);
    const template = document.getElementById("recovery-template");
    root.innerHTML = template.innerHTML;
    root.querySelector("[data-reload]")?.addEventListener("click", () => location.reload());
    root.querySelector("[data-export-fallback]")?.addEventListener("click", exportJson);
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function escapeAttr(value) {
    return escapeHtml(value);
  }

  window.__classMeetingStorageSmokeTest = async function storageSmokeTest(count = 120) {
    const base = structuredClone(state.meeting);
    for (let i = 0; i < count; i += 1) {
      state.meeting = structuredClone(base);
      state.meeting.id = `smoke-${Date.now()}-${i}`;
      state.meeting.title = `저장 테스트 ${i + 1}`;
      await saveMeetingNow();
    }
    state.meeting = base;
    await saveMeetingNow();
    return getAllMeetings();
  };
})();
