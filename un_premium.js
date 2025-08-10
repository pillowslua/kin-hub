const VERSION = "1.5";
const DELAY = 500;
var jwt, defaultHeaders, userInfo, sub;
let isRunning = false;

const initInterface = () => {
  const containerHTML = `
   <div id="_overlay"></div>
   <div id="_container" class="modern-ui">
       <div id="_header">
           <span class="back-arrow">←</span>
           <div class="header-text">
               <div class="header-title">Kin HUB Dashboard</div>
               <div class="header-subtitle">by Kinz</div>
           </div>
       </div>
       <div id="_main_content">
           <!-- DuoFarmer Info Section -->
           <div class="setting-group-label">Account Information</div>
           <div class="setting-item">
               <div class="setting-label">Username</div>
               <div class="setting-value" id="_username">Loading...</div>
           </div>
           <div class="setting-item">
               <div class="setting-label">Base Language</div>
               <div class="setting-value" id="_from">Loading...</div>
           </div>
           <div class="setting-item">
               <div class="setting-label">Learning Language</div>
               <div class="setting-value" id="_learn">Loading...</div>
           </div>
           <div class="setting-item">
               <div class="setting-label">Current Streak</div>
               <div class="setting-value" id="_streak">0</div>
           </div>
           <div class="setting-item">
               <div class="setting-label">Gems</div>
               <div class="setting-value" id="_gem">0</div>
           </div>
           <div class="setting-item">
               <div class="setting-label">Total XP</div>
               <div class="setting-value" id="_xp">0</div>
           </div>

           <!-- DuoFarmer Controls Section -->
           <div class="setting-group-label">Farming Controls</div>
           <div class="setting-item">
               <div class="setting-label">Farm Action</div>
               <select class="modern-dropdown" id="_select_option">
                   <!-- Options populated by JS -->
               </select>
           </div>
           <div class="setting-item">
               <div class="setting-label">Start/Stop</div>
               <div class="button-group">
                   <button class="modern-button" id="_start_btn">Start</button>
                   <button class="modern-button" id="_stop_btn" hidden>Stop</button>
               </div>
           </div>
           <div class="setting-item notification-area">
               <div id="_notify" class="notify-text notify-info">Ready to farm! <br>Recommended to go to blank page for max performance.</div>
           </div>

           <!-- NEW: Contacts Section -->
           <div class="setting-group-label">Contacts</div>
           <div class="setting-item">
               <div class="setting-label">Facebook</div>
               <a href="https://www.facebook.com/rollingbackyah/" target="_blank" class="contact-link">Visit Profile</a>
           </div>
           <div class="setting-item">
               <div class="setting-label">My Website</div>
               <a href="https://kinhubweb.vercel.app/" target="_blank" class="contact-link">Check Code</a>
           </div>
           <div class="setting-item">
               <div class="setting-label">Zalo</div>
               <a href="https://anotepad.com/notes/k6nheji6" target="_blank" class="contact-link">Chat Now</a>
           </div>
           <div class="setting-item">
               <div class="setting-label">Discord</div>
               <a href="https://discord.gg/m3EV55SpYw" target="_blank" class="contact-link">Join Server</a>
           </div>

           <!-- NEW: Generated User ID Section -->
           <div class="setting-group-label">User ID</div>
           <div class="setting-item">
               <div class="setting-label">ID</div>
               <div class="setting-value" id="_random_id">Fetching...</div>
           </div>

           <!-- General Settings (mimicking the image for aesthetic) - KEPT FOR REFERENCE, CAN BE REMOVED/CUSTOMIZED -->
           <!--
           <div class="setting-group-label">General Options (Placeholder)</div>
           <div class="setting-item">
               <div class="setting-label">Sample Switch</div>
               <label class="modern-switch">
                   <input type="checkbox">
                   <span class="slider round"></span>
               </label>
           </div>
           <div class="setting-item">
               <div class="setting-label">Sample Input</div>
               <input type="text" class="modern-input" value="Dynamic Input">
           </div>
           <div class="setting-item">
               <div class="setting-label">Sample Dropdown</div>
               <select class="modern-dropdown">
                   <option>Dropdown Option 1</option>
                   <option>Option 2</option>
                   <option>Option 3</option>
               </select>
           </div>
           <div class="setting-item">
               <div class="setting-label">Sample Button</div>
               <button class="modern-button">tap to Interact</button>
           </div>
           -->
       </div>
       <div class="bottom-gradient"></div>
       <div id="_footer">
           <span id="_version">Ver. ${VERSION}</span>
           <span>|</span>
           <a href="https://github.com/pillowslua" target="_blank" class="footer-link"Open Source</a>
           <span>|</span>
           <a href="https://discord.gg/m3EV55SpYw" target="_blank" class="footer-link">Report Issues</a>
       </div>
   </div>
   <!-- NEW: Kin HUB PREMIUM Button -->
   <div id="_floating_btn" class="kinhub-premium-button">Kin HUB PREMIUM</div>
   `;

  const style = document.createElement("style");
  style.innerHTML = `
    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400&display=swap'); /* For random ID */

    body {
        font-family: 'Roboto', sans-serif;
    }

    #_container {
        width: 95vw;
        max-width: 500px; /* Slightly narrower to match image aesthetics */
        height: 85vh;
        max-height: 90vh;
        background: #252525; /* Darker background */
        color: #E0E0E0;
        border-radius: 18px; /* More rounded corners */
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5); /* Deeper shadow */
        font-family: 'Roboto', sans-serif;
        display: flex;
        flex-direction: column;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 9999;
        overflow: hidden; /* Important for border-radius and gradient */
    }

    #_header {
        background: #252525;
        padding: 20px;
        display: flex;
        align-items: center;
        gap: 15px;
        border-bottom: 1px solid #333; /* Subtle separator */
    }

    .back-arrow {
        font-size: 26px;
        font-weight: 500;
        color: #FFF;
        cursor: pointer;
    }

    .header-text {
        display: flex;
        flex-direction: column;
    }

    .header-title {
        font-size: 1.6em;
        font-weight: 700;
        color: #FFF;
    }

    .header-subtitle {
        font-size: 0.9em;
        color: #B0B0B0;
        line-height: 1.3;
        margin-top: 2px;
    }

    #_main_content {
        flex: 1;
        background: #252525; /* Consistent background with header */
        padding: 0 20px 20px; /* Adjust padding for bottom gradient */
        overflow-y: auto; /* Scrollable content */
        position: relative;
        z-index: 1; /* Ensure content is above gradient */
    }

    .setting-group-label {
        color: #B0B0B0;
        font-size: 0.9em;
        margin: 20px 0 10px;
        font-weight: 500;
        text-transform: uppercase;
    }

    .setting-item {
        background: #2D2D2D; /* Card background for each setting */
        border-radius: 8px; /* Rounded corners for settings items */
        padding: 15px;
        margin-bottom: 5px; /* Slight gap between items */
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-height: 50px; /* Ensure consistent height */
        box-sizing: border-box;
    }

    .setting-item:last-child {
        margin-bottom: 0;
    }

    .setting-label {
        color: #F0F0F0;
        font-size: 1em;
        font-weight: 400;
    }

    .setting-value {
        color: #A0A0A0;
        font-size: 0.9em;
        font-weight: 500;
    }

    /* Modern Switch (Toggle) - Left for reference, not directly used in DuoFarmer logic */
    .modern-switch {
        position: relative;
        display: inline-block;
        width: 48px;
        height: 28px;
    }

    .modern-switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #555; /* Off state color */
        -webkit-transition: .4s;
        transition: .4s;
    }

    .slider:before {
        position: absolute;
        content: "";
        height: 20px;
        width: 20px;
        left: 4px;
        bottom: 4px;
        background-color: #CCC; /* Knob color */
        -webkit-transition: .4s;
        transition: .4s;
    }

    input:checked + .slider {
        background-color: #4CAF50; /* On state color (Duolingo green) */
    }

    input:focus + .slider {
        box-shadow: 0 0 1px #4CAF50;
    }

    input:checked + .slider:before {
        -webkit-transform: translateX(20px);
        -ms-transform: translateX(20px);
        transform: translateX(20px);
    }

    .slider.round {
        border-radius: 28px;
    }

    .slider.round:before {
        border-radius: 50%;
    }

    /* Modern Input */
    .modern-input {
        background: #3A3A3A;
        border: none;
        outline: none;
        padding: 10px 12px;
        border-radius: 6px;
        color: #FFF;
        font-size: 0.95em;
        text-align: right;
        min-width: 120px;
        box-sizing: border-box;
    }

    /* Modern Dropdown */
    .modern-dropdown {
        background: #3A3A3A;
        border: none;
        outline: none;
        padding: 10px 12px;
        border-radius: 6px;
        color: #FFF;
        font-size: 0.95em;
        text-align: right;
        min-width: 160px;
        appearance: none; /* Remove default arrow */
        background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23E0E0E0%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13%205.7L146.2%20202.7%2018.3%2075.1a17.6%2017.6%200%200%200-25.7%2023.1l137.9%20137.9c1.9%201.9%204.1%203.3%206.5%204.3%203.5%201.4%207.3%202.1%2011.1%202.1h.4c3.9%200%207.6-.7%2011.1-2.1%202.5-1%204.7-2.4%206.5-4.3L287%2092.6c.9-9.1-1.1-18.1-7.2-22.9z%22%2F%3E%3C%2Fsvg%3E'); /* Custom SVG arrow */
        background-repeat: no-repeat;
        background-position: right 12px center;
        background-size: 10px;
        padding-right: 30px; /* Space for the arrow */
        cursor: pointer;
        box-sizing: border-box;
    }

    /* Modern Button */
    .modern-button {
        background: #3A3A3A;
        border: none;
        outline: none;
        padding: 10px 15px;
        border-radius: 6px;
        color: #FFF;
        font-size: 0.95em;
        cursor: pointer;
        transition: background 0.2s ease;
        flex-grow: 1; /* Allow buttons in a group to expand */
        box-sizing: border-box;
    }

    .modern-button:hover {
        background: #4A4A4A;
    }

    .modern-button:active {
        background: #5A5A5A;
    }

    .button-group {
        display: flex;
        gap: 8px; /* Space between buttons */
    }

    /* Notification Area */
    .notification-area {
        background: #2D2D2D; /* Same as other setting items */
        padding: 15px;
        border-radius: 8px;
        margin-top: 10px;
        margin-bottom: 20px; /* Space from bottom gradient */
        font-size: 0.85em;
        line-height: 1.4;
        min-height: 60px; /* Ensure it's visible even with short text */
        align-items: flex-start; /* Align text to top-left */
    }
    .notify-text {
        text-align: left;
        width: 100%;
        /* Base style for text within notifications */
        color: #E0E0E0; /* Default text color, will be overridden by type-specific classes */
    }

    .notify-info {
        color: #FFD700; /* Yellow for info */
    }

    .notify-success {
        color: #4CAF50; /* Green for success */
    }

    .notify-error {
        color: #F44336; /* Red for error */
    }

    /* NEW: Contact Links */
    .contact-link {
        color: #7B8CFF; /* A distinct blue/purple for links */
        text-decoration: none;
        font-size: 0.9em;
        font-weight: 500;
        transition: color 0.2s ease;
    }

    .contact-link:hover {
        color: #A0B0FF;
    }

    /* NEW: Random ID Display */
    #_random_id {
        color: #00BCD4; /* Cyan color for the generated ID */
        font-weight: bold;
        font-size: 0.9em;
        font-family: 'Roboto Mono', monospace; /* Monospace for ID */
    }

    /* Bottom red gradient */
    .bottom-gradient {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 100px; /* Height of the gradient area */
        background: linear-gradient(to top, rgba(139, 0, 0, 0.4) 0%, rgba(139, 0, 0, 0) 100%); /* Dark red gradient */
        pointer-events: none; /* Allows clicks to pass through to content below */
        z-index: 2; /* Above content but below footer */
    }

    #_footer {
        background: #252525;
        padding: 15px 20px;
        display: flex;
        justify-content: center; /* Center content */
        align-items: center;
        gap: 10px;
        font-size: 0.85em;
        color: #A0A0A0;
        border-top: 1px solid #333;
        position: relative; /* For z-index to be above gradient */
        z-index: 3;
    }

    .footer-link {
        color: #A0A0A0;
        text-decoration: none;
        transition: color 0.2s ease;
    }
    .footer-link:hover {
        color: #FFF;
    }

    #_overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0,0,0,0.7); /* Slightly lighter overlay */
        z-index: 9998;
        pointer-events: all;
    }

    /* NEW: Kin HUB PREMIUM Button Style */
    .kinhub-premium-button {
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: auto; /* Auto width based on content */
        padding: 15px 25px; /* More padding for text */
        height: auto;
        background: linear-gradient(145deg, #673AB7, #512DA8); /* Deep purple gradient */
        border-radius: 12px; /* Slightly more rounded rectangle */
        box-shadow: 0 8px 30px rgba(0,0,0,0.6), 0 0 15px rgba(103, 58, 183, 0.4); /* Deeper shadow and a purple glow */
        z-index: 10000;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2em; /* Readable text size */
        font-weight: bold;
        color: #FFF;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        transition: all 0.2s ease;
    }

    .kinhub-premium-button:hover {
        background: linear-gradient(145deg, #7E57C2, #673AB7);
        box-shadow: 0 10px 35px rgba(0,0,0,0.7), 0 0 20px rgba(126, 87, 194, 0.6);
        transform: translateY(-2px); /* Slight lift on hover */
    }

    .hidden{
        display: none;
    }

    /* Styles for disabled buttons/inputs in modern UI */
    .modern-button[disabled], ._disable_btn {
        background: #4A4A4A !important;
        color: #999 !important;
        cursor: not-allowed !important;
        box-shadow: none !important;
    }
    .modern-dropdown[disabled], .modern-input[disabled] {
        background: #4A4A4A !important;
        color: #999 !important;
        cursor: not-allowed !important;
    }
    `;
  document.head.appendChild(style);

  const container = document.createElement("div");
  container.innerHTML = containerHTML;
  document.body.appendChild(container);

  // Load fonts
  const fontRobotoLink = document.createElement("link");
  fontRobotoLink.href = "https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap";
  fontRobotoLink.rel = "stylesheet";
  document.head.appendChild(fontRobotoLink);

  const fontMonoLink = document.createElement("link");
  fontMonoLink.href = "https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400&display=swap";
  fontMonoLink.rel = "stylesheet";
  document.head.appendChild(fontMonoLink);
};

