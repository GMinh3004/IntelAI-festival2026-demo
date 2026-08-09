const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let ylog = true;

function getTime() {
    const now = new Date();

    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    return `[${hours}:${minutes}:${seconds}]`;
}

let foutput = document.getElementById("foutput");
function jsOut(smessage) {
    ylog = true;
    const time = getTime();
    foutput.value += `${getTime()} ${smessage}\n`;
    foutput.scrollTop = foutput.scrollHeight;
}

let sram = "Started KBHelper";
jsOut(sram);

let cls = document.getElementById("clear");
const cpa = document.getElementById("cpA");

cls.addEventListener("click", function () {
    foutput.value = "";
    ylog = false;
});
cpa.addEventListener("click", async function () {
    if (ylog == true) {
        await navigator.clipboard.writeText(foutput.value);
        cpa.innerText = "Copied!";
        cpa.classList.add("press");

        setTimeout(() => {
            cpa.innerText = "Copy All";
            cpa.classList.remove("press");
        }, 2000);
    } else {
        alert("No log found!?");
    }
});
