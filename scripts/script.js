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