const setInterfaceVisible = (visible) => {
  const container = document.getElementById("_container");
  const overlay = document.getElementById("_overlay");
  if (container) container.style.display = visible ? "flex" : "none";
  if (overlay) overlay.style.display = visible ? "block" : "none";
};

const isInterfaceVisible = () => {
  const container = document.getElementById("_container");
  return container && container.style.display !== "none" && container.style.display !== "";
};

const toggleInterface = () => {
  setInterfaceVisible(!isInterfaceVisible());
};

const addEventFloatingBtn = () => {
  const floatingBtn = document.getElementById("_floating_btn");
  const startBtn = document.getElementById("_start_btn");
  const stopBtn = document.getElementById("_stop_btn");
  const select = document.getElementById("_select_option");

  if (!floatingBtn) return;

  floatingBtn.addEventListener("click", () => {
    if (isRunning) {
      if (confirm("DuoFarmer is farming. Do you want to stop and hide UI?")) {
        isRunning = false;
        if (stopBtn) stopBtn.hidden = true;
        if (startBtn) {
          startBtn.hidden = false;
          startBtn.disabled = true;
          startBtn.classList.add("_disable_btn");
        }
        if (select) select.disabled = false;
        setTimeout(() => {
          if (startBtn) startBtn.classList.remove("_disable_btn");
          if (startBtn) startBtn.disabled = false;
        }, 2000);
        setInterfaceVisible(false);
        return;
      } else {
        return;
      }
    }
    setInterfaceVisible(!isInterfaceVisible());
  });
};

