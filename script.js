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

// --- PHẦN BỔ SUNG: GIẢ LẬP XỬ LÝ LOG DÙNG ASYNC / AWAIT ---

const reqBtn = document.getElementById("requestb");
const scanBtn = document.getElementById("scanos");
const cmdInput = document.getElementById("command");

// Giả lập tính năng "Ask KBHelper"
async function processCommand() {
    const text = cmdInput.value.trim();
    if (!text) return;

    jsOut(`USER_CMD: ${text}`);
    cmdInput.value = ""; // Xóa ô nhập

    jsOut("KBHelper: Analyzing request...");
    await wait(800); // Chờ 0.8 giây cho giống thật

    if (
        text.toLowerCase().includes("net") ||
        text.toLowerCase().includes("wifi")
    ) {
        jsOut("DIAGNOSIS: Network interface wlan0 is DOWN.");
        await wait(600);
        jsOut(
            "FIX_SUGGEST: Run 'sudo ip link set wlan0 up' or restart NetworkManager.",
        );
    } else {
        jsOut(
            `DIAGNOSIS: Analyzed pattern '${text}'. System parameters nominal.`,
        );
        await wait(500);
        jsOut("SUGGESTION: No critical errors found for this entry.");
    }
}

// Giả lập tính năng "Auto find bugs"
async function autoScan() {
    jsOut("SYSTEM_SCAN: Initializing deep inspection...");
    await wait(700);
    jsOut("CHECKING: /var/log/syslog ...");
    await wait(1000);
    jsOut("WARN: Failed to bind port 80 (Address already in use).");
    await wait(800);
    jsOut(
        "RECOMMENDATION: Kill process occupying port 80 or check firewall settings.",
    );
}

// Bắt sự kiện Click
if (reqBtn) reqBtn.addEventListener("click", processCommand);
if (scanBtn) scanBtn.addEventListener("click", autoScan);

// Bắt sự kiện nhấn Enter trong ô Command
if (cmdInput) {
    cmdInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            processCommand();
        }
    });
}
