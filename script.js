/* -------------------------
    SET YEAR IN FOOTER
------------------------- */
document.getElementById("year").textContent = new Date().getFullYear();

/* -------------------------
    UPDATE GREGORIAN DATE
------------------------- */
function updateGregorianDate() {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    
    const formattedDate = `${dd}/${mm}/${yyyy}`;

    const gregDateElement = document.querySelector(".greg-date");
    if (gregDateElement) {
        gregDateElement.textContent = formattedDate;
    }
}
updateGregorianDate();

/* -------------------------
    THEME TOGGLE (WITH SAVE)
------------------------- */
const themeBtn = document.getElementById("theme-toggle-btn");
const body = document.body;

// Load saved theme
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
    body.setAttribute("data-theme", savedTheme);
    body.style.backgroundColor = savedTheme === "dark" ? "#1E4646" : "#053132";
} else {
    body.setAttribute("data-theme", "light");
}

// Toggle theme
themeBtn.addEventListener("click", () => {
    const current = body.getAttribute("data-theme");

    if (current === "dark") {
        body.setAttribute("data-theme", "light");
        body.style.backgroundColor = "#053132";
        localStorage.setItem("theme", "light");
    } else {
        body.setAttribute("data-theme", "dark");
        body.style.backgroundColor = "#1E4646";
        localStorage.setItem("theme", "dark");
    }
});

/* -------------------------
    MOBILE MENU
------------------------- */
const mobileMenu = document.getElementById("mobile-menu");
const mobileOverlay = document.getElementById("mobile-overlay");

document.getElementById("mobile-menu-open").addEventListener("click", () => {
    mobileMenu.style.display = "block";
    mobileOverlay.style.display = "block";
});

document.getElementById("mobile-menu-close").addEventListener("click", () => {
    mobileMenu.style.display = "none";
    mobileOverlay.style.display = "none";
});

mobileOverlay.addEventListener("click", () => {
    mobileMenu.style.display = "none";
    mobileOverlay.style.display = "none";
});

/* -------------------------
    CALENDAR MODAL
------------------------- */
const calendarBtn = document.querySelector(".calendar-btn");
const calendarModal = document.getElementById("calendar-modal");
const calendarClose = document.getElementById("calendar-close");
const calendarDaysContainer = document.getElementById("calendar-days");
const calendarMonthHeader = document.getElementById("calendar-month");

function renderCalendar() {
    const city = document.getElementById("city").value.trim() || localStorage.getItem("city") || 'London';
    const country = document.getElementById("country").value.trim() || localStorage.getItem("country") || 'UK';

    if (!city || !country) {
        calendarDaysContainer.innerHTML = 'Please set a city and country to view the full calendar.';
        return;
    }

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;

    calendarDaysContainer.innerHTML = 'Loading calendar...';

    fetch(`https://api.aladhan.com/v1/calendarByCity/${year}/${month}?city=${city}&country=${country}&method=2`)
        .then(res => res.json())
        .then(data => {
            if (!data.data) {
                calendarDaysContainer.innerHTML = 'Error loading calendar data.';
                return;
            }

            const monthData = data.data;
            let html = "";
            const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];

            const hijriMonthName = monthData[0].date.hijri.month.en;
            const hijriYear = monthData[0].date.hijri.year;

            calendarMonthHeader.textContent = `${monthNames[today.getMonth()]} ${year} / ${hijriMonthName} ${hijriYear} H`;

            const weekDays = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
            weekDays.forEach(d => html += `<div class="calendar-day-name">${d}</div>`);

            const firstDay = new Date(year, today.getMonth(), 1).getDay();
            for (let i = 0; i < firstDay; i++) {
                html += `<div class="calendar-day empty"></div>`;
            }

            monthData.forEach(dayInfo => {
                const gregDay = dayInfo.date.gregorian.day;
                const hijriDay = dayInfo.date.hijri.day;

                const isToday = parseInt(gregDay) === today.getDate();

                html += `
                    <div class="calendar-day ${isToday ? 'today' : ''}">
                        <span class="greg">${gregDay}</span>
                        <span class="hijri">${hijriDay} H</span>
                    </div>`;
            });

            calendarDaysContainer.innerHTML = html;
        })
        .catch(err => {
            console.error("Error fetching calendar:", err);
            calendarDaysContainer.innerHTML = 'Failed to load calendar.';
        });
}

calendarBtn.addEventListener("click", () => {
    renderCalendar();
    calendarModal.style.display = "flex";
});

calendarClose.addEventListener("click", () => calendarModal.style.display = "none");

calendarModal.addEventListener("click", e => {
    if (e.target === calendarModal) calendarModal.style.display = "none";
});

/* -------------------------
    HIJRI DATE HEADER UPDATE
------------------------- */
function updateHijriHeader(hijri) {
    const fullDate = `${hijri.day} ${hijri.month.en} ${hijri.year} H`;

    const fullDateElement = document.getElementById("hijri-date-full");
    if (fullDateElement) fullDateElement.innerText = fullDate;

    document.getElementById("hijri-date").innerText = hijri.day || "--";
    document.getElementById("hijri-weekday").innerText = hijri.weekday?.en || "--";
    document.getElementById("hijri-month").innerText = hijri.month?.en || "--";
    document.getElementById("hijri-year").innerText = hijri.year || "--";
}

/* -------------------------
    FETCH TODAY'S HIJRI DATE
------------------------- */
function fetchHijriDate() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');

    fetch(`https://api.aladhan.com/v1/gToH?date=${yyyy}-${mm}-${dd}`)
        .then(res => res.json())
        .then(data => {
            if (data.data?.hijri) {
                updateHijriHeader(data.data.hijri);
            }
        })
        .catch(err => console.error("Hijri fetch error:", err));
}
fetchHijriDate();

/* -------------------------
    PRAYER TIMES (SAVED CITY)
------------------------- */
function getPrayerTimes(city, country) {
    fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=2`)
        .then(res => res.json())
        .then(data => {
            if (!data.data?.timings) {
                alert("Invalid city/country.");
                return;
            }

            const t = data.data.timings;
            document.getElementById("fajr-time").innerText = t.Fajr;
            document.getElementById("sunrise-time").innerText = t.Sunrise;
            document.getElementById("dhuhr-time").innerText = t.Dhuhr;
            document.getElementById("asr-time").innerText = t.Asr;
            document.getElementById("maghrib-time").innerText = t.Maghrib;
            document.getElementById("isha-time").innerText = t.Isha;

            if (data.data.date?.hijri) {
                updateHijriHeader(data.data.date.hijri);
            }
        })
        .catch(err => console.error("Prayer time error:", err));
}

/* -------------------------
    CITY / COUNTRY INPUTS
------------------------- */
const getPrayerTimesBtn = document.getElementById("get-prayer-times");

getPrayerTimesBtn.addEventListener("click", () => {
    const city = document.getElementById("city").value.trim();
    const country = document.getElementById("country").value.trim();

    if (!city || !country) return alert("Please enter both city and country.");

    localStorage.setItem("city", city);
    localStorage.setItem("country", country);

    getPrayerTimes(city, country);
});

/* -------------------------
    AUTO LOAD SAVED DATA
------------------------- */
window.onload = () => {
    const savedCity = localStorage.getItem("city");
    const savedCountry = localStorage.getItem("country");

    if (savedCity && savedCountry) {
        document.getElementById("city").value = savedCity;
        document.getElementById("country").value = savedCountry;

        getPrayerTimes(savedCity, savedCountry);
    }
};