const addEventStartBtn = () => {
  const startBtn = document.getElementById("_start_btn");
  const stopBtn = document.getElementById("_stop_btn");
  const select = document.getElementById("_select_option");

  if (!startBtn) return;

  startBtn.addEventListener("click", async () => {
    isRunning = true;
    startBtn.hidden = true;
    if (stopBtn) {
        stopBtn.hidden = false;
        stopBtn.disabled = true;
        stopBtn.classList.add("_disable_btn");
    }
    if (select) select.disabled = true;

    const selected = select.options[select.selectedIndex];
    const optionData = {
      type: selected.getAttribute("data-type"),
      amount: Number(selected.getAttribute("data-amount")),
      from: selected.getAttribute("data-from"),
      learn: selected.getAttribute("data-learn"),
      value: selected.value,
      label: selected.textContent,
    };
    await farmSelectedOption(optionData);

    setTimeout(() => {
      if (stopBtn) stopBtn.classList.remove("_disable_btn");
      if (stopBtn) stopBtn.disabled = false;
    }, 2000);
  });
};

const addEventStopBtn = () => {
  const startBtn = document.getElementById("_start_btn");
  const stopBtn = document.getElementById("_stop_btn");
  const select = document.getElementById("_select_option");

  if (!stopBtn) return;

  stopBtn.addEventListener("click", () => {
    isRunning = false;
    stopBtn.hidden = true;
    if (startBtn) {
        startBtn.hidden = false;
        startBtn.disabled = true;
        startBtn.classList.add("_disable_btn");
    }
    if (select) select.disabled = false;
    setTimeout(() => {
      if (startBtn) startBtn.classList.remove("_disable_btn");
      if (startBtn) startBtn.disabled = false;
    }, 2000);
  });
};

