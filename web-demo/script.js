const state = {
  expanded: false,
  module: "dashboard",
  settingsOpen: false,
  claudeAuthorized: false,
  compactTitle: "概览已就绪",
  compactSubtitle: "点击展开查看交互 demo",
  compactTaskTitle: "专注计时",
  compactTaskSubtitle: "25:00",
  timerSeconds: 25 * 60,
  timerInterval: null,
  aiConfig: {
    baseUrl: "",
    model: "gpt-4.1-mini",
    apiKey: "",
  },
  chatMessages: [
    { role: "assistant", text: "这是网页交互 demo。这里展示的是灵动岛 AI 面板的交互形态，不会真实调用模型。" }
  ],
  dashboard: {
    dateHeadline: formatDateHeadline(new Date()),
    usageHeadline: "今日设备使用 5 小时 24 分钟",
    event: { title: "产品评审会", subtitle: "14:00 - 15:00 • 工作日历", accent: "#7fe3ff" },
    todo: { title: "提交 Demo 链接", subtitle: "待办 • 工作 • 今天", accent: "#ffb86a" },
    media: { source: "Spotify", title: "Midnight City", subtitle: "M83" },
  },
  clipboard: [
    { title: "临时文案：请把灵动岛的 AI 设置折叠起来", time: "13:25" },
    { title: "图片缓存：设计草图 1440x900", time: "13:11" },
  ],
  reminders: [
    { key: "water", title: "喝水提醒", subtitle: "每 45 分钟提醒一次", active: true },
    { key: "stand", title: "站立提醒", subtitle: "每 60 分钟提醒一次", active: false },
  ],
  claude: {
    title: "未授权读取 Claude Code",
    subtitle: "开启后可读取本机 ~/.claude/projects 会话状态",
    dotClass: "gray",
  },
};

const modules = [
  { key: "dashboard", title: "概览" },
  { key: "chat", title: "AI" },
  { key: "clipboard", title: "中转站" },
  { key: "timer", title: "计时器" },
  { key: "reminders", title: "提醒" },
];

const compactIsland = document.getElementById("compactIsland");
const closeIsland = document.getElementById("closeIsland");
const expandedIsland = document.getElementById("expandedIsland");
const moduleTabs = document.getElementById("moduleTabs");
const modulePanel = document.getElementById("modulePanel");

compactIsland.addEventListener("click", () => {
  state.expanded = true;
  render();
});

closeIsland.addEventListener("click", () => {
  state.expanded = false;
  render();
});

function renderTabs() {
  moduleTabs.innerHTML = "";
  modules.forEach((mod) => {
    const button = document.createElement("button");
    button.className = `tab-btn ${state.module === mod.key ? "active" : ""}`;
    button.textContent = mod.title;
    button.onclick = () => {
      state.module = mod.key;
      render();
    };
    moduleTabs.appendChild(button);
  });
}

function renderCompact() {
  document.getElementById("compactTitle").textContent = state.compactTitle;
  document.getElementById("compactSubtitle").textContent = state.compactSubtitle;
  document.getElementById("compactTaskTitle").textContent = state.compactTaskTitle;
  document.getElementById("compactTaskSubtitle").textContent = state.compactTaskSubtitle;
  expandedIsland.classList.toggle("hidden", !state.expanded);
}

function renderDashboard() {
  const tpl = document.getElementById("dashboardTemplate").content.cloneNode(true);
  tpl.getElementById("todayHeadline").textContent = state.dashboard.dateHeadline;
  tpl.getElementById("usageHeadline").textContent = state.dashboard.usageHeadline;

  const agendaCards = tpl.getElementById("agendaCards");
  [state.dashboard.event, state.dashboard.todo].forEach((item) => {
    const card = document.createElement("article");
    card.className = "agenda-card";
    card.innerHTML = `
      <div style="display:flex; gap:12px; align-items:flex-start;">
        <span style="width:6px;height:42px;border-radius:999px;background:${item.accent};display:block;"></span>
        <div class="stack dense">
          <strong>${item.title}</strong>
          <span class="muted">${item.subtitle}</span>
        </div>
      </div>
    `;
    agendaCards.appendChild(card);
  });

  tpl.getElementById("mediaSource").textContent = state.dashboard.media.source;
  tpl.getElementById("mediaTitle").textContent = state.dashboard.media.title;
  tpl.getElementById("mediaSubtitle").textContent = state.dashboard.media.subtitle;
  return tpl;
}

