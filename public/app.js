(() => {
  "use strict";

  const SCHEMA_VERSION = 11;
  const APP_VERSION = "2026.07.16-ten-page-redesign";
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
      mail: asset("icons/discuss", "57.png"),
      people: asset("icons/discuss", "49.png"),
      clock: asset("icons/discuss", "50.png"),
      rules: asset("icons/discuss", "17.png"),
      listen: asset("icons/discuss", "19.png"),
      promise: asset("icons/discuss", "22.png"),
      happy: asset("icons/discuss", "25.png"),
      neutral: asset("icons/discuss", "26.png"),
      concern: asset("icons/discuss", "48.png"),
      search: asset("icons/discuss", "38.png"),
      idea: asset("icons/discuss", "40.png"),
      role: asset("icons/discuss", "42.png"),
      badge: asset("icons/discuss", "10.png"),
      speech: asset("icons/discuss", "60.png"),
      group: asset("icons/discuss", "69.png"),
      podium: asset("icons/discuss", "70.png")
    },
    titles: {
      main: asset("titles", "title-main.png"),
      prepare: asset("titles", "title-prepare.png"),
      reflection: asset("titles", "title-reflection.png"),
      opinionBoard: asset("titles", "title-opinion-board.png"),
      opinionSummary: asset("titles", "title-opinion-summary.png"),
      discussion: asset("titles", "title-discussion.png"),
      vote: asset("titles", "title-vote.png"),
      decision: asset("titles", "title-decision.png"),
      report: asset("titles", "title-report.png"),
      slogan: asset("titles", "title-slogan.png")
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
    "complete-save": "success",
    "timer-start": "open",
    "select-topic": "open",
    "delete-opinion": "fail"
  };

  const audioCache = {};

  function playSound(name) {
    try {
      if (!state.meeting.sfxEnabled || !SOUNDS[name]) return;
      if (!audioCache[name]) {
        audioCache[name] = new Audio(SOUNDS[name].path);
        audioCache[name].preload = "auto";
      }
      const node = audioCache[name];
      node.volume = SOUNDS[name].volume;
      node.currentTime = 0;
      node.play().catch(() => {});
    } catch (error) {
      console.warn("sound skipped", error);
    }
  }

  const POSTER_STYLES = [
    {
      id: "mint",
      name: "민트 새싹",
      mood: "산뜻하고 차분한 기본",
      mascot: ASSETS.characters.rabbit,
      icons: { head: ASSETS.icons.target, how: ASSETS.icons.pencil, who: ASSETS.icons.role, when: ASSETS.icons.calendar, talk: ASSETS.icons.speech, vote: ASSETS.icons.hands, closing: ASSETS.icons.heart }
    },
    {
      id: "sky",
      name: "파란 하늘",
      mood: "시원한 하늘 여행",
      mascot: ASSETS.characters.penguin,
      icons: { head: ASSETS.icons.plane, how: ASSETS.icons.board, who: ASSETS.icons.people, when: ASSETS.icons.clock, talk: ASSETS.icons.question, vote: ASSETS.icons.check, closing: ASSETS.icons.mail }
    },
    {
      id: "sunny",
      name: "노란 축제",
      mood: "신나는 축제 느낌",
      mascot: ASSETS.characters.fox,
      icons: { head: ASSETS.icons.megaphoneBig, how: ASSETS.icons.clipboard, who: ASSETS.icons.group, when: ASSETS.icons.calendar, talk: ASSETS.icons.podium, vote: ASSETS.icons.badge, closing: ASSETS.icons.happy }
    },
    {
      id: "pink",
      name: "분홍 하트",
      mood: "따뜻하고 다정한 느낌",
      mascot: ASSETS.characters.squirrel,
      icons: { head: ASSETS.icons.heart, how: ASSETS.icons.pencil, who: ASSETS.icons.people, when: ASSETS.icons.clock, talk: ASSETS.icons.speech, vote: ASSETS.icons.hands, closing: ASSETS.icons.happy }
    },
    {
      id: "violet",
      name: "보라 별밤",
      mood: "차분한 별밤 무드",
      mascot: ASSETS.characters.owl,
      icons: { head: ASSETS.icons.idea, how: ASSETS.icons.report, who: ASSETS.icons.role, when: ASSETS.icons.calendar, talk: ASSETS.icons.question, vote: ASSETS.icons.chart, closing: ASSETS.icons.heart }
    }
  ];

  // 상시 노출 아이콘은 글리프 대신 SVG로 그린다. ⌂·⚙·Ⅱ 같은 글자는 기기에 따라 빈 네모로 나온다.
  const ICON = {
    home: `<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 3.1 2.6 11.2h2.5v9.7h5.1v-5.6h3.6v5.6h5.1v-9.7h2.5z"/></svg>`,
    // 슬라이더 모양은 "설정"으로 안 읽힌다. 아이들이 아는 톱니바퀴로.
    settings: `<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 2.6l1.9.55.95 1.75 1.98.16 1.4 1.4.16 1.98 1.75.95L21.4 12l-.55 1.9-1.75.95-.16 1.98-1.4 1.4-1.98.16-.95 1.75L12 21.4l-1.9-.55-.95-1.75-1.98-.16-1.4-1.4-.16-1.98-1.75-.95L2.6 12l.55-1.9 1.75-.95.16-1.98 1.4-1.4 1.98-.16.95-1.75z" fill="currentColor"/><circle cx="12" cy="12" r="3.6" fill="#fff"/></svg>`,
    play: `<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7.4 4.6 19.2 12 7.4 19.4z"/></svg>`,
    pause: `<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="6.4" y="4.8" width="4.3" height="14.4" rx="1.3"/><rect x="13.3" y="4.8" width="4.3" height="14.4" rx="1.3"/></svg>`
  };

  const PAGES = [
    { id: "main", title: "우리반 학급회의", subtitle: "우리 반의 일을 우리 손으로 정하는 회의 시간", theme: "#19a78d", bg: ASSETS.backgrounds[0], mascot: ASSETS.characters.rabbit, titleArt: ASSETS.titles.main },
    { id: "page_01_meeting_prepare", step: 1, short: "준비", title: "회의 준비", subtitle: "", theme: "#159f84", bg: ASSETS.backgrounds[0], mascot: ASSETS.characters.rabbit, titleArt: ASSETS.titles.prepare },
    { id: "page_02_flow_setup", step: 2, short: "순서", title: "우리 회의 순서 고르기", subtitle: "", theme: "#6d50dc", bg: ASSETS.backgrounds[1], mascot: ASSETS.characters.plannerRabbit },
    { id: "page_03_start_guide", step: 3, short: "시작", title: "학급회의를 위한 우리의 약속", subtitle: "", theme: "#2372df", bg: ASSETS.backgrounds[2], mascot: ASSETS.characters.fox },
    { id: "page_04_reflection", step: 4, short: "지난번 보기", title: "지난번 약속 돌아보기", subtitle: "", theme: "#e54b79", bg: ASSETS.backgrounds[2], mascot: asset("icons/discuss", "23.png"), titleArt: ASSETS.titles.reflection },
    { id: "page_05_opinion_board", step: 5, short: "생각 적기", title: "우리 생각 적기", subtitle: "내 생각과 이유, 좋아질 점, 걱정되는 점을 함께 적어요.", theme: "#159f84", bg: ASSETS.backgrounds[2], mascot: ASSETS.characters.squirrel, titleArt: ASSETS.titles.opinionBoard },
    { id: "page_06_opinion_summary", step: 6, short: "생각 모아 손들기", title: "생각 모아 손들기", subtitle: "앞에서 나온 생각과 이유를 모아 보고, 같은 생각에 손든 친구 수를 적어요.", theme: "#6d50dc", bg: ASSETS.backgrounds[1], mascot: ASSETS.characters.owl, titleArt: ASSETS.titles.opinionSummary },
    { id: "page_07_discussion", step: 7, short: "함께 토의", title: "함께 토의하기", subtitle: "좋은 점과 걱정되는 점을 듣고 더 좋은 방법을 찾아봐요.", theme: "#f28a16", bg: ASSETS.backgrounds[3], mascot: ASSETS.characters.rabbit, titleArt: ASSETS.titles.discussion },
    { id: "page_08_vote", step: 8, short: "손들기", title: "손들어 정하기", subtitle: "좋아요와 다른 생각으로 나누어 손든 친구 수와 비율을 확인해요.", theme: "#2f80ed", bg: ASSETS.backgrounds[3], mascot: ASSETS.characters.penguin, titleArt: ASSETS.titles.vote },
    { id: "page_09_decision", step: 9, short: "정한 일", title: "함께 정한 일 적기", subtitle: "무엇을, 누가, 언제까지 할지 쉽게 적어요.", theme: "#159f84", bg: ASSETS.backgrounds[4], mascot: asset("icons/discuss", "66.png"), titleArt: ASSETS.titles.decision },
    { id: "page_10_report", step: 10, short: "마무리", title: "오늘 회의 한눈에 보기", subtitle: "오늘 나눈 생각과 결정한 일을 회의 기록으로 확인해요.", theme: "#6d50dc", bg: ASSETS.backgrounds[5], mascot: ASSETS.characters.koala, titleArt: ASSETS.titles.report }
  ];

  const STEP_COLORS = ["#19b999", "#a78bfa", "#2f80ed", "#f48fb1", "#7ccfff", "#ffb23e", "#14a889", "#7857d9", "#159f84", "#e54b79"];
  const FLOW_ROUTE_HINTS = ["", "", "", "회의를 열 때", "지난 약속이 있을 때", "의견을 모을 때", "생각을 묶고 좋은 방법을 찾을 때", "좋은 방법을 찾을 때", "함께 결정할 때", "실천 방법을 정할 때", "회의를 마칠 때"];
  const CORE_PHASES = [
    { label: "준비", pages: [1, 2, 3, 4], startPage: 1, color: "#19b999" },
    { label: "생각 모으기", pages: [5, 6], startPage: 5, color: "#6d50dc" },
    { label: "함께 토의", pages: [7], startPage: 7, color: "#f28a16" },
    { label: "손들어 정하기", pages: [8], startPage: 8, color: "#2f80ed" },
    { label: "정한 일 확인", pages: [9, 10], startPage: 9, color: "#159f84" }
  ];
  const FLOW_SELECTABLE_PAGES = [3, 4, 5, 6, 7, 8, 9, 10];
  const FLOW_ROUTE_ICONS = {
    3: ASSETS.icons.megaphone,
    4: ASSETS.icons.search,
    5: ASSETS.icons.pencil,
    6: ASSETS.icons.idea,
    7: ASSETS.icons.speech,
    8: ASSETS.icons.hands,
    9: ASSETS.icons.clipboard,
    10: ASSETS.icons.report
  };
  const FLOW_TIME_PAGES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const POSITIVE_CLOSING_LINES = [
    "오늘 친구들의 말을 끝까지 듣고 서로의 생각을 이어 준 모습이 정말 멋졌어요.",
    "서로 다른 의견을 차분히 듣고 더 좋은 방법을 찾은 우리 반이 자랑스러워요.",
    "용기 내어 생각을 말하고 친구의 의견을 존중한 모두에게 박수를 보내요.",
    "한 사람의 생각도 놓치지 않고 함께 결정한 과정이 아주 훌륭했어요.",
    "문제를 탓하기보다 해결 방법을 함께 찾아간 태도가 정말 믿음직했어요.",
    "손을 들고 약속을 정한 뒤 결과를 함께 확인한 모습이 참 책임감 있었어요.",
    "친구의 이유를 물어보고 생각을 더 나은 방향으로 바꾼 점이 인상 깊었어요.",
    "우리 반 모두가 참여해 실천할 수 있는 약속을 만든 것이 큰 성장이에요.",
    "말할 기회를 골고루 나누고 기다려 준 배려가 오늘 회의를 빛나게 했어요.",
    "정한 일을 누가 어떻게 실천할지 구체적으로 적은 점이 정말 훌륭해요."
  ];

  const CIVIC_VALUE_LINES = [
    "민주 시민은 서로의 다름을 존중하며 공동의 문제를 대화로 해결해요.",
    "우리의 한 표와 한마디는 공동체를 더 공정하고 안전하게 만드는 소중한 참여예요.",
    "합의는 모두가 똑같이 생각하는 일이 아니라 서로의 이유를 듣고 함께 책임지는 과정이에요.",
    "다른 의견을 존중하는 태도는 민주주의를 지키는 가장 기본적인 힘이에요.",
    "함께 정한 약속을 실천하고 다시 돌아보는 일이 책임 있는 시민의 모습이에요.",
    "소수의 의견까지 살피면 우리 모두가 더 안심하고 참여할 수 있는 공동체가 돼요.",
    "공정한 기회와 배려 있는 대화가 있을 때 우리 반의 결정은 더 단단해져요.",
    "권리만큼 서로에 대한 책임을 생각하는 마음이 민주 시민의 중요한 가치예요.",
    "문제를 발견하고 해결에 참여하는 작은 실천이 더 좋은 사회를 만들어요.",
    "서로 질문하고 근거를 나누며 결정하는 경험이 민주적인 힘을 키워 줘요."
  ];

  const DEFAULT_MEETING = {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    schemaVersion: SCHEMA_VERSION,
    appVersion: APP_VERSION,
    currentPage: 1,
    title: "6월 1주 학급회의",
    date: new Date().toISOString().slice(0, 10),
    totalStudents: 25,
    // 결석생이 있으면 손든 수 합계가 등록 인원과 영영 안 맞아 회의가 멈춘다. 오늘 빠진 인원을 따로 센다.
    absentCount: 0,
    depthMode: "advanced",
    soundEnabled: true,
    bgmEnabled: false,
    sfxEnabled: true,
    reducedMotion: false,
    roles: {
      entries: [
        { id: "role-host", label: "회장", name: "김하늘" },
        { id: "role-vice-chair", label: "부회장 · 화면에 적는 친구", name: "이서준" },
        { id: "role-secretary", label: "서기 · 공책에 적는 친구", name: "박지우" }
      ]
    },
    flow: {
      stepLabels: ["준비", "순서", "시작", "지난번 보기", "생각 적기", "생각 모아 손들기", "함께 토의", "손들기", "정한 일", "마무리"],
      durationMinutes: 30,
      stageMinutes: [2, 2, 2, 3, 5, 8, 5, 3, 3, 2],
      completedPages: [],
      selectedPages: [3, 4, 5, 6, 7, 8, 9, 10],
      studentNavigation: true
    },
    // 5개면 3페이지에서 두 줄 반이 되어 오른쪽 스크롤바가 생겼다.
    // 회의 중에 지킬 것 4개만 남기고, "정한 약속 지키기"는 9페이지 실천 약속이 맡는다.
    meetingRules: [
      "친구의 말을 끝까지 들어요.",
      "생각을 말할 때 왜 그런지도 함께 말해요.",
      "사람이 아니라 생각에 대해 이야기해요.",
      "말할 기회를 골고루 나누어요."
    ],
    decisionRules: {
      agreeThreshold: 60,
      holdThreshold: 30,
      safetyRule: "안전 문제가 있으면 조건을 다시 검토해요.",
      feasibilityRule: "정한 뒤에 정말 해 볼 수 있는지 확인해요."
    },
    timer: {
      startedAt: null,
      pausedAt: null,
      accumulatedMs: 0,
      running: false,
      durationMinutes: 30,
      fiveMinuteAlerts: false,
      lastFiveMinuteAlertBlock: 0,
      stageNumber: 1,
      stageStartedAt: null,
      stageAccumulatedMs: 0
    },
    agenda: {
      title: "우리 반 청소를 골고루 해요",
      problemContext: "청소할 일이 몇몇 친구에게 몰려서 속상한 친구가 있어요.",
      problemProposer: "김하늘",
      problemAdditionalOpinions: [],
      expectedOutcome: "청소할 일을 모두가 괜찮다고 느끼게 나누는 방법을 정해요.",
      outcomeProposer: "이서준",
      outcomeAdditionalOpinions: [],
      selectedTopic: "청소 구역을 매주 바꾸는 것이 좋을까요?"
    },
    previous: {
      promise: "급식 줄을 조용히 서기",
      handRaise: { good: 18, normal: 5, hard: 2 },
      evidence: "친구들이 줄에서 조용히 서려고 노력했어요.",
      cause: "금요일에는 쉬는 시간이 짧아 이동이 급했어요.",
      improvement: "급식 이동 시간을 조금 더 여유 있게 해요.",
      reflectionNotes: "줄을 차분히 서려는 친구가 많았어요. 시간이 촉박할 때는 서두르기 어려웠고, 다음에는 이동 준비를 조금 일찍 시작해요."
    },
    opinions: [
      {
        id: "op-1",
        text: "청소 구역을 돌아가며 정하면 좋겠어요.",
        reason: "모두가 여러 가지 청소할 일을 해 볼 수 있어서요.",
        expectedEffect: "청소할 일이 한쪽에 몰리지 않아요.",
        concern: "처음에는 헷갈릴 수 있어요.",
        category: "청소할 일",
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
        expectedEffect: "빠뜨린 청소할 일을 확인하기 쉬워요.",
        concern: "부회장이 화면에 적기 힘들 수 있어요.",
        category: "우리 반 생활",
        likes: 7
      }
    ],
    opinionDraft: {
      text: "청소 구역을 매주 바꾸면 좋겠어요.",
        reason: "모두가 여러 가지 청소할 일을 해 볼 수 있어요.",
        expectedEffect: "모두에게 괜찮다고 느끼는 친구가 늘어요.",
      concern: "처음 한 주는 안내표가 필요해요.",
        category: "청소할 일"
    },
    opinionPresenterHands: 6,
    topicSelection: {
      candidates: [
        { id: "topic-1", label: "청소 구역을 매주 바꾸기", hands: 15 },
        { id: "topic-2", label: "힘든 청소할 일은 짝과 함께하기", hands: 7 },
        { id: "topic-3", label: "청소 체크표 만들기", hands: 3 }
      ],
      criteriaScores: {
        fairness: 5,
        feasibility: 4,
        safety: 5,
        preparation: 3,
        burden: 2
      },
      selectedTopic: "청소 구역을 매주 바꾸는 것이 좋을까요?",
      talliedOpinionIds: []
    },
    discussion: {
      proposal: "구역을 바꾸면 모두가 여러 가지 청소할 일을 해 볼 수 있어요.",
      questions: "구역표는 누가 정하고 어디에 붙이나요?",
      agreeReasons: "같은 친구만 힘든 곳을 맡지 않아서 모두에게 괜찮아요.",
      concerns: "매주 바뀌면 헷갈릴 수 있어 안내가 필요해요.",
      revisionSuggestion: "처음 한 주는 안내표와 함께 시작해요.",
      handRaise: { presenters: 5, questions: 3, agreeSpeakers: 4, concernSpeakers: 2 }
    },
    vote: {
      question: "청소 구역을 매주 바꾸는 것이 좋을까요?",
      mode: "handRaise",
      agree: 18,
      disagree: 4,
      hold: 3,
      confirmed: false,
      confirmedAt: null
    },
    decision: {
      text: "청소 구역을 매주 바꾸기로 했어요.",
      practiceMethod: "월요일마다 청소 구역표를 확인해요.",
      owner: "반장 김하늘, 부반장 이서준",
      period: "6월 3일 ~ 6월 17일",
      successCriteria: "청소할 일이 한쪽에 몰리지 않아요.",
      nextReview: "정한 청소 일이 잘 지켜졌는지 확인해요.",
      volunteerHands: 4,
      additionalNotes: ""
    },
    students: Array.from({ length: 30 }, () => ""),
    speakerOrder: [],
    freeNote: "",
    posterStyle: "mint",
    feedbackIndex: 0,
    teacherComment: "서로의 생각을 소중히 듣고 더 좋은 방법을 함께 찾은 우리 반이 자랑스러워요. 민주 시민은 서로의 다름을 존중하며 공동의 문제를 대화로 해결해요.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    archived: false
  };

  function createEmptyMeeting() {
    const meeting = structuredClone(DEFAULT_MEETING);
    meeting.id = crypto.randomUUID ? crypto.randomUUID() : String(Date.now());
    meeting.currentPage = 1;
    meeting.title = "";
    meeting.date = new Date().toISOString().slice(0, 10);
    meeting.roles = {
      entries: [
        { id: "role-host", label: "회장", name: "" },
        { id: "role-vice-chair", label: "부회장 · 화면에 적는 친구", name: "" },
        { id: "role-secretary", label: "서기 · 공책에 적는 친구", name: "" }
      ]
    };
    meeting.agenda = {
      title: "",
      problemContext: "",
      problemProposer: "",
      problemAdditionalOpinions: [],
      expectedOutcome: "",
      outcomeProposer: "",
      outcomeAdditionalOpinions: [],
      selectedTopic: ""
    };
    meeting.previous = {
      promise: "",
      handRaise: { good: 0, normal: 0, hard: 0 },
      evidence: "",
      cause: "",
      improvement: "",
      reflectionNotes: ""
    };
    meeting.opinions = [];
    meeting.opinionDraft = { text: "", reason: "", expectedEffect: "", concern: "", category: "우리 반 생활" };
    meeting.topicSelection.candidates = [];
    meeting.topicSelection.talliedOpinionIds = [];
    meeting.topicSelection.selectedTopic = "";
    meeting.freeNote = "";
    meeting.discussion = { proposal: "", questions: "", agreeReasons: "", concerns: "", revisionSuggestion: "", handRaise: { presenters: 0, questions: 0, agreeSpeakers: 0, concernSpeakers: 0 } };
    meeting.vote = { question: "", mode: "handRaise", agree: 0, disagree: 0, hold: 0, confirmed: false, confirmedAt: null };
    meeting.decision = { text: "", practiceMethod: "", owner: "", period: "", successCriteria: "", nextReview: "", volunteerHands: 0, additionalNotes: "" };
    meeting.students = Array.from({ length: 30 }, () => "");
    meeting.speakerOrder = [];
    meeting.feedbackIndex = getClosingFeedbackIndex(`${meeting.id}-${meeting.date}`);
    meeting.teacherComment = buildClosingFeedback(meeting, meeting.feedbackIndex);
    meeting.meetingRules = [""];
    meeting.createdAt = new Date().toISOString();
    meeting.updatedAt = meeting.createdAt;
    return applyAudioPreferences(meeting);
  }

  const state = {
    // 시작 상태도 빈 회의여야 한다. 샘플 회의는 '연습용 불러오기'에서만 쓴다.
    meeting: createEmptyMeeting(),
    recentMeetings: [],
    dbReady: false,
    dbFailed: false,
    saveTimer: null,
    renderTimer: null,
    lastRenderedPage: null,
    settingsOpen: false,
    settingsReturnAction: "open-settings",
    saveStatus: "saved",
    clockPointerId: null,
    clockExpanded: false,
    clockCollapseTimer: null,
    noteExpanded: false,
    helpExpanded: false,
    recordsModalOpen: false,
    // 저장을 눌렀을 때 앞 페이지로 튕기지 않고, 10쪽에 머문 채 안 적은 곳을 보여 주기 위한 목록.
    finalizeGaps: [],
    opinionListOpen: false,
    // 10쪽 마무리 한마디는 팝업이라, 문장 바꾸기로 다시 그려도 열린 채여야 한다.
    closingCommentOpen: false
  };

  const root = document.getElementById("app");

  // 오류 하나로 화면을 통째로 복구화면으로 바꾸면 적어 둔 회의가 사라진 것처럼 보여서, 알림만 띄우고 회의는 그대로 둔다.
  let lastErrorNoticeAt = 0;
  let discardOnUnload = false;

  window.addEventListener("error", (event) => {
    console.warn("script error", event?.error || event?.message || event);
    if (Date.now() - lastErrorNoticeAt < 8000) return;
    lastErrorNoticeAt = Date.now();
    toast("잠깐 문제가 생겼어요. 적은 내용은 그대로 있으니 회의를 이어가도 괜찮아요.", "warn");
  });
  window.addEventListener("unhandledrejection", (event) => {
    console.warn("unhandled rejection", event.reason);
    setSaveStatus("error");
    toast("저장에 잠깐 문제가 있었어요. 회의는 계속해도 괜찮아요.", "warn");
  });
  // '버리고 새로 시작'을 누른 뒤에는 방금 지운 기록을 다시 써 넣지 않는다.
  window.addEventListener("beforeunload", () => {
    if (!discardOnUnload) saveSnapshot();
  });

  init();

  async function init() {
    try {
      // 이벤트부터 붙여야 뒤에서 실패해도 버튼이 안 먹는 먹통 화면이 되지 않는다.
      bindGlobalEvents();
      const snapshot = loadSnapshot();
      try {
        state.meeting = snapshot ? migrate(snapshot) : createEmptyMeeting();
      } catch (error) {
        console.warn("migrate failed", error);
        state.meeting = createEmptyMeeting();
        toast("지난 기록을 여는 데 문제가 있어서 새 회의로 시작해요.", "warn");
      }
      if (!snapshot) state.meeting.currentPage = 0;
      const rawPageParam = new URLSearchParams(location.search).get("page");
      if (rawPageParam !== null) {
        const requestedPage = Number(rawPageParam);
        if (Number.isInteger(requestedPage) && requestedPage >= 0 && requestedPage <= 10) {
          if (requestedPage === 0 || getNavigationState(requestedPage).unlocked) {
            state.meeting.currentPage = requestedPage;
          }
        }
      }
      render();
      startTimerLoop();
      const db = await openDb();
      state.dbReady = Boolean(db);
      state.dbFailed = !db; // 기기 저장함을 못 쓰면 시작할 때부터 정직하게 표시한다.
      if (db) {
        if (state.meeting.currentPage !== 0) await saveMeetingNow();
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
    window.addEventListener("resize", () => updateHandPointer());
    // 스크롤마다 위치를 재는 대신 한 프레임에 한 번만 잰다. 저사양 태블릿에서 스크롤이 끊기지 않는다.
    let handPointerFrame = 0;
    const queueHandPointer = () => {
      if (handPointerFrame) return;
      handPointerFrame = requestAnimationFrame(() => {
        handPointerFrame = 0;
        updateHandPointer();
      });
    };
    window.addEventListener("scroll", queueHandPointer, { passive: true, capture: true });

    document.addEventListener("input", (event) => {
      const bulkStudentInput = event.target.closest("[data-student-name-bulk]");
      if (bulkStudentInput) {
        applyBulkStudentNames(bulkStudentInput.value);
        return;
      }
      const field = event.target.closest("[data-field]");
      if (!field) return;
      const value = normalizeInputValue(field);
      setPath(state.meeting, field.dataset.field, value);
      if (/^vote\.(agree|disagree|hold)$/.test(field.dataset.field)) state.meeting.vote.confirmed = false;
      state.meeting.updatedAt = new Date().toISOString();
      queueSave();
      updateDependentText();
    });

    document.addEventListener("change", async (event) => {
      if (event.target.matches("[data-student-name-bulk]")) {
        render();
        return;
      }
      const field = event.target.closest("[data-field]");
      if (field) {
        const value = normalizeInputValue(field);
        if (field.type === "number" && field.value !== String(value)) field.value = String(value);
        setPath(state.meeting, field.dataset.field, value);
        if (/^vote\.(agree|disagree|hold)$/.test(field.dataset.field)) state.meeting.vote.confirmed = false;
        queueSave();
      }

      if (event.target.matches("[data-import-json]")) {
        await importJson(event.target.files?.[0]);
        event.target.value = "";
      }
    });

    document.addEventListener("click", async (event) => {
      // 보드 안 펼침 토글은 가운데 팝업으로 뜬다. 팝업 밖(흐린 배경)을 누르면 닫는다.
      const openPopup = document.querySelector(".redesign-board details.compact-details[open], .flow-setup-board details.compact-details[open]");
      if (openPopup && !openPopup.contains(event.target)) {
        openPopup.open = false;
        return;
      }

      const noteBackdrop = event.target.closest("[data-note-backdrop]");
      if (noteBackdrop && event.target === noteBackdrop) {
        closeMeetingNote();
        return;
      }

      const helpBackdrop = event.target.closest("[data-help-backdrop]");
      if (helpBackdrop && event.target === helpBackdrop) {
        closeMeetingHelp();
        return;
      }

      const settingsBackdrop = event.target.closest("[data-settings-backdrop]");
      if (settingsBackdrop && event.target === settingsBackdrop) {
        closeSettingsModal();
        return;
      }

      const recordsBackdrop = event.target.closest("[data-records-backdrop]");
      if (recordsBackdrop && event.target === recordsBackdrop) {
        closeRecordsModal();
        return;
      }

      if (event.target.closest("[data-clock-control]")) expandMeetingClock();

      const button = event.target.closest("[data-action]");
      if (!button) return;

      // 회색 버튼을 눌러도 아무 일이 없으면 아이들은 고장으로 여긴다. 왜 못 넘어가는지 알려준다.
      if (button.hasAttribute("data-blocked")) {
        playSound("fail");
        const validation = validateStage(state.meeting.currentPage);
        if (!validation.valid) showValidationError(validation);
        return;
      }
      if (button.disabled) return;
      if (isRepeatTap(button)) return;

      const action = button.dataset.action;
      const path = button.dataset.path;

      playSound(ACTION_SOUNDS[action] || "click");

      try {

      if (action === "toggle-sfx") {
        state.meeting.sfxEnabled = !state.meeting.sfxEnabled;
        state.meeting.soundEnabled = state.meeting.sfxEnabled;
        queueSave();
        render();
        if (state.meeting.sfxEnabled) playSound("open");
        return;
      }

      if (action === "collapse-clock") {
        collapseMeetingClock();
        return;
      }

      if (action === "open-meeting-note") {
        openMeetingNote();
        return;
      }

      if (action === "close-meeting-note") {
        closeMeetingNote();
        return;
      }

      // 기록한 생각 목록은 자리를 많이 먹어 입력칸을 밀어낸다. 눌렀을 때만 가운데 팝업으로 보여 준다.
      if (action === "open-opinion-list") {
        state.opinionListOpen = true;
        render();
        requestAnimationFrame(() => document.querySelector("[data-opinion-list] summary")?.focus());
        return;
      }

      if (action === "open-meeting-help") {
        openMeetingHelp();
        return;
      }

      if (action === "close-meeting-help") {
        closeMeetingHelp();
        return;
      }

      if (action === "toggle-five-minute-alert") {
        const timer = state.meeting.timer;
        timer.fiveMinuteAlerts = !timer.fiveMinuteAlerts;
        timer.lastFiveMinuteAlertBlock = Math.floor(getElapsedMs() / (5 * 60 * 1000));
        queueSave();
        render();
        toast(timer.fiveMinuteAlerts ? "🔔 5분마다 알림을 울릴게요." : "🔕 5분 알림을 껐어요.");
        return;
      }

      if (action === "go") goTo(Number(button.dataset.page));
      if (action === "home") goTo(0);
      if (action === "complete-next") completeCurrentStage();
      if (action === "complete-save") await completeAndFinalize();
      if (action === "prev") goTo(getPreviousRoutePage(state.meeting.currentPage));
      // 이미 마쳤다고 표시된 페이지라도 다시 열어야 하므로 잠금 검사를 건너뛴다.
      if (action === "fix-gap") goTo(Number(button.dataset.page), true);
      if (action === "toggle-flow-page") toggleFlowPage(Number(button.dataset.page));
      if (action === "sample") loadSample();
      if (action === "clear-prepare") clearPreparation();
      if (action === "open-settings") openSettingsModal(button);
      if (action === "close-settings") closeSettingsModal();
      if (action === "new") await newMeeting();
      if (action === "continue") await continueLatest();
      if (action === "load-meeting") await loadMeeting(button.dataset.id);
      if (action === "counter-minus") updateCounter(path, -1);
      if (action === "counter-plus") updateCounter(path, 1);
      if (action === "add-role") addRole();
      if (action === "remove-role") removeRole(Number(button.dataset.index));
      if (action === "add-prepare-opinion") addPrepareOpinion(button.dataset.kind);
      if (action === "remove-prepare-opinion") removePrepareOpinion(button.dataset.kind, Number(button.dataset.index));
      if (action === "add-meeting-rule") addMeetingRule();
      if (action === "remove-meeting-rule") removeMeetingRule(Number(button.dataset.index));
      if (action === "sample-meeting-rules") loadMeetingRuleSamples();
      if (action === "add-opinion") addOpinion();
      if (action === "delete-opinion") deleteOpinion(button.dataset.id);
      if (action === "toggle-speaker-order") toggleSpeakerOrder(Number(button.dataset.index));
      if (action === "clear-speaker-order") clearSpeakerOrder();
      if (action === "add-all-speakers") setAllSpeakers();
      if (action === "shuffle-speakers") shuffleSpeakers();
      if (action === "select-topic") selectTopic(button.dataset.label);
      if (action === "toggle-tally") toggleOpinionTally(button.dataset.id);
      if (action === "confirm-vote") confirmVoteTally();
      if (action === "timer-start") timerStart();
      if (action === "timer-pause") timerPause();
      if (action === "timer-reset") timerReset();
      if (action === "timer-preset") timerSetPreset(Number(button.dataset.minutes));
      if (action === "export-json") exportJson();
      if (action === "import-json") importRecordsFromFile();
      if (action === "open-records-modal") {
        state.recordsModalOpen = true;
        render();
      }
      if (action === "close-records-modal") closeRecordsModal();
      if (action === "refresh-closing-comment") refreshClosingComment();
      if (action === "set-poster-style") {
        state.meeting.posterStyle = POSTER_STYLES.some((style) => style.id === button.dataset.style) ? button.dataset.style : "mint";
        state.meeting.updatedAt = new Date().toISOString();
        queueSave();
        render();
        // 다시 그리면 접힘이 닫혀서, 모양을 두세 개 비교하려면 매번 다시 열어야 한다. 그 자리에 다시 펴 준다.
        document.querySelector(".report-share-card details.compact-details:not(.report-details)")?.setAttribute("open", "");
      }
      if (action === "open-poster-print") {
        state.posterPrintOpen = true;
        render();
      }
      if (action === "close-poster-print") closePosterPrint();
      if (action === "print-poster") window.print();
      } catch (error) {
        console.warn("action failed", action, error);
        setSaveStatus("error");
        toast("잠깐 문제가 생겼어요. 한 번 더 눌러 주세요.", "warn");
      }
    });

    document.addEventListener("pointerdown", (event) => {
      const control = event.target.closest?.("[data-clock-control]");
      if (!control) {
        if (state.clockExpanded) collapseMeetingClock();
        return;
      }

      const dial = event.target.closest?.("[data-clock-dial]");
      if (!dial) {
        expandMeetingClock();
        return;
      }

      event.preventDefault();
      if (!control.classList.contains("is-expanded")) {
        expandMeetingClock();
        return;
      }

      expandMeetingClock(false);
      state.clockPointerId = event.pointerId;
      dial.setPointerCapture?.(event.pointerId);
      updateMeetingDurationFromDial(event, dial);
    });

    document.addEventListener("pointermove", (event) => {
      if (state.clockPointerId !== event.pointerId) return;
      const dial = document.querySelector("[data-clock-dial]");
      if (!dial) return;
      event.preventDefault();
      updateMeetingDurationFromDial(event, dial);
    });

    document.addEventListener("pointerup", (event) => {
      if (state.clockPointerId !== event.pointerId) return;
      state.clockPointerId = null;
    });

    document.addEventListener("pointercancel", () => {
      state.clockPointerId = null;
    });

    document.addEventListener("keydown", (event) => {
      const dial = event.target.closest?.("[data-clock-dial]");
      if (dial && ["ArrowLeft", "ArrowDown", "ArrowRight", "ArrowUp"].includes(event.key)) {
        event.preventDefault();
        expandMeetingClock(false);
        const direction = event.key === "ArrowRight" || event.key === "ArrowUp" ? 1 : -1;
        setMeetingDuration(Math.max(10, Math.min(60, Number(state.meeting.flow.durationMinutes || 30) + direction * 5)));
        queueSave();
        updateDependentText();
        return;
      }
      // 보드 안의 펼침 토글은 화면 가운데 팝업으로 뜬다. ESC 로 닫는다.
      if (event.key === "Escape") {
        const openPopup = document.querySelector(".redesign-board details.compact-details[open], .flow-setup-board details.compact-details[open]");
        if (openPopup) {
          event.preventDefault();
          openPopup.open = false;
          openPopup.querySelector("summary")?.focus();
          return;
        }
      }
      if (event.key === "Escape" && state.posterPrintOpen) {
        event.preventDefault();
        closePosterPrint();
        return;
      }
      if (event.key === "Escape" && state.recordsModalOpen) {
        event.preventDefault();
        closeRecordsModal();
        return;
      }
      if (event.key === "Escape" && state.clockExpanded) {
        event.preventDefault();
        collapseMeetingClock();
        return;
      }
      if (event.key === "Escape" && state.noteExpanded) {
        event.preventDefault();
        closeMeetingNote();
        return;
      }
      if (event.key === "Escape" && state.helpExpanded) {
        event.preventDefault();
        closeMeetingHelp();
        return;
      }
      if (event.key === "Escape" && state.settingsOpen) {
        event.preventDefault();
        closeSettingsModal();
        return;
      }
      // 열린 모달이 없으면 trapModalFocus 가 바로 빠져나오므로 평소 Tab 이동은 그대로다.
      if (event.key === "Tab") trapModalFocus(event);
    });

    document.addEventListener("toggle", (event) => {
      if (event.target.matches?.("[data-opinion-list]")) state.opinionListOpen = event.target.open;
      if (event.target.matches?.(".closing-comment-details")) state.closingCommentOpen = event.target.open;
      const current = event.target;
      if (!(current instanceof HTMLDetailsElement) || !current.open || !current.matches("details.compact-details")) return;
      if (current.matches(".start-guide-details")) return;
      const scope = current.closest(".workspace, .guide-modal, .landing-content") || document;
      scope.querySelectorAll("details.compact-details[open]").forEach((details) => {
        if (details !== current && !details.contains(current) && !current.contains(details)) details.open = false;
      });
    }, true);
  }

  function openSettingsModal(trigger) {
    state.settingsReturnAction = trigger?.dataset.action || "open-settings";
    state.settingsOpen = true;
    render();
  }

  function closeSettingsModal() {
    state.settingsOpen = false;
    render();
    focusAfterClose(`[data-action="${state.settingsReturnAction}"]`);
  }

  function closeRecordsModal() {
    state.recordsModalOpen = false;
    render();
    focusAfterClose('[data-action="open-records-modal"]');
  }

  function closePosterPrint() {
    state.posterPrintOpen = false;
    render();
    focusAfterClose('[data-action="open-poster-print"]');
  }

  // 모달을 닫으면 그 모달을 열었던 버튼으로 포커스를 돌려준다.
  function focusAfterClose(selector) {
    requestAnimationFrame(() => document.querySelector(selector)?.focus());
  }

  // 열려 있는 모달은 언제나 하나뿐이다. 설정·기록 보관함·인쇄 미리보기·회의 기록/도움말이 모두 같은 규칙을 쓴다.
  function getOpenModal() {
    return document.querySelector(".guide-modal, .records-modal, .poster-print-panel, .meeting-note-dialog");
  }

  function getModalFocusables(modal) {
    return Array.from(modal.querySelectorAll("button, summary, input, select, textarea, [href], [tabindex]:not([tabindex='-1'])"))
      .filter((node) => !node.disabled && node.getClientRects().length > 0);
  }

  // 모달이 열리면 뒤 화면은 Tab·스크린리더에서 빼고, 첫 포커스를 모달 안에 둔다.
  function applyModalLock() {
    // 회의 기록·도움말 창은 페이지 안에서 그려져서, 뒤 화면을 잠그기 전에 밖으로 옮겨야 같이 잠기지 않는다.
    const inlineOverlay = root.querySelector("main .meeting-note-overlay");
    if (inlineOverlay) root.appendChild(inlineOverlay);
    const modal = getOpenModal();
    const pageRoot = root.querySelector(":scope > main");
    if (pageRoot) {
      pageRoot.toggleAttribute("inert", Boolean(modal));
      if (modal) pageRoot.setAttribute("aria-hidden", "true");
      else pageRoot.removeAttribute("aria-hidden");
    }
    if (!modal) return;
    requestAnimationFrame(() => {
      if (modal.contains(document.activeElement)) return;
      getModalFocusables(modal)[0]?.focus();
    });
  }

  function trapModalFocus(event) {
    const modal = getOpenModal();
    if (!modal) return;
    const focusable = getModalFocusables(modal);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function render() {
    try {
      const page = PAGES[state.meeting.currentPage] || PAGES[1];
      const pageChanged = state.lastRenderedPage !== state.meeting.currentPage;
      state.lastRenderedPage = state.meeting.currentPage;
      root.innerHTML = page.id === "main" ? renderLanding(page) : renderPage(page);
      if (state.settingsOpen) root.insertAdjacentHTML("beforeend", renderSettingsModal());
      if (pageChanged) {
        const entered = root.firstElementChild;
        entered?.classList.add("page-enter");
        // 클래스를 남겨 두면 fill-mode:both 때문에 scale(1.028) 이 계속 걸린 채로 굳는다.
        // 화면 전체가 2.8% 커진 상태가 되어 아래쪽 요소가 잘린다. 끝나면 반드시 뗀다.
        window.setTimeout(() => entered?.classList.remove("page-enter"), 700);
      }
      if (state.posterPrintOpen && PAGES[state.meeting.currentPage]?.id === "page_10_report") {
        root.insertAdjacentHTML("beforeend", renderPosterPrintOverlay());
      } else {
        state.posterPrintOpen = false;
      }
      if (state.recordsModalOpen && PAGES[state.meeting.currentPage]?.id === "main") {
        root.insertAdjacentHTML("beforeend", renderRecordsModal());
      } else {
        state.recordsModalOpen = false;
      }
      applyModalLock();
      // 페이지가 바뀔 때마다 화면 전체를 읽지 않도록, 바뀐 쪽 이름만 짧게 알린다.
      if (pageChanged) {
        const announcer = document.getElementById("page-announce");
        if (announcer) announcer.textContent = page.title;
      }
      updateDependentText();
    } catch (error) {
      console.error(error);
      showRecovery(error);
    }
  }

  // 이 페이지에서 할 일이 '기록' 하나로 줄어서, 손가락도 기록 흐름만 가리킨다.
  function getOpinionBoardPointerTarget() {
    const meeting = state.meeting;
    if (!meeting.opinions.some((opinion) => String(opinion.text || "").trim())) {
      return String(meeting.opinionDraft.text || "").trim()
        ? document.querySelector('[data-action="add-opinion"]')
        : document.querySelector('textarea[data-field="opinionDraft.text"]');
    }
    return document.querySelector('[data-action="complete-next"]');
  }

  function getOpinionSummaryPointerTarget() {
    const opinions = state.meeting.opinions;
    const tallied = state.meeting.topicSelection.talliedOpinionIds;
    const nextIndex = opinions.findIndex((opinion) => !tallied.includes(opinion.id));
    if (nextIndex >= 0) {
      return Number(opinions[nextIndex].likes || 0) === 0
        ? document.querySelector(`[data-action="counter-plus"][data-path="opinions.${nextIndex}.likes"]`)
        : document.querySelectorAll(".opinion-tally-card .tally-toggle")[nextIndex];
    }
    if (opinions.length && !state.meeting.topicSelection.selectedTopic) {
      const bestIndex = opinions.reduce((best, opinion, index) => (Number(opinion.likes || 0) > Number(opinions[best].likes || 0) ? index : best), 0);
      return document.querySelectorAll(".opinion-tally-card .opinion-pick")[bestIndex];
    }
    if (opinions.length) return document.querySelector('[data-action="complete-next"]');
    return null;
  }

  function getVotePointerTarget() {
    const vote = state.meeting.vote;
    const agree = Number(vote.agree || 0);
    const disagree = Number(vote.disagree || 0);
    const expected = Number(state.meeting.totalStudents || 0);
    const total = agree + disagree;
    if (agree === 0) return document.querySelector('[data-action="counter-plus"][data-path="vote.agree"]');
    if (disagree === 0 && total < expected) return document.querySelector('[data-action="counter-plus"][data-path="vote.disagree"]');
    if (total === expected && !vote.confirmed) return document.querySelector("[data-vote-confirm]");
    if (vote.confirmed) return document.querySelector('[data-action="complete-next"]');
    return null;
  }

  function updateHandPointer() {
    const existing = document.querySelector(".ux-hand-pointer");
    // 모달이 떠 있으면 뒤 화면 손가락은 가린다. 회의 기록·도움말 창도 이제 같이 막힌다.
    const blocked = getOpenModal() || document.querySelector(".confirm-overlay");
    // 가운데 팝업이 떠 있으면 그 안에서 다음에 누를 곳을 가리킨다.
    const popup = document.querySelector(".redesign-board details.compact-details[open], .flow-setup-board details.compact-details[open]");
    let target = null;
    if (!blocked && popup) {
      target = popup.querySelector(".details-content input:not([disabled]), .details-content textarea, .details-content button:not([disabled]), .details-content select")
        || popup.querySelector("summary");
    } else if (!blocked) {
      if (state.meeting.currentPage === 5) target = getOpinionBoardPointerTarget();
      if (state.meeting.currentPage === 6) target = getOpinionSummaryPointerTarget();
      if (state.meeting.currentPage === 8) target = getVotePointerTarget();
    }
    if (!target || target.disabled) {
      existing?.remove();
      return;
    }
    const pointer = existing || document.body.appendChild(Object.assign(document.createElement("div"), { className: "ux-hand-pointer" }));
    pointer.setAttribute("aria-hidden", "true");
    const rect = target.getBoundingClientRect();
    const placeAbove = rect.bottom + 48 > window.innerHeight;
    pointer.textContent = placeAbove ? "👇" : "👆";
    pointer.style.left = `${Math.round(rect.left + rect.width / 2)}px`;
    pointer.style.top = placeAbove ? `${Math.round(rect.top - 40)}px` : `${Math.round(rect.bottom + 2)}px`;
  }

  function renderLandingRecordCard(meeting, index) {
    const iconSrc = index % 2 === 0 ? ASSETS.icons.heart : ASSETS.icons.hands;
    const summary = meeting.decision?.text || meeting.agenda?.title || "회의 이어하기";
    return `
      <button class="landing-record-card" type="button" data-action="load-meeting" data-id="${escapeAttr(meeting.id)}">
        <img class="record-card-icon" src="${iconSrc}" alt="" loading="eager" />
        <span class="record-card-body">
          <strong>${escapeHtml(friendlyMeetingTitle(meeting.title) || "저장된 회의")}</strong>
          <small>${escapeHtml(meeting.date || "")} · ${escapeHtml(summary)}</small>
        </span>
        <i class="record-card-arrow" aria-hidden="true">›</i>
      </button>
    `;
  }

  function renderLandingRecordEmpty() {
    return `<div class="landing-record-empty">저장된 회의가 아직 없어요.<br/>연습용 회의로 바로 시작할 수 있어요.</div>`;
  }

  function renderLanding(page) {
    const recent = state.recentMeetings.slice(0, 2).map((meeting, index) => renderLandingRecordCard(meeting, index)).join("")
      || renderLandingRecordEmpty();

    return `
      <main class="app-page landing landing-v2" style="--bg:url('${page.bg}'); --theme:${page.theme}">
        <button class="settings-chip" type="button" data-action="open-settings" aria-label="설정 열기" title="설정">${ICON.settings}</button>
        <div class="landing-sparkles" aria-hidden="true">${"<i></i>".repeat(20)}</div>
        <div class="landing-content">
          <!-- 히어로는 두 칸을 가로지른다. 왼쪽 칸(785px) 안에 두면 제목이 529px 로 눌려
               첫인상이 약했고, 오른쪽 기록 패널 위아래로 빈 공간이 남았다. -->
          <div class="landing-hero-row">
            ${page.mascot ? img(page.mascot, "학급회의를 안내하는 토끼", "landing-mascot") : ""}
            <h1 class="meeting-wordmark art-wordmark">
              ${img(page.titleArt, page.title, "landing-title-art")}
            </h1>
          </div>
          <section class="landing-intro">
            <p class="landing-subtitle">우리 반의 일을 우리 손으로 정하는 회의 시간</p>
            <p class="landing-description"><span>오늘의 주제를 정하고 생각을 나눈 뒤,</span> <span>손들어 결정하고 실천 약속까지 회의 기록에 남겨요.</span></p>
            <div class="actions landing-actions">
              <button class="btn primary landing-cta-main" data-action="new">📋 새 회의 시작</button>
              <button class="btn secondary landing-cta-sub" data-action="continue">💬 회의 이어하기</button>
              <button class="btn mint landing-cta-sub" data-action="sample">✏️ 연습용 회의</button>
            </div>
            <div class="landing-feature-strip" aria-label="이 앱으로 할 수 있는 일">
              <article>${img(ASSETS.icons.speech, "", "feature-icon")}<b>생각을 말해요</b><span>오늘의 주제에 대한 생각을 발표해요</span></article>
              <article>${img(ASSETS.icons.search, "", "feature-icon")}<b>생각을 살펴봐요</b><span>좋은 점과 걱정되는 점을 따져 봐요</span></article>
              <article>${img(ASSETS.icons.check, "", "feature-icon")}<b>함께 결정해요</b><span>손들어 공정하게 정해요</span></article>
              <article>${img(ASSETS.icons.badge, "", "feature-icon")}<b>회의 기록을 남겨요</b><span>우리 반의 결정을 기록해요</span></article>
            </div>
          </section>
          <section class="panel landing-records">
            <div class="with-icon">
              ${img(ASSETS.icons.board, "회의 기록 아이콘", "asset-icon large")}
              <div>
                <p class="page-kicker">회의 기록 보관</p>
                <h2>지난 회의 다시 보기</h2>
              </div>
            </div>
            <div class="landing-record-list">${recent}</div>
            <div class="landing-record-tools">
              <button class="record-tool-btn" type="button" data-action="open-records-modal">📚 전체 기록 보기</button>
              <button class="record-tool-btn" type="button" data-action="import-json">📂 기록 불러오기</button>
              <button class="record-tool-btn" type="button" data-action="export-json">💾 기록 파일 내려받기</button>
            </div>
            ${state.dbFailed ? `<div class="warning">지금은 이 브라우저에만 기록을 남기고 있어요.</div>` : ""}
          </section>
        </div>
      </main>
    `;
  }

  function renderRecordsModal() {
    const cards = state.recentMeetings.map((meeting, index) => renderLandingRecordCard(meeting, index)).join("")
      || renderLandingRecordEmpty();
    return `
      <div class="records-overlay" role="presentation" data-records-backdrop>
        <div class="records-modal" role="dialog" aria-modal="true" aria-label="전체 회의 기록">
          <div class="records-modal-head">
            <h2>📚 전체 회의 기록</h2>
            <button class="records-modal-close" type="button" data-action="close-records-modal" aria-label="닫기">×</button>
          </div>
          <div class="records-modal-list">${cards}</div>
        </div>
      </div>
    `;
  }

  function renderPage(page) {
    return `
      <main class="app-page page-step-${page.step}" data-page-step="${page.step}" style="--bg:url('${page.bg}'); --theme:${page.theme}">
        <button class="home-chip" type="button" data-action="home" aria-label="처음으로">${ICON.home}</button>
        <button class="settings-chip" type="button" data-action="open-settings" aria-label="설정 열기" title="설정">${ICON.settings}</button>
        <div class="app-shell">
          <header class="topbar">
            <section class="page-heading">
              ${renderPageTitle(page)}
            </section>
            ${renderProgress(page.step)}
          </header>
          ${renderFacilitationPanel(page.step)}
          <section class="page-body">
            ${page.mascot ? img(page.mascot, `${page.title} 안내 캐릭터`, "mascot") : ""}
            ${renderMeetingClockDial()}
            ${renderMeetingNote()}
            ${renderMeetingAssistant(page.step)}
            ${renderContent(page)}
          </section>
          ${renderNav(page.step)}
        </div>
      </main>
    `;
  }

  function renderProgress(currentStep) {
    const currentPhase = getCorePhase(currentStep);
    const routePages = getFlowRoutePages();
    return `
      <nav class="progress" aria-label="학급회의 순서">
        ${CORE_PHASES.map((phase, index) => {
          const phaseNumber = index + 1;
          const phaseRoute = routePages.filter((step) => phase.pages.includes(step));
          const targetPage = phaseRoute[0] || null;
          const isDone = phaseRoute.length > 0 && phaseRoute.every((step) => state.meeting.flow.completedPages.includes(PAGES[step].id));
          const navigation = targetPage ? getNavigationState(targetPage) : { unlocked: false };
          const isLocked = !targetPage || !navigation.unlocked;
          const status = `${isDone ? "done" : ""} ${phaseNumber === currentPhase ? "active" : ""} ${isLocked ? "locked" : ""} ${!targetPage ? "skipped" : ""}`.trim();
          const ariaLabel = !targetPage
            ? `${phaseNumber}단계 ${phase.label}, 이번 회의에서는 건너뜀`
            : isLocked
              ? `${phaseNumber}단계 ${phase.label}, 앞 순서를 마치면 열림`
              : `${phaseNumber}단계 ${phase.label}로 이동`;
          return `
            <button class="progress-item ${status}" style="--step-color:${phase.color}" type="button" data-action="go" data-page="${targetPage || ""}" aria-label="${escapeAttr(ariaLabel)}" title="${escapeAttr(ariaLabel)}" ${isLocked ? "disabled" : ""}>
              <span class="step-dot"><span class="step-number">${isLocked ? "🔒" : phaseNumber}</span></span>
              <span class="progress-label">${escapeHtml(phase.label)}</span>
            </button>
          `;
        }).join("")}
      </nav>
    `;
  }

  function getCorePhase(step) {
    const index = CORE_PHASES.findIndex((phase) => phase.pages.includes(Number(step)));
    return index >= 0 ? index + 1 : 1;
  }

  function renderPageTitle(page) {
    const phase = getCorePhase(page.step);
    const phaseInfo = CORE_PHASES[phase - 1];
    const phaseRoute = getFlowRoutePages().filter((step) => phaseInfo.pages.includes(step));
    const position = phaseRoute.indexOf(Number(page.step)) + 1;
    const progressText = position > 0 && phaseRoute.length > 1 ? `${phaseInfo.label} ${position}/${phaseRoute.length}` : phaseInfo.label;
    return `
      <h1 class="page-title page-title-art text-title">
        <span class="page-step-badge" aria-label="5단계 중 ${phase}단계">${phase}</span>
        <span class="page-title-text">${escapeHtml(page.title)}<small class="page-phase-progress">${escapeHtml(progressText)}</small></span>
      </h1>
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
    const hasTopic = String(state.meeting.agenda.title || "").trim().length > 0;
    const hasStory = [state.meeting.agenda.problemContext, state.meeting.agenda.expectedOutcome].some((value) => String(value || "").trim());
    return `
      <div class="workspace wide">
        <section class="panel redesign-board prepare-redesign">
          <div class="redesign-board-head">
            <div><h2>오늘 회의를 준비해요</h2><p>날짜와 인원을 확인한 뒤, 오늘 함께 해결할 일을 한 문장으로 적어요.</p></div>
            <span class="board-step-chip">준비 1</span>
          </div>
          <div class="prepare-foundation-grid">
            <div class="prepare-top-grid">
              ${infoField("날짜", "date", ASSETS.icons.calendar, "#ef4f85", { type: "date", className: "prepare-date-card" })}
              ${infoField("우리 반 친구", "totalStudents", ASSETS.icons.group, "#2f80ed", { type: "number", attrs: { min: 1, max: 30 } })}
            </div>
            ${infoField("오늘의 주제", "agenda.title", ASSETS.icons.megaphone, "#ef4f85", { type: "textarea", rows: 2, className: "prepare-main-topic" })}
          </div>
          <section class="prepare-expanded-section" aria-labelledby="prepare-story-title">
            <div class="prepare-expanded-head">
              <strong id="prepare-story-title">왜 회의가 필요할까요?</strong>
              <span>문제와 바라는 모습을 한 칸씩 채워요.</span>
            </div>
            <div class="prepare-story-grid">
              ${prepareProposalCard("problem", "지금 어떤 문제가 있나요?", "agenda.problemContext", "agenda.problemProposer", ASSETS.icons.question, "#8b5cf6")}
              ${prepareProposalCard("outcome", "어떻게 바뀌면 좋을까요?", "agenda.expectedOutcome", "agenda.outcomeProposer", ASSETS.icons.target, "#2f80ed")}
            </div>
          </section>
          <div class="redesign-readiness" role="status" aria-label="회의 준비 입력 상태">
            <span class="${hasTopic ? "ready" : "needs-attention"}" data-prepare-topic-status><b>${hasTopic ? "✓" : "1"}</b><em>${hasTopic ? "오늘의 주제를 적었어요" : "오늘의 주제를 먼저 적어요"}</em></span>
            <i aria-hidden="true">→</i>
            <span class="${hasStory ? "ready" : "needs-attention"}" data-prepare-story-status><b>${hasStory ? "✓" : "2"}</b><em>${hasStory ? "회의가 필요한 까닭을 적었어요" : "문제나 바라는 모습을 적어요"}</em></span>
            <i aria-hidden="true">→</i>
            <span class="time"><b>3</b><em>다음에서 회의 순서를 골라요</em></span>
          </div>
        </section>
      </div>
    `;
  }

  function prepareProposalCard(kind, label, textPath, proposerPath, emoji, color) {
    const textValue = getPath(state.meeting, textPath) ?? "";
    const proposerValue = getPath(state.meeting, proposerPath) ?? "";
    const additionalPath = kind === "problem" ? "agenda.problemAdditionalOpinions" : "agenda.outcomeAdditionalOpinions";
    const additionalOpinions = Array.isArray(getPath(state.meeting, additionalPath)) ? getPath(state.meeting, additionalPath) : [];
    const opinions = [{ text: textValue, proposer: proposerValue }, ...additionalOpinions];
    return `
      <div class="info-row prepare-text-card prepare-proposal-card prepare-proposal-group" data-prepare-kind="${kind}">
        ${chip(emoji, color)}
        <div class="info-body">
          <div class="prepare-opinion-title-row">
            <span class="info-label" style="color:${color}">${escapeHtml(label)}</span>
            <button class="prepare-add-opinion" type="button" data-action="add-prepare-opinion" data-kind="${kind}">＋ 생각 더하기</button>
          </div>
          <div class="prepare-opinion-list">
            ${opinions.map((opinion, index) => {
              const opinionTextPath = index === 0 ? textPath : `${additionalPath}.${index - 1}.text`;
              const opinionProposerPath = index === 0 ? proposerPath : `${additionalPath}.${index - 1}.proposer`;
              const proposer = String(opinion?.proposer || "");
              const text = String(opinion?.text || "");
              const preview = text.trim() || "내용을 적어 주세요";
              return `
                <!-- compact-details 를 붙이면 열었을 때 화면 가운데 팝업으로 뜬다.
                     펼친 채로 두면 161px 짜리 편집칸이 57px 목록 창에 갇혀 잘려 보였다. -->
                <details class="prepare-opinion-toggle compact-details">
                  <summary>
                    <b>${escapeHtml(proposer.trim() || `${index + 1}번째 생각`)}</b>
                    <span>${escapeHtml(preview)}</span>
                  </summary>
                  <div class="prepare-opinion-editor">
                    <textarea class="row-input" data-field="${opinionTextPath}" rows="2" wrap="soft" aria-label="${escapeAttr(`${label} ${index + 1}번째 생각`)}" placeholder="생각을 적어요">${escapeHtml(text)}</textarea>
                    <div class="prepare-opinion-person-row">
                      <label class="prepare-proposer-field">
                        <span>생각을 낸 사람</span>
                        <input class="row-input" data-field="${opinionProposerPath}" value="${escapeAttr(proposer)}" aria-label="${escapeAttr(`${label} ${index + 1}번째 생각을 낸 사람`)}" placeholder="이름을 적어요" />
                      </label>
                      ${index > 0 ? `<button class="prepare-opinion-remove" type="button" data-action="remove-prepare-opinion" data-kind="${kind}" data-index="${index - 1}" aria-label="${index + 1}번째 생각 지우기">×</button>` : ""}
                    </div>
                  </div>
                </details>
              `;
            }).join("")}
          </div>
        </div>
      </div>
    `;
  }

  function renderFlowSetup() {
    const selectedPages = getSelectedFlowPages();
    const roles = state.meeting.roles.entries;
    const assignedRoleCount = roles.filter((role) => String(role.name || "").trim()).length;
    const missingRoleCount = Math.max(0, roles.length - assignedRoleCount);
    const durationMinutes = getMeetingDurationMinutes();
    return `
      <div class="workspace wide">
        <section class="panel flow-setup-board">
          <div class="flow-board-section flow-activity-section">
            <div class="flow-section-head student-route-head">
              <div>
                <h2 class="panel-title">오늘 회의 순서</h2>
                <p>필요한 활동을 누르면 오늘 순서에서 빼거나 다시 넣을 수 있어요.</p>
              </div>
              <span>선택 ${selectedPages.length}개 · ${durationMinutes}분</span>
            </div>
            <div class="student-route-grid" role="group" aria-label="오늘 진행할 활동 체크리스트">
              ${FLOW_SELECTABLE_PAGES.map((step, index) => {
                const label = state.meeting.flow.stepLabels[step - 1] || PAGES[step].short;
                const isSelected = selectedPages.includes(step);
                return `
                  <button class="route-choice ${isSelected ? "selected" : ""}" style="--route:${STEP_COLORS[step - 1]}" type="button" data-action="toggle-flow-page" data-page="${step}" aria-pressed="${isSelected}">
                    <span class="route-choice-head">
                      <span class="route-step-number" aria-hidden="true">${index + 1}</span>
                      <span class="route-check" aria-hidden="true">${isSelected ? "✓" : ""}</span>
                      <strong>${escapeHtml(label)}</strong>
                    </span>
                    <span class="route-choice-body">
                      ${img(FLOW_ROUTE_ICONS[step], "", "route-choice-icon")}
                      <small>${FLOW_ROUTE_HINTS[step]}</small>
                    </span>
                  </button>
                `;
              }).join("")}
            </div>
          </div>

          <div class="flow-board-section flow-role-section">
            <div class="flow-section-head role-section-head">
              <div>
                <h2 class="panel-title">맡을 친구 정하기</h2>
                <p>맡은 일 이름은 바로 고칠 수 있고, 친구 이름은 크게 적을 수 있어요.</p>
              </div>
              <div class="role-head-actions">
                <span data-role-progress>${assignedRoleCount}/${roles.length}명 입력</span>
                <button class="add-row" data-action="add-role">＋ 맡은 일 추가</button>
              </div>
            </div>
            <div class="role-editor" aria-label="맡은 일 정하기">
              ${roles.map((role, index) => `
                <article class="role-row">
                  <div class="role-card-head">
                    ${chip(index === 0 ? ASSETS.icons.podium : ASSETS.icons.pencil, index === 0 ? "#19b999" : "#2f80ed", role.label)}
                    <label class="role-field role-title-field">
                      <span class="sr-only">맡은 일</span>
                      <input class="role-title-input" data-field="roles.entries.${index}.label" value="${escapeAttr(role.label)}" aria-label="${index + 1}번째 맡은 일" placeholder="예: 회장" />
                    </label>
                    <button class="row-x" data-action="remove-role" data-index="${index}" aria-label="${escapeAttr(role.label || "맡은 일")} 지우기">×</button>
                  </div>
                  <label class="role-field person">
                    <!-- 카드가 좁아 이 라벨이 위 줄(아이콘·맡은 일)과 겹쳐 보였다.
                         바로 아래 입력칸에 "이름 적기" 안내가 있으므로 화면에서는 빼고
                         읽기 도구용으로만 남긴다. 위 "맡은 일" 라벨과 같은 방식. -->
                    <span class="sr-only">맡은 친구</span>
                    <input class="row-input" data-field="roles.entries.${index}.name" value="${escapeAttr(role.name)}" aria-label="${escapeAttr(role.label || `${index + 1}번째 맡은 일`)}을 맡은 친구" placeholder="이름 적기" />
                  </label>
                </article>
              `).join("")}
            </div>
          </div>

          <div class="flow-readiness" role="status" aria-label="회의 준비 상태">
            <span class="${selectedPages.length ? "ready" : "needs-attention"}"><b aria-hidden="true">${selectedPages.length ? "✓" : "!"}</b>활동 ${selectedPages.length}개 선택</span>
            <i aria-hidden="true">·</i>
            <span class="${missingRoleCount ? "needs-attention" : "ready"}" data-role-readiness><b aria-hidden="true" data-role-readiness-icon>${missingRoleCount ? "!" : "✓"}</b><em data-role-readiness-text>${missingRoleCount ? `맡을 친구 ${missingRoleCount}명 미입력` : "맡을 친구 입력 완료"}</em></span>
            <i aria-hidden="true">·</i>
            <span class="time"><b aria-hidden="true" class="clock-dot"></b>예상 시간 ${durationMinutes}분</span>
          </div>
        </section>
      </div>
    `;
  }

  // 준비도 칩은 글자를 치는 도중에도 바뀌어야 해서 한곳에서 만든다. updateDependentText 가 같은 함수로 다시 그린다.
  function readinessChip(status, badge, text) {
    return `<span class="${status}"><b>${badge}</b><em>${escapeHtml(text)}</em></span>`;
  }

  function readinessChips(step) {
    const meeting = state.meeting;
    const filled = (value) => String(value || "").trim().length > 0;
    const chips = [];
    if (Number(step) === 3) {
      const hasTopic = filled(meeting.agenda.title);
      const ruleCount = meeting.meetingRules.filter((rule) => filled(rule)).length;
      chips.push(readinessChip(hasTopic ? "ready" : "needs-attention", hasTopic ? "✓" : "!", "오늘의 주제 확인"));
      chips.push(readinessChip(ruleCount ? "ready" : "needs-attention", ruleCount ? "✓" : "!", `약속 ${ruleCount}개 준비`));
      chips.push(readinessChip("time", "▶", "이제 지난 약속을 돌아봐요"));
    } else if (Number(step) === 6) {
      const opinionCount = meeting.opinions.length;
      const talliedCount = meeting.topicSelection.talliedOpinionIds.filter((id) => meeting.opinions.some((opinion) => opinion.id === id)).length;
      const allTallied = Boolean(opinionCount) && talliedCount === opinionCount;
      chips.push(readinessChip(opinionCount ? "ready" : "needs-attention", opinionCount ? "✓" : "1", `생각 ${opinionCount}개 모음`));
      chips.push(readinessChip(allTallied ? "ready" : "needs-attention", allTallied ? "✓" : "2", `손든 수 ${talliedCount}/${opinionCount} 확인`));
      chips.push(readinessChip(filled(meeting.topicSelection.selectedTopic) ? "ready" : "needs-attention", filled(meeting.topicSelection.selectedTopic) ? "✓" : "3", "이어갈 생각 고르기"));
    } else if (Number(step) === 7) {
      const hasTopic = filled(meeting.topicSelection.selectedTopic);
      const hasDiscussion = [meeting.discussion.agreeReasons, meeting.discussion.concerns, meeting.discussion.revisionSuggestion].some(filled);
      chips.push(readinessChip(hasTopic ? "ready" : "needs-attention", hasTopic ? "✓" : "1", "토의할 생각 확인"));
      chips.push(readinessChip(hasDiscussion ? "ready" : "needs-attention", hasDiscussion ? "✓" : "2", "세 가지 관점으로 토의"));
      chips.push(readinessChip("time", "3", "다음에서 손들어 정해요"));
    } else if (Number(step) === 9) {
      const decision = meeting.decision;
      const hasWho = filled(decision.practiceMethod) && filled(decision.owner);
      chips.push(readinessChip(filled(decision.text) ? "ready" : "needs-attention", filled(decision.text) ? "✓" : "1", "정한 일"));
      chips.push(readinessChip(hasWho ? "ready" : "needs-attention", hasWho ? "✓" : "2", "방법과 맡을 친구"));
      chips.push(readinessChip(filled(decision.period) ? "ready" : "needs-attention", filled(decision.period) ? "✓" : "3", "기간 확인"));
    } else if (Number(step) === 10) {
      const hasTopic = filled(meeting.agenda.title);
      const hasDecision = filled(meeting.decision.text);
      chips.push(readinessChip(hasTopic ? "ready" : "needs-attention", hasTopic ? "✓" : "!", "주제 확인"));
      chips.push(readinessChip(hasDecision ? "ready" : "needs-attention", hasDecision ? "✓" : "!", "실천 약속 확인"));
      chips.push(readinessChip("time", "★", "저장하면 오늘 회의가 끝나요"));
    }
    return chips.join("<i>→</i>");
  }

  function readinessStrip(step) {
    return `<div class="redesign-readiness" data-readiness-strip="${step}">${readinessChips(step)}</div>`;
  }

  function renderStartGuide() {
    return `
      <div class="workspace wide">
        <section class="panel redesign-board promise-redesign">
          <div class="redesign-board-head">
            <div><h2>약속을 읽고 회의를 시작해요</h2><p>오늘의 주제를 확인하고, 친구들과 지킬 약속을 소리 내어 읽어요.</p></div>
            <button class="btn mint sm" data-action="sample-meeting-rules">✨ 약속 예시 넣기</button>
          </div>
          <label class="promise-topic-band">
            ${chip(ASSETS.icons.megaphone, "#7857d9", "오늘의 주제")}
            <span><b>오늘의 주제</b><small>앞에서 정한 주제가 그대로 이어져요.</small></span>
            <input class="row-input xl" data-field="agenda.title" value="${escapeAttr(state.meeting.agenda.title)}" aria-label="오늘의 주제" placeholder="오늘의 주제를 적어요" />
          </label>
          <div class="promise-section-head"><strong>우리 반 약속</strong><span>모두 읽은 뒤 필요한 약속만 고쳐요.</span></div>
          <ol class="meeting-rule-list promise-card-grid">
            ${state.meeting.meetingRules.map((rule, index) => `
              <li class="meeting-rule-row">
                <span class="rule-number">${index + 1}</span>
                <input class="row-input" data-field="meetingRules.${index}" value="${escapeAttr(rule)}" aria-label="${index + 1}번째 회의 약속" placeholder="우리 반이 지킬 약속을 입력해요" />
                <button class="row-x" data-action="remove-meeting-rule" data-index="${index}" aria-label="${index + 1}번째 회의 약속 삭제">×</button>
              </li>
            `).join("")}
          </ol>
          <div class="promise-add-row"><button class="add-row" data-action="add-meeting-rule">＋ 약속 한 가지 더하기</button></div>
          ${readinessStrip(3)}
        </section>
      </div>
    `;
  }

  function getSavedPromiseOptions() {
    const values = state.recentMeetings
      .filter((meeting) => meeting?.id !== state.meeting.id)
      .map((meeting) => ({
        date: meeting.date || "저장된 회의",
        label: String(meeting.agenda?.title || meeting.decision?.text || "저장된 회의 주제").trim(),
        value: String(meeting.decision?.text || meeting.agenda?.title || "").trim()
      }))
      .filter((item) => item.value);
    const current = String(state.meeting.previous.promise || "").trim();
    if (current && !values.some((item) => item.value === current)) values.unshift({ date: "현재 선택", label: current, value: current });
    return values.filter((item, index, all) => all.findIndex((candidate) => candidate.value === item.value) === index).slice(0, 20);
  }

  function renderReflection() {
    const hr = state.meeting.previous.handRaise;
    const total = Number(hr.good || 0) + Number(hr.normal || 0) + Number(hr.hard || 0);
    const expected = getPresentCount();
    const countState = total === expected && expected > 0 ? "complete" : total > expected ? "over" : "pending";
    const countMessage = countState === "complete"
      ? "모두 손들었어요"
      : countState === "over"
        ? `${total - expected}명이 많아요`
        : `${Math.max(0, expected - total)}명을 더 세어요`;
    const savedPromises = getSavedPromiseOptions();
    return `
      <div class="workspace wide">
        <section class="panel redesign-board reflection-redesign">
        <div class="redesign-board-head">
          <div><h2>지난 약속을 돌아봐요</h2><p>손든 수를 세고, 잘된 점과 다음에 바꿀 점을 짧게 남겨요.</p></div>
          <span class="board-step-chip pink">지난번 보기</span>
        </div>
        <section class="reflection-top-card">
          <label class="reflection-promise-picker">
            <span>${img(ASSETS.icons.clipboard, "지난번 약속 아이콘", "hero-img")}<b>지난번 약속</b></span>
            <select class="row-input xl" data-field="previous.promise" aria-label="저장된 회의에서 지난번 약속 고르기">
              <option value="">저장된 회의에서 지난번 약속을 골라요</option>
              ${savedPromises.map((item) => `<option value="${escapeAttr(item.value)}" ${item.value === state.meeting.previous.promise ? "selected" : ""}>${escapeHtml(item.date)} · ${escapeHtml(item.label)}</option>`).join("")}
            </select>
          </label>
          <div class="reflection-count-status ${countState}" data-reflection-status>
            <span>손든 수 모두</span><strong><b data-reflection-total>${total}</b> / <b data-present-count>${expected}</b>명</strong><small data-reflection-message>${countMessage}</small>
          </div>
        </section>
        ${renderAbsentControl()}
        <div class="grid reflect reflection-large-cards">
          ${faceCard("잘 지켰어요", "previous.handRaise.good", ASSETS.icons.happy, "#19b999")}
          ${faceCard("조금 지켰어요", "previous.handRaise.normal", ASSETS.icons.neutral, "#f59e0b")}
          ${faceCard("지키기 어려웠어요", "previous.handRaise.hard", ASSETS.icons.concern, "#ef4f85")}
        </div>
        <div class="reflection-note-grid">
          ${pastelNote("잘된 점", "previous.evidence", ASSETS.icons.happy, "#19b999")}
          ${pastelNote("어려웠던 점", "previous.cause", ASSETS.icons.concern, "#ef4f85")}
          ${pastelNote("다음에 바꿀 점", "previous.improvement", ASSETS.icons.idea, "#2f80ed")}
        </div>
        <details class="compact-details reflection-legacy-note">
          <summary>자유 메모 보기</summary>
          <div class="details-content"><textarea class="row-input" data-field="previous.reflectionNotes" rows="2" aria-label="지난 약속 자유 메모" placeholder="더 남길 내용이 있으면 적어요">${escapeHtml(state.meeting.previous.reflectionNotes)}</textarea></div>
        </details>
        <div class="redesign-readiness"><span class="${state.meeting.previous.promise ? "ready" : "needs-attention"}"><b>${state.meeting.previous.promise ? "✓" : "1"}</b><em>지난 약속 고르기</em></span><i>→</i><span class="${countState === "complete" ? "ready" : "needs-attention"}"><b>${countState === "complete" ? "✓" : "2"}</b><em>${countMessage}</em></span><i>→</i><span class="time"><b>3</b><em>다음에 생각을 모아요</em></span></div>
        </section>
      </div>
    `;
  }

  function applyBulkStudentNames(value) {
    const names = String(value || "")
      .split(/[,，;\n]+/)
      .map((name) => name.trim())
      .filter(Boolean)
      .slice(0, 30);

    const previousOrderNames = getSpeakerOrder().map((index) => String(state.meeting.students[index] || "").trim());
    state.meeting.students = Array.from({ length: 30 }, (_, index) => names[index] || "");
    state.meeting.speakerOrder = previousOrderNames
      .map((name) => state.meeting.students.findIndex((student) => String(student || "").trim() === name))
      .filter((index, position, all) => index >= 0 && all.indexOf(index) === position);
    state.meeting.updatedAt = new Date().toISOString();

    document.querySelectorAll("[data-student-bulk-count]").forEach((node) => {
      node.textContent = `${names.length}명`;
    });
    document.querySelectorAll('[data-action="add-all-speakers"]').forEach((button) => {
      button.disabled = names.length < 1;
    });
    document.querySelectorAll('[data-action="shuffle-speakers"]').forEach((button) => {
      button.disabled = names.length < 2;
    });

    queueSave();
    updateDependentText();
  }

  function getSpeakerOrder() {
    const students = Array.isArray(state.meeting.students) ? state.meeting.students : [];
    return (Array.isArray(state.meeting.speakerOrder) ? state.meeting.speakerOrder : [])
      .map(Number)
      .filter((index, position, all) => Number.isInteger(index) && index >= 0 && index < 30 && students[index]?.trim() && all.indexOf(index) === position);
  }

  function renderOpinionBoard() {
    const speakerOrder = getSpeakerOrder();
    const namedStudents = state.meeting.students.filter((name) => String(name || "").trim()).length;
    const namedStudentEntries = state.meeting.students
      .map((name, index) => ({ name: String(name || "").trim(), index }))
      .filter((student) => student.name);
    return `
      <div class="workspace wide">
        <section class="panel redesign-board opinion-entry-panel opinion-entry-redesign">
          <div class="panel-head opinion-entry-head">
            <div><h2 class="panel-title" style="color:var(--blue)">생각과 이유를 차례로 적어요</h2><p>친구가 말한 생각과 이유를 적고 ‘기록하기’를 눌러요.</p></div>
            <span class="speaker-count-badge">생각 ${state.meeting.opinions.length}개</span>
          </div>
          <label class="opinion-topic-context">${chip(ASSETS.icons.clipboard, "#19b999", "오늘의 주제")}<span><b>오늘의 주제</b><small>앞 단계의 주제가 이어졌어요.</small></span><input class="row-input" data-field="agenda.title" value="${escapeAttr(state.meeting.agenda.title)}" aria-label="오늘의 주제" /></label>
          <!-- 이 순서에 꼭 필요한 건 '기록' 하나뿐이라 한 칸으로 펴고, 발표 순서는 아래 토글로 내렸다. -->
          <div class="opinion-speaking-layout" style="grid-template-columns:minmax(0,1fr)">
            <div class="opinion-compose">
              <label><span class="info-label" style="color:var(--blue)">생각</span><textarea class="row-input" data-field="opinionDraft.text" rows="3" placeholder="발표한 생각을 적어요" aria-label="발표한 생각">${escapeHtml(state.meeting.opinionDraft.text)}</textarea></label>
              <label><span class="info-label" style="color:var(--violet)">이유</span><textarea class="row-input" data-field="opinionDraft.reason" rows="3" placeholder="그렇게 생각한 이유를 적어요" aria-label="발표한 이유">${escapeHtml(state.meeting.opinionDraft.reason)}</textarea></label>
              <button class="btn mint" data-action="add-opinion">＋ 생각과 이유 기록하기</button>
              <details class="compact-details" data-opinion-list ${state.opinionListOpen ? "open" : ""}>
                <summary>기록한 생각 <b data-opinion-count>${state.meeting.opinions.length}</b>개 보기</summary>
                <div class="details-content">
                  <div class="recorded-opinion-items">
                    ${state.meeting.opinions.map((opinion, index) => `
                      <span class="recorded-opinion-chip"><b>${index + 1}</b><span>${escapeHtml(opinion.text)}</span><button type="button" data-action="delete-opinion" data-id="${escapeAttr(opinion.id)}" aria-label="${index + 1}번째 생각 지우기">×</button></span>
                    `).join("") || `<span class="recorded-opinion-empty">‘기록하기’를 누르면 여기에 생각이 쌓여요. 잘못 적으면 ×로 지울 수 있어요.</span>`}
                  </div>
                </div>
              </details>
            </div>
          </div>
          <details class="compact-details">
            <summary>발표 순서 정하기 · 친구 이름 적기 <span data-student-readiness>${namedStudents ? `친구 ${namedStudents}명 입력` : "이름을 한 번에 입력해요"}</span></summary>
            <div class="details-content speaker-order-content" aria-label="우리 반 발표 순서 정하기">
              <label class="student-bulk-entry">
                <span><b>발표할 친구 이름</b><small>쉼표로 나누어 한 번에 적어요.</small></span>
                <input class="row-input" data-student-name-bulk value="${escapeAttr(state.meeting.students.filter((name) => String(name || "").trim()).join(", "))}" placeholder="예: 김민준, 이서윤, 박지우" aria-label="학생 이름 쉼표로 한 번에 입력" />
                <em data-student-bulk-count>${state.meeting.students.filter((name) => String(name || "").trim()).length}명</em>
              </label>
              <div class="student-order-tools" aria-label="발표 순서 빠른 도구">
                <button type="button" class="btn secondary sm" data-action="add-all-speakers" ${namedStudents ? "" : "disabled"}>모두 순서에 넣기</button>
                <button type="button" class="btn secondary sm" data-action="shuffle-speakers" ${namedStudents > 1 ? "" : "disabled"}>🔀 순서 섞기</button>
              </div>
              <div class="student-roster-chips" aria-label="발표 순서를 정할 이름표">
                ${namedStudentEntries.map(({ name, index }) => {
                  const orderIndex = speakerOrder.indexOf(index);
                  return `<button type="button" class="student-roster-chip ${orderIndex >= 0 ? "is-ordered" : ""}" data-action="toggle-speaker-order" data-index="${index}" aria-pressed="${orderIndex >= 0}" aria-label="${escapeAttr(name)} 발표 순서 ${orderIndex >= 0 ? "빼기" : "추가"}"><b>${orderIndex >= 0 ? orderIndex + 1 : "+"}</b><span>${escapeHtml(name)}</span></button>`;
                }).join("") || `<p class="student-roster-empty">위 칸에 발표할 친구 이름을 적으면 이름표가 나타나요.</p>`}
              </div>
              <div class="speaker-order-preview">
                <strong>발표 순서</strong>
                <div>${speakerOrder.map((studentIndex, orderIndex) => `<button type="button" data-action="toggle-speaker-order" data-index="${studentIndex}" aria-label="${orderIndex + 1}번째 ${escapeAttr(state.meeting.students[studentIndex])} 순서에서 빼기"><b>${orderIndex + 1}</b>${escapeHtml(state.meeting.students[studentIndex])}</button>`).join("") || `<span class="speaker-empty-guide"><b>1 · 친구 이름 입력</b><i>→</i><b>2 · 이름표 누르기</b></span>`}</div>
                ${speakerOrder.length ? `<button class="speaker-order-clear" type="button" data-action="clear-speaker-order">순서 초기화</button>` : ""}
              </div>
              <!-- 30칸 이름 입력은 위 쉼표 입력으로 같은 일을 할 수 있어서 뺐다. 숨은 조작 요소 60개가 사라진다. -->
            </div>
          </details>
          <div class="redesign-readiness"><span class="${state.meeting.agenda.title ? "ready" : "needs-attention"}"><b>${state.meeting.agenda.title ? "✓" : "1"}</b><em>주제 확인</em></span><i>→</i><span class="${state.meeting.opinions.length ? "ready" : "needs-attention"}"><b>${state.meeting.opinions.length ? "✓" : "2"}</b><em>생각 ${state.meeting.opinions.length}개 기록</em></span><i>→</i><span class="time"><b>3</b><em>다음에서 손든 수를 세어요</em></span></div>
        </section>
      </div>
    `;
  }

  function renderOpinionSummary() {
    const rankColors = ["#ef4f85", "#2f80ed", "#7857d9"];
    const opinionCount = state.meeting.opinions.length;
    const talliedCount = state.meeting.topicSelection.talliedOpinionIds.filter((id) => state.meeting.opinions.some((opinion) => opinion.id === id)).length;
    return `
      <div class="workspace wide">
        <section class="panel redesign-board opinion-tally-board opinion-summary-redesign">
          <div class="panel-head opinion-tally-head">
            <div><h2 class="panel-title" style="color:var(--violet)">앞에서 나온 생각 모아보기</h2><p>생각과 이유를 읽고, 같은 생각에 손든 친구 수를 적어요.</p></div>
            <span class="tally-status ${opinionCount && talliedCount === opinionCount ? "is-complete" : ""}"><b>${talliedCount} / ${opinionCount}</b> 확인</span>
          </div>
          <div class="summary-topic-band"><span>오늘의 주제</span><strong>${escapeHtml(state.meeting.agenda.title || "앞 단계에서 오늘의 주제를 적어 주세요.")}</strong></div>
          <div class="opinion-tally-list">
            ${state.meeting.opinions.map((opinion, index) => `
              <article class="opinion-tally-card ${state.meeting.topicSelection.selectedTopic === opinion.text ? "is-selected" : ""}" style="--rank:${rankColors[index % rankColors.length]}">
                <button type="button" class="tally-remove" data-action="delete-opinion" data-id="${escapeAttr(opinion.id)}" aria-label="${index + 1}번째 생각 지우기" title="이 생각 지우기">×</button>
                <span class="rank-badge">${index + 1}</span>
                <div class="opinion-tally-copy"><strong>${escapeHtml(opinion.text)}</strong><p>${escapeHtml(opinion.reason || "이유를 아직 적지 않았어요.")}</p></div>
                ${handVoteControl(`opinions.${index}.likes`, opinion.id)}
                <button class="btn ${state.meeting.topicSelection.selectedTopic === opinion.text ? "mint" : "secondary"} sm opinion-pick" type="button" data-action="select-topic" data-label="${escapeAttr(opinion.text)}">${state.meeting.topicSelection.selectedTopic === opinion.text ? "✓ 함께 토의할 생각" : "이 생각으로 토의하기"}</button>
              </article>
            `).join("") || `<div class="empty-shared-state">앞 순서에서 생각과 이유를 먼저 기록해 주세요.</div>`}
          </div>
          <div class="selected-opinion-banner ${state.meeting.topicSelection.selectedTopic ? "is-selected" : ""}"><span>함께 토의할 생각</span><strong>${escapeHtml(state.meeting.topicSelection.selectedTopic || "위 생각 중 하나를 골라 주세요.")}</strong></div>
          ${readinessStrip(6)}
        </section>
      </div>
    `;
  }

  function renderDiscussionFields() {
    return `
      <div class="hint-band live-entry-guide">💡 좋은 점 → 걱정되는 점 → 더 좋은 방법 순서로 이야기해요. 부회장은 핵심만 짧게 적어요.</div>
      <div class="discussion-three-grid">
        ${pastelNote("좋은 점", "discussion.agreeReasons", ASSETS.icons.check, "#19b999")}
        ${pastelNote("걱정되는 점", "discussion.concerns", ASSETS.icons.concern, "#ef4f85")}
        ${pastelNote("더 좋은 방법", "discussion.revisionSuggestion", ASSETS.icons.idea, "#f59e0b")}
      </div>
      <!-- 발언 카운터 4세트는 검증에도 회의 기록에도 쓰이지 않아 지웠다. 데이터(discussion.handRaise)는 그대로 둔다. -->
      <details class="compact-details discussion-extra-details">
        <summary>처음 생각한 방법과 궁금한 점 적기</summary>
        <div class="details-content grid two">
          ${pastelNote("처음 생각한 방법", "discussion.proposal", ASSETS.icons.report, "#2f80ed")}
          ${pastelNote("궁금한 점", "discussion.questions", ASSETS.icons.question, "#7857d9")}
        </div>
      </details>
    `;
  }

  function renderDiscussion() {
    return `
      <div class="workspace wide">
        <section class="panel redesign-board discussion-redesign">
          <div class="redesign-board-head"><div><h2>세 가지 질문으로 더 좋은 방법을 찾아요</h2><p>한 칸씩 차례로 이야기하면 친구들의 생각을 놓치지 않아요.</p></div><span class="board-step-chip orange">함께 토의</span></div>
          <label class="discussion-topic-band">${chip(ASSETS.icons.megaphoneBig, "#f59e0b", "함께 토의할 생각")}<span><b>함께 토의할 생각</b><small>앞에서 고른 생각이 이어져요.</small></span><input class="row-input" data-field="topicSelection.selectedTopic" value="${escapeAttr(state.meeting.topicSelection.selectedTopic)}" aria-label="함께 토의할 생각" /></label>
          ${renderDiscussionFields()}
          ${readinessStrip(7)}
        </section>
      </div>
    `;
  }

  function renderVote() {
    const agree = Number(state.meeting.vote.agree || 0);
    const disagree = Number(state.meeting.vote.disagree || 0);
    const total = agree + disagree;
    const expected = getPresentCount();
    const agreeRate = total ? Math.round((agree / total) * 100) : 0;
    const countState = total === expected && expected > 0 ? "complete" : total > expected ? "over" : "pending";
    const interpretation = agreeRate >= 50
      ? "좋아요가 많아도, 다른 생각인 친구의 이유를 꼭 듣고 함께 정해요."
      : "다른 생각이 많네요. 이유를 더 듣고 방법을 고쳐 봐요.";

    return `
      <div class="workspace wide">
        <section class="panel redesign-board vote-redesign">
          <div class="redesign-board-head"><div><h2>손든 수를 세고 결과를 함께 확인해요</h2><p>두 가지 손든 수를 모두 센 뒤, 숫자와 친구들의 이유를 같이 살펴요.</p></div><span class="board-step-chip blue">손들기</span></div>
          <label class="vote-question-band"><span><b>함께 정할 질문</b><small>질문을 소리 내어 한 번 읽어요.</small></span><input class="row-input" data-field="vote.question" value="${escapeAttr(state.meeting.vote.question || state.meeting.topicSelection.selectedTopic)}" aria-label="함께 정할 질문" /></label>
          <div class="vote-main-grid">
            <div class="vote-choice-grid">
              ${voteCard("좋아요", "이 방법이 좋아요", "vote.agree", ASSETS.icons.check, "#19b999")}
              ${voteCard("다른 생각이에요", "다른 방법이나 이유가 있어요", "vote.disagree", ASSETS.icons.x, "#e54b79")}
            </div>
            <section class="result-panel">
            ${img(ASSETS.icons.mail, "손든 수 아이콘", "result-img")}
            <span class="info-label" style="color:var(--blue)">결과를 같이 읽어요</span>
            <p class="rate-line">현재 좋아요 비율 <b class="rate" style="color:var(--mint-deep)">${agreeRate}%</b></p>
            <div class="bar"><span style="--value:${agreeRate}%"></span></div>
            <p class="interp">${interpretation}</p>
            <div class="vote-reference-note">숫자는 정하는 데 도움을 주는 참고예요. 숫자만 보지 말고 친구의 이유를 함께 들어요.</div>
          </section>
          </div>
          <div class="vote-equation ${countState}" aria-live="polite">
            <span>좋아요 <b data-vote-equation-agree>${agree}</b>명</span><i>＋</i><span>다른 생각 <b data-vote-equation-disagree>${disagree}</b>명</span><i>＝</i><strong><b data-vote-equation-total>${total}</b> / <b data-present-count>${expected}</b>명</strong>
            <em data-vote-equation-gap>${countState === "complete" ? "✓ 모두 셌어요" : countState === "over" ? `${total - expected}명 많아요` : `${expected - total}명 더 세어요`}</em>
            <button class="btn ${state.meeting.vote.confirmed ? "mint" : "secondary"} sm vote-equation-confirm" data-action="confirm-vote" data-vote-confirm ${countState === "complete" ? "" : "disabled"}>${state.meeting.vote.confirmed ? "✓ 확인했어요" : "다 세었어요"}</button>
          </div>
          ${renderAbsentControl()}
        </section>
      </div>
    `;
  }

  function renderDecision() {
    const decision = state.meeting.decision;
    return `
      <div class="workspace wide">
        <section class="panel redesign-board decision-redesign">
          <div class="redesign-board-head"><div><h2>정한 일을 ‘우리가 할 일’로 적어요</h2><p>무엇을·어떻게·누가·언제까지 할지 네 칸에 적으면 약속이 완성돼요.</p></div><span class="vote-summary-chip">좋아요 ${state.meeting.vote.agree} · 다른 생각 ${state.meeting.vote.disagree}</span></div>
        <div class="decision-field-grid">
          ${infoField("오늘 함께 정한 일", "decision.text", ASSETS.icons.target, "#19b999")}
          ${infoField("어떻게 실천할까요?", "decision.practiceMethod", ASSETS.icons.pencil, "#2f80ed")}
          ${infoField("누가 맡을까요?", "decision.owner", ASSETS.icons.role, "#7857d9")}
          ${infoField("언제까지 할까요?", "decision.period", ASSETS.icons.calendar, "#ef4f85")}
        </div>
        <section class="decision-preview" aria-label="우리가 할 일 미리보기">
          <span>우리가 할 일</span>
          <strong data-decision-preview-text>${escapeHtml(decision.text || "무엇을 할지 적으면 여기에 보여요.")}</strong>
          <p><b data-decision-preview-method>${escapeHtml(decision.practiceMethod || "실천 방법")}</b> · <b data-decision-preview-owner>${escapeHtml(decision.owner || "맡을 친구")}</b> · <b data-decision-preview-period>${escapeHtml(decision.period || "실천 기간")}</b></p>
        </section>
        <details class="compact-details decision-extra-details">
          <summary>추가로 입력할 내용 적기</summary>
          <div class="details-content">
            <textarea class="row-input decision-additional-input" data-field="decision.additionalNotes" rows="4" aria-label="정한 일에 추가로 기록할 내용" placeholder="필요한 내용을 자유롭게 적어요">${escapeHtml(state.meeting.decision.additionalNotes)}</textarea>
          </div>
        </details>
        ${readinessStrip(9)}
        </section>
      </div>
    `;
  }

  function getClosingFeedbackIndex(seed) {
    return Array.from(String(seed || "우리 반")).reduce((sum, character) => (sum * 31 + character.charCodeAt(0)) % 100, 0);
  }

  function buildClosingFeedback(meeting = state.meeting, index = meeting.feedbackIndex) {
    const normalized = ((Number(index) || 0) % 100 + 100) % 100;
    const positive = POSITIVE_CLOSING_LINES[Math.floor(normalized / 10)];
    const civic = CIVIC_VALUE_LINES[normalized % 10];
    return `${positive} ${civic}`;
  }

  function renderReport() {
    const speakerOrder = getSpeakerOrder().map((index, orderIndex) => `${orderIndex + 1}. ${state.meeting.students[index]}`).join(" → ");
    const rows = [
      ["날짜", `${state.meeting.date} · 우리 반 친구 ${state.meeting.totalStudents}명 · 오늘 온 친구 ${getPresentCount()}명`],
      ["오늘의 주제", state.meeting.agenda.title],
      ["지금 우리의 문제점", formatPrepareOpinions("problem")],
      ["어떻게 바꾸면 좋을까요?", formatPrepareOpinions("outcome")],
      ["맡은 일", formatRolesForReport()],
      ["우리 반 약속", state.meeting.meetingRules.filter((rule) => rule.trim()).join(" / ") || "적은 약속 없음"],
      // 같은 내용이 두 줄로 나뉘어 나오던 것을 한 줄로 합친다.
      ["지난 약속 돌아보기", `${state.meeting.previous.promise} · 잘 지켰어요 ${state.meeting.previous.handRaise.good} / 조금 지켰어요 ${state.meeting.previous.handRaise.normal} / 지키기 어려웠어요 ${state.meeting.previous.handRaise.hard} · 잘된 점: ${state.meeting.previous.evidence} / 어려웠던 점: ${state.meeting.previous.cause} / 다음에 바꿀 점: ${state.meeting.previous.improvement}`],
      ["발표 순서", speakerOrder],
      ["나온 생각", state.meeting.opinions.map((op) => `${op.text}${op.reason ? ` (${op.reason})` : ""}`).join(" / ")],
      ["함께 토의한 내용", `생각한 방법: ${state.meeting.discussion.proposal} / 걱정되는 점: ${state.meeting.discussion.concerns} / 더 좋은 방법: ${state.meeting.discussion.revisionSuggestion}`],
      ["손든 수", `좋아요 ${state.meeting.vote.agree} / 다른 생각 ${state.meeting.vote.disagree}`],
      ["오늘 함께 정한 일", state.meeting.decision.text],
      ["어떻게 해 볼까요?", state.meeting.decision.practiceMethod],
      ["누가 언제까지 할까요?", `${state.meeting.decision.owner} · ${state.meeting.decision.period}`],
      ["추가 기록", state.meeting.decision.additionalNotes],
      ["우리 반 마무리 한마디", state.meeting.teacherComment]
    ];

    const representativeIdea = state.meeting.topicSelection.selectedTopic || state.meeting.opinions[0]?.text || "아직 고르지 않았어요.";
    const voteTotal = Number(state.meeting.vote.agree || 0) + Number(state.meeting.vote.disagree || 0);
    const agreeRate = voteTotal ? Math.round((Number(state.meeting.vote.agree || 0) / voteTotal) * 100) : 0;
    return `
      <div class="workspace wide">
        <section class="panel redesign-board report-redesign">
          <div class="redesign-board-head"><div><h2>오늘 회의를 한눈에 확인해요</h2><p>처음 주제부터 실천 약속까지 차례로 읽고 회의를 마쳐요.</p></div><span class="board-step-chip violet">마무리</span></div>
          ${state.finalizeGaps.length ? `
            <div class="hint-band">✏️ 아직 안 적은 곳이 있어요. 눌러서 채우고 오면 저장할 수 있어요.
              ${state.finalizeGaps.map((gap) => `<button class="btn secondary sm" type="button" data-action="fix-gap" data-page="${gap.step}" title="${escapeAttr(gap.message)}">${escapeHtml(PAGES[gap.step]?.title || `${gap.step}쪽`)}</button>`).join("")}
            </div>
          ` : ""}
          <div class="report-summary-grid">
            <article><span>1 · 오늘의 주제</span><strong>${escapeHtml(state.meeting.agenda.title || "아직 적지 않았어요.")}</strong></article>
            <article><span>2 · 함께 토의한 생각</span><strong>${escapeHtml(representativeIdea)}</strong></article>
            <article><span>3 · 손든 결과</span><strong>좋아요 ${state.meeting.vote.agree}명 · ${agreeRate}%</strong></article>
            <article><span>4 · 함께 정한 일</span><strong>${escapeHtml(state.meeting.decision.text || "아직 정하지 않았어요.")}</strong></article>
          </div>
          <section class="report-promise-strip">
            ${chip(ASSETS.icons.target, "#19b999", "우리가 실천할 약속")}
            <span><b>우리가 실천할 약속</b><strong>${escapeHtml(state.meeting.decision.practiceMethod || "실천 방법을 확인해 주세요.")}</strong></span>
            <em>${escapeHtml(state.meeting.decision.owner || "맡을 친구")} · ${escapeHtml(state.meeting.decision.period || "실천 기간")}</em>
          </section>
          <div class="report-finish-grid">
            <section class="report-share-card">
              <!-- 이 칸은 127px 인데 머리글·인쇄 버튼·모양 토글·기록 토글을 다 넣어 235px 이 되어
                   오른쪽에 스크롤바가 생겼다. 핵심(인쇄)만 남긴다.
                   · 머리글 문구는 인쇄 버튼이 그대로 말해 주므로 버튼에 합쳤다.
                   · 게시물 모양 고르기는 인쇄 미리보기 안(poster-print-styles)에 이미 있다. -->
              <button class="btn primary poster-print-open" type="button" data-action="open-poster-print">🖨️ 교실에 붙일 한 장 크게 보고 인쇄하기</button>
              <details class="compact-details report-details"><summary>오늘 회의 기록 전체 ${rows.length}개 보기</summary><div id="reportText" class="details-content report-list">${rows.map(([label, value]) => `<div class="report-row"><b class="report-key">${escapeHtml(label)}</b><span>${escapeHtml(value || "아직 입력하지 않았어요.")}</span></div>`).join("")}</div></details>
            </section>
            <!-- 아이콘·제목·바꾸기 버튼·안내문·글상자를 한 칸에 다 넣으니 서로 겹치고
                 오른쪽에 스크롤바가 생겼다. 칸에는 제목과 지금 문장만 두고,
                 누르면 화면 가운데 팝업에서 크게 읽고 고치게 한다. -->
            <section class="report-closing-card">
              <details class="compact-details closing-comment-details" ${state.closingCommentOpen ? "open" : ""}>
                <summary>
                  ${chip(ASSETS.icons.speech, "#7857d9", "우리 반 마무리 한마디")}
                  <span class="closing-summary-text">
                    <b>우리 반 마무리 한마디</b>
                    <em>${escapeHtml(state.meeting.teacherComment || "눌러서 마무리 인사를 적어요.")}</em>
                  </span>
                </summary>
                <div class="details-content closing-comment-content">
                  <p class="closing-comment-guide">서로의 참여를 칭찬하며 오늘 회의를 마쳐요.</p>
                  <textarea class="row-input" data-field="teacherComment" rows="5" aria-label="우리 반 마무리 한마디" placeholder="오늘 회의에서 좋았던 점을 한 문장으로 적어요.">${escapeHtml(state.meeting.teacherComment)}</textarea>
                  <button class="btn secondary" type="button" data-action="refresh-closing-comment">↻ 다른 문장으로 바꾸기</button>
                </div>
              </details>
            </section>
          </div>
          ${readinessStrip(10)}
        </section>
      </div>
    `;
  }

  function buildA4Poster(style) {
    const meeting = state.meeting;
    const blank = (value, fallback = "아직 정하지 않았어요.") => String(value || "").trim() ? String(value).trim() : fallback;
    const agree = Number(meeting.vote.agree || 0);
    const disagree = Number(meeting.vote.disagree || 0);
    const voteTotal = agree + disagree;
    const agreeRate = voteTotal ? Math.round((agree / voteTotal) * 100) : 0;
    const question = blank(meeting.vote.question || meeting.topicSelection.selectedTopic, "함께 토의한 질문");
    const hostName = meeting.roles?.entries?.find((entry) => entry.id === "role-host")?.name || "";
    const footerNames = hostName ? `회장 ${hostName}` : "우리 반 모두";
    return `
      <div class="a4-poster poster-style-${style.id}" aria-hidden="true">
        <div class="a4-deco a4-deco-1"></div>
        <div class="a4-deco a4-deco-2"></div>
        <header class="a4-head">
          <img class="a4-head-icon" src="${style.icons.head}" alt="" />
          <div class="a4-head-copy">
            <span class="a4-kicker">${escapeHtml(blank(meeting.title, "우리 반 학급회의"))} · ${escapeHtml(meeting.date)} · ${escapeHtml(meeting.totalStudents)}명</span>
            <h1 class="a4-title">${escapeHtml(blank(meeting.agenda.title, "우리 반이 함께 정했어요"))}</h1>
          </div>
          <img class="a4-mascot" src="${style.mascot}" alt="" />
        </header>
        <section class="a4-hero">
          <span>우리가 함께 정한 일</span>
          <strong>${escapeHtml(blank(meeting.decision.text))}</strong>
        </section>
        <section class="a4-tiles">
          <article><img src="${style.icons.how}" alt="" /><b>어떻게 할까요?</b><p>${escapeHtml(blank(meeting.decision.practiceMethod, "함께 정한 방법대로 해요."))}</p></article>
          <article><img src="${style.icons.who}" alt="" /><b>누가 할까요?</b><p>${escapeHtml(blank(meeting.decision.owner, "우리 반 모두"))}</p></article>
          <article><img src="${style.icons.when}" alt="" /><b>언제까지?</b><p>${escapeHtml(blank(meeting.decision.period, "다음 회의 때까지"))}</p></article>
        </section>
        <section class="a4-vote">
          <div class="a4-vote-question"><img src="${style.icons.talk}" alt="" /><div><b>함께 토의한 질문</b><p>${escapeHtml(question)}</p></div></div>
          <div class="a4-vote-result">
            <img src="${style.icons.vote}" alt="" />
            <div class="a4-vote-nums">
              <span class="a4-vote-agree">좋아요 ${agree}명</span>
              <span class="a4-vote-bar"><i style="width:${agreeRate}%"></i></span>
              <span class="a4-vote-etc">다른 생각 ${disagree}명 · 좋아요 ${agreeRate}%</span>
            </div>
          </div>
        </section>
        <footer class="a4-closing">
          <img src="${style.icons.closing}" alt="" />
          <p>${escapeHtml(blank(meeting.teacherComment, "함께 정한 약속을 소중히 지켜요."))}</p>
          <small>${escapeHtml(footerNames)} · 우리 모두 함께 지켜요!</small>
        </footer>
      </div>
    `;
  }

  function renderPosterPrintOverlay() {
    const currentStyle = POSTER_STYLES.find((style) => style.id === state.meeting.posterStyle) || POSTER_STYLES[0];
    return `
      <div class="poster-print-overlay" role="dialog" aria-modal="true" aria-label="교실 게시물 인쇄 미리보기">
        <div class="poster-print-panel">
          <div class="poster-print-toolbar">
            <div class="poster-print-styles" role="radiogroup" aria-label="게시물 스타일 고르기">
              ${POSTER_STYLES.map((style) => `
                <button type="button" class="poster-style-chip ${state.meeting.posterStyle === style.id ? "is-selected" : ""}" data-action="set-poster-style" data-style="${style.id}" role="radio" aria-checked="${state.meeting.posterStyle === style.id}">
                  <img src="${style.mascot}" alt="" /><span><b>${escapeHtml(style.name)}</b><small>${escapeHtml(style.mood)}</small></span>
                </button>
              `).join("")}
            </div>
            <div class="poster-print-actions">
              <button class="btn primary" type="button" data-action="print-poster">🖨️ A4로 인쇄하기</button>
              <button class="btn secondary" type="button" data-action="close-poster-print">닫기</button>
            </div>
          </div>
          <div class="poster-print-stage">
            <div class="poster-print-sheet">${buildA4Poster(currentStyle)}</div>
          </div>
        </div>
      </div>
    `;
  }

  function renderNav(step) {
    const validation = validateStage(step);
    const navHintId = `nav-hint-${step}`;
    const disabledAttrs = validation.valid ? "" : `data-blocked aria-disabled="true" aria-describedby="${navHintId}"`;
    const navHint = validation.valid
      ? "✓ 이 순서를 마칠 준비가 됐어요."
      : `다음으로 가려면: ${validation.message}`;
    if (step === 1) {
      return `
        <div class="nav-area">
          <p class="nav-requirement ${validation.valid ? "ready" : "needs-attention"}" id="${navHintId}" data-nav-requirement>${escapeHtml(navHint)}</p>
          <div class="cta-row prepare-bottom-actions" aria-label="회의 준비 작업">
            <button class="btn mint" data-action="sample">✨ 연습용 예시 보기</button>
            <button class="btn ghost" data-action="clear-prepare">🧹 입력 비우기</button>
            ${renderSaveStatus()}
            <button class="btn primary" data-action="complete-next" data-primary-next ${disabledAttrs}>준비 마치고 순서 정하기 →</button>
          </div>
        </div>
      `;
    }

    const nextPage = getNextRoutePage(step);
    const destinationLabels = {
      2: "필요하면 순서와 맡은 일 정하기",
      3: "우리 반 약속 읽기",
      4: "지난번 약속 돌아보기",
      5: "우리 생각 적기",
      6: "생각 모아 손들기",
      7: "함께 토의하기",
      8: "손들어 정하기",
      9: "함께 정한 일 적기",
      10: "오늘 회의 한눈에 보기"
    };
    const isRouteEnd = step > 2 && nextPage == null;
    const isFinalSaved = isRouteEnd
      && Boolean(state.meeting.savedAt)
      && state.meeting.flow.completedPages.includes(PAGES[step]?.id);
    return `
      <div class="nav-area">
        <p class="nav-requirement ${validation.valid ? "ready" : "needs-attention"}" id="${navHintId}" data-nav-requirement>${escapeHtml(isFinalSaved ? "🎉 회의 기록을 저장했어요. 이상으로 오늘 학급회의를 마칩니다!" : navHint)}</p>
        <div class="cta-row">
          ${step > 1 ? `<button class="btn ghost" data-action="prev">← 이전</button>` : ""}
          ${renderSaveStatus()}
          ${isFinalSaved ? `
            <button class="btn primary xl" data-action="home" data-primary-next>🎉 저장 완료 · 처음으로</button>
          ` : isRouteEnd ? `
            <button class="btn primary xl" data-action="complete-save" data-primary-next ${disabledAttrs}>✓ 이 활동 마치고 회의 기록 저장</button>
            <button class="btn dark" data-action="home">${ICON.home} 처음으로</button>
          ` : `<button class="btn primary xl" data-action="complete-next" data-primary-next ${disabledAttrs}>${step === 2 ? "이 순서로 시작하기 →" : `✓ 이 순서 마치고 ${nextPage ? destinationLabels[nextPage] || "다음 순서" : "활동을 한 개 이상 고르기"} →`}</button>`}
        </div>
      </div>
    `;
  }

  function renderSaveStatus() {
    const statuses = {
      saving: ["saving", "↻ 저장 중…"],
      error: ["error", "! 저장 확인 필요"],
      localOnly: ["error", "! 이 브라우저에만 임시 저장"],
      saved: ["saved", "✓ 자동 저장됨"]
    };
    const [className, label] = statuses[state.saveStatus] || statuses.saved;
    return `<span class="save-status-pill ${className}" data-save-status role="status" aria-live="polite">${label}</span>`;
  }

  function chairPrompt(step) {
    return ({
      1: "오늘 무엇을 함께 정할지 한 문장으로 적어 볼게요.",
      2: "오늘 할 활동을 고르고, 맡을 친구를 정할게요.",
      3: "지금부터 우리 반 학급회의를 시작하겠습니다. 친구의 말을 끝까지 들어 주세요.",
      4: "지난번 약속을 잘 지켰는지 손들어 볼게요.",
      5: "내 생각과 그 이유를 차례로 말해요. 부회장이 화면에 짧게 적을게요.",
      6: "나온 생각과 이유를 함께 읽고, 같은 생각에 손든 친구 수를 세어 볼게요.",
      7: "좋은 점과 걱정되는 점을 듣고 더 좋은 방법을 찾아볼게요.",
      8: "좋아요와 다른 생각, 두 가지로 손을 들어요. 숫자를 보고 함께 정할게요.",
      9: "함께 정한 일을 누가 언제까지 할지 분명하게 적을게요.",
      10: "오늘 함께 정한 일을 읽고 회의를 마칠게요."
    })[step] || "학급회의 순서대로 진행해요.";
  }

  function stageGuide(step) {
    return ({
      1: { children: "어떤 일이 있었는지, 어떻게 되면 좋을지 말해요.", recorder: "오늘의 주제와 생각을 낸 친구 이름을 적어요." },
      2: {
        children: "오늘 할 활동을 골라 눌러요.",
        recorder: "맡은 일 이름과 맡을 친구 이름을 적어요. 나중에 바꿔도 돼요.",
        help: [
          { title: "오늘 할 활동 고르기", body: "누른 활동만 오늘 순서에 들어가요. 위에서부터 차례로 해요." },
          { title: "맡을 친구 정하기", body: "맡은 일에는 회장·부회장·서기처럼 할 일을 적고, 맡은 친구에는 이름을 적어요. 지금 정하지 않아도 돼요." }
        ]
      },
      3: { children: "약속을 다 같이 소리 내어 읽어요.", recorder: "바꿀 약속이 있으면 칸을 눌러 고쳐요." },
      4: { children: "잘 지켰는지 손을 들어 보여요.", recorder: "손든 친구가 몇 명인지 세어 적고, 왜 그런지 한 줄 적어요." },
      5: { children: "내 생각과 이유를 한 사람씩 말해요.", recorder: "발표한 생각과 이유를 짧게 적고 '기록하기'를 눌러요." },
      6: { children: "나온 생각과 이유를 읽고 같은 생각에 손을 들어요.", recorder: "생각마다 손든 수를 적고 '다 세었어요'를 눌러요. 그다음 토의할 생각 하나를 골라요." },
      7: { children: "좋은 점, 걱정되는 점, 새 방법을 차례로 말해요.", recorder: "중요한 말만 짧게 화면에 적어요." },
      8: { children: "한 사람씩 손들어 좋아요 또는 다른 생각을 보여요.", recorder: "두 가지 손든 수를 적고, 오늘 온 친구 수와 맞는지 확인해요." },
      9: { children: "무엇을 누가 언제까지 할지 함께 정해요.", recorder: "무엇을·어떻게·누가·언제까지, 네 칸을 채워요." },
      10: { children: "함께 정한 일을 소리 내어 읽어요.", recorder: "아래 저장 버튼을 누르면 오늘 회의가 기록으로 남아요." }
    })[step] || { children: "함께 토의해요.", recorder: "중요한 말을 적어요." };
  }

  // 완료 조건을 손으로 적어 두면 validateStage 와 어긋난다. 하단 안내문과 같은 곳에서 만든다.
  function stageDoneText(step) {
    const validation = validateStage(step);
    if (!validation.valid) return `${validation.message} 그러면 끝나요.`;
    return getNextRoutePage(step) == null ? "다 했어요! 아래 버튼을 눌러 회의 기록을 저장해요." : "다 했어요! 다음으로 가도 좋아요.";
  }

  function getMeetingDurationMinutes() {
    const savedMinutes = Number(state.meeting.timer?.durationMinutes ?? state.meeting.flow.durationMinutes);
    return Math.max(10, Math.min(60, savedMinutes || 30));
  }

  function getMeetingClockAngle(minutes = getMeetingDurationMinutes()) {
    const clamped = Math.max(10, Math.min(60, Number(minutes) || 30));
    return clamped === 60 ? 360 : clamped * 6;
  }

  function renderMeetingClockDial() {
    const minutes = getMeetingDurationMinutes();
    const durationMs = minutes * 60 * 1000;
    const progress = durationMs ? Math.max(0, Math.min(100, (getRemainingMs() / durationMs) * 100)) : 0;
    const alertEnabled = Boolean(state.meeting.timer.fiveMinuteAlerts);
    return `
      <aside class="meeting-clock-control ${state.clockExpanded ? "is-expanded" : ""}" data-clock-control style="--clock-angle:${getMeetingClockAngle(minutes)}deg; --clock-progress:${progress}%" aria-label="전체 회의 시간 조절">
        <button class="meeting-clock-close" type="button" data-action="collapse-clock" aria-label="타이머를 작게 보기">× 작게</button>
        <span class="meeting-clock-label">60분 타이머</span>
        <button class="meeting-clock-dial" type="button" data-clock-dial title="바늘을 돌려서 시간을 맞춰요" aria-label="시계를 돌려 전체 회의 시간을 5분 단위로 조절" aria-valuemin="10" aria-valuemax="60" aria-valuenow="${minutes}" aria-valuetext="${minutes}분">
          <span class="clock-ear clock-ear-left" aria-hidden="true"></span>
          <span class="clock-ear clock-ear-right" aria-hidden="true"></span>
          <span class="clock-ticks" aria-hidden="true">${Array.from({ length: 12 }, (_, index) => `<i style="--tick-index:${index}"></i>`).join("")}</span>
          <span class="clock-number clock-number-60" aria-hidden="true">60</span>
          <span class="clock-number clock-number-15" aria-hidden="true">15</span>
          <span class="clock-number clock-number-30" aria-hidden="true">30</span>
          <span class="clock-number clock-number-45" aria-hidden="true">45</span>
          <span class="clock-cheek clock-cheek-left" aria-hidden="true"></span>
          <span class="clock-cheek clock-cheek-right" aria-hidden="true"></span>
          <span class="clock-smile" aria-hidden="true"></span>
          <span class="clock-hand" aria-hidden="true"></span>
          <span class="clock-center" aria-hidden="true"></span>
        </button>
        <div class="meeting-clock-meta">
          <strong class="meeting-clock-set"><span data-clock-minutes>${minutes}</span>분 설정</strong>
          <small class="meeting-clock-remaining" role="timer" aria-label="남은 회의 시간"><span>남은 시간</span><b data-timer-display>${formatTime(getRemainingMs())}</b></small>
        </div>
        <div class="meeting-clock-presets" aria-label="회의 시간 빠르게 고르기">
          ${[15, 30, 45, 60].map((preset) => `<button type="button" data-action="timer-preset" data-minutes="${preset}" class="${minutes === preset ? "is-active" : ""}" aria-pressed="${minutes === preset}">${preset}분</button>`).join("")}
        </div>
        <button class="meeting-clock-alert ${alertEnabled ? "is-on" : ""}" type="button" data-action="toggle-five-minute-alert" aria-pressed="${alertEnabled}"><span>${alertEnabled ? "🔔" : "🔕"}</span> 5분 알림 <b>${alertEnabled ? "켜짐" : "꺼짐"}</b></button>
        <button class="meeting-clock-reset" type="button" data-action="timer-reset">↺ 처음부터</button>
        <button class="meeting-clock-toggle" type="button" data-action="${state.meeting.timer.running ? "timer-pause" : "timer-start"}">${state.meeting.timer.running ? `${ICON.pause} 멈춤` : `${ICON.play} 시작`}</button>
      </aside>
    `;
  }

  function meetingNoteText(value) {
    return String(value ?? "").trim();
  }

  function meetingNoteItem(label, value) {
    const text = meetingNoteText(value);
    return text ? { label, value: text } : null;
  }

  function getMeetingNoteSections() {
    const meeting = state.meeting;
    const joinParts = (...parts) => parts.map(meetingNoteText).filter(Boolean).join(" · ");
    const roles = (meeting.roles?.entries || [])
      .map((role) => joinParts(role.label, role.name))
      .filter(Boolean)
      .join(" / ");
    const rules = (meeting.meetingRules || []).map(meetingNoteText).filter(Boolean).join(" / ");
    const opinions = (meeting.opinions || []).map((opinion, index) => meetingNoteItem(
      `생각 ${index + 1}`,
      joinParts(opinion.text, opinion.reason, opinion.expectedEffect, opinion.concern)
    )).filter(Boolean);
    const draft = meeting.opinionDraft || {};
    const draftText = joinParts(draft.text, draft.reason, draft.expectedEffect, draft.concern);
    if (draftText) opinions.push(meetingNoteItem("작성 중인 생각", draftText));

    const speakerOrder = (meeting.speakerOrder || [])
      .map((index, orderIndex) => meeting.students?.[Number(index)]?.trim() ? `${orderIndex + 1}. ${meeting.students[Number(index)].trim()}` : "")
      .filter(Boolean)
      .join(" → ");
    const voteTotal = Number(meeting.vote?.agree || 0) + Number(meeting.vote?.disagree || 0);
    const sections = [
      {
        title: "회의 준비",
        icon: "📌",
        items: [
          meetingNoteItem("날짜", meeting.date),
          meetingNoteItem("우리 반 친구", meeting.totalStudents ? `${meeting.totalStudents}명` : ""),
          meetingNoteItem("오늘 온 친구", meeting.totalStudents ? `${getPresentCount(meeting)}명` : ""),
          meetingNoteItem("오늘의 주제", meeting.agenda?.title),
          meetingNoteItem("어떤 문제가 있었나요?", formatPrepareOpinions("problem", meeting)),
          meetingNoteItem("어떻게 바꾸면 좋을까요?", formatPrepareOpinions("outcome", meeting)),
          meetingNoteItem("맡은 친구", roles),
          meetingNoteItem("우리 반 약속", rules)
        ]
      },
      {
        title: "지난 약속 돌아보기",
        icon: "🔎",
        items: [
          meetingNoteItem("지난번 약속", meeting.previous?.promise),
          meetingNoteItem("돌아본 내용", meeting.previous?.reflectionNotes || joinParts(meeting.previous?.evidence, meeting.previous?.cause, meeting.previous?.improvement))
        ]
      },
      {
        title: "모은 생각",
        icon: "💬",
        items: [meetingNoteItem("발표 순서", speakerOrder), ...opinions].filter(Boolean)
      },
      {
        title: "함께 토의",
        icon: "🗣️",
        items: [
          meetingNoteItem("함께 토의할 생각", meeting.topicSelection?.selectedTopic),
          meetingNoteItem("생각한 방법", meeting.discussion?.proposal),
          meetingNoteItem("궁금한 점", meeting.discussion?.questions),
          meetingNoteItem("좋은 점", meeting.discussion?.agreeReasons),
          meetingNoteItem("걱정되는 점", meeting.discussion?.concerns),
          meetingNoteItem("더 좋은 방법", meeting.discussion?.revisionSuggestion)
        ]
      },
      {
        title: "손들어 정하기",
        icon: "✋",
        items: [
          meetingNoteItem("함께 정할 질문", meeting.vote?.question),
          meetingNoteItem("손든 수", voteTotal ? `좋아요 ${meeting.vote.agree || 0}명 · 다른 생각 ${meeting.vote.disagree || 0}명` : "")
        ]
      },
      {
        title: "정한 일",
        icon: "✅",
        items: [
          meetingNoteItem("오늘 함께 정한 일", meeting.decision?.text),
          meetingNoteItem("어떻게 해 볼까요?", meeting.decision?.practiceMethod),
          meetingNoteItem("누가 할까요?", meeting.decision?.owner),
          meetingNoteItem("언제까지 할까요?", meeting.decision?.period),
          meetingNoteItem("추가 기록", meeting.decision?.additionalNotes || joinParts(meeting.decision?.successCriteria, meeting.decision?.nextReview)),
          meetingNoteItem("자유 메모", meeting.freeNote),
          meetingNoteItem("우리 반 마무리 한마디", meeting.teacherComment)
        ]
      }
    ];

    return sections
      .map((section) => ({ ...section, items: section.items.filter(Boolean) }))
      .filter((section) => section.items.length > 0);
  }

  function renderMeetingNote() {
    const sections = getMeetingNoteSections();
    const recordCount = sections.reduce((sum, section) => sum + section.items.length, 0);
    const voteTotal = Number(state.meeting.vote?.agree || 0) + Number(state.meeting.vote?.disagree || 0);
    const summaryItems = [
      meetingNoteItem("오늘의 주제", state.meeting.agenda?.title),
      meetingNoteItem("함께 토의할 생각", state.meeting.topicSelection?.selectedTopic),
      meetingNoteItem("손든 결과", voteTotal ? `좋아요 ${state.meeting.vote.agree || 0}명 · 다른 생각 ${state.meeting.vote.disagree || 0}명` : ""),
      meetingNoteItem("함께 정한 일", state.meeting.decision?.text)
    ].filter(Boolean);
    const summaryHtml = summaryItems.length
      ? `<section class="meeting-note-summary" aria-label="오늘 회의 핵심 요약">${summaryItems.map((item, index) => `<article><span>${index + 1}</span><div><b>${escapeHtml(item.label)}</b><p>${escapeHtml(item.value)}</p></div></article>`).join("")}</section>`
      : "";
    const sectionsHtml = sections.length
      ? sections.map((section) => `
          <article class="meeting-note-section">
            <h3><span aria-hidden="true">${section.icon}</span>${escapeHtml(section.title)}<small>${section.items.length}</small></h3>
            <div class="meeting-note-entries">
              ${section.items.map((item) => `
                <div class="meeting-note-entry">
                  <strong>${escapeHtml(item.label)}</strong>
                  <p>${escapeHtml(item.value)}</p>
                </div>
              `).join("")}
            </div>
          </article>
        `).join("")
      : `<div class="meeting-note-empty">아직 입력된 회의 내용이 없어요.</div>`;

    return `
      <aside class="meeting-note-control" aria-label="회의 기록 노트">
        <button class="meeting-note-button" type="button" data-action="open-meeting-note" aria-haspopup="dialog" aria-label="회의 기록 크게 보기">
          <span class="meeting-note-symbol" aria-hidden="true"><i></i><i></i><i></i></span>
          <strong>회의 기록</strong>
          <small><b data-note-count>${recordCount}</b>개 입력</small>
          <em>눌러 크게</em>
        </button>
      </aside>
      ${state.noteExpanded ? `
        <div class="meeting-note-overlay" data-note-backdrop>
          <section class="meeting-note-dialog" role="dialog" aria-modal="true" aria-labelledby="meeting-note-title">
            <header class="meeting-note-head">
              <div class="meeting-note-title-wrap">
                <span class="meeting-note-symbol large" aria-hidden="true"><i></i><i></i><i></i></span>
                <div>
                  <span class="meeting-note-kicker">입력한 내용이 자동으로 모여요</span>
                  <h2 id="meeting-note-title">우리 반 회의 기록</h2>
                  <p>${escapeHtml(meetingNoteText(state.meeting.date))} · 기록 ${recordCount}개</p>
                </div>
              </div>
              <button class="meeting-note-close" type="button" data-action="close-meeting-note" aria-label="회의 기록 닫기">× 닫기</button>
            </header>
            ${summaryHtml}
            <div class="meeting-note-content">
              <label class="meeting-note-freeform">
                <b>✏️ 자유 메모</b>
                <textarea class="row-input" data-field="freeNote" rows="2" placeholder="더 남기고 싶은 말을 자유롭게 적어요" aria-label="회의 자유 메모">${escapeHtml(state.meeting.freeNote || "")}</textarea>
              </label>
              ${sectionsHtml}
            </div>
          </section>
        </div>
      ` : ""}
    `;
  }

  function openMeetingNote() {
    collapseMeetingClock();
    state.helpExpanded = false;
    state.noteExpanded = true;
    render();
  }

  function closeMeetingNote() {
    state.noteExpanded = false;
    render();
    focusAfterClose("[data-action='open-meeting-note']");
  }

  function renderMeetingAssistant(step) {
    const guide = stageGuide(step);
    const isDone = state.meeting.flow.completedPages.includes(PAGES[step]?.id);
    return `
      <aside class="meeting-help-control" aria-label="이 페이지 도움말">
        <button class="meeting-help-button" type="button" data-action="open-meeting-help" aria-haspopup="dialog" aria-label="이 페이지 이용 방법 크게 보기">
          <span class="meeting-help-symbol" aria-hidden="true">?</span>
          <strong>도움말</strong>
          <small>어떻게 해요?</small>
          <em>눌러 크게</em>
        </button>
      </aside>
      ${state.helpExpanded ? `
        <div class="meeting-note-overlay meeting-help-overlay" data-help-backdrop>
          <section class="meeting-note-dialog meeting-help-dialog" role="dialog" aria-modal="true" aria-labelledby="meeting-help-title">
            <header class="meeting-note-head meeting-help-head">
              <div class="meeting-note-title-wrap">
                <span class="meeting-help-symbol large" aria-hidden="true">?</span>
                <div><span class="meeting-note-kicker">${escapeHtml(PAGES[step]?.title || "우리 반 회의")}</span><h2 id="meeting-help-title">이 화면은 이렇게 해요</h2></div>
              </div>
              <button class="meeting-note-close" type="button" data-action="close-meeting-help" aria-label="도움말 닫기">× 닫기</button>
            </header>
            <div class="meeting-help-content">
              <article><span>1</span><div><b>함께 읽어요</b><p>${escapeHtml(chairPrompt(step))}</p></div></article>
              <article><span>2</span><div><b>친구들이 해요</b><p>${escapeHtml(guide.children)}</p></div></article>
              <article><span>3</span><div><b>기록할 내용</b><p>${escapeHtml(guide.recorder)}</p></div></article>
              <article><span>✓</span><div><b>${isDone ? "이 순서를 마쳤어요" : "다 했는지 확인해요"}</b><p>${escapeHtml(stageDoneText(step))}</p></div></article>
              ${(guide.help || []).map((item) => `<article><span>★</span><div><b>${escapeHtml(item.title)}</b><p>${escapeHtml(item.body)}</p></div></article>`).join("")}
            </div>
          </section>
        </div>
      ` : ""}
    `;
  }

  function openMeetingHelp() {
    collapseMeetingClock();
    state.noteExpanded = false;
    state.helpExpanded = true;
    render();
  }

  function closeMeetingHelp() {
    state.helpExpanded = false;
    render();
    focusAfterClose("[data-action='open-meeting-help']");
  }

  // 회장이 읽을 문장이 도움말 모달 안에만 있어서 화면에서는 아무도 못 봤다. 페이지마다 한 줄 띠로 꺼내 준다.
  function renderFacilitationPanel(step) {
    if (!Number(step)) return "";
    const chairName = String(state.meeting.roles?.entries?.find((entry) => entry.id === "role-host")?.name || "").trim();
    const who = chairName ? `회장 ${chairName}` : "회장이 읽어요";
    return `
      <div class="facilitation-panel" style="grid-template-columns:minmax(0,1fr)">
        <div class="chair-line" style="min-height:0">
          <strong style="min-height:0">🎤 ${escapeHtml(who)}: “${escapeHtml(chairPrompt(step))}”</strong>
        </div>
      </div>
    `;
  }

  function renderSettingsModal() {
    return `
      <div class="modal-backdrop" data-settings-backdrop>
        <section class="guide-modal" role="dialog" aria-modal="true" aria-labelledby="guide-title">
          <button class="modal-close" type="button" data-action="close-settings" aria-label="닫기">×</button>
          <p class="page-kicker">설정</p>
          <h2 id="guide-title">학급회의 설정</h2>
          <div class="settings-main-grid">
          <section class="settings-section" aria-labelledby="sound-settings-title">
            <div class="settings-section-head">
              <span class="settings-section-icon" aria-hidden="true">🔊</span>
              <div><h3 id="sound-settings-title">소리 설정</h3><p>수업 환경에 맞게 소리를 정해요.</p></div>
            </div>
            <div class="sound-setting-list">
              <div class="sound-setting-row is-unavailable">
                <div><strong>배경음악</strong><span>현재 이 버전에는 배경음악이 없어요.</span></div>
                <button class="setting-switch" type="button" aria-pressed="false" disabled>사용 안 함</button>
              </div>
              <div class="sound-setting-row">
                <div><strong>효과음</strong><span>버튼, 확인, 완료 소리를 켜거나 꺼요.</span></div>
                <button class="setting-switch ${state.meeting.sfxEnabled ? "is-on" : ""}" type="button" data-action="toggle-sfx" aria-pressed="${state.meeting.sfxEnabled}">${state.meeting.sfxEnabled ? "켜짐" : "꺼짐"}</button>
              </div>
            </div>
          </section>
          <section class="settings-section" aria-labelledby="record-settings-title">
            <div class="settings-section-head">
              <span class="settings-section-icon" aria-hidden="true">💾</span>
              <div><h3 id="record-settings-title">회의 기록 관리</h3><p>기록 파일을 불러오거나 따로 보관해요.</p></div>
            </div>
            <div class="settings-actions">
              <label class="btn secondary" for="jsonImport">회의 기록 불러오기</label>
              <input id="jsonImport" class="hidden-input" type="file" accept="application/json" data-import-json />
              <button class="btn secondary" type="button" data-action="export-json">기록 파일 내려받기</button>
            </div>
            <div class="local-save-notice"><strong>🔒 이 기기에만 저장됩니다</strong><span>다른 기기나 브라우저에는 자동으로 옮겨지지 않아요. 중요한 기록은 파일로 따로 보관해 주세요.</span></div>
          </section>
          </div>
          <details class="compact-details settings-details">
            <summary>우리 반 사용 도움말 보기</summary>
            <div class="details-content guide-grid">
              <article><b>1. 준비</b><p>오늘의 주제와 어떤 문제가 있는지 적어요. 연습용 예시는 연습할 때만 사용해요.</p></article>
              <article><b>2. 진행</b><p>회장은 진행 문장을 읽고, 부회장은 필요한 수와 중요한 내용을 화면에 적어요.</p></article>
              <article><b>3. 기록</b><p>화면 내용은 자동으로 저장돼요. 서기는 자세한 내용을 공책에 적어요.</p></article>
              <article><b>4. 이동</b><p>화면 위쪽 번호를 눌러 필요한 순서로 직접 이동해요.</p></article>
            </div>
          </details>
          <details class="compact-details guide-standards settings-details">
            <summary>관련 성취기준 보기</summary>
            <div class="details-content standards-content">
              <section class="standards-group">
                <h3>3~4학년</h3>
                <ul class="standards-list">
                  <li><b>[4국01-06]</b><span>주제에 적절한 의견과 이유를 제시하고 서로의 생각을 교환하며 토의한다.</span></li>
                  <li><b>[4사08-01]</b><span>학교 자치 사례를 통하여 민주주의의 의미를 이해하고, 학교생활에서 민주주의를 실천하는 능력을 기른다.</span></li>
                  <li><b>[4사09-01]</b><span>생활 주변의 문제를 파악하고 합리적으로 해결하는 능력을 기른다.</span></li>
                </ul>
              </section>
              <section class="standards-group">
                <h3>5~6학년</h3>
                <ul class="standards-list">
                  <li><b>[6국01-02]</b><span>의견을 제시하고 함께 조정하며 토의한다.</span></li>
                  <li><b>[6국01-03]</b><span>절차와 규칙을 지키고 근거를 제시하며 토론한다.</span></li>
                  <li><b>[6사05-03]</b><span>민주주의의 의미와 중요성을 파악하고 생활 속에서 실천하는 태도를 기른다.</span></li>
                  <li><b>[6사05-04]</b><span>민주적 의사 결정 원리를 이해하고 실제 생활 속에서 실천한다.</span></li>
                </ul>
              </section>
              <p class="standards-note">자료를 읽을 때는 글이나 자료의 출처가 믿을 만한지도 함께 판단해요.</p>
            </div>
          </details>
          <details class="compact-details settings-details">
            <summary>만든 사람과 저작권 · 정보</summary>
            <div class="details-content settings-about">
              <section class="about-block" aria-labelledby="about-credit-title">
                <h3 id="about-credit-title">만든 사람과 저작권</h3>
                <ul class="about-lines">
                  <li>기획·제작: 옐샘 · 아이스크림미디어</li>
                  <li>제공: issamGPT AI Mart</li>
                  <li>© 2026 옐샘 · 아이스크림미디어. 이용 조건은 issamGPT 이용약관을 따릅니다.</li>
                  <li>앱 화면을 캡처한 이미지와 앱 안의 배경·캐릭터·아이콘 일러스트, 음원은 저작권 보호를 받습니다. 내려받아 다시 배포하거나, 다른 자료·서비스에 옮겨 쓰거나, 상업적으로 이용할 수 없습니다.</li>
                  <li>배경·캐릭터·아이콘 일러스트는 생성형 AI로 만든 자료입니다. 효과음은 Pixabay Content License 자료이며, 글꼴은 각 라이선스(SIL OFL 1.1)를 따릅니다. 출처 기록은 <b>assets/CREDITS.md</b>에 있습니다.</li>
                </ul>
              </section>

              <section class="about-block" aria-labelledby="about-info-title">
                <h3 id="about-info-title">정보</h3>
                <ul class="about-lines">
                  <li>프로그램: 학급회의 시간 — 우리반 학급회의</li>
                  <li>버전: ${escapeHtml(APP_VERSION)}</li>
                  <li>대상: 초등학교 3~6학년 학급회의</li>
                  <li>구성: 10단계 회의 흐름 + A4 게시물 인쇄 · 저장: 이 기기의 브라우저(localStorage), 서버 전송 없음</li>
                </ul>
              </section>
            </div>
          </details>
          <button class="btn primary settings-confirm" type="button" data-action="close-settings">설정 닫기</button>
        </section>
      </div>
    `;
  }

  function renderVisual(content, alt, className) {
    if (String(content || "").startsWith("./assets/")) {
      return img(content, alt || "", `${className} visual-img`);
    }
    return `<span class="${className}" aria-hidden="true">${content || ""}</span>`;
  }

  function chip(content, color, alt = "") {
    return `<span class="chip" style="--chip:${color}">${renderVisual(content, alt, "chip-visual")}</span>`;
  }

  function infoField(label, path, emoji, color, opts = {}) {
    const value = getPath(state.meeting, path) ?? "";
    const attrText = Object.entries(opts.attrs || {}).map(([key, val]) => `${key}="${escapeAttr(val)}"`).join(" ");
    const rowClass = opts.className ? ` ${escapeAttr(opts.className)}` : "";
    const rows = Math.max(2, Math.min(6, Number(opts.rows) || 2));
    const control = opts.type === "textarea"
      ? `<textarea class="row-input" data-field="${path}" rows="${rows}" wrap="soft" aria-label="${escapeAttr(label)}">${escapeHtml(value)}</textarea>`
      : `<input class="row-input" type="${opts.type || "text"}" data-field="${path}" value="${escapeAttr(value)}" aria-label="${escapeAttr(label)}" ${attrText} />`;
    return `
      <div class="info-row${rowClass}">
        ${chip(emoji, color)}
        <div class="info-body">
          <span class="info-label" style="color:${color}">${label}</span>
          ${control}
        </div>
      </div>
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

  function sideCount(visual, label, path, color) {
    const value = Number(getPath(state.meeting, path) || 0);
    return `
      <div class="side-count" style="--sc:${color}">
        ${renderVisual(visual, label, "sc-emoji")}
        <span class="sc-label">${label}</span>
        <button class="sc-btn" type="button" data-action="counter-minus" data-path="${path}" aria-label="${escapeAttr(label)} 줄이기">−</button>
        <span class="sc-value">${value}명</span>
        <button class="sc-btn plus" type="button" data-action="counter-plus" data-path="${path}" aria-label="${escapeAttr(label)} 늘리기">＋</button>
      </div>
    `;
  }

  function faceCard(label, path, visual, color) {
    const value = Number(getPath(state.meeting, path) || 0);
    return `
      <section class="card face-card" style="--fc:${color}">
        <div class="face-card-head">
          ${renderVisual(visual, label, "face")}
          <span class="face-label">${label}</span>
        </div>
        <span class="face-vote-caption">✋ 이 생각에 손든 친구</span>
        <div class="face-vote-stepper">
          <button class="face-vote-btn" type="button" data-action="counter-minus" data-path="${path}" aria-label="${escapeAttr(label)} 손든 친구 수 줄이기">−</button>
          <input class="face-vote-input" type="number" min="0" data-field="${path}" value="${value}" aria-label="${escapeAttr(label)} 손든 친구 수" />
          <span>명</span>
          <button class="face-vote-btn plus" type="button" data-action="counter-plus" data-path="${path}" aria-label="${escapeAttr(label)} 손든 친구 수 늘리기">＋</button>
        </div>
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

  function handVoteControl(path, opinionId = "") {
    const value = Number(getPath(state.meeting, path) || 0);
    const isTallied = opinionId && state.meeting.topicSelection.talliedOpinionIds.includes(opinionId);
    return `
      <div class="hand-vote-control" aria-label="손든 친구 수">
        <span class="hand-vote-label">✋ 손든 친구</span>
        <button type="button" data-action="counter-minus" data-path="${path}" aria-label="손든 친구 수 줄이기">−</button>
        <strong>${value}명</strong>
        <button type="button" data-action="counter-plus" data-path="${path}" aria-label="손든 친구 수 늘리기">＋</button>
        ${opinionId ? `<button type="button" class="tally-toggle ${isTallied ? "done" : ""}" data-action="toggle-tally" data-id="${escapeAttr(opinionId)}">${isTallied ? "✓ 세었어요" : "다 세었어요"}</button>` : ""}
      </div>
    `;
  }

  function img(src, alt, className) {
    const eagerClasses = ["mascot", "landing-title-art", "feature-icon", "asset-icon"];
    const loading = eagerClasses.some((name) => className.includes(name)) ? "eager" : "lazy";
    return `<img class="${className}" src="${src}" alt="${escapeAttr(alt)}" loading="${loading}" onerror="this.classList.add('missing'); this.removeAttribute('src')" />`;
  }

  function goTo(pageNumber, fromCompletion = false) {
    const current = state.meeting.currentPage;
    if (!fromCompletion && pageNumber > 0 && pageNumber !== current) {
      const navigation = getNavigationState(pageNumber);
      if (!navigation.unlocked) {
        const firstPage = navigation.firstIncomplete;
        const firstTitle = PAGES[firstPage]?.title || "앞 순서";
        toast(`🔒 먼저 ‘${firstTitle}’ 순서를 마쳐 주세요.`, "warn");
        return;
      }
    }
    if (pageNumber > 0 && pageNumber !== current) {
      resetStageTimer(pageNumber);
    }
    state.meeting.currentPage = pageNumber;
    queueSave();
    render();
    requestAnimationFrame(() => {
      root.scrollTo({ top: 0, left: 0, behavior: "auto" });
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });
  }

  function getSelectedFlowPages(meeting = state.meeting) {
    const selected = Array.isArray(meeting?.flow?.selectedPages)
      ? meeting.flow.selectedPages
      : DEFAULT_MEETING.flow.selectedPages;
    return [...new Set(selected.map(Number).filter((page) => FLOW_SELECTABLE_PAGES.includes(page)))].sort((a, b) => a - b);
  }

  function getFlowRoutePages(meeting = state.meeting) {
    return [1, 2, ...getSelectedFlowPages(meeting)].filter((step, index, all) => all.indexOf(step) === index);
  }

  function getNavigationState(targetPage, meeting = state.meeting) {
    const target = Number(targetPage);
    if (target <= 0) return { unlocked: true, firstIncomplete: null };
    const routePages = getFlowRoutePages(meeting);
    if (!routePages.includes(target)) return { unlocked: false, firstIncomplete: null };
    const firstIncomplete = routePages
      .filter((step) => step < target)
      .find((step) => !meeting.flow.completedPages.includes(PAGES[step]?.id));
    return { unlocked: firstIncomplete == null, firstIncomplete: firstIncomplete ?? null };
  }

  function getNextRoutePage(currentPage) {
    const current = Number(currentPage);
    if (current < 2) return current + 1;
    const selectedPages = getSelectedFlowPages();
    const routePages = selectedPages.length ? selectedPages : FLOW_SELECTABLE_PAGES;
    return routePages.find((page) => page > current) || null;
  }

  function getPreviousRoutePage(currentPage) {
    const current = Number(currentPage);
    if (current <= 1) return 1;
    if (current === 2) return 1;
    const selectedPages = getSelectedFlowPages();
    const routePages = selectedPages.length ? selectedPages : FLOW_SELECTABLE_PAGES;
    return routePages.filter((page) => page < current).at(-1) || 2;
  }

  function toggleFlowPage(pageNumber) {
    if (!FLOW_SELECTABLE_PAGES.includes(pageNumber)) return;
    const selected = getSelectedFlowPages();
    state.meeting.flow.selectedPages = selected.includes(pageNumber)
      ? selected.filter((page) => page !== pageNumber)
      : [...selected, pageNumber].sort((a, b) => a - b);
    queueSave();
    render();
  }

  // 등록 인원이 아니라 '오늘 온 친구' 수를 기준으로 세야 결석생이 있어도 회의가 멈추지 않는다.
  function getPresentCount(meeting = state.meeting) {
    return Math.max(0, Number(meeting.totalStudents || 0) - Number(meeting.absentCount || 0));
  }

  // 4·8쪽이 같은 absentCount 를 보므로 한 번만 정하면 다시 묻지 않는다.
  function renderAbsentControl() {
    const absent = Number(state.meeting.absentCount || 0);
    const present = getPresentCount();
    return `
      <details class="compact-details" ${absent ? "open" : ""}>
        <summary>오늘 안 온 친구가 있어요 <span>${absent ? `${absent}명 빠졌어요` : "눌러서 고치기"}</span></summary>
        <div class="details-content">
          ${sideCount(ASSETS.icons.people, "오늘 안 온 친구", "absentCount", "#8296a6")}
          <p class="shared-vote-note">오늘 온 친구는 ${present}명이에요. 손든 수를 ${present}명에 맞추면 다음으로 갈 수 있어요.</p>
        </div>
      </details>
    `;
  }

  function validateStage(step) {
    const meeting = state.meeting;
    const missing = (message, field = "") => ({ valid: false, message, field, step });
    const filled = (value) => String(value ?? "").trim().length > 0;

    if (step === 1) {
      if (Number(meeting.totalStudents || 0) < 1) return missing("우리 반 친구 수를 1명 이상 적어 주세요.", "totalStudents");
      if (!filled(meeting.agenda.title)) return missing("오늘의 주제를 적어 주세요.", "agenda.title");
    }

    if (step === 2 && getSelectedFlowPages(meeting).length < 1) {
      return missing("오늘 사용할 활동을 한 가지 이상 골라 주세요.");
    }

    if (step === 3) {
      if (!filled(meeting.agenda.title)) return missing("오늘의 주제를 적어 주세요.", "agenda.title");
      const firstRuleIndex = meeting.meetingRules.findIndex(filled);
      if (firstRuleIndex < 0) return missing("우리 반이 지킬 약속을 한 가지 이상 적어 주세요.", "meetingRules.0");
    }

    if (step === 4) {
      const hasSavedPromise = getSavedPromiseOptions().length > 0;
      if (hasSavedPromise && !filled(meeting.previous.promise)) return missing("지난번 약속을 하나 골라 주세요.", "previous.promise");
      if (hasSavedPromise && filled(meeting.previous.promise)) {
        const handRaise = meeting.previous.handRaise;
        const counted = Number(handRaise.good || 0) + Number(handRaise.normal || 0) + Number(handRaise.hard || 0);
        const expected = getPresentCount(meeting);
        if (counted !== expected) return missing(`손든 친구를 모두 세어 주세요. 지금 ${counted}/${expected}명이에요. 안 온 친구가 있으면 ‘오늘 안 온 친구가 있어요’를 눌러 고쳐요.`, "previous.handRaise.good");
      }
    }

    if (step === 5) {
      // 이름·발표 순서는 진행을 돕는 준비 도구라 통과 조건에서 뺐다. 이 순서의 목표는 '생각 기록'뿐이다.
      if (!meeting.opinions.some((opinion) => filled(opinion.text))) {
        return missing("생각과 이유를 적고 ‘기록하기’를 눌러 주세요.", "opinionDraft.text");
      }
    }

    if (step === 6) {
      const opinions = meeting.opinions.filter((opinion) => filled(opinion.text));
      if (!opinions.length) return missing("앞 순서에서 생각과 이유를 먼저 기록해 주세요.");
      const talliedIds = meeting.topicSelection.talliedOpinionIds || [];
      const untallied = opinions.find((opinion) => !talliedIds.includes(opinion.id));
      if (untallied) return missing(`‘${untallied.text}’에 손든 수를 세고 ‘다 세었어요’를 눌러 주세요.`);
      if (!filled(meeting.topicSelection.selectedTopic)) {
        return missing("함께 토의할 생각을 하나 골라 주세요.", "topicSelection.selectedTopic");
      }
    }

    if (step === 7 && ![
      meeting.discussion.agreeReasons,
      meeting.discussion.concerns,
      meeting.discussion.revisionSuggestion
    ].some(filled)) {
      return missing("좋은 점, 걱정되는 점, 더 좋은 방법 중 하나 이상 적어 주세요.", "discussion.agreeReasons");
    }

    if (step === 8) {
      const vote = meeting.vote;
      const counted = Number(vote.agree || 0) + Number(vote.disagree || 0);
      const expected = getPresentCount(meeting);
      if (counted !== expected) return missing(`손든 친구 ${counted}명과 오늘 온 친구 ${expected}명을 맞춰 주세요. 안 온 친구가 있으면 ‘오늘 안 온 친구가 있어요’를 눌러 고쳐요.`, "vote.agree");
      if (!vote.confirmed) return missing("손든 수를 다 센 뒤 ‘다 세었어요’를 눌러 확인해 주세요.", "vote.agree");
    }

    if (step === 9) {
      const requiredFields = [
        ["decision.text", meeting.decision.text, "오늘 함께 정한 일을 적어 주세요."],
        ["decision.practiceMethod", meeting.decision.practiceMethod, "어떻게 실천할지 적어 주세요."],
        ["decision.owner", meeting.decision.owner, "누가 맡을지 적어 주세요."],
        ["decision.period", meeting.decision.period, "언제까지 할지 적어 주세요."]
      ];
      const missingField = requiredFields.find(([, value]) => !filled(value));
      if (missingField) return missing(missingField[2], missingField[0]);
    }

    return { valid: true, message: "", field: "", step };
  }

  function revealValidationField(fieldPath) {
    if (!fieldPath) return;
    const field = Array.from(document.querySelectorAll("[data-field]")).find((node) => node.dataset.field === fieldPath);
    if (!field) return;
    let parent = field.parentElement;
    while (parent) {
      if (parent.tagName === "DETAILS") parent.open = true;
      parent = parent.parentElement;
    }
    requestAnimationFrame(() => {
      field.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
      field.focus({ preventScroll: true });
    });
  }

  function showValidationError(validation, moveToStage = false) {
    toast(`⚠️ ${validation.message}`, "warn");
    if (moveToStage && state.meeting.currentPage !== validation.step) {
      goTo(validation.step, true);
      requestAnimationFrame(() => revealValidationField(validation.field));
      return;
    }
    revealValidationField(validation.field);
  }

  function completeCurrentStage() {
    const current = state.meeting.currentPage;
    const pageId = PAGES[current]?.id;
    if (!pageId) return;
    const validation = validateStage(current);
    if (!validation.valid) {
      showValidationError(validation);
      return;
    }
    const nextPage = getNextRoutePage(current);
    if (!state.meeting.flow.completedPages.includes(pageId)) {
      state.meeting.flow.completedPages.push(pageId);
    }
    if (nextPage != null) {
      goTo(nextPage, true);
      return;
    }
    queueSave();
    toast("🎉 모든 순서를 마쳤어요. 아래에서 회의 기록을 저장해요.");
  }

  async function completeAndFinalize() {
    const current = state.meeting.currentPage;
    const requiredRoute = getFlowRoutePages().filter((step) => step < 10);
    // 10쪽까지 온 아이를 앞 페이지로 되돌리면 고장으로 보인다. 여기 남아서 안 적은 곳만 보여 준다.
    const gaps = requiredRoute.map((step) => validateStage(step)).filter((validation) => !validation.valid);
    if (gaps.length) {
      state.finalizeGaps = gaps;
      render();
      toast("⚠️ 아직 안 적은 곳이 있어요. 위에 있는 버튼을 눌러 채우고 와요.", "warn");
      return;
    }
    state.finalizeGaps = [];
    const pageId = PAGES[current]?.id;
    if (pageId && !state.meeting.flow.completedPages.includes(pageId)) {
      state.meeting.flow.completedPages.push(pageId);
    }
    await finalizeMeeting();
  }

  async function newMeeting() {
    const ok = await askConfirm("새 회의를 시작할까요? 진행하던 회의는 저장한 뒤 시작해요.", { confirmLabel: "새로 시작", cancelLabel: "그대로 두기" });
    if (!ok) return;
    await saveMeetingNow();
    state.recentMeetings = await getAllMeetings();
    state.meeting = createEmptyMeeting();
    state.meeting.currentPage = 1;
    queueSave();
    render();
  }

  async function loadSample() {
    const ok = await askConfirm("연습용 회의를 불러올까요? 진행하던 회의는 '지난 회의 보관함'에 그대로 남아요.", { confirmLabel: "불러오기", cancelLabel: "그대로 두기" });
    if (!ok) return;
    try {
      await saveMeetingNow();
    } catch (error) {
      console.warn("save before sample failed", error);
    }
    state.meeting = applyAudioPreferences(structuredClone(DEFAULT_MEETING));
    state.meeting.id = crypto.randomUUID ? crypto.randomUUID() : String(Date.now());
    state.meeting.currentPage = 1;
    queueSave();
    render();
  }

  async function clearPreparation() {
    const ok = await askConfirm("1페이지에 적은 준비 내용만 비울까요? 다른 페이지의 기록은 그대로 남아요.", { confirmLabel: "비우기", cancelLabel: "그대로 두기" });
    if (!ok) return;
    state.meeting.agenda.title = "";
    state.meeting.agenda.problemContext = "";
    state.meeting.agenda.problemProposer = "";
    state.meeting.agenda.problemAdditionalOpinions = [];
    state.meeting.agenda.expectedOutcome = "";
    state.meeting.agenda.outcomeProposer = "";
    state.meeting.agenda.outcomeAdditionalOpinions = [];
    state.meeting.updatedAt = new Date().toISOString();
    queueSave();
    render();
    toast("🧹 준비 칸만 비웠어요. 다른 기록은 그대로예요.");
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
    state.recordsModalOpen = false;
    queueSave();
    render();
  }

  function updateCounter(path, delta) {
    const requested = Number(getPath(state.meeting, path) || 0) + delta;
    // 결석 인원은 등록 인원까지, 손든 수는 '오늘 온 친구'까지만 올라간다.
    const limit = path === "absentCount"
      ? Math.max(0, Number(state.meeting.totalStudents) || 0)
      : isHeadCountPath(path) ? getPresentCount() : Number.MAX_SAFE_INTEGER;
    const next = Math.min(limit, Math.max(0, requested));
    setPath(state.meeting, path, next);
    if (/^vote\.(agree|disagree|hold)$/.test(path)) state.meeting.vote.confirmed = false;
    if (requested > limit && limit !== Number.MAX_SAFE_INTEGER) toast(`${limit}명보다 많을 수 없어요.`, "warn");
    queueSave();
    render();
  }

  function isHeadCountPath(path) {
    return /^(opinionPresenterHands|opinions\.\d+\.likes|topicSelection\.candidates\.\d+\.hands|previous\.handRaise\.(good|normal|hard)|discussion\.handRaise\.(presenters|questions|agreeSpeakers|concernSpeakers)|vote\.(agree|disagree|hold)|decision\.volunteerHands)$/.test(path || "");
  }

  function addRole() {
    state.meeting.roles.entries.push({
      id: crypto.randomUUID ? crypto.randomUUID() : `role-${Date.now()}`,
      label: "",
      name: ""
    });
    queueSave();
    render();
  }

  function removeRole(index) {
    if (!Number.isInteger(index) || index < 0 || index >= state.meeting.roles.entries.length) return;
    state.meeting.roles.entries.splice(index, 1);
    queueSave();
    render();
  }

  function getAdditionalPrepareOpinions(kind, meeting = state.meeting) {
    const key = kind === "problem" ? "problemAdditionalOpinions" : kind === "outcome" ? "outcomeAdditionalOpinions" : "";
    if (!key) return [];
    if (!Array.isArray(meeting.agenda[key])) meeting.agenda[key] = [];
    return meeting.agenda[key];
  }

  function addPrepareOpinion(kind) {
    const opinions = getAdditionalPrepareOpinions(kind);
    if (!opinions) return;
    opinions.push({
      id: crypto.randomUUID ? crypto.randomUUID() : `${kind}-${Date.now()}`,
      text: "",
      proposer: ""
    });
    state.meeting.updatedAt = new Date().toISOString();
    queueSave();
    render();
    requestAnimationFrame(() => {
      const group = document.querySelector(`[data-prepare-kind="${kind}"]`);
      const list = group?.querySelector(".prepare-opinion-list");
      const latest = group?.querySelector(".prepare-opinion-toggle:last-of-type");
      if (list) list.scrollTop = list.scrollHeight;
      // 이제 기본이 닫힘이라, 방금 더한 생각은 팝업으로 열어 바로 적게 한다.
      if (latest) latest.open = true;
      latest?.querySelector("textarea")?.focus();
      if (list) list.scrollTop = list.scrollHeight;
    });
  }

  function removePrepareOpinion(kind, index) {
    const opinions = getAdditionalPrepareOpinions(kind);
    if (!Number.isInteger(index) || index < 0 || index >= opinions.length) return;
    opinions.splice(index, 1);
    state.meeting.updatedAt = new Date().toISOString();
    queueSave();
    render();
  }

  function formatPrepareOpinions(kind, meeting = state.meeting) {
    const agenda = meeting.agenda || {};
    const first = kind === "problem"
      ? { text: agenda.problemContext, proposer: agenda.problemProposer }
      : { text: agenda.expectedOutcome, proposer: agenda.outcomeProposer };
    const opinions = [first, ...getAdditionalPrepareOpinions(kind, meeting)];
    return opinions
      .map((opinion) => {
        const text = String(opinion?.text || "").trim();
        const proposer = String(opinion?.proposer || "").trim();
        if (!text && !proposer) return "";
        return proposer ? `${proposer}: ${text || "내용 미입력"}` : text;
      })
      .filter(Boolean)
      .join(" / ");
  }

  function formatRolesForReport() {
    const roles = state.meeting.roles.entries
      .filter((role) => role.label?.trim() || role.name?.trim())
      .map((role) => `${role.label?.trim() || "맡은 일"} ${role.name?.trim() || "아직 안 정함"}`);
    return roles.length ? roles.join(", ") : "적은 맡은 일 없음";
  }

  function addMeetingRule() {
    if (state.meeting.meetingRules.length >= 8) {
      toast("우리 반 약속은 8개까지 적을 수 있어요.", "warn");
      return;
    }
    state.meeting.meetingRules.push("");
    queueSave();
    render();
  }

  function removeMeetingRule(index) {
    if (!Number.isInteger(index) || index < 0 || index >= state.meeting.meetingRules.length) return;
    state.meeting.meetingRules.splice(index, 1);
    if (!state.meeting.meetingRules.length) state.meeting.meetingRules.push("");
    queueSave();
    render();
  }

  function loadMeetingRuleSamples() {
    state.meeting.meetingRules = [...DEFAULT_MEETING.meetingRules];
    queueSave();
    render();
    toast("✨ 약속 예시를 불러왔어요. 우리 반에 맞게 고쳐 보세요.");
  }

  function toggleSpeakerOrder(index) {
    if (!Number.isInteger(index) || index < 0 || index >= 30) return;
    const name = String(state.meeting.students?.[index] || "").trim();
    if (!name) {
      toast("친구 이름을 먼저 입력해 주세요.", "warn");
      return;
    }
    const order = getSpeakerOrder();
    const existing = order.indexOf(index);
    state.meeting.speakerOrder = existing >= 0 ? order.filter((studentIndex) => studentIndex !== index) : [...order, index];
    queueSave();
    render();
  }

  function clearSpeakerOrder() {
    state.meeting.speakerOrder = [];
    queueSave();
    render();
  }

  function setAllSpeakers() {
    state.meeting.speakerOrder = state.meeting.students
      .map((name, index) => String(name || "").trim() ? index : null)
      .filter((index) => index != null);
    queueSave();
    render();
    toast(`✓ 발표할 친구 ${state.meeting.speakerOrder.length}명을 순서에 넣었어요.`);
  }

  function shuffleSpeakers() {
    const order = state.meeting.students
      .map((name, index) => String(name || "").trim() ? index : null)
      .filter((index) => index != null);
    for (let index = order.length - 1; index > 0; index -= 1) {
      const target = Math.floor(Math.random() * (index + 1));
      [order[index], order[target]] = [order[target], order[index]];
    }
    state.meeting.speakerOrder = order;
    queueSave();
    render();
    toast("🔀 발표 순서를 골고루 섞었어요.");
  }

  function addOpinion() {
    const draft = state.meeting.opinionDraft;
    if (!draft.text?.trim() || !draft.reason?.trim()) {
      playSound("fail");
      toast("✏️ 내 생각과 이유를 먼저 적어 주세요.", "warn");
      return;
    }
    state.meeting.opinions.push({
      id: crypto.randomUUID ? crypto.randomUUID() : `op-${Date.now()}`,
      text: draft.text.trim(),
      reason: draft.reason.trim(),
      expectedEffect: draft.expectedEffect.trim(),
      concern: draft.concern.trim(),
      category: draft.category.trim() || "우리 반 생활",
      likes: 0
    });
    state.meeting.opinionDraft = { text: "", reason: "", expectedEffect: "", concern: "", category: "우리 반 생활" };
    queueSave();
    render();
  }

  function deleteOpinion(id) {
    const removed = state.meeting.opinions.find((opinion) => opinion.id === id);
    state.meeting.opinions = state.meeting.opinions.filter((opinion) => opinion.id !== id);
    state.meeting.topicSelection.talliedOpinionIds = state.meeting.topicSelection.talliedOpinionIds.filter((talliedId) => talliedId !== id);
    if (removed && state.meeting.topicSelection.selectedTopic === removed.text) {
      state.meeting.topicSelection.selectedTopic = "";
      state.meeting.vote.question = "";
    }
    queueSave();
    render();
    toast("🧽 생각 하나를 지웠어요.");
  }

  function toggleOpinionTally(id) {
    if (!id) return;
    const tallied = state.meeting.topicSelection.talliedOpinionIds;
    const index = tallied.indexOf(id);
    if (index >= 0) tallied.splice(index, 1);
    else tallied.push(id);
    queueSave();
    render();
  }

  function selectTopic(label) {
    state.meeting.topicSelection.selectedTopic = String(label || "").trim();
    state.meeting.vote.question = state.meeting.topicSelection.selectedTopic;
    queueSave();
    render();
  }

  function confirmVoteTally() {
    const vote = state.meeting.vote;
    const total = Number(vote.agree || 0) + Number(vote.disagree || 0);
    const expected = getPresentCount();
    if (!expected || total !== expected) {
      toast(`손든 친구 ${total}명과 오늘 온 친구 ${expected}명이 맞는지 먼저 확인해요.`, "warn");
      return;
    }
    vote.confirmed = true;
    vote.confirmedAt = new Date().toISOString();
    queueSave();
    render();
    toast("✓ 모두의 손든 수를 확인했어요.");
  }

  function refreshClosingComment() {
    const current = Number(state.meeting.feedbackIndex || 0);
    state.meeting.feedbackIndex = (current + 1) % 100;
    state.meeting.teacherComment = buildClosingFeedback(state.meeting, state.meeting.feedbackIndex);
    queueSave();
    render();
    toast(`마무리 샘플 ${state.meeting.feedbackIndex + 1}/100을 불러왔어요.`);
  }

  function expandMeetingClock(autoCollapse = false) {
    state.clockExpanded = true;
    if (state.clockCollapseTimer) {
      clearTimeout(state.clockCollapseTimer);
      state.clockCollapseTimer = null;
    }
    document.querySelectorAll("[data-clock-control]").forEach((control) => {
      control.classList.add("is-expanded");
    });
    // 펼친 시계는 화면을 덮는다. 홈·설정 칩이 그 위 모서리에 걸쳐 반쯤 잘려 보였다.
    // :has() 는 오래된 교실 태블릿에서 안 먹으니 body 표시로 처리한다.
    document.body.classList.add("clock-expanded");
    if (autoCollapse) scheduleMeetingClockCollapse(4200);
  }

  function scheduleMeetingClockCollapse(delay = 2200) {
    if (state.clockCollapseTimer) clearTimeout(state.clockCollapseTimer);
    state.clockCollapseTimer = setTimeout(() => {
      collapseMeetingClock();
    }, delay);
  }

  function collapseMeetingClock() {
    if (state.clockCollapseTimer) clearTimeout(state.clockCollapseTimer);
    state.clockCollapseTimer = null;
    state.clockExpanded = false;
    state.clockPointerId = null;
    document.querySelectorAll("[data-clock-control]").forEach((control) => {
      control.classList.remove("is-expanded");
    });
    document.body.classList.remove("clock-expanded");
  }

  function updateMeetingDurationFromDial(event, dial) {
    const rect = dial.getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    let angle = (Math.atan2(dy, dx) * 180 / Math.PI + 90 + 360) % 360;
    let minutes = Math.round(angle / 30) * 5;
    if (minutes === 0) minutes = 60;
    minutes = Math.max(10, Math.min(60, minutes));
    if (minutes === Number(state.meeting.flow.durationMinutes)) return;
    setMeetingDuration(minutes);
    queueSave();
    updateDependentText();
  }

  function updateMeetingClockVisual() {
    const minutes = getMeetingDurationMinutes();
    const durationMs = minutes * 60 * 1000;
    const remaining = getRemainingMs();
    const remainingText = formatTime(remaining);
    const progress = durationMs ? Math.max(0, Math.min(100, (remaining / durationMs) * 100)) : 0;
    document.querySelectorAll("[data-clock-control]").forEach((control) => {
      control.style.setProperty("--clock-angle", `${getMeetingClockAngle(minutes)}deg`);
      control.style.setProperty("--clock-progress", `${progress}%`);
      control.setAttribute("aria-label", `전체 회의 시간 조절, ${remainingText} 남음`);
    });
    document.querySelectorAll("[data-clock-minutes]").forEach((node) => {
      node.textContent = String(minutes);
    });
    document.querySelectorAll("[data-clock-dial]").forEach((dial) => {
      dial.setAttribute("aria-valuenow", String(minutes));
      dial.setAttribute("aria-valuetext", `${minutes}분`);
    });
  }

  function getStageMinutes(step = state.meeting.currentPage) {
    const saved = Number(state.meeting.flow.stageMinutes?.[Number(step) - 1]);
    return Number.isFinite(saved) && saved > 0 ? saved : 3;
  }

  function setMeetingDuration(value) {
    const target = Math.max(10, Math.min(60, Math.round(Number(value) || 30)));
    const current = FLOW_TIME_PAGES.map((step) => getStageMinutes(step));
    const currentTotal = current.reduce((sum, minutes) => sum + minutes, 0) || 30;
    const scaled = current.map((minutes) => Math.max(1, Math.min(15, Math.floor((minutes / currentTotal) * target))));
    let difference = target - scaled.reduce((sum, minutes) => sum + minutes, 0);
    const priority = current
      .map((minutes, index) => ({ index, remainder: ((minutes / currentTotal) * target) % 1 }))
      .sort((a, b) => b.remainder - a.remainder);
    let cursor = 0;
    while (difference !== 0 && cursor < 1000) {
      const index = priority[cursor % priority.length].index;
      if (difference > 0 && scaled[index] < 15) {
        scaled[index] += 1;
        difference -= 1;
      } else if (difference < 0 && scaled[index] > 1) {
        scaled[index] -= 1;
        difference += 1;
      }
      cursor += 1;
    }
    const nextStageMinutes = [...state.meeting.flow.stageMinutes];
    FLOW_TIME_PAGES.forEach((step, index) => {
      nextStageMinutes[step - 1] = scaled[index];
    });
    state.meeting.flow.stageMinutes = nextStageMinutes;
    state.meeting.flow.durationMinutes = target;
    state.meeting.timer.durationMinutes = target;
    state.meeting.updatedAt = new Date().toISOString();
  }

  function accumulateRunningTimer(now = Date.now()) {
    const timer = state.meeting.timer;
    if (!timer.running) return;
    timer.accumulatedMs += Math.max(0, now - Number(timer.startedAt || now));
    timer.stageAccumulatedMs += Math.max(0, now - Number(timer.stageStartedAt || now));
    timer.startedAt = now;
    timer.stageStartedAt = now;
  }

  function resetStageTimer(pageNumber) {
    const timer = state.meeting.timer;
    const now = Date.now();
    accumulateRunningTimer(now);
    timer.stageNumber = pageNumber;
    timer.stageAccumulatedMs = 0;
    timer.stageStartedAt = timer.running ? now : null;
  }

  function timerStart() {
    const timer = state.meeting.timer;
    if (timer.running) {
      toast("시간을 이미 재고 있어요.");
      return;
    }
    const now = Date.now();
    if (Number(timer.stageNumber) !== Number(state.meeting.currentPage)) {
      timer.stageNumber = state.meeting.currentPage;
      timer.stageAccumulatedMs = 0;
    }
    timer.running = true;
    timer.startedAt = now;
    timer.stageStartedAt = now;
    timer.pausedAt = null;
    timer.lastFiveMinuteAlertBlock = Math.floor(getElapsedMs(now) / (5 * 60 * 1000));
    queueSave();
    render();
  }

  function timerPause() {
    const timer = state.meeting.timer;
    const now = Date.now();
    if (timer.running) {
      accumulateRunningTimer(now);
      timer.running = false;
      timer.pausedAt = now;
    } else {
      if (Number(timer.stageNumber) !== Number(state.meeting.currentPage)) resetStageTimer(state.meeting.currentPage);
      timer.running = true;
      timer.startedAt = now;
      timer.stageStartedAt = now;
      timer.pausedAt = null;
    }
    queueSave();
    render();
  }

  function timerReset() {
    const timer = state.meeting.timer;
    timer.running = false;
    timer.startedAt = null;
    timer.pausedAt = Date.now();
    timer.accumulatedMs = 0;
    timer.stageNumber = state.meeting.currentPage;
    timer.stageStartedAt = null;
    timer.stageAccumulatedMs = 0;
    timer.lastFiveMinuteAlertBlock = 0;
    queueSave();
    render();
    toast("↺ 타이머를 처음으로 돌렸어요.");
  }

  function timerSetPreset(minutes) {
    if (![15, 30, 45, 60].includes(Number(minutes))) return;
    setMeetingDuration(minutes);
    const timer = state.meeting.timer;
    timer.running = false;
    timer.startedAt = null;
    timer.pausedAt = Date.now();
    timer.accumulatedMs = 0;
    timer.stageNumber = state.meeting.currentPage;
    timer.stageStartedAt = null;
    timer.stageAccumulatedMs = 0;
    timer.lastFiveMinuteAlertBlock = 0;
    state.clockExpanded = true;
    queueSave();
    render();
    toast(`⏱ 회의 시간을 ${minutes}분으로 맞췄어요.`);
  }

  function startTimerLoop() {
    setInterval(() => {
      const remaining = getRemainingMs();
      if (state.meeting.timer.running && remaining <= 0) {
        finishMeetingTimer();
        return;
      }
      maybePlayFiveMinuteAlert();
      document.querySelectorAll("[data-timer-display]").forEach((node) => {
        node.textContent = formatTime(remaining);
      });
      updateMeetingClockVisual();
    }, 1000);
  }

  function finishMeetingTimer() {
    const timer = state.meeting.timer;
    accumulateRunningTimer();
    timer.running = false;
    timer.startedAt = null;
    timer.stageStartedAt = null;
    timer.pausedAt = Date.now();
    playSound("success");
    queueSave();
    render();
    toast("⏰ 회의 시간이 다 됐어요! 이제 마무리를 시작해요.", "warn");
  }

  function getElapsedMs(now = Date.now()) {
    const timer = state.meeting.timer;
    return Math.max(0, Number(timer.accumulatedMs || 0) + (timer.running ? now - Number(timer.startedAt || now) : 0));
  }

  function maybePlayFiveMinuteAlert() {
    const timer = state.meeting.timer;
    if (!timer.running || !timer.fiveMinuteAlerts) return;
    const block = Math.floor(getElapsedMs() / (5 * 60 * 1000));
    const lastBlock = Math.max(0, Number(timer.lastFiveMinuteAlertBlock || 0));
    if (block < 1 || block <= lastBlock) return;
    timer.lastFiveMinuteAlertBlock = block;
    playSound("success");
    queueSave();
    toast(`🔔 ${block * 5}분이 지났어요. 다음 순서를 확인해요!`);
  }

  function getRemainingMs() {
    const timer = state.meeting.timer;
    const elapsed = getElapsedMs();
    return Math.max(0, Number(timer.durationMinutes || 0) * 60 * 1000 - elapsed);
  }

  function formatTime(ms) {
    const totalSeconds = Math.ceil(ms / 1000);
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  }

  async function finalizeMeeting() {
    const selectedPages = getSelectedFlowPages();
    state.meeting.archived = false;
    state.meeting.updatedAt = new Date().toISOString();
    state.meeting.savedAt = state.meeting.updatedAt;
    if (selectedPages.includes(10) && !state.meeting.flow.completedPages.includes(PAGES[10].id)) {
      state.meeting.flow.completedPages.push(PAGES[10].id);
    }
    await saveMeetingNow();
    state.recentMeetings = await getAllMeetings();
    render();
    launchStamp();
    launchConfetti();
    // 저장이 안 된 브라우저에서 "안전하게 저장됐어요"라고 하면 아이가 그냥 종료해 버린다.
    toast(state.dbFailed ? LOCAL_ONLY_SAVE_MESSAGE : "🎉 오늘 회의가 이 기기에 안전하게 저장됐어요!", state.dbFailed ? "warn" : "info");
  }

  function askConfirm(message, { confirmLabel = "네, 할게요", cancelLabel = "아니요" } = {}) {
    return new Promise((resolve) => {
      document.querySelectorAll(".confirm-overlay").forEach((node) => node.remove());
      const overlay = document.createElement("div");
      overlay.className = "confirm-overlay";
      overlay.innerHTML = `
        <div class="confirm-card" role="alertdialog" aria-modal="true" aria-label="확인이 필요해요">
          <p>${escapeHtml(message)}</p>
          <div class="confirm-actions">
            <button type="button" class="btn ghost" data-confirm-cancel>${escapeHtml(cancelLabel)}</button>
            <button type="button" class="btn primary" data-confirm-ok>${escapeHtml(confirmLabel)}</button>
          </div>
        </div>
      `;
      const finish = (result) => {
        overlay.remove();
        resolve(result);
      };
      overlay.addEventListener("click", (event) => {
        if (event.target.closest("[data-confirm-ok]")) return finish(true);
        if (event.target.closest("[data-confirm-cancel]")) return finish(false);
        if (event.target === overlay) finish(false);
      });
      overlay.addEventListener("keydown", (event) => {
        if (event.key === "Escape") finish(false);
      });
      document.body.appendChild(overlay);
      requestAnimationFrame(() => overlay.querySelector("[data-confirm-ok]")?.focus());
    });
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

  // 카운터처럼 연타가 정상인 동작은 제외하고, 저장·이동 같은 동작만 350ms 안의 중복 탭을 막는다.
  const RAPID_TAP_EXEMPT = new Set(["counter-plus", "counter-minus", "toggle-speaker-order", "toggle-flow-page", "toggle-tally"]);
  const lastTapAt = new Map();

  function isRepeatTap(button) {
    const action = button.dataset.action;
    if (RAPID_TAP_EXEMPT.has(action)) return false;
    // 15분·30분 버튼처럼 data-minutes 로만 갈리는 버튼이 같은 키를 쓰면 연달아 누른 쪽이 무시되므로 dataset을 전부 넣는다.
    const key = Object.entries({ ...button.dataset }).map(([name, value]) => `${name}=${value}`).join("|");
    const now = Date.now();
    if (now - (lastTapAt.get(key) || 0) < 350) return true;
    lastTapAt.set(key, now);
    return false;
  }

  function launchStamp() {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    document.querySelectorAll(".stamp-layer").forEach((node) => node.remove());
    const layer = document.createElement("div");
    layer.className = "stamp-layer";
    layer.setAttribute("aria-hidden", "true");
    layer.innerHTML = `<div class="stamp-mark">회의 끝!<small>오늘 회의를 저장했어요</small></div>`;
    document.body.appendChild(layer);
    setTimeout(() => {
      document.body.classList.add("is-stamped");
      setTimeout(() => document.body.classList.remove("is-stamped"), 320);
    }, 380);
    setTimeout(() => layer.remove(), 2200);
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

  // 회의 기록 모양인지 최소한만 확인한다. 아무 JSON이나 migrate로 넘기면 남의 파일이 회의록이 되어 버린다.
  const MEETING_KEYS = ["id", "schemaVersion", "agenda", "flow", "opinions", "decision", "vote", "title", "date"];

  function isMeetingLike(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) return false;
    return MEETING_KEYS.some((key) => Object.prototype.hasOwnProperty.call(value, key));
  }

  async function importJson(file) {
    if (!file) return;
    try {
      const text = await file.text();
      const payload = JSON.parse(text);
      const meeting = payload?.meetings?.[0] || payload?.meeting || payload;
      if (!isMeetingLike(meeting)) {
        toast("이 파일은 우리 반 회의 기록이 아닌 것 같아요. 학급회의에서 내려받은 파일을 골라 주세요.", "warn");
        return;
      }
      state.meeting = migrate(meeting);
      state.meeting.currentPage = Math.max(1, state.meeting.currentPage || 1);
      await saveMeetingNow();
      state.recentMeetings = await getAllMeetings();
      render();
    } catch (error) {
      console.warn(error);
      toast("회의 기록 파일을 열지 못했어요. 다른 파일인지 확인해 주세요.", "warn");
    }
  }

  function importRecordsFromFile() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json,.json";
    input.addEventListener("change", async () => {
      const file = input.files?.[0];
      if (!file) return;
      await importRecords(file);
    });
    input.click();
  }

  function extractImportedMeetings(payload) {
    if (Array.isArray(payload)) return payload;
    if (!payload || typeof payload !== "object") return [];
    if (Array.isArray(payload.meetings)) return payload.meetings;
    if (payload.meeting && typeof payload.meeting === "object") return [payload.meeting];
    if (payload.id || payload.schemaVersion) return [payload];
    return [];
  }

  async function importRecords(file) {
    try {
      const text = await file.text();
      const payload = JSON.parse(text);
      const candidates = extractImportedMeetings(payload).filter(isMeetingLike);
      if (!candidates.length) throw new Error("가져올 회의 기록이 없는 파일이에요.");
      let saved = 0;
      for (const raw of candidates) {
        const meeting = migrate(raw);
        if (!raw.id) meeting.id = crypto.randomUUID ? crypto.randomUUID() : `meeting-${Date.now()}-${saved}`;
        // 기기 저장함이 막혀 있으면 실제로 담기지 않으므로 불러왔다고 말하지 않는다.
        if ((await withStore("meetings", "readwrite", (store) => store.put(meeting))) == null) {
          state.dbFailed = true;
          toast(LOCAL_ONLY_SAVE_MESSAGE, "warn");
          return;
        }
        saved += 1;
      }
      state.recentMeetings = await getAllMeetings();
      render();
      toast(`📂 기록 ${saved}개를 불러왔어요.`);
    } catch (error) {
      console.warn("import-json failed", error);
      toast("파일을 읽지 못했어요. 학급회의에서 내려받은 기록 파일인지 확인해 주세요.", "warn");
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

  function queueSave() {
    saveSnapshot();
    setSaveStatus("saving");
    clearTimeout(state.saveTimer);
    state.saveTimer = setTimeout(() => saveMeetingNow().catch((error) => {
      console.warn(error);
      setSaveStatus("error");
    }), 500);
  }

  function setSaveStatus(status) {
    state.saveStatus = status;
    const labels = {
      saving: ["saving", "↻ 저장 중…"],
      error: ["error", "! 저장 확인 필요"],
      // 기기 저장함이 막힌 브라우저에서는 저장됐다고 말하지 않는다.
      localOnly: ["error", "! 이 브라우저에만 임시 저장"],
      saved: ["saved", "✓ 자동 저장됨"]
    };
    const [className, label] = labels[status] || labels.saved;
    document.querySelectorAll("[data-save-status]").forEach((node) => {
      node.className = `save-status-pill ${className}`;
      node.textContent = label;
    });
  }

  // 기기 저장함이 잠긴 브라우저(시크릿 모드 등)에서 아이에게 알려 줄 문구.
  const LOCAL_ONLY_SAVE_MESSAGE = "지금은 기기에 저장할 수 없어서 이 브라우저에만 임시로 남아요. 회의가 끝나면 '기록 파일 내려받기'를 꼭 눌러 주세요.";
  let snapshotFailNoticed = false;
  let localOnlyNoticed = false;

  function saveSnapshot() {
    try {
      localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(state.meeting));
      localStorage.setItem(SETTINGS_KEY, JSON.stringify({
        schemaVersion: SCHEMA_VERSION,
        lastMeetingId: state.meeting.id,
        bgmEnabled: Boolean(state.meeting.bgmEnabled),
        sfxEnabled: Boolean(state.meeting.sfxEnabled)
      }));
    } catch (error) {
      // 조용히 넘기면 아이가 저장된 줄 알고 나가 버리므로 한 번은 꼭 알린다.
      console.warn("snapshot save failed", error);
      if (snapshotFailNoticed) return;
      snapshotFailNoticed = true;
      toast("기록을 담아 둘 자리가 부족해요. '기록 파일 내려받기'를 눌러 파일로 받아 주세요.", "warn");
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

  function applyAudioPreferences(meeting) {
    const settings = loadSettings();
    if (typeof settings.bgmEnabled === "boolean") meeting.bgmEnabled = settings.bgmEnabled;
    if (typeof settings.sfxEnabled === "boolean") meeting.sfxEnabled = settings.sfxEnabled;
    meeting.soundEnabled = meeting.sfxEnabled;
    return meeting;
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
    setSaveStatus("saving");
    try {
      const meeting = structuredClone(state.meeting);
      meeting.updatedAt = new Date().toISOString();
      // withStore는 기기 저장함을 못 쓸 때 null을 준다. 이때 '저장됨'이라고 하면 거짓말이 된다.
      const storedKey = await withStore("meetings", "readwrite", (store) => store.put(meeting));
      if (storedKey == null) {
        state.dbFailed = true;
        setSaveStatus("localOnly");
        if (!localOnlyNoticed) {
          localOnlyNoticed = true;
          toast(LOCAL_ONLY_SAVE_MESSAGE, "warn");
        }
        return;
      }
      state.dbFailed = false;
      setSaveStatus("saved");
    } catch (error) {
      setSaveStatus("error");
      throw error;
    }
  }

  async function getMeeting(id) {
    return withStore("meetings", "readonly", (store) => store.get(id));
  }

  async function getAllMeetings() {
    const meetings = await withStore("meetings", "readonly", (store) => store.getAll());
    return (meetings || []).sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)));
  }

  function migrate(input) {
    // 병합 베이스는 샘플이 아닌 빈 회의여야 한다. 샘플이면 아이가 안 적은 칸이 청소 구역·좋아요 18명 같은 가짜 내용으로 채워진다.
    const meeting = deepMerge(createEmptyMeeting(), input || {});
    meeting.schemaVersion = SCHEMA_VERSION;
    meeting.title = friendlyMeetingTitle(meeting.title);
    meeting.agenda.problemAdditionalOpinions = normalizeAdditionalPrepareOpinions(meeting.agenda.problemAdditionalOpinions, "problem");
    meeting.agenda.outcomeAdditionalOpinions = normalizeAdditionalPrepareOpinions(meeting.agenda.outcomeAdditionalOpinions, "outcome");
    const legacyRoles = input?.roles || {};
    if (!Array.isArray(input?.roles?.entries)) {
      const combinedRecorders = [legacyRoles.recorder, legacyRoles.timeKeeper].filter(Boolean).join(", ");
      meeting.roles.entries = [
        { id: "role-host", label: "회장", name: legacyRoles.host || "" },
        { id: "role-vice-chair", label: "부회장 · 화면에 적는 친구", name: combinedRecorders },
        { id: "role-secretary", label: "서기 · 공책에 적는 친구", name: "" }
      ];
    } else {
      let migratedLegacyRecorder = false;
      meeting.roles.entries = input.roles.entries.map((role, index) => {
        role = role || {};
        const id = role.id || `role-${index + 1}`;
        const oldLabel = String(role.label || "");
        const isLegacyRecorder = id === "role-record-time" && ["기록·시간관리자", "적고 시간 보는 친구"].includes(oldLabel);
        if (isLegacyRecorder) migratedLegacyRecorder = true;
        const renamedLabels = {
          "부회장(화면 입력)": "부회장 · 화면에 적는 친구",
          "서기(별도 문서)": "서기 · 공책에 적는 친구"
        };
        return {
          id: isLegacyRecorder ? "role-vice-chair" : id,
          label: id === "role-host" && oldLabel === "사회자"
            ? "회장"
            : isLegacyRecorder
              ? "부회장 · 화면에 적는 친구"
              : renamedLabels[oldLabel] || oldLabel,
          name: String(role.name || "")
        };
      });
      const hasSecretary = meeting.roles.entries.some((role) => role.id === "role-secretary" || role.label.startsWith("서기"));
      if (migratedLegacyRecorder && !hasSecretary) {
        meeting.roles.entries.push({ id: "role-secretary", label: "서기 · 공책에 적는 친구", name: "" });
      }
      const migratedViceChair = meeting.roles.entries.find((role) => role.id === "role-vice-chair");
      const migratedSecretary = meeting.roles.entries.find((role) => role.id === "role-secretary");
      if (migratedViceChair?.name === "이서준, 박지우" && migratedSecretary && !migratedSecretary.name) {
        migratedViceChair.name = "이서준";
        migratedSecretary.name = "박지우";
      }
    }
    meeting.meetingRules = Array.isArray(input?.meetingRules)
      ? input.meetingRules.slice(0, 8).map((rule) => String(rule || ""))
      : [""];
    if (!meeting.meetingRules.length) meeting.meetingRules = [""];
    meeting.previous.reflectionNotes = String(input?.previous?.reflectionNotes || [meeting.previous.evidence, meeting.previous.cause, meeting.previous.improvement].filter(Boolean).join(" ") || "");
    meeting.students = Array.from({ length: 30 }, (_, index) => String(input?.students?.[index] || ""));
    meeting.speakerOrder = Array.isArray(input?.speakerOrder)
      ? input.speakerOrder.map(Number).filter((index, position, all) => Number.isInteger(index) && index >= 0 && index < 30 && all.indexOf(index) === position)
      : [];
    meeting.decision.additionalNotes = String(input?.decision?.additionalNotes || [meeting.decision.successCriteria, meeting.decision.nextReview].filter(Boolean).join(" ") || "");
    meeting.feedbackIndex = Number.isFinite(Number(input?.feedbackIndex)) ? ((Number(input.feedbackIndex) % 100) + 100) % 100 : getClosingFeedbackIndex(`${meeting.id}-${meeting.date}`);
    meeting.teacherComment = String(input?.teacherComment || buildClosingFeedback(meeting, meeting.feedbackIndex));
    meeting.opinions = Array.isArray(meeting.opinions) ? meeting.opinions.map((opinion) => ({
      id: opinion.id || (crypto.randomUUID ? crypto.randomUUID() : `op-${Date.now()}`),
      text: opinion.text || "생각을 적지 않았어요.",
      reason: opinion.reason || "이유 미입력",
      expectedEffect: opinion.expectedEffect || "",
      concern: opinion.concern || "",
      category: opinion.category || "우리 반 생활",
      likes: Number(opinion.likes || 0)
    })) : [];
    meeting.flow.completedPages = Array.isArray(meeting.flow.completedPages)
      ? meeting.flow.completedPages.filter((pageId) => PAGES.some((page) => page.id === pageId))
      : [];
    const savedSchemaVersion = Number(input?.schemaVersion || 0);
    if (savedSchemaVersion < 11 && meeting.flow.completedPages.includes(PAGES[7].id) && !meeting.flow.completedPages.includes(PAGES[6].id)) {
      meeting.flow.completedPages.push(PAGES[6].id);
    }
    const savedSelectedPages = Array.isArray(input?.flow?.selectedPages)
      ? input.flow.selectedPages.map(Number)
      : [...DEFAULT_MEETING.flow.selectedPages];
    meeting.flow.selectedPages = [...new Set(savedSelectedPages.filter((page) => FLOW_SELECTABLE_PAGES.includes(page)))].sort((a, b) => a - b);
    if (savedSchemaVersion < 11 && meeting.flow.selectedPages.includes(6) && !meeting.flow.selectedPages.includes(7)) {
      meeting.flow.selectedPages.push(7);
      meeting.flow.selectedPages.sort((a, b) => a - b);
    }
    meeting.flow.stageMinutes = Array.from({ length: 10 }, (_, index) => {
      const value = Number(meeting.flow.stageMinutes?.[index]);
      return Number.isFinite(value) && value > 0 ? Math.min(15, value) : DEFAULT_MEETING.flow.stageMinutes[index];
    });
    const plannedMinutes = Math.max(10, Math.min(60, FLOW_TIME_PAGES.reduce((sum, step) => sum + meeting.flow.stageMinutes[step - 1], 0)));
    meeting.flow.durationMinutes = plannedMinutes;
    meeting.timer.durationMinutes = plannedMinutes;
    meeting.flow.studentNavigation = true;
    delete meeting.flow.teacherUnlock;
    meeting.sfxEnabled = input?.sfxEnabled == null
      ? input?.soundEnabled !== false
      : Boolean(input.sfxEnabled);
    meeting.bgmEnabled = Boolean(input?.bgmEnabled);
    meeting.soundEnabled = meeting.sfxEnabled;
    const savedTimerStage = Number(meeting.timer.stageNumber || meeting.currentPage || 1);
    meeting.timer.stageNumber = savedTimerStage === 7 ? 6 : Math.min(10, Math.max(1, savedTimerStage));
    meeting.timer.stageAccumulatedMs = Math.max(0, Number(meeting.timer.stageAccumulatedMs || 0));
    meeting.timer.fiveMinuteAlerts = Boolean(input?.timer?.fiveMinuteAlerts);
    meeting.timer.lastFiveMinuteAlertBlock = Math.max(0, Number(meeting.timer.lastFiveMinuteAlertBlock || 0));
    if (meeting.timer.running) {
      meeting.timer.running = false;
      meeting.timer.startedAt = null;
      meeting.timer.stageStartedAt = null;
      meeting.timer.pausedAt = Date.now();
    }
    meeting.freeNote = String(input?.freeNote || "");
    meeting.posterStyle = POSTER_STYLES.some((style) => style.id === input?.posterStyle) ? input.posterStyle : "mint";
    meeting.topicSelection.talliedOpinionIds = Array.isArray(meeting.topicSelection.talliedOpinionIds)
      ? meeting.topicSelection.talliedOpinionIds.filter((id) => meeting.opinions.some((opinion) => opinion.id === id))
      : [];
    meeting.vote.confirmed = Boolean(meeting.vote.confirmed);
    meeting.vote.confirmedAt = meeting.vote.confirmedAt || null;
    meeting.vote.hold = 0;
    const oldDefaultSteps = ["시작", "반성", "의견", "정리", "토론", "투표", "결정", "회의록", "공유", "마무리"];
    const previousDefaultSteps = ["준비", "순서", "시작", "돌아보기", "의견 적기", "의견 모으기", "함께 이야기", "투표", "정한 내용", "마무리"];
    const latestPreviousDefaultSteps = ["준비", "순서", "시작", "지난번 보기", "생각 적기", "생각 모으기", "함께 말하기", "손들기", "정한 일", "마무리"];
    const talkDefaultSteps = ["준비", "순서", "시작", "지난번 보기", "생각 적기", "생각 모아 말하기", "함께 말하기", "손들기", "정한 일", "마무리"];
    const raiseDefaultSteps = ["준비", "순서", "시작", "지난번 보기", "생각 적기", "생각 모아 손들기", "함께 말하기", "손들기", "정한 일", "마무리"];
    const savedSteps = Array.isArray(meeting.flow.stepLabels)
      ? meeting.flow.stepLabels.map((label) => String(label || ""))
      : [...DEFAULT_MEETING.flow.stepLabels];
    const legacyDefaultPatterns = [oldDefaultSteps, previousDefaultSteps, latestPreviousDefaultSteps, talkDefaultSteps, raiseDefaultSteps].map((steps) => steps.join("|"));
    meeting.flow.stepLabels = legacyDefaultPatterns.includes(savedSteps.join("|"))
      ? [...DEFAULT_MEETING.flow.stepLabels]
      : savedSteps.slice(0, 10);
    while (meeting.flow.stepLabels.length < 10) meeting.flow.stepLabels.push(PAGES[meeting.flow.stepLabels.length + 1]?.short || "단계");
    meeting.totalStudents = Math.min(30, Math.max(1, Number(meeting.totalStudents || DEFAULT_MEETING.totalStudents)));
    // 구버전 저장본에는 absentCount 가 없다. 없으면 0(결석 없음)으로 두고, 등록 인원을 넘지 않게 자른다.
    meeting.absentCount = Math.min(meeting.totalStudents, Math.max(0, Number(input?.absentCount) || 0));
    const currentPage = Number(meeting.currentPage || 1);
    meeting.currentPage = currentPage === 7 ? 6 : Number.isFinite(currentPage) ? Math.min(10, Math.max(0, currentPage)) : 1;
    return applyAudioPreferences(meeting);
  }

  function normalizeAdditionalPrepareOpinions(value, kind) {
    if (!Array.isArray(value)) return [];
    return value.slice(0, 20).map((opinion, index) => ({
      id: opinion?.id || `${kind}-${index + 1}`,
      text: String(opinion?.text || ""),
      proposer: String(opinion?.proposer || "")
    }));
  }

  function deepMerge(target, source) {
    for (const [key, value] of Object.entries(source || {})) {
      // 불러온 파일이 이 키들로 브라우저 전체 설정을 건드리지 못하게 막는다.
      // 목록을 const 로 두면 파일 위쪽에서 먼저 부르는 init() → migrate() 가 TDZ 오류로 죽어 이어하기가 새 회의로 떨어진다.
      if (key === "__proto__" || key === "constructor" || key === "prototype") continue;
      if (value && typeof value === "object" && !Array.isArray(value)) {
        target[key] = deepMerge(target[key] || {}, value);
      } else {
        target[key] = value;
      }
    }
    return target;
  }

  function friendlyMeetingTitle(title) {
    return String(title || "");
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
    if (input.type === "number") {
      const min = Number(input.min || 0);
      const configuredMax = input.max ? Number(input.max) : Number.MAX_SAFE_INTEGER;
      const headCountMax = isHeadCountPath(input.dataset.field) ? getPresentCount() : Number.MAX_SAFE_INTEGER;
      return Math.min(configuredMax, headCountMax, Math.max(min, Number(input.value || 0)));
    }
    return input.value;
  }

  function updateDependentText() {
    updateMeetingClockVisual();
    const hasPrepareTopic = String(state.meeting.agenda.title || "").trim().length > 0;
    const hasPrepareStory = [state.meeting.agenda.problemContext, state.meeting.agenda.expectedOutcome].some((value) => String(value || "").trim());
    document.querySelectorAll("[data-prepare-topic-status]").forEach((node) => {
      node.className = hasPrepareTopic ? "ready" : "needs-attention";
      const badge = node.querySelector("b");
      const text = node.querySelector("em");
      if (badge) badge.textContent = hasPrepareTopic ? "✓" : "1";
      if (text) text.textContent = hasPrepareTopic ? "오늘의 주제를 적었어요" : "오늘의 주제를 먼저 적어요";
    });
    document.querySelectorAll("[data-prepare-story-status]").forEach((node) => {
      node.className = hasPrepareStory ? "ready" : "needs-attention";
      const badge = node.querySelector("b");
      const text = node.querySelector("em");
      if (badge) badge.textContent = hasPrepareStory ? "✓" : "2";
      if (text) text.textContent = hasPrepareStory ? "회의가 필요한 까닭을 적었어요" : "문제나 바라는 모습을 적어요";
    });
    const roles = state.meeting.roles.entries || [];
    const assignedRoleCount = roles.filter((role) => String(role.name || "").trim()).length;
    const missingRoleCount = Math.max(0, roles.length - assignedRoleCount);
    document.querySelectorAll("[data-role-progress]").forEach((node) => {
      node.textContent = `${assignedRoleCount}/${roles.length}명 입력`;
    });
    document.querySelectorAll("[data-role-readiness]").forEach((node) => {
      node.className = missingRoleCount ? "needs-attention" : "ready";
    });
    document.querySelectorAll("[data-role-readiness-icon]").forEach((node) => {
      node.textContent = missingRoleCount ? "!" : "✓";
    });
    document.querySelectorAll("[data-role-readiness-text]").forEach((node) => {
      node.textContent = missingRoleCount ? `맡을 친구 ${missingRoleCount}명 미입력` : "맡을 친구 입력 완료";
    });
    const namedStudents = state.meeting.students.filter((name) => String(name || "").trim()).length;
    // 이름 수는 이제 5쪽 '발표 순서 정하기' 토글 요약에만 보인다. 접힌 채로도 숫자가 맞아야 한다.
    document.querySelectorAll("[data-student-readiness]").forEach((node) => {
      node.textContent = namedStudents ? `친구 ${namedStudents}명 입력` : "이름을 한 번에 입력해요";
    });
    const decisionPreview = {
      "[data-decision-preview-text]": state.meeting.decision.text || "무엇을 할지 적으면 여기에 보여요.",
      "[data-decision-preview-method]": state.meeting.decision.practiceMethod || "실천 방법",
      "[data-decision-preview-owner]": state.meeting.decision.owner || "맡을 친구",
      "[data-decision-preview-period]": state.meeting.decision.period || "실천 기간"
    };
    Object.entries(decisionPreview).forEach(([selector, value]) => {
      document.querySelectorAll(selector).forEach((node) => { node.textContent = value; });
    });
    const noteRecordCount = getMeetingNoteSections().reduce((sum, section) => sum + section.items.length, 0);
    document.querySelectorAll("[data-note-count]").forEach((node) => {
      node.textContent = String(noteRecordCount);
    });
    // 3·6·7·9·10쪽 준비도 칩은 통째로 다시 만든다. 내용이 같으면 건드리지 않아 입력 중에도 깜빡이지 않는다.
    document.querySelectorAll("[data-readiness-strip]").forEach((node) => {
      const html = readinessChips(Number(node.dataset.readinessStrip));
      if (html && node.innerHTML !== html) node.innerHTML = html;
    });
    document.querySelectorAll("[data-timer-display]").forEach((node) => {
      node.textContent = formatTime(getRemainingMs());
    });
    const reflection = state.meeting.previous.handRaise;
    const reflectionTotal = Number(reflection.good || 0) + Number(reflection.normal || 0) + Number(reflection.hard || 0);
    const reflectionExpected = getPresentCount();
    document.querySelectorAll("[data-present-count]").forEach((node) => {
      node.textContent = String(reflectionExpected);
    });
    const reflectionState = reflectionTotal === reflectionExpected && reflectionExpected > 0
      ? "complete"
      : reflectionTotal > reflectionExpected
        ? "over"
        : "pending";
    const reflectionMessage = reflectionState === "complete"
      ? "모두 손들었어요"
      : reflectionState === "over"
        ? `${reflectionTotal - reflectionExpected}명이 많아요`
        : `${Math.max(0, reflectionExpected - reflectionTotal)}명을 더 세어요`;
    document.querySelectorAll("[data-reflection-total]").forEach((node) => {
      node.textContent = String(reflectionTotal);
    });
    document.querySelectorAll("[data-reflection-message]").forEach((node) => {
      node.textContent = reflectionMessage;
    });
    document.querySelectorAll("[data-reflection-status]").forEach((node) => {
      node.className = `reflection-count-status ${reflectionState}`;
    });
    const voteTotal = Number(state.meeting.vote.agree) + Number(state.meeting.vote.disagree);
    const agreeRate = voteTotal ? Math.round((Number(state.meeting.vote.agree) / voteTotal) * 100) : 0;
    const page = PAGES[state.meeting.currentPage];
    if (page?.id === "page_08_vote") {
      const display = document.querySelector(".rate");
      if (display) display.textContent = `${agreeRate}%`;
      const bar = document.querySelector(".result-panel .bar span");
      if (bar) bar.style.setProperty("--value", `${agreeRate}%`);
      const expected = getPresentCount();
      const countState = voteTotal === expected && expected > 0 ? "complete" : voteTotal > expected ? "over" : "pending";
      document.querySelectorAll("[data-vote-confirm]").forEach((button) => { button.disabled = countState !== "complete"; });
      document.querySelectorAll("[data-vote-equation-agree]").forEach((node) => { node.textContent = String(Number(state.meeting.vote.agree || 0)); });
      document.querySelectorAll("[data-vote-equation-disagree]").forEach((node) => { node.textContent = String(Number(state.meeting.vote.disagree || 0)); });
      document.querySelectorAll("[data-vote-equation-total]").forEach((node) => { node.textContent = String(voteTotal); });
      document.querySelectorAll("[data-vote-equation-gap]").forEach((node) => {
        node.textContent = countState === "complete"
          ? "✓ 모두 셌어요"
          : countState === "over"
            ? `${voteTotal - expected}명 많아요`
            : `${Math.max(0, expected - voteTotal)}명 더 세어요`;
      });
      document.querySelectorAll(".vote-equation").forEach((node) => { node.className = `vote-equation ${countState}`; });
    }
    updateStageCompletionUi();
    updateHandPointer();
  }

  function updateStageCompletionUi() {
    const step = Number(state.meeting.currentPage || 0);
    if (step < 1) return;
    const validation = validateStage(step);
    const isFinalSaved = step > 2
      && getNextRoutePage(step) == null
      && Boolean(state.meeting.savedAt)
      && state.meeting.flow.completedPages.includes(PAGES[step]?.id);
    document.querySelectorAll("[data-primary-next]").forEach((button) => {
      button.toggleAttribute("data-blocked", !validation.valid);
      button.setAttribute("aria-disabled", String(!validation.valid));
    });
    document.querySelectorAll("[data-nav-requirement]").forEach((node) => {
      node.className = `nav-requirement ${validation.valid ? "ready" : "needs-attention"}`;
      node.textContent = isFinalSaved
        ? "🎉 회의 기록을 저장했어요. 이상으로 오늘 학급회의를 마칩니다!"
        : validation.valid
        ? "✓ 이 순서를 마칠 준비가 됐어요."
        : `다음으로 가려면: ${validation.message}`;
    });
  }

  function showRecovery(error) {
    console.warn("recovery screen", error);
    const template = document.getElementById("recovery-template");
    root.innerHTML = template.innerHTML;
    root.dataset.error = String(error?.stack || error || "unknown error");
    root.querySelector("[data-reload]")?.addEventListener("click", () => location.reload());
    root.querySelector("[data-export-fallback]")?.addEventListener("click", exportJson);
    // 같은 기록이 계속 화면을 깨뜨릴 때, 그 기록을 지우고 빠져나가는 유일한 길.
    root.querySelector("[data-discard-restart]")?.addEventListener("click", () => {
      if (!confirm("적어 둔 기록을 지우고 새 회의를 시작할까요?")) return;
      discardOnUnload = true;
      try {
        localStorage.removeItem(SNAPSHOT_KEY);
      } catch (removeError) {
        console.warn("snapshot remove failed", removeError);
      }
      location.reload();
    });
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
