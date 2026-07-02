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
      asset("backgrounds", "ChatGPT Image 2026년 6월 11일 오후 11_58_33 (2).png"),
      asset("backgrounds", "ChatGPT Image 2026년 6월 11일 오후 11_58_50 (1).png"),
      asset("backgrounds", "ChatGPT Image 2026년 6월 12일 오전 12_01_15 (1).png"),
      asset("backgrounds", "ChatGPT Image 2026년 6월 12일 오전 12_01_48 (1).png"),
      asset("backgrounds", "ChatGPT Image 2026년 6월 12일 오전 12_02_33 (1).png"),
      asset("backgrounds", "ChatGPT Image 2026년 6월 12일 오후 03_41_19 (1).png"),
      asset("backgrounds", "ChatGPT Image 2026년 6월 12일 오후 03_41_47 (1).png")
    ],
    characters: {
      rabbit: asset("icons", "ChatGPT Image 2026년 6월 11일 오후 11_58_33 (1).png"),
      plannerRabbit: asset("icons", "ChatGPT Image 2026년 6월 11일 오후 11_58_51 (2).png"),
      fox: asset("icons", "ChatGPT Image 2026년 6월 11일 오후 11_59_29 (1).png"),
      squirrel: asset("icons", "ChatGPT Image 2026년 6월 12일 오전 12_00_15 (1).png"),
      owl: asset("icons", "ChatGPT Image 2026년 6월 12일 오전 12_02_44 (9).png"),
      penguin: asset("icons", "ChatGPT Image 2026년 6월 12일 오전 12_01_48 (2).png"),
      koala: asset("icons", "ChatGPT Image 2026년 6월 12일 오전 12_02_34 (2).png")
    },
    icons: {
      clipboard: asset("icons", "ChatGPT Image 2026년 6월 11일 오후 11_58_35 (4).png"),
      pencil: asset("icons", "ChatGPT Image 2026년 6월 11일 오후 11_58_37 (5).png"),
      megaphone: asset("icons", "ChatGPT Image 2026년 6월 11일 오후 11_58_54 (4).png"),
      check: asset("icons", "ChatGPT Image 2026년 6월 12일 오전 12_01_51 (4).png"),
      x: asset("icons", "ChatGPT Image 2026년 6월 12일 오전 12_01_54 (5).png"),
      pause: asset("icons", "ChatGPT Image 2026년 6월 12일 오전 12_01_56 (6).png"),
      chart: asset("icons", "ChatGPT Image 2026년 6월 12일 오전 12_01_57 (7).png"),
      lock: asset("icons", "ChatGPT Image 2026년 6월 12일 오전 12_01_59 (8).png"),
      question: asset("icons", "ChatGPT Image 2026년 6월 12일 오전 12_01_19 (3).png"),
      hands: asset("icons", "ChatGPT Image 2026년 6월 12일 오전 12_01_25 (6).png"),
      heart: asset("icons", "ChatGPT Image 2026년 6월 12일 오전 12_00_27 (6).png"),
      target: asset("icons", "ChatGPT Image 2026년 6월 12일 오전 12_00_56 (3).png"),
      calendar: asset("icons", "ChatGPT Image 2026년 6월 12일 오후 03_41_27 (5).png"),
      report: asset("icons", "ChatGPT Image 2026년 6월 12일 오전 12_02_37 (4).png"),
      plane: asset("icons", "ChatGPT Image 2026년 6월 12일 오전 12_02_43 (8).png"),
      board: asset("icons", "ChatGPT Image 2026년 6월 12일 오후 03_41_19 (3).png")
    }
  };

  const PAGES = [
    { id: "main", title: "학급회의 시간", subtitle: "30분 안에 의견, 토론, 투표, 결정, 회의록까지 이어가는 초등 심화 학급회의 도구", theme: "#19a78d", bg: ASSETS.backgrounds[0] },
    { id: "page_01_meeting_prepare", step: 1, short: "시작", title: "회의 준비 입력", subtitle: "안건과 문제 상황을 초등 심화 수준으로 정리합니다.", theme: "#159f84", bg: ASSETS.backgrounds[0], mascot: ASSETS.characters.rabbit },
    { id: "page_02_flow_setup", step: 2, short: "설정", title: "회의 흐름 설정", subtitle: "회의 단계, 역할, 결정 기준을 먼저 정합니다.", theme: "#6d50dc", bg: ASSETS.backgrounds[1], mascot: ASSETS.characters.plannerRabbit },
    { id: "page_03_start_guide", step: 3, short: "의견", title: "회의 시작 안내", subtitle: "목표와 규칙을 확인하고 30분 회의를 시작합니다.", theme: "#2372df", bg: ASSETS.backgrounds[2], mascot: ASSETS.characters.fox },
    { id: "page_04_reflection", step: 4, short: "정리", title: "지난 회의 실천 반성", subtitle: "잘했는지보다 왜 그랬는지 분석합니다.", theme: "#e54b79", bg: ASSETS.backgrounds[2], mascot: ASSETS.characters.squirrel },
    { id: "page_05_opinion_board", step: 5, short: "의견 게시판", title: "의견 게시판", subtitle: "의견은 이유와 걱정되는 점까지 함께 적습니다.", theme: "#159f84", bg: ASSETS.backgrounds[2], mascot: ASSETS.characters.squirrel },
    { id: "page_06_opinion_summary", step: 6, short: "의견 모아보기", title: "의견 모아보기", subtitle: "공감순이 아니라 기준 비교로 토론 주제를 정합니다.", theme: "#6d50dc", bg: ASSETS.backgrounds[5], mascot: ASSETS.characters.owl },
    { id: "page_07_discussion", step: 7, short: "토론", title: "토론 진행", subtitle: "질문, 찬성 이유, 걱정되는 점, 수정 제안을 균형 있게 다룹니다.", theme: "#f28a16", bg: ASSETS.backgrounds[3], mascot: ASSETS.characters.rabbit },
    { id: "page_08_vote", step: 8, short: "투표", title: "투표하기 / 거수 수합", subtitle: "찬성, 반대, 보류를 기록하고 결과를 해석합니다.", theme: "#2f80ed", bg: ASSETS.backgrounds[3], mascot: ASSETS.characters.penguin },
    { id: "page_09_decision", step: 9, short: "결정사항 정리", title: "결정사항 정리", subtitle: "결정을 실천 계획과 다음 회의 확인 기준으로 바꿉니다.", theme: "#159f84", bg: ASSETS.backgrounds[4], mascot: ASSETS.characters.fox },
    { id: "page_10_report", step: 10, short: "회의록", title: "결과 공유 / 회의록", subtitle: "과정과 결정 근거를 저장하고 다음 회의로 연결합니다.", theme: "#6d50dc", bg: ASSETS.backgrounds[6], mascot: ASSETS.characters.koala }
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
    renderTimer: null
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
      root.innerHTML = page.id === "main" ? renderLanding(page) : renderPage(page);
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
        ${renderToolbar()}
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
        <section class="panel">
          <div class="grid two">
            ${field("회의 제목", "title")}
            ${field("날짜", "date", "date")}
            ${field("학급 인원", "totalStudents", "number", { min: 1, max: 40 })}
            ${selectField("회의 수준", "depthMode", [["basic", "기본형"], ["advanced", "심화형"]])}
          </div>
          <div class="grid" style="margin-top:18px">
            ${field("오늘의 안건", "agenda.title")}
            ${field("문제 상황 설명", "agenda.problemContext", "textarea")}
            ${field("기대하는 변화", "agenda.expectedOutcome", "textarea")}
            ${field("지난 회의 약속", "previous.promise")}
          </div>
          <div class="warning">심화형에서는 안건뿐 아니라 문제 상황과 기대하는 변화를 함께 적어야 회의가 깊어집니다.</div>
        </section>
      </div>
    `;
  }

  function renderFlowSetup() {
    const roles = [
      ["host", "사회자", "순서 진행, 발언권 안내, 다음 단계 이동", "#19b999"],
      ["recorder", "기록자", "의견, 거수 수, 결정사항 기록", "#49a4f5"],
      ["timeKeeper", "시간관리자", "타이머 확인과 시간 연장 안내", "#8b5cf6"],
      ["encourager", "격려자", "존중 표현과 경청 태도 확인", "#f472b6"]
    ];
    return `
      <div class="workspace wide">
        <div class="grid main">
          <section class="panel">
            <h2>단계 이름</h2>
            <ul class="list">
              ${state.meeting.flow.stepLabels.map((label, index) => `
                <li class="list-row">
                  <span class="badge">${index + 1}</span>
                  <input data-field="flow.stepLabels.${index}" value="${escapeAttr(label)}" aria-label="${index + 1}단계 이름" />
                  <button class="icon-btn minus" data-action="remove-step" data-index="${index}" aria-label="단계 삭제">×</button>
                </li>
              `).join("")}
            </ul>
            <div class="actions">
              <button class="btn secondary" data-action="add-step">단계 추가</button>
            </div>
          </section>
          <section class="panel">
            <h2>오늘의 역할</h2>
            ${roles.map(([key, label, desc, color]) => `
              <div class="role-row">
                <span class="role-dot" style="--role-color:${color}">${label.slice(0, 1)}</span>
                <div class="field">
                  <label>${label}</label>
                  <input data-field="roles.${key}" value="${escapeAttr(state.meeting.roles[key])}" />
                  <span class="muted small-text">${desc}</span>
                </div>
              </div>
            `).join("")}
            <div class="card compact" style="margin-top:18px; border-color:#ffd36b">
              <h3 class="card-title" style="color:#e08a00">결정 기준</h3>
              <div class="grid two">
                ${field("찬성 기준(%)", "decisionRules.agreeThreshold", "number", { min: 1, max: 100 })}
                ${field("보류 재논의 기준(%)", "decisionRules.holdThreshold", "number", { min: 1, max: 100 })}
              </div>
            </div>
          </section>
        </div>
      </div>
    `;
  }

  function renderStartGuide() {
    const rules = [
      "친구의 말을 끝까지 듣는다.",
      "의견에는 이유를 함께 말한다.",
      "반대할 때는 사람보다 의견에 대해 말한다.",
      "결정 후에는 실천 방법까지 정한다."
    ];
    return `
      <div class="workspace">
        <div class="grid main">
          <section class="panel">
            <h2>우리 반 회의 약속</h2>
            <ul class="list">
              ${rules.map((rule, index) => `
                <li class="list-row"><span class="badge">${index + 1}</span><strong>${rule}</strong></li>
              `).join("")}
            </ul>
          </section>
          <section class="panel">
            <div class="with-icon">
              ${img(ASSETS.icons.megaphone, "안건 아이콘", "asset-icon large")}
              <div>
                <p class="page-kicker">오늘의 안건</p>
                <h2>${escapeHtml(state.meeting.agenda.title)}</h2>
              </div>
            </div>
            <p class="big-line">목표: ${escapeHtml(state.meeting.agenda.expectedOutcome)}</p>
            <div class="card compact" style="margin-top:18px">
              <strong>진행자 멘트</strong>
              <p>지금부터 오늘의 학급회의를 시작하겠습니다. 오늘은 ${escapeHtml(state.meeting.agenda.title)}에 대해 이야기하겠습니다.</p>
            </div>
            ${renderTimerPanel()}
          </section>
        </div>
      </div>
    `;
  }

  function renderReflection() {
    const total = state.meeting.previous.handRaise.good + state.meeting.previous.handRaise.normal + state.meeting.previous.handRaise.hard;
    return `
      <div class="workspace wide">
        <section class="hero-card with-icon">
          ${img(ASSETS.icons.clipboard, "지난 약속 아이콘", "asset-icon large")}
          <div>
            <p class="page-kicker">지난 회의 약속</p>
            <p class="big-line">${escapeHtml(state.meeting.previous.promise || "지난 회의에서 정한 약속")}</p>
          </div>
        </section>
        <div class="grid three" style="margin-top:22px">
          ${metricCard("잘 지켜졌어요", "previous.handRaise.good", ASSETS.icons.check, "#19b999")}
          ${metricCard("보통이에요", "previous.handRaise.normal", ASSETS.icons.pause, "#f59e0b")}
          ${metricCard("조금 어려웠어요", "previous.handRaise.hard", ASSETS.icons.x, "#e54b79")}
        </div>
        ${total > state.meeting.totalStudents ? `<div class="warning">거수 합계 ${total}명이 학급 인원 ${state.meeting.totalStudents}명을 넘었어요. 수를 다시 확인해 주세요.</div>` : ""}
        <div class="grid three" style="margin-top:22px">
          ${textCard("실천 근거", "previous.evidence", ASSETS.icons.question)}
          ${textCard("어려웠던 원인", "previous.cause", ASSETS.icons.heart)}
          ${textCard("개선 제안", "previous.improvement", ASSETS.icons.pencil)}
        </div>
      </div>
    `;
  }

  function renderOpinionBoard() {
    return `
      <div class="workspace wide">
        <section class="hero-card with-icon">
          ${img(ASSETS.icons.clipboard, "안건 아이콘", "asset-icon large")}
          <div>
            <p class="page-kicker">오늘의 안건</p>
            <p class="big-line">${escapeHtml(state.meeting.agenda.title)}</p>
          </div>
        </section>
        <div class="grid three" style="margin-top:22px">
          ${state.meeting.opinions.slice(0, 3).map((opinion, index) => renderOpinionCard(opinion, index)).join("")}
        </div>
        <section class="panel" style="margin-top:22px">
          <h2>내 의견</h2>
          <div class="grid two">
            ${field("의견", "opinionDraft.text")}
            ${field("이유", "opinionDraft.reason")}
            ${field("기대 효과", "opinionDraft.expectedEffect")}
            ${field("걱정되는 점", "opinionDraft.concern")}
            ${field("카테고리", "opinionDraft.category")}
            ${counter("발표 희망 거수", "opinionPresenterHands")}
          </div>
          <div class="actions">
            <button class="btn primary" data-action="add-opinion">의견 등록</button>
          </div>
        </section>
      </div>
    `;
  }

  function renderOpinionSummary() {
    const top = [...state.meeting.opinions].sort((a, b) => b.likes - a.likes).slice(0, 3);
    const criteria = [
      ["공정성", "fairness"],
      ["실현 가능성", "feasibility"],
      ["안전성", "safety"],
      ["준비물 필요", "preparation"],
      ["담당자 부담", "burden"]
    ];
    return `
      <div class="workspace wide">
        <div class="grid two">
          <section class="panel">
            <h2>공감 많은 의견</h2>
            <ul class="list">
              ${top.map((opinion, index) => `
                <li class="list-row">
                  <span class="badge">${index + 1}</span>
                  <strong>${escapeHtml(opinion.text)}</strong>
                  <span class="tag">♥ ${opinion.likes}</span>
                </li>
              `).join("")}
            </ul>
          </section>
          <section class="panel">
            <h2>기준 비교</h2>
            ${criteria.map(([label, key]) => criteriaRow(label, state.meeting.topicSelection.criteriaScores[key] || 0)).join("")}
          </section>
        </div>
        <section class="hero-card" style="margin-top:22px">
          <p class="page-kicker">선택된 토론 주제</p>
          <p class="big-line">${escapeHtml(state.meeting.topicSelection.selectedTopic)}</p>
          <div class="grid three" style="margin-top:20px">
            ${state.meeting.topicSelection.candidates.map((candidate) => `
              <div class="card compact">
                <strong>${escapeHtml(candidate.label)}</strong>
                ${counter("후보 거수", `topicSelection.candidates.${state.meeting.topicSelection.candidates.indexOf(candidate)}.hands`)}
                <button class="btn secondary" data-action="select-topic" data-label="${escapeAttr(candidate.label)}" style="width:100%;margin-top:12px">토론 주제로 선택</button>
              </div>
            `).join("")}
          </div>
        </section>
      </div>
    `;
  }

  function renderDiscussion() {
    return `
      <div class="workspace wide">
        <section class="hero-card with-icon">
          ${img(ASSETS.icons.megaphone, "토론 아이콘", "asset-icon large")}
          <div>
            <p class="page-kicker">토론 주제</p>
            <p class="big-line">${escapeHtml(state.meeting.topicSelection.selectedTopic)}</p>
          </div>
        </section>
        <div class="grid two" style="margin-top:22px">
          ${textCard("제안 설명", "discussion.proposal", ASSETS.icons.report)}
          ${textCard("궁금한 점", "discussion.questions", ASSETS.icons.question)}
          ${textCard("찬성 이유", "discussion.agreeReasons", ASSETS.icons.check)}
          ${textCard("걱정되는 점", "discussion.concerns", ASSETS.icons.x)}
          ${textCard("수정 제안", "discussion.revisionSuggestion", ASSETS.icons.pencil)}
          <section class="card">
            <h3 class="card-title">발언 거수</h3>
            ${counter("발표 희망", "discussion.handRaise.presenters")}
            ${counter("질문 있음", "discussion.handRaise.questions")}
            ${counter("찬성 발언", "discussion.handRaise.agreeSpeakers")}
            ${counter("걱정 발언", "discussion.handRaise.concernSpeakers")}
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
        <section class="hero-card with-icon">
          ${img(ASSETS.icons.lock, "투표 아이콘", "asset-icon large")}
          <div>
            <p class="page-kicker">투표 질문</p>
            <p class="big-line">${escapeHtml(state.meeting.vote.question || state.meeting.topicSelection.selectedTopic)}</p>
          </div>
        </section>
        <div class="grid three" style="margin-top:22px">
          ${voteCard("찬성", "좋다고 생각해요", "vote.agree", ASSETS.icons.check, "#19b999")}
          ${voteCard("반대", "다른 방법이 필요해요", "vote.disagree", ASSETS.icons.x, "#e54b79")}
          ${voteCard("보류", "조금 더 생각해요", "vote.hold", ASSETS.icons.pause, "#8b5cf6")}
        </div>
        ${warning}
        <div class="grid two" style="margin-top:22px">
          <section class="panel">
            <h2>결과 해석</h2>
            <div class="metric" style="--metric-color:#159f84">
              <span class="label">찬성률</span>
              <span class="value">${agreeRate}%</span>
              <div class="bar" style="--metric-color:#159f84"><span style="--value:${agreeRate}%"></span></div>
            </div>
            <p><strong>${interpretation}</strong></p>
          </section>
          <section class="panel">
            <h2>결정 기준</h2>
            <ul class="list">
              <li class="list-row"><span class="badge">%</span>찬성 ${state.meeting.decisionRules.agreeThreshold}% 이상이면 채택 후보</li>
              <li class="list-row"><span class="badge">?</span>보류 ${state.meeting.decisionRules.holdThreshold}% 이상이면 재논의 권장</li>
              <li class="list-row"><span class="badge">!</span>안전 문제가 있으면 조건 검토</li>
            </ul>
          </section>
        </div>
      </div>
    `;
  }

  function renderDecision() {
    return `
      <div class="workspace wide">
        <section class="hero-card with-icon">
          ${img(ASSETS.icons.chart, "투표 결과 아이콘", "asset-icon large")}
          <div>
            <p class="page-kicker">투표 결과 요약</p>
            <p class="big-line">찬성 ${state.meeting.vote.agree}명 · 반대 ${state.meeting.vote.disagree}명 · 보류 ${state.meeting.vote.hold}명</p>
          </div>
        </section>
        <div class="grid two" style="margin-top:22px">
          ${textCard("오늘의 결정", "decision.text", ASSETS.icons.target)}
          ${textCard("실천 방법", "decision.practiceMethod", ASSETS.icons.check)}
          ${textCard("담당자", "decision.owner", ASSETS.icons.hands)}
          ${textCard("실천 기간", "decision.period", ASSETS.icons.calendar)}
          ${textCard("성공 기준", "decision.successCriteria", ASSETS.icons.heart)}
          ${textCard("다음 회의 확인", "decision.nextReview", ASSETS.icons.clipboard)}
        </div>
        <section class="panel" style="margin-top:22px">
          ${counter("담당자 지원 거수", "decision.volunteerHands")}
        </section>
      </div>
    `;
  }

  function renderReport() {
    const rows = [
      ["회의 제목", state.meeting.title],
      ["날짜", state.meeting.date],
      ["학급 인원", `${state.meeting.totalStudents}명`],
      ["오늘의 역할", `사회자 ${state.meeting.roles.host}, 기록자 ${state.meeting.roles.recorder}, 시간관리자 ${state.meeting.roles.timeKeeper}, 격려자 ${state.meeting.roles.encourager}`],
      ["지난 약속 반성", `${state.meeting.previous.promise} · 잘 지킴 ${state.meeting.previous.handRaise.good}명 / 보통 ${state.meeting.previous.handRaise.normal}명 / 어려움 ${state.meeting.previous.handRaise.hard}명`],
      ["주요 의견", state.meeting.opinions.slice(0, 3).map((op) => `${op.text} (${op.reason})`).join(" / ")],
      ["토론 주제", state.meeting.topicSelection.selectedTopic],
      ["토론 요약", `제안: ${state.meeting.discussion.proposal} / 걱정: ${state.meeting.discussion.concerns} / 수정: ${state.meeting.discussion.revisionSuggestion}`],
      ["거수 기록", `발표 ${state.meeting.discussion.handRaise.presenters}명, 질문 ${state.meeting.discussion.handRaise.questions}명, 찬성 발언 ${state.meeting.discussion.handRaise.agreeSpeakers}명, 걱정 발언 ${state.meeting.discussion.handRaise.concernSpeakers}명`],
      ["투표 결과", `찬성 ${state.meeting.vote.agree}명 / 반대 ${state.meeting.vote.disagree}명 / 보류 ${state.meeting.vote.hold}명`],
      ["오늘의 결정", state.meeting.decision.text],
      ["실천 방법", state.meeting.decision.practiceMethod],
      ["담당자", state.meeting.decision.owner],
      ["실천 기간", state.meeting.decision.period],
      ["성공 기준", state.meeting.decision.successCriteria],
      ["다음 회의 확인", state.meeting.decision.nextReview],
      ["선생님 한마디", state.meeting.teacherComment]
    ];

    return `
      <div class="workspace wide">
        <div class="grid main">
          <section class="panel">
            <div class="with-icon">
              ${img(ASSETS.icons.report, "회의록 아이콘", "asset-icon large")}
              <div>
                <p class="page-kicker">오늘의 회의록</p>
                <h2>${escapeHtml(state.meeting.title)}</h2>
              </div>
            </div>
            <div id="reportText" class="report-table" style="margin-top:18px">
              ${rows.map(([label, value]) => `
                <div class="report-row"><b>${escapeHtml(label)}</b><span>${escapeHtml(value || "아직 입력하지 않았어요.")}</span></div>
              `).join("")}
            </div>
          </section>
          <section class="panel">
            <h2>오늘의 결정</h2>
            <p class="big-line">${escapeHtml(state.meeting.decision.text)}</p>
            <div class="card compact" style="margin-top:18px">
              <h3 class="card-title">다음 회의에서 확인</h3>
              <p>${escapeHtml(state.meeting.decision.nextReview)}</p>
            </div>
            ${field("선생님 한마디", "teacherComment", "textarea")}
          </section>
        </div>
      </div>
    `;
  }

  function renderNav(step) {
    return `
      <div class="bottom-actions">
        ${step > 1 ? `<button class="btn secondary" data-action="prev">이전 단계</button>` : ""}
        ${step < 10 ? `<button class="btn primary" data-action="next">다음 단계 →</button>` : `
          <button class="btn primary" data-action="save-report">회의 저장</button>
          <button class="btn secondary" data-action="print">PDF 저장</button>
          <button class="btn mint" data-action="export-json">JSON 백업</button>
          <button class="btn dark" data-action="copy-report">회의록 복사</button>
        `}
      </div>
    `;
  }

  function renderToolbar() {
    return `
      <div class="toolbar" aria-label="빠른 도구">
        <button type="button" data-action="export-json" title="JSON 백업">JS</button>
        <button type="button" data-action="print" title="PDF 저장">PDF</button>
      </div>
    `;
  }

  function field(label, path, type = "text", attrs = {}) {
    const value = getPath(state.meeting, path) ?? "";
    if (type === "textarea") {
      return `<div class="field"><label>${label}</label><textarea data-field="${path}">${escapeHtml(value)}</textarea></div>`;
    }
    const attrText = Object.entries(attrs).map(([key, val]) => `${key}="${escapeAttr(val)}"`).join(" ");
    return `<div class="field"><label>${label}</label><input type="${type}" data-field="${path}" value="${escapeAttr(value)}" ${attrText} /></div>`;
  }

  function selectField(label, path, options) {
    const value = getPath(state.meeting, path);
    return `
      <div class="field">
        <label>${label}</label>
        <select data-field="${path}">
          ${options.map(([optionValue, text]) => `<option value="${optionValue}" ${optionValue === value ? "selected" : ""}>${text}</option>`).join("")}
        </select>
      </div>
    `;
  }

  function counter(label, path) {
    const value = Number(getPath(state.meeting, path) || 0);
    return `
      <div class="counter" style="margin-top:10px">
        <span class="counter-label">${label}</span>
        <div class="counter-controls">
          <button class="icon-btn minus" type="button" data-action="counter-minus" data-path="${path}" aria-label="${label} 줄이기">−</button>
          <input type="number" min="0" data-field="${path}" value="${value}" aria-label="${label}" />
          <button class="icon-btn" type="button" data-action="counter-plus" data-path="${path}" aria-label="${label} 늘리기">+</button>
        </div>
      </div>
    `;
  }

  function metricCard(label, path, icon, color) {
    const value = Number(getPath(state.meeting, path) || 0);
    return `
      <section class="card">
        <div class="with-icon">
          ${img(icon, `${label} 아이콘`, "asset-icon")}
          <div class="metric" style="--metric-color:${color};flex:1">
            <strong>${label}</strong>
            <span class="value">${value}명</span>
          </div>
        </div>
        ${counter(label, path)}
      </section>
    `;
  }

  function voteCard(title, subtitle, path, icon, color) {
    return `
      <section class="card" style="--theme:${color}">
        <div class="with-icon">
          ${img(icon, `${title} 아이콘`, "asset-icon large")}
          <div>
            <h3 class="card-title" style="color:${color}">${title}</h3>
            <p class="muted"><strong>${subtitle}</strong></p>
          </div>
        </div>
        ${counter(title, path)}
      </section>
    `;
  }

  function textCard(title, path, icon) {
    return `
      <section class="card">
        <div class="with-icon">
          ${img(icon, `${title} 아이콘`, "asset-icon")}
          <h3 class="card-title">${title}</h3>
        </div>
        ${field(title, path, "textarea")}
      </section>
    `;
  }

  function renderOpinionCard(opinion, index) {
    const notes = ["#ef4f85", "#49a4f5", "#8b5cf6"];
    return `
      <article class="opinion-card" style="--note:${notes[index % notes.length]}">
        <span class="tag">${escapeHtml(opinion.category)}</span>
        <strong>${escapeHtml(opinion.text)}</strong>
        <span>이유: ${escapeHtml(opinion.reason)}</span>
        <span class="muted">기대 효과: ${escapeHtml(opinion.expectedEffect || "함께 더 생각해요.")}</span>
        <div class="with-icon" style="justify-content:space-between">
          <button class="btn secondary" data-action="like-opinion" data-id="${opinion.id}" style="min-height:44px;font-size:16px">♥ ${opinion.likes}</button>
          <button class="icon-btn minus" data-action="delete-opinion" data-id="${opinion.id}" aria-label="의견 삭제">×</button>
        </div>
      </article>
    `;
  }

  function criteriaRow(label, score) {
    return `
      <div class="criteria-row">
        <span>${label}</span>
        <div class="score-dots">${Array.from({ length: 5 }, (_, index) => `<span class="${index < score ? "on" : ""}"></span>`).join("")}</div>
        <strong>${score >= 4 ? "높음" : score >= 3 ? "보통" : "낮음"}</strong>
      </div>
    `;
  }

  function renderTimerPanel() {
    return `
      <div class="card compact" style="margin-top:18px">
        <h3 class="card-title">타이머</h3>
        <p class="big-line" id="timerDisplay">${formatTime(getRemainingMs())}</p>
        <div class="actions">
          <button class="btn primary" data-action="timer-start">${state.meeting.timer.running ? "다시 시작" : "타이머 시작"}</button>
          <button class="btn secondary" data-action="timer-pause">${state.meeting.timer.running ? "일시정지" : "재개"}</button>
          <button class="btn secondary" data-action="timer-extend">1분 연장</button>
        </div>
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
      alert("의견과 이유를 먼저 적어 주세요.");
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
    alert("회의가 저장되었습니다. PDF 또는 JSON으로도 백업해 주세요.");
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
    const text = Array.from(document.querySelectorAll(".report-row"))
      .map((row) => row.innerText)
      .join("\n");
    await navigator.clipboard?.writeText(text);
    alert("회의록 텍스트를 복사했습니다.");
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
    const voteTotal = state.meeting.vote.agree + state.meeting.vote.disagree + state.meeting.vote.hold;
    const agreeRate = voteTotal ? Math.round((state.meeting.vote.agree / voteTotal) * 100) : 0;
    const page = PAGES[state.meeting.currentPage];
    if (page?.id === "page_08_vote") {
      const display = document.querySelector(".metric .value");
      if (display) display.textContent = `${agreeRate}%`;
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
