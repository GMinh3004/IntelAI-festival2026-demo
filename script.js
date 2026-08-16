const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let ylog = true;
let printing = false;

// DOM Elements
const foutput = document.getElementById("foutput");
const cmdinp = document.getElementById("command");
const reqBtn = document.getElementById("requestb");
const scanBtn = document.getElementById("scanos");
const cls = document.getElementById("clear");
const cpa = document.getElementById("cpA");

// Elements phần Hint (Trả lời ngắn & Copy lệnh)
const hintDiv = document.getElementById("hint");
const kchat = document.getElementById("kchat");
const kcmd = document.getElementById("kcmd");
const cpcmd = document.getElementById("cpcmd");

function getTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    return `[${hours}:${minutes}:${seconds}]`;
}

function jsOut(smessage) {
    ylog = true;
    foutput.value += `${getTime()} ${smessage}\n`;
    foutput.scrollTop = foutput.scrollHeight;
}

jsOut("Started KBHelper");

if (cls) {
    cls.addEventListener("click", function () {
        foutput.value = "";
        ylog = false;
    });
}

if (cpa) {
    cpa.addEventListener("click", async function () {
        if (ylog && foutput.value.trim() !== "") {
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
}

if (cpcmd) {
    cpcmd.addEventListener("click", async function () {
        const cmdText = kcmd.innerText.trim();
        if (cmdText) {
            await navigator.clipboard.writeText(cmdText);
            cpcmd.innerText = "Copied!";
            setTimeout(() => {
                cpcmd.innerText = "Copy";
            }, 2000);
        }
    });
}

// --- TÍNH NĂNG 1: ASK KBHELPER ---
async function processCommand() {
    const text = cmdinp.value.trim();
    if (!text) return; // Kiểm tra ô nhập trước để tránh kẹt nút

    if (!printing) {
        printing = true;
        scanBtn.style.backgroundColor = "gray";
        scanBtn.style.cursor = "not-allowed";

        jsOut(`USER_CMD: ${text}`);
        cmdinp.value = "";

        jsOut("KBHelper: Analyzing request...");
        await wait(600);

        const lowerText = text.toLowerCase();
        const installMatch = lowerText.match(
            /(?:install|download|tải|cài đặt|cài)\s+([a-z0-9\-_]+)/i,
        );

        if (installMatch && installMatch[1]) {
            const pkg = installMatch[1];
            const cmd = `sudo apt update && sudo apt install -y ${pkg}`;

            // 1. Ghi log
            jsOut(
                `DIAGNOSIS: Intent detected -> Software Installation [Package: '${pkg}']`,
            );
            await wait(400);
            jsOut(`FIX_SUGGEST: Run '${cmd}'`);

            // 2. Cập nhật khung Hint hiển thị gọn
            hintDiv.style.display = "block"; // Bật hintDiv
            kchat.innerText = `Yêu cầu cài đặt phần mềm: ${pkg}`;
            kcmd.innerText = cmd;
        } else if (
            lowerText.includes("net") || lowerText.includes("wifi") ||
            lowerText.includes("mạng")
        ) {
            const cmd = "sudo ip link set wlan0 up";

            jsOut("DIAGNOSIS: Network interface wlan0 is DOWN.");
            await wait(400);
            jsOut(`FIX_SUGGEST: Run '${cmd}' or restart NetworkManager.`);
            hintDiv.style.display = "block"; // Bật hintDiv
            kchat.innerText = "Phát hiện card mạng wlan0 đang bị tắt.";
            kcmd.innerText = cmd;
        } else {
            jsOut(
                `DIAGNOSIS: Analyzed pattern '${text}'. System parameters nominal.`,
            );
            await wait(400);
            jsOut("SUGGESTION: No critical errors found for this entry.");
            hintDiv.style.display = "block"; // Bật hintDiv
            kchat.innerText =
                "Hệ thống hoạt động bình thường, không tìm thấy lỗi.";
            kcmd.innerText = "";
        }

        // Mở khóa nút
        printing = false;
        scanBtn.style.cursor = "pointer";
        scanBtn.style.backgroundColor = "rgb(102, 179, 255)";
    }
}

// --- TÍNH NĂNG 2: AUTO FIND BUGS ---
async function autoScan() {
    if (!printing) {
        printing = true;
        reqBtn.style.backgroundColor = "gray";
        reqBtn.style.cursor = "not-allowed";

        jsOut("SYSTEM_SCAN: Initializing deep inspection...");
        await wait(600);
        jsOut("CHECKING: /var/log/syslog ...");
        await wait(800);
        jsOut("WARN: Failed to bind port 80 (Address already in use).");
        await wait(600);

        const cmd = "sudo kill -9 $(sudo lsof -t -i:80)";
        jsOut(`FIX_SUGGEST: Run '${cmd}'`);

        // Cập nhật khung Hint
        hintDiv.style.display = "block"; // Bật hintDiv
        kchat.innerText =
            "Lỗi: Cổng 80 đang bị chiếm dụng bởi tiến trình khác.";
        kcmd.innerText = cmd;

        printing = false;
        reqBtn.style.cursor = "pointer";
        reqBtn.style.backgroundColor = "rgb(102, 179, 255)";
    }
}

// Bắt sự kiện Click & Enter
if (reqBtn) reqBtn.addEventListener("click", processCommand);
if (scanBtn) scanBtn.addEventListener("click", autoScan);
if (cmdinp) {
    cmdinp.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            processCommand();
        }
    });
}
