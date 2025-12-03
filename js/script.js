
let darkMode = localStorage.getItem("darkMode")
const themeSwitch = document.getElementById("themeSwitch")

const enableDarkMode = () =>{
    document.body.classList.add("darkMode")
    localStorage.setItem("darkMode", "active")
}

const disableDarkMode = () =>{
    document.body.classList.remove("darkMode")
    localStorage.removeItem("darkMode")
}

if (darkMode === "active") enableDarkMode()

if (themeSwitch) {
    themeSwitch.addEventListener("click", () =>{
        darkMode = localStorage.getItem("darkMode")
        darkMode !== "active" ? enableDarkMode() : disableDarkMode()
    })
}

/* Responsive navigation bar toggle */
const mainMenu = document.querySelector(".mainMenu");
const closeMenu = document.querySelector(".closeMenu");
const openMenu = document.querySelector(".openMenu");

if (openMenu && closeMenu) {
    openMenu.addEventListener("click", show);
    closeMenu.addEventListener("click", hideMenu);
}

function show(){
    if (mainMenu) {
        mainMenu.style.display = "flex";
        mainMenu.style.top = "0";
    }
}

function hideMenu(){
    if (mainMenu) {
        mainMenu.style.top = "-100%";
    }
}

/* -------------------------
    UPDATE GREGORIAN DATE
------------------------- */
function updateGregorianDate() {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    
    const formattedDate = `${dd}/${mm}/${yyyy}`;

    const gregDateElement = document.getElementById("greg-date-display");
    if (gregDateElement) {
        gregDateElement.textContent = formattedDate;
    }
}
updateGregorianDate();

/* -------------------------
    HIJRI DATE HEADER UPDATE
------------------------- */
function updateHijriHeader(hijri) {
    const fullDate = `${hijri.day} ${hijri.month.en} ${hijri.year} H`;

    const fullDateElement = document.getElementById("hijri-date-full");
    if (fullDateElement) fullDateElement.innerText = fullDate;

    const hijriDateEl = document.getElementById("hijri-date");
    const hijriWeekdayEl = document.getElementById("hijri-weekday");
    const hijriMonthEl = document.getElementById("hijri-month");
    const hijriYearEl = document.getElementById("hijri-year");

    if (hijriDateEl) hijriDateEl.innerText = hijri.day || "--";
    if (hijriWeekdayEl) hijriWeekdayEl.innerText = hijri.weekday?.en || "--";
    if (hijriMonthEl) hijriMonthEl.innerText = hijri.month?.en || "--";
    if (hijriYearEl) hijriYearEl.innerText = hijri.year || "--";
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
    CALENDAR MODAL
------------------------- */
const calendarBtn = document.querySelector(".calendar-btn");
const calendarModal = document.getElementById("calendar-modal");
const calendarClose = document.getElementById("calendar-close");
const calendarDaysContainer = document.getElementById("calendar-days");
const calendarMonthHeader = document.getElementById("calendar-month");

function renderCalendar() {
    const cityInput = document.getElementById("cityInput");
    const countryInput = document.getElementById("countryInput");
    
    const city = cityInput ? cityInput.value.trim() : localStorage.getItem("city") || 'London';
    const country = countryInput ? countryInput.value.trim() : localStorage.getItem("country") || 'UK';

    if (!city || !country) {
        if (calendarDaysContainer) {
            calendarDaysContainer.innerHTML = 'Please set a city and country to view the full calendar.';
        }
        return;
    }

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;

    if (calendarDaysContainer) {
        calendarDaysContainer.innerHTML = 'Loading calendar...';
    }

    fetch(`https://api.aladhan.com/v1/calendarByCity/${year}/${month}?city=${city}&country=${country}&method=2`)
        .then(res => res.json())
        .then(data => {
            if (!data.data) {
                if (calendarDaysContainer) {
                    calendarDaysContainer.innerHTML = 'Error loading calendar data.';
                }
                return;
            }

            const monthData = data.data;
            let html = "";
            const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];

            const hijriMonthName = monthData[0].date.hijri.month.en;
            const hijriYear = monthData[0].date.hijri.year;

            if (calendarMonthHeader) {
                calendarMonthHeader.textContent = `${monthNames[today.getMonth()]} ${year} / ${hijriMonthName} ${hijriYear} H`;
            }

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

            if (calendarDaysContainer) {
                calendarDaysContainer.innerHTML = html;
            }
        })
        .catch(err => {
            console.error("Error fetching calendar:", err);
            if (calendarDaysContainer) {
                calendarDaysContainer.innerHTML = 'Failed to load calendar.';
            }
        });
}