function renderChat() {
  const tpl = document.getElementById("aiTemplate").content.cloneNode(true);
  const messages = tpl.getElementById("chatMessages");
  state.chatMessages.forEach((message) => {
    const bubble = document.createElement("div");
    bubble.className = `bubble ${message.role}`;
    bubble.textContent = message.text;
    messages.appendChild(bubble);
  });

  const settingsPanel = tpl.getElementById("settingsPanel");
  const settingsSummary = tpl.getElementById("settingsSummary");
  settingsPanel.classList.toggle("hidden", !state.settingsOpen);
  settingsSummary.classList.toggle("hidden", state.settingsOpen);

  tpl.getElementById("baseUrlInput").value = state.aiConfig.baseUrl;
  tpl.getElementById("modelInput").value = state.aiConfig.model;
  tpl.getElementById("apiKeyInput").value = state.aiConfig.apiKey;
  tpl.getElementById("savedModel").textContent = state.aiConfig.model || "未配置模型";
  tpl.getElementById("savedHost").textContent = state.aiConfig.baseUrl
    ? `${safeHost(state.aiConfig.baseUrl)} • 点击设置图标修改`
    : "默认 OpenAI 官方地址 • 点击设置图标修改";

  const toggle = tpl.getElementById("claudeToggle");
  toggle.textContent = state.claudeAuthorized ? "已授权" : "未授权";
  toggle.className = `toggle-chip ${state.claudeAuthorized ? "on" : "off"}`;
  toggle.onclick = () => {
    state.claudeAuthorized = !state.claudeAuthorized;
    state.claude = state.claudeAuthorized
      ? { title: "Claude Code 工作中", subtitle: "最近会话仍在处理中 • island 项目", dotClass: "" }
      : { title: "未授权读取 Claude Code", subtitle: "开启后可读取本机 ~/.claude/projects 会话状态", dotClass: "gray" };
    render();
  };

  tpl.getElementById("claudeStatusTitle").textContent = state.claude.title;
  tpl.getElementById("claudeStatusSubtitle").textContent = state.claude.subtitle;
  tpl.getElementById("claudeStatusDot").className = `status-dot ${state.claude.dotClass}`;

  tpl.getElementById("settingsToggle").onclick = () => {
    state.settingsOpen = !state.settingsOpen;
    render();
  };

  tpl.getElementById("saveSettings").onclick = () => {
    state.aiConfig.baseUrl = tpl.getElementById("baseUrlInput").value.trim();
    state.aiConfig.model = tpl.getElementById("modelInput").value.trim();
    state.aiConfig.apiKey = tpl.getElementById("apiKeyInput").value.trim();
    state.settingsOpen = false;
    render();
  };

  tpl.getElementById("sendChat").onclick = () => {
    const input = tpl.getElementById("chatInput");
    const text = input.value.trim();
    if (!text) return;
    state.chatMessages.push({ role: "user", text });
    state.chatMessages.push({
      role: "assistant",
      text: state.aiConfig.apiKey
        ? "这是交互 demo：已记录你的配置与消息。这里可以继续接正式接口。"
        : "这是交互 demo：当前未配置 API Key，所以这里只做本地交互回显。"
    });
    input.value = "";
    render();
  };

  return tpl;
}

function renderClipboard() {
  const tpl = document.getElementById("clipboardTemplate").content.cloneNode(true);
  const list = tpl.getElementById("clipboardList");
  state.clipboard.forEach((item) => {
    const card = document.createElement("article");
    card.className = "clip-card";
    card.innerHTML = `
      <div class="stack dense">
        <strong>${item.title}</strong>
        <span class="muted">${item.time}</span>
      </div>
      <div class="row" style="gap:8px;">
        <button class="pill-btn secondary">重新复制</button>
        <button class="pill-btn secondary">打开文件</button>
      </div>
    `;
    list.appendChild(card);
  });
  return tpl;
}