const addEventVersionLink = () => {
  const versionElement = document.getElementById("_version");
  if (!versionElement) return;
  versionElement.addEventListener("click", () => {
    prompt("Your JWT token: ", jwt);
  });
};

const addEventListeners = () => {
  addEventFloatingBtn();
  addEventStartBtn();
  addEventStopBtn();
  addEventVersionLink();
};

const populateOptions = () => {
  const select = document.getElementById("_select_option");
  if (!select) return;
  select.innerHTML = "";
  const fromLang = userInfo?.fromLanguage || "ru";
  const learnLang = userInfo?.learningLanguage || "en";
  const options = [
    { type: "gem", label: `Gems Farming`, value: `gem-30`, amount: 30 },
    {
      type: "xp",
      label: `XP Farming`,
      value: `xp-499`,
      amount: 499,
      from: fromLang,
      learn: "en",
    },
    {
      type: "streak",
      label: `Streaks Restoring`,
      value: `repair`,
    },
    {
      type: "streak",
      label: `Streaks Farming`,
      value: `farm`,
    },
  ];
  options.forEach((opt) => {
    const option = document.createElement("option");
    option.value = opt.value;
    option.textContent = opt.label;
    option.setAttribute("data-type", opt.type);
    option.setAttribute("data-amount", opt.amount);
    option.setAttribute("data-from", opt.from);
    option.setAttribute("data-learn", opt.learn);
    select.appendChild(option);
  });
};