if (calendarBtn && calendarModal) {
    calendarBtn.addEventListener("click", () => {
        renderCalendar();
        calendarModal.style.display = "flex";
    });
}

if (calendarClose && calendarModal) {
    calendarClose.addEventListener("click", () => calendarModal.style.display = "none");
}

if (calendarModal) {
    calendarModal.addEventListener("click", e => {
        if (e.target === calendarModal) calendarModal.style.display = "none";
    });
}

/* Prayer time API fetching logic */
const cityInput = document.getElementById("cityInput");
const countryInput = document.getElementById("countryInput");
const searchBtn = document.getElementById("searchButton");
const messageArea = document.getElementById("messageArea");

function showWarning(message) {
    console.warn("⚠️ UI WARNING:", message);
    if (messageArea) {
        messageArea.textContent = message;
    }
}

async function getPrayerTimes() {
    if (messageArea) messageArea.textContent = '';

    const city = cityInput ? cityInput.value.trim() : '';
    const country = countryInput ? countryInput.value.trim() : '';

    if (!city || !country) {
        showWarning("Please enter both a city and a country before searching.");
        return; 
    }
    
    // Save to localStorage
    localStorage.setItem("city", city);
    localStorage.setItem("country", country);
    
    const url = `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=2`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            showWarning(`Request failed with HTTP status ${response.status}. Please try again.`);
            return;
        }
        
        const data = await response.json();

        if (data.code !== 200 || data.data === null) {
            showWarning(`City or Country not found. Please check spelling for "${city}, ${country}".`);
            return;
        }

        console.log(`API Data received successfully for: ${city}, ${country}`);
        
        // Update prayer times in the grid
        const t = data.data.timings;
        const fajrEl = document.getElementById("fajr-time");
        const sunriseEl = document.getElementById("sunrise-time");
        const dhuhrEl = document.getElementById("dhuhr-time");
        const asrEl = document.getElementById("asr-time");
        const maghribEl = document.getElementById("maghrib-time");
        const ishaEl = document.getElementById("isha-time");

        if (fajrEl) fajrEl.innerText = t.Fajr;
        if (sunriseEl) sunriseEl.innerText = t.Sunrise;
        if (dhuhrEl) dhuhrEl.innerText = t.Dhuhr;
        if (asrEl) asrEl.innerText = t.Asr;
        if (maghribEl) maghribEl.innerText = t.Maghrib;
        if (ishaEl) ishaEl.innerText = t.Isha;

        // Update Hijri date if available
        if (data.data.date?.hijri) {
            updateHijriHeader(data.data.date.hijri);
        }

    } catch (error) {
        console.error("Network error:", error);
        showWarning("An error occurred while connecting to the API. Check your connection.");
    }
}

if (searchBtn) {
    searchBtn.addEventListener("click", getPrayerTimes);
}

/* -------------------------
    AUTO LOAD SAVED DATA
------------------------- */
window.addEventListener('DOMContentLoaded', () => {
    const savedCity = localStorage.getItem("city");
    const savedCountry = localStorage.getItem("country");

    if (cityInput && countryInput) {
        if (savedCity && savedCountry) {
            cityInput.value = savedCity;
            countryInput.value = savedCountry;
        } else {
            // Set default to Addis Ababa, Ethiopia
            cityInput.value = "Addis Ababa";
            countryInput.value = "Ethiopia";
        }
        getPrayerTimes();
    }
});