function renderTimer() {
  const tpl = document.getElementById("timerTemplate").content.cloneNode(true);
  tpl.getElementById("timerDisplay").textContent = formatTimer(state.timerSeconds);
  const presets = tpl.getElementById("timerPresets");
  [5, 15, 25, 50].forEach((min) => {
    const btn = document.createElement("button");
    btn.className = "pill-btn secondary";
    btn.textContent = `${min} 分钟`;
    btn.onclick = () => {
      state.timerSeconds = min * 60;
      restartTimer();
    };
    presets.appendChild(btn);
  });
  tpl.getElementById("startCustomTimer").onclick = () => {
    const input = tpl.getElementById("customMinutes").value.trim();
    const minutes = Number(input || "25");
    if (!Number.isFinite(minutes) || minutes <= 0) return;
    state.timerSeconds = Math.round(minutes * 60);
    restartTimer();
  };
  return tpl;
}

function renderReminders() {
  const tpl = document.getElementById("remindersTemplate").content.cloneNode(true);
  const grid = tpl.getElementById("reminderCards");
  state.reminders.forEach((reminder) => {
    const card = document.createElement("article");
    card.className = `reminder-card ${reminder.active ? `active ${reminder.key}` : ""}`;
    const button = document.createElement("button");
    button.className = `toggle-chip ${reminder.active ? "on" : "off"}`;
    button.textContent = reminder.active ? "已开启" : "未开启";
    button.onclick = () => {
      reminder.active = !reminder.active;
      render();
    };
    card.innerHTML = `
      <div class="stack dense">
        <div class="row between">
          <strong>${reminder.title}</strong>
        </div>
        <span class="muted">${reminder.subtitle}</span>
      </div>
    `;
    card.querySelector(".row").appendChild(button);
    grid.appendChild(card);
  });
  return tpl;
}

function renderPanel() {
  modulePanel.innerHTML = "";
  let content;
  switch (state.module) {
    case "dashboard":
      content = renderDashboard();
      state.compactTitle = "概览已就绪";
      state.compactSubtitle = "日期、待办与媒体已整合";
      state.compactTaskTitle = "专注计时";
      state.compactTaskSubtitle = formatTimer(state.timerSeconds);
      break;
    case "chat":
      content = renderChat();
      state.compactTitle = "AI 对话";
      state.compactSubtitle = "点设置图标可编辑接口配置";
      state.compactTaskTitle = "Claude 状态";
      state.compactTaskSubtitle = state.claudeAuthorized ? "工作中" : "未授权";
      break;
    case "clipboard":
      content = renderClipboard();
      state.compactTitle = "剪贴板中转站";
      state.compactSubtitle = "文本与图片的临时缓存";
      state.compactTaskTitle = "当前任务";
      state.compactTaskSubtitle = "暂无进行中的提醒";
      break;
    case "timer":
      content = renderTimer();
      state.compactTitle = "专注计时器";
      state.compactSubtitle = "支持预设和自定义分钟数";
      state.compactTaskTitle = "专注计时";
      state.compactTaskSubtitle = formatTimer(state.timerSeconds);
      break;
    case "reminders":
      content = renderReminders();
      state.compactTitle = "健康提醒";
      state.compactSubtitle = "喝水与站立提醒显色开关";
      state.compactTaskTitle = state.reminders.some((item) => item.active) ? "喝水提醒" : "当前任务";
      state.compactTaskSubtitle = state.reminders.some((item) => item.active) ? "下次：14:30" : "暂无进行中的提醒";
      break;
  }
  modulePanel.appendChild(content);
}

function restartTimer() {
  clearInterval(state.timerInterval);
  render();
  state.timerInterval = setInterval(() => {
    if (state.timerSeconds <= 0) {
      clearInterval(state.timerInterval);
      return;
    }
    state.timerSeconds -= 1;
    const task = document.getElementById("compactTaskSubtitle");
    if (task) task.textContent = formatTimer(state.timerSeconds);
    const display = document.getElementById("timerDisplay");
    if (display) display.textContent = formatTimer(state.timerSeconds);
  }, 1000);
}

function render() {
  renderTabs();
  renderPanel();
  renderCompact();
}

function formatTimer(total) {
  const minutes = String(Math.floor(total / 60)).padStart(2, "0");
  const seconds = String(total % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function formatDateHeadline(date) {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(date);
}

function safeHost(input) {
  try {
    return new URL(input).host;
  } catch {
    return input;
  }
}

render();