// NEW: Updated updateNotify function with 'type'
const updateNotify = (message, type = 'info') => {
  const notify = document.getElementById("_notify");
  if (!notify) return;
  const now = new Date().toLocaleTimeString();

  // Reset classes first
  notify.classList.remove('notify-info', 'notify-success', 'notify-error');
  // Add appropriate class based on type
  notify.classList.add(`notify-${type}`);

  notify.innerHTML = `[${now}] ${message}`;
};

const disableInterface = (notifyMsg = "", notifyType = 'info') => {
  const startBtn = document.getElementById("_start_btn");
  const stopBtn = document.getElementById("_stop_btn");
  const select = document.getElementById("_select_option");

  if (startBtn) {
      startBtn.disabled = true;
      startBtn.classList.add("_disable_btn");
  }
  if (stopBtn) {
      stopBtn.disabled = true;
      stopBtn.classList.add("_disable_btn");
  }
  if (select) {
      select.disabled = true;
  }

  if (notifyMsg) {
    updateNotify(notifyMsg, notifyType); // Use updated notify function
  }
};

const resetStartStopBtn = () => {
  isRunning = false;
  const startBtn = document.getElementById("_start_btn");
  const stopBtn = document.getElementById("_stop_btn");
  const select = document.getElementById("_select_option");

  if (stopBtn) stopBtn.hidden = true;
  if (startBtn) {
      startBtn.hidden = false;
      startBtn.disabled = true;
      startBtn.classList.add("_disable_btn");
  }
  if (select) select.disabled = false;

  setTimeout(() => {
    if (startBtn) startBtn.classList.remove("_disable_btn");
    if (startBtn) startBtn.disabled = false;
  }, 2000);
};

const blockStopBtn = () => {
  const stopBtn = document.getElementById("_stop_btn");
  if (stopBtn) {
      stopBtn.disabled = true;
      stopBtn.classList.add("_disable_btn");
  }
};

const unblockStopBtn = () => {
  const stopBtn = document.getElementById("_stop_btn");
  if (stopBtn) {
      stopBtn.disabled = false;
      stopBtn.classList.remove("_disable_btn");
  }
};

//--------------------Logic - (Không đổi)--------------------//

