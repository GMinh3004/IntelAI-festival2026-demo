const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function getTime() {
    const now = new Date();

    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    return `[${hours}:${minutes}:${seconds}]`;
}

let foutput = document.getElementById("foutput");
function jsOut(smessage) {
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
});
cpa.addEventListener("click", async function () {
    if (foutput.value != "") {
        await navigator.clipboard.writeText(foutput.value);
        cpa.innerText = "Copied!";
        cpa.style.border = "none";
        cpa.style.backgroundColor = "rgb(0, 230, 0)";
        cpa.style.color = "white";
        await wait(3000);
        cpa.innerText = "Copy All";
    } else {
        alert("No text :(");
    }
});
