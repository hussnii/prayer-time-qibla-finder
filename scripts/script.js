/* Dark/light mode toggle */
let darkMode = localStorage.getItem("darkMode")
const themeSwitch = document.getElementById("themeSwitch")

const enableDarkMode = () =>{
    document.body.classList.add("darkMode")
    localStorage.setItem("darkMode", "active")
}

const disableDarkMode = () =>{
    document.body.classList.remove("darkMode")
    localStorage.setItem("darkMode", null)
}

if (darkMode === "active") enableDarkMode()

themeSwitch.addEventListener("click", () =>{
    darkMode = localStorage.getItem("darkMode")
    darkMode !== "active" ? enableDarkMode() : disableDarkMode() 
})



/* Responsive navigation bar toggle */
const mainMenu = document.querySelector(".mainMenu");
const closeMenu = document.querySelector(".closeMenu");
const openMenu = document.querySelector(".openMenu");

openMenu.addEventListener("click" ,show);
closeMenu.addEventListener("click" ,hideMenu);

function show(){
    mainMenu.style.display = "flex";
    mainMenu.style.top = "0";
}

function hideMenu(){
    mainMenu.style.top = "-100%";
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


// --- Placeholder UI Update Functions (Defined in other modules) ---
function updatePrayerTimes(data) {
    console.log("Updated Prayer Times:", data.data.timings);
    // Logic to display Fajr, Dhuhr, Asr, etc., goes here.
}

function updateHijriDate(data) {
    console.log("Updated Hijri Date:", data.data.date.hijri);
    // Logic to display the Hijri date goes here.
}

function updateCountdown(data) {
    console.log("Countdown data ready.");
    // Logic to start the countdown timer goes here.
}

async function getPrayerTimes() {
    if (messageArea) messageArea.textContent = '';

    const city = cityInput.value.trim();
    const country = countryInput.value.trim();

    
    if (!city || !country) {
        showWarning("Please enter both a **city** and a **country** before searching.");
        return; 
    }
    
    
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
        updatePrayerTimes(data);
        updateHijriDate(data);
        updateCountdown(data);

    } catch (error) {
        
        console.error("Network error:", error);
        showWarning("An error occurred while connecting to the API. Check your connection.");
    }
}


searchBtn.addEventListener("click", getPrayerTimes);