const getJwtToken = () => {
  var cookies = document.cookie.split(";");
  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i].trim();
    if (cookie.startsWith("jwt_token=")) {
      return cookie.substring("jwt_token=".length);
    }
  }
  return null;
};

const decodeJwtToken = (token) => {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  return JSON.parse(jsonPayload);
};

const formatHeaders = (jwt) => ({
  "Content-Type": "application/json",
  Authorization: "Bearer " + jwt,
  "User-Agent": navigator.userAgent,
});

const getUserInfo = async (sub) => {
  const userInfoUrl = `https://www.duolingo.com/2017-06-30/users/${sub}?fields=id,username,fromLanguage,learningLanguage,streak,totalXp,level,numFollowers,numFollowing,gems,creationDate,streakData`;
  let response = await fetch(userInfoUrl, {
    method: "GET",
    headers: defaultHeaders,
  });
  return await response.json();
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const updateUserInfo = () => {
  const username = document.getElementById("_username");
  const from = document.getElementById("_from");
  const learn = document.getElementById("_learn");
  const streak = document.getElementById("_streak");
  const gem = document.getElementById("_gem");
  const xp = document.getElementById("_xp");

  if (userInfo) {
      if (username) username.innerText = userInfo.username;
      if (from) from.innerText = userInfo.fromLanguage;
      if (learn) learn.innerText = userInfo.learningLanguage;
      if (streak) streak.innerText = userInfo.streak;
      if (gem) gem.innerText = userInfo.gems;
      if (xp) xp.innerText = userInfo.totalXp;
  }
};

const toTimestamp = (dateStr) => {
  return Math.floor(new Date(dateStr).getTime() / 1000);
};

const daysBetween = (startTimestamp, endTimestamp) => {
  return Math.floor((endTimestamp - startTimestamp) / (60 * 60 * 24));
};

const sendRequest = async ({ url, payload, headers, method = "PUT" }) => {
  try {
    const res = await fetch(url, {
      method,
      headers,
      body: payload ? JSON.stringify(payload) : undefined,
    });
    return res;
  } catch (error) {
    return error;
  }
};

const sendRequestWithDefaultHeaders = async ({
  url,
  payload,
  headers = {},
  method = "GET",
}) => {
  const mergedHeaders = { ...defaultHeaders, ...headers };
  return sendRequest({ url, payload, headers: mergedHeaders, method });
};

const farmGemOnce = async () => {
  const idReward =
    "SKILL_COMPLETION_BALANCED-dd2495f4_d44e_3fc3_8ac8_94e2191506f0-2-GEMS";
  const patchUrl = `https://www.duolingo.com/2017-06-30/users/${sub}/rewards/${idReward}`;
  const patchData = {
    consumed: true,
    learningLanguage: userInfo.learningLanguage,
    fromLanguage: userInfo.fromLanguage,
  };
  return await sendRequestWithDefaultHeaders({
    url: patchUrl,
    payload: patchData,
    method: "PATCH",
  });
};

const farmGemLoop = async () => {
  const gemFarmed = 30;
  while (isRunning) {
    try {
      await farmGemOnce();
      userInfo = { ...userInfo, gems: userInfo.gems + gemFarmed };
      updateNotify(`You got ${gemFarmed} gem!!!`, 'success'); // Success notify
      updateUserInfo();
      await delay(DELAY);
    } catch (error) {
      updateNotify(
        `Error ${error.status}! Please report to our developers ( Contacts )!`, 'error' // Error notify
      );
      await delay(DELAY + 1000);
    }
  }
};

const farmXpOnce = async (amount) => {
  const startTime = Math.floor(Date.now() / 1000);
  const fromLanguage = userInfo.fromLanguage;
  const completeUrl = `https://stories.duolingo.com/api2/stories/en-${fromLanguage}-the-passport/complete`;
  const payload = {
    awardXp: true,
    isFeaturedStoryInPracticeHub: false,
    completedBonusChallenge: true,
    mode: "READ",
    isV2Redo: false,
    isV2Story: false,
    isLegendaryMode: true,
    masterVersion: false,
    maxScore: 0,
    numHintsUsed: 0,
    score: 0,
    startTime: startTime,
    fromLanguage: fromLanguage,
    learningLanguage: "en",
    hasXpBoost: false,
    happyHourBonusXp: 449,
  };
  return await sendRequestWithDefaultHeaders({
    url: completeUrl,
    payload: payload,
    headers: defaultHeaders,
    method: "POST",
  });
};

const farmXpLoop = async (amount) => {
  while (isRunning) {
    try {
      const response = await farmXpOnce(amount);
      if (response.status == 500) {
        updateNotify(
          "Make sure you are on English course (learning lang must be EN)!", 'error'
        );
        await delay(DELAY + 1000);
        continue;
      }
      const responseData = await response.json();
      const xpFarmed = responseData?.awardedXp || 0;
      userInfo = { ...userInfo, totalXp: userInfo.totalXp + xpFarmed };
      updateNotify(`You got ${xpFarmed} XP!!!`, 'success'); // Success notify
      updateUserInfo();
      await delay(DELAY);
    } catch (error) {
      updateNotify(
        `Error ${error.status}! Please record screen and report in telegram group!`, 'error'
      );
      await delay(DELAY + 1000);
    }
  }
};

const farmSessionOnce = async (startTime, endTime) => {
  const sessionPayload = {
    challengeTypes: [
      "assist",
      "characterIntro",
      "characterMatch",
      "characterPuzzle",
      "characterSelect",
      "characterTrace",
      "characterWrite",
      "completeReverseTranslation",
      "definition",
      "dialogue",
      "extendedMatch",
      "extendedListenMatch",
      "form",
      "freeResponse",
      "gapFill",
      "judge",
      "listen",
      "listenComplete",
      "listenMatch",
      "match",
      "name",
      "listenComprehension",
      "listenIsolation",
      "listenSpeak",
      "listenTap",
      "orderTapComplete",
      "partialListen",
      "partialReverseTranslate",
      "patternTapComplete",
      "radioBinary",
      "radioImageSelect",
      "radioListenMatch",
      "radioListenRecognize",
      "radioSelect",
      "readComprehension",
      "reverseAssist",
      "sameDifferent",
      "select",
      "selectPronunciation",
      "selectTranscription",
      "svgPuzzle",
      "syllableTap",
      "syllableListenTap",
      "speak",
      "tapCloze",
      "tapClozeTable",
      "tapComplete",
      "tapCompleteTable",
      "tapDescribe",
      "translate",
      "transliterate",
      "transliterationAssist",
      "typeCloze",
      "typeClozeTable",
      "typeComplete",
      "typeCompleteTable",
      "writeComprehension",
    ],
    fromLanguage: userInfo.fromLanguage,
    isFinalLevel: false,
    isV2: true,
    juicy: true,
    learningLanguage: userInfo.learningLanguage,
    smartTipsVersion: 2,
    type: "GLOBAL_PRACTICE",
  };
  const sessionRes = await sendRequestWithDefaultHeaders({
    url: "https://www.duolingo.com/2017-06-30/sessions",
    payload: sessionPayload,
    method: "POST",
  });
  const sessionData = await sessionRes.json();

  const updateSessionPayload = {
    ...sessionData,
    heartsLeft: 0,
    startTime: startTime,
    enableBonusPoints: false,
    endTime: endTime,
    failed: false,
    maxInLessonStreak: 9,
    shouldLearnThings: true,
  };
  const updateRes = await sendRequestWithDefaultHeaders({
    url: `https://www.duolingo.com/2017-06-30/sessions/${sessionData.id}`,
    payload: updateSessionPayload,
    method: "PUT",
  });
  return await updateRes.json();
};

const repairStreak = async () => {
  blockStopBtn();
  try {
    if(!userInfo.streakData.currentStreak) {
      updateNotify("You have no streak! Abort!", 'info');
      resetStartStopBtn();
      return;
    }

    const startStreakDate = userInfo.streakData.currentStreak.startDate;
    const endStreakDate = userInfo.streakData.currentStreak.endDate;

    const startStreakTimestamp = toTimestamp(startStreakDate);
    const endStreakTimestamp = toTimestamp(endStreakDate);
    const expectedStreak = daysBetween(startStreakTimestamp, endStreakTimestamp) + 1;

    if (expectedStreak > userInfo.streak) {
      updateNotify("Your streak is frozen somewhere! Repairing...", 'info');
      await delay(2000);

      let currentTimestamp = Math.floor(Date.now() / 1000);
      for (let i = 0; i < expectedStreak; i++) {
        await farmSessionOnce(
          currentTimestamp,
          currentTimestamp + 60
        );
        currentTimestamp -= 86400;
        updateNotify(
          `Trying to repair streak ( ${i + 1}/${expectedStreak})...`, 'info'
        );
        await delay(DELAY);
      }

      const userAfterRepair = await getUserInfo(sub);
      if (userAfterRepair.streak > userInfo.streak) {
        updateNotify(`Your streak has been repaired! No more frozen streak!`, 'success');
        userInfo = userAfterRepair;
        updateUserInfo();
      } else {
        updateNotify(
          `Streak repair failed or no frozen streak! Please check your account!`, 'error'
        );
      }
    } else {
      updateNotify("You have no frozen streak! No need to repair!", 'info');
      resetStartStopBtn();
      return;
    }
  } catch (error) {
     updateNotify(`Error during streak repair: ${error?.message || error}. Please report!`, 'error');
  } finally {
    unblockStopBtn();
  }
};

const farmStreakLoop = async () => {
  const hasStreak = !!userInfo.streakData.currentStreak;
  const startStreakDate = hasStreak
    ? userInfo.streakData.currentStreak.startDate
    : new Date().toISOString().split('T')[0];

  let currentTimestamp = hasStreak
    ? toTimestamp(startStreakDate) - 86400
    : Math.floor(Date.now() / 1000);

  while (isRunning) {
    try {
      const sessionRes = await farmSessionOnce(currentTimestamp, currentTimestamp + 60);
      if (sessionRes && sessionRes.id) {
        currentTimestamp -= 86400;
        const updatedUser = await getUserInfo(sub);
        userInfo = updatedUser;
        updateNotify(`You got +1 streak! Current streak: ${userInfo.streak}`, 'success');
        updateUserInfo();
        await delay(DELAY);
      } else {
        updateNotify("Failed to farm streak session, I'm trying again...", 'error');
        await delay(2000);
        continue;
      }
    } catch (error) {
      updateNotify(`Error in farmStreak: ${error?.message || error}`, 'error');
      await delay(2000);
      continue;
    }
  }
}

const farmSelectedOption = async (option) => {
  const { type, value, amount } = option;

  switch (type) {
    case "gem":
      farmGemLoop();
      break;
    case "xp":
      farmXpLoop(amount);
      break;
    case "streak":
      if (value == "repair") {
        await repairStreak();
      } else if (value == "farm") {
        farmStreakLoop();
      }
      break;
  }
};

// NEW: Function to fetch random ID from GitHub
const fetchRandomIdFromGithub = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        const lines = text.split('\n').filter(line => line.trim() !== ''); // Split by new line and filter empty lines
        if (lines.length > 0) {
            const randomIndex = Math.floor(Math.random() * lines.length);
            return lines[randomIndex].trim();
        }
        return "N/A - No IDs found.";
    } catch (error) {
        console.error("Error fetching random ID:", error);
        return `Error: ${error.message}`;
    }
};


