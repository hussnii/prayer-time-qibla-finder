
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
