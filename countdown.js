document.addEventListener('DOMContentLoaded', () => {

    const toggle = document.getElementById('darkModeToggle');
    toggle.addEventListener('click', () => {
        document.body.classList.toggle('darkMode');
        if(document.body.classList.contains('darkMode')){
            toggle.textContent = "☀️"; 
        } else {
            toggle.textContent = "🌙"; 
        }
    })});
const latitude = 9.03; 
const longitude = 38.74; 
const method = 2; 

async function getPrayerTimes() {
    try {
        const url = `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=${method}`;
        const response = await fetch(url);
        const data = await response.json();
        return data.data.timings;
    } catch (err) {
        console.error("Error fetching prayer times:", err);
        return null;
    }
}

function convertToDate(timeStr) {
    const [hour, minute] = timeStr.split(":").map(Number);
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0);
}
function getNextPrayer(prayerTimes, currentTime) {
    const order = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
    for (const name of order) {
        const prayerDate = convertToDate(prayerTimes[name]);
        if (prayerDate > currentTime) {
            return { name, date: prayerDate };
        }
    }
    const tomorrowFajr = convertToDate(prayerTimes.Fajr);
    tomorrowFajr.setDate(tomorrowFajr.getDate() + 1);
    return { name: "Fajr", date: tomorrowFajr };
}

function formatCountdown(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;
}
async function updateCountdown() {
    const prayerTimes = await getPrayerTimes();
    if (!prayerTimes) return;

    const now = new Date();

    const nextPrayer = getNextPrayer(prayerTimes, now);
    const remaining = nextPrayer.date - now;

    document.getElementById("countdown").innerText = formatCountdown(remaining);
    document.getElementById("next").innerText = `time left to ${nextPrayer.name}`;
}


updateCountdown();
setInterval(updateCountdown, 1000);
const toggle = document.getElementById("toggle");

toggle.addEventListener("click", () => {
    document.body.classList.toggle("darkMode");

    // Change button emoji
    toggle.textContent = 
        document.body.classList.contains("darkMode") ? "☀️" : "🌙";
});

const fajir = document.getElementById("fajir");
const dhuhr = document.getElementById("dhuhr");
const asr = document.getElementById("asr");
const maghrib = document.getElementById("maghrib");
const isha = document.getElementById("isha");

const prayertext1 = document.getElementById("prayertext1");
const prayertext2 = document.getElementById("prayertext2");
const prayertext3 = document.getElementById("prayertext3");
const prayertext4 = document.getElementById("prayertext4");
const prayertext5 = documecnt.getElementById("prayertext5");

function saveStatus() {
  const status = {
    fajir: fajir.checked,
    dhuhr: dhuhr.checked,
    asr: asr.checked,
    maghrib: maghrib.checked,
    isha: isha.checked,
    date: new Date().toDateString()
  };
  localStorage.setItem("prayerStatus", JSON.stringify(status));
}

function resetAll() {
  fajir.checked = false;
  dhuhr.checked = false;
  asr.checked = false;
  maghrib.checked = false;
  isha.checked = false;

  prayertext1.textContent = "";
  prayertext2.textContent = "";
  prayertext3.textContent = "";
  prayertext4.textContent = "";
  prayertext5.textContent = "";

  saveStatus();
}

function loadStatus() {
  const saved = JSON.parse(localStorage.getItem("prayerStatus"));
  const today = new Date().toDateString();

  if (!saved || saved.date !== today) {
    resetAll(); 
    return;
  }
  fajir.checked = saved.fajir;
  dhuhr.checked = saved.dhuhr;
  asr.checked = saved.asr;
  maghrib.checked = saved.maghrib;
  isha.checked = saved.isha;
}
function setupListeners() {
  fajir.addEventListener("change", () => {
    prayertext1.textContent = fajir.checked
      ? "Fajr completed —MashaAllah!"
      : "";
    saveStatus();
  });

  dhuhr.addEventListener("change", () => {
    prayertext2.textContent = dhuhr.checked
      ? "Dhuhr completed —MashaAllah!"
      : "";
    saveStatus();
  });

  asr.addEventListener("change", () => {
    prayertext3.textContent = asr.checked
      ? "Asr completed — MashaAllah!"
      : "";
    saveStatus();
  });

  maghrib.addEventListener("change", () => {
    prayertext4.textContent = maghrib.checked
      ? "Maghrib completed — MashaAllah!"
      : "";
    saveStatus();
  });

  isha.addEventListener("change", () => {
    prayertext5.textContent = isha.checked
      ? " Isha completed — MashaAllah!"
      : "";
    saveStatus();
  });
}

loadStatus();
setupListeners();
function checkMidnight() {
  const saved = JSON.parse(localStorage.getItem("prayerStatus"));
  const today = new Date().toDateString();

  if (!saved || saved.date !== today) {
    resetAll();
  }
}

setInterval(checkMidnight, 30000);