const initVariables = async () => {
  jwt = getJwtToken();
  if (!jwt) {
    disableInterface("Please login to Duolingo and reload!", 'error'); // Use error type
    return;
  }
  defaultHeaders = formatHeaders(jwt);
  const decodedJwt = decodeJwtToken(jwt);
  sub = decodedJwt.sub;
  userInfo = await getUserInfo(sub);
  populateOptions();

  // Fetch and display random ID
  const randomIdElement = document.getElementById("_random_id");
  if (randomIdElement) {
      // !!! THAY THẾ LINK NÀY BẰNG LINK RAW GITHUB CỦA BRO (VD: gist hoặc file trong repo) !!!
      // Ví dụ: https://raw.githubusercontent.com/tuanhaideptrai/your-repo/main/your-ids.txt
      const githubRawUrl = "https://raw.githubusercontent.com/pillowslua/kin-hub/refs/heads/main/keys"; // Đây là link mẫu, bro có thể tự tạo file ids.txt của mình trên GitHub
      randomIdElement.innerText = await fetchRandomIdFromGithub(githubRawUrl);
      if (randomIdElement.innerText.startsWith("Error")) {
          randomIdElement.style.color = "#F44336"; // Red color for error in ID display
      }
  }
};

//--------------------Main--------------------//

(async () => {
  initInterface();
  setInterfaceVisible(false); // Hide by default
  await initVariables(); // Get user info and random ID before updating UI
  updateUserInfo(); // Update UI elements with user info
  addEventListeners(); // Add listeners after elements are populated
})();
