/* Set Year in Footer */
document.getElementById("year").textContent = new Date().getFullYear();

/* STATIC HIJRI DATE */
document.getElementById("hijri-date").textContent = "10 Jumada al-Akhira 1447 H";

/* THEME TOGGLE */
const themeBtn = document.getElementById("theme-toggle-btn");
themeBtn.addEventListener("click", () => {
    const body = document.body;
    const current = body.getAttribute("data-theme");
    if (current === "dark") {
        body.setAttribute("data-theme", "light");
        body.style.backgroundColor = "#053132";
    } else {
        body.setAttribute("data-theme", "dark");
        body.style.backgroundColor = "#1E4646";
    }
});

/* MOBILE MENU */
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

/* CALENDAR MODAL */
const calendarBtn = document.querySelector(".calendar-btn");
const calendarModal = document.getElementById("calendar-modal");
const calendarClose = document.getElementById("calendar-close");
const calendarDaysContainer = document.getElementById("calendar-days");
const calendarMonthHeader = document.getElementById("calendar-month");

// Helper: Approximate Hijri day
function getApproxHijriDay(gregorianDay) {
    let hijriDay = (gregorianDay + 17) % 30;
    return hijriDay === 0 ? 30 : hijriDay;
}

// Render calendar for current month
function renderCalendar() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth(); // 0-11
    const day = today.getDate();
    const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    
    // Hijri month/year (static for demo)
    const hijriMonth = "Jumada al-Akhira";
    const hijriYear = 1447;

    // Header
    calendarMonthHeader.textContent = `${monthNames[month]} ${year} / ${hijriMonth} ${hijriYear} H`;

    // Days of week
    const weekDays = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    let html = "";
    weekDays.forEach(d => {
        html += `<div class="calendar-day-name">${d}</div>`;
    });

    // Days of month
    const firstDay = new Date(year, month, 1).getDay();
    const numDays = new Date(year, month + 1, 0).getDate();

    // Empty slots before 1st
    for(let i=0; i<firstDay; i++){
        html += `<div class="calendar-day empty"></div>`;
    }

    // Days
    for(let d=1; d<=numDays; d++){
        const hijriDay = getApproxHijriDay(d);
        const isToday = (d === day);
        html += `<div class="calendar-day ${isToday ? 'today' : ''}">
                    <span class="greg">${d}</span>
                    <span class="hijri">H ${hijriDay}</span>
                 </div>`;
    }

    calendarDaysContainer.innerHTML = html;
}

// Open calendar
calendarBtn.addEventListener("click", () => {
    renderCalendar();
    calendarModal.style.display = "flex";
});
calendarClose.addEventListener("click", () => {
    calendarModal.style.display = "none";
});
calendarModal.addEventListener("click", (e) => {
    if(e.target === calendarModal) calendarModal.style.display = "none";
});
