document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('darkModeToggle');
    toggle.addEventListener('click', () => {
        document.body.classList.toggle('darkMode');
        toggle.textContent = document.body.classList.contains('darkMode') ? "☀️" : "🌙";
    });

    const latitude = 9.03;
    const longitude = 38.74;
    const method = 2;

    const motivationalTexts = [
        "Prayer is your connection to peace and guidance.",
        "Keep your heart focused and your soul strong.",
        "A moment of prayer can change your entire day.",
        "Seek Allah's mercy, it is never too late.",
        "Every prayer is a step closer to inner calm."
    ];

    async function getPrayerTimes() {
        const url = `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=${method}`;
        const response = await fetch(url);
        const data = await response.json();
        return data.data.timings;
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
                const lastIndex = order.indexOf(name) === 0 ? 4 : order.indexOf(name) - 1;
                const lastPrayer = order[lastIndex];
                return { next: { name, date: prayerDate }, last: lastPrayer };
            }
        }
        const tomorrowFajr = convertToDate(prayerTimes.Fajr);
        tomorrowFajr.setDate(tomorrowFajr.getDate() + 1);
        return { next: { name: "Fajr", date: tomorrowFajr }, last: "Isha" };
    }

    function formatCountdown(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;
    }

    function updateRightBoxText() {
        const motivationEl = document.getElementById("upcomingPrayer"); // You can also create a separate span with id="motivationText"
        motivationEl.innerText = motivationalTexts[Math.floor(Math.random() * motivationalTexts.length)];
    }

    async function updateCountdown() {
        const prayerTimes = await getPrayerTimes();
        if (!prayerTimes) return;

        const now = new Date();
        const { next, last } = getNextPrayer(prayerTimes, now);
        const remaining = next.date - now;

        const countdownEl = document.getElementById("countdown");
        const nextEl = document.getElementById("next");

        if (remaining <= 0) {
            countdownEl.innerText = "00:00:00";
            nextEl.innerText = `Time for ${next.name}!`;
            updateRightBoxText(); // Update motivational text when countdown hits 0
        } else {
            countdownEl.innerText = formatCountdown(remaining);
            nextEl.innerText = `Time left to ${next.name}`;
        }

        document.getElementById("lastPrayer").innerText = `Last Prayer: ${last}`;
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
});
