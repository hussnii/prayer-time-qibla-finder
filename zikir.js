let count = 0;
const increase = document.getElementById("increase");
const decrease = document.getElementById("decrease");
const reset = document.getElementById("reset");
const counter = document.getElementById("counter");
const countertext = document.getElementById("countertext");

if (localStorage.getItem("zikirCount")) {
    count = parseInt(localStorage.getItem("zikirCount"));
    counter.textContent = count;
}

increase.onclick = function () {
    count++;
    counter.textContent = count;
    localStorage.setItem("zikirCount", count);
}

decrease.onclick = function () {
    if (count > 0) count--;
    counter.textContent = count;
    localStorage.setItem("zikirCount", count);
}


reset.onclick = function () {
    count = 0;
    counter.textContent = count;
    localStorage.setItem("zikirCount", count);
}


const toggle = document.getElementById("toggle");

toggle.addEventListener("click", () => {
    document.body.classList.toggle("darkMode");
    toggle.textContent =
        document.body.classList.contains("darkMode") ? "☀️" : "🌙";
});
