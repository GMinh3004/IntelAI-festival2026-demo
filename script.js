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
