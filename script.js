const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let ylog = true;
let printing = false;

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
let kchat = document.getElementById("kchat");
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
        cpa.innerText = "Copied all!";
        cpa.classList.add("press");

        setTimeout(() => {
            cpa.innerText = "Copy All";
            cpa.classList.remove("press");
        }, 2000);
    } else {
        alert("No log found!?");
    }
});

// ai
const reqBtn = document.getElementById("requestb");
const scanBtn = document.getElementById("scanos");
const cmdinp = document.getElementById("command");

async function processCommand() {
    const text = cmdinp.value.trim();
    if (!text) return; // Kiểm tra trước: Nếu ô trống thì dừng luôn, không làm gì cả

    if (printing == false) {
        printing = true;

        scanBtn.style.backgroundColor = "gray";
        scanBtn.style.cursor = "not-allowed";

        const gettxt = text.toLowerCase();

        jsOut(`USER_CMD: ${text}`);
        cmdinp.value = ""; // Xóa ô nhập

        jsOut("KBHelper: Analyzing request...");
        await wait(800);

        const installMatch = gettxt.match(
            /(?:install|download|tải|cài đặt|cài)\s+([a-z0-9\-_]+)/i,
        );

        if (installMatch && installMatch[1]) {
            const packageName = installMatch[1];

            jsOut(
                `DIAGNOSIS: Intent detected -> Software Installation [Package: '${packageName}']`,
            );
            await wait(600);
            jsOut(
                `KFixit: Run 'sudo apt update && sudo apt install -y ${packageName}'`,
            );
        } else if (
            text.toLowerCase().includes("net") ||
            text.toLowerCase().includes("wifi")
        ) {
            jsOut("DIAGNOSIS: Network interface wlan0 is DOWN.");
            await wait(600);
            jsOut(
                "KFixit: Run 'sudo ip link set wlan0 up' or restart NetworkManager.",
            );
        } else {
            jsOut(
                `DIAGNOSIS: Analyzed pattern '${text}'. System parameters nominal.`,
            );
            await wait(500);
            jsOut("SUGGESTION: No critical errors found for this entry.");
        }
        printing = false;
        scanBtn.style.cursor = "pointer";
        scanBtn.style.backgroundColor = "rgb(102, 179, 255)";
    }
}
// Auto scan
async function autoScan() {
    if (printing == false) {
        printing = true;
        reqBtn.style.backgroundColor = "gray";
        reqBtn.style.cursor = "not-allowed";
        jsOut("SYSTEM_SCAN: Initializing deep inspection...");
        await wait(700);
        jsOut("CHECKING: /var/log/syslog ...");
        await wait(1000);
        jsOut("WARN: Failed to bind port 80 (Address already in use).");
        await wait(800);
        jsOut(
            "KFixit: Kill process occupying port 80 or check firewall settings.",
        );
        printing = false;
        reqBtn.style.cursor = "pointer";
        reqBtn.style.backgroundColor = "rgb(102, 179, 255)";
    }
}

// Click
if (reqBtn) reqBtn.addEventListener("click", processCommand);
if (scanBtn) scanBtn.addEventListener("click", autoScan);

// Bắt sự kiện nhấn Enter trong ô Command
if (cmdinp) {
    cmdinp.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            processCommand();
        }
    });
}


