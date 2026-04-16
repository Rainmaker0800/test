const GAS_URL = "https://script.google.com/macros/s/AKfycbwX2ie2URiBLke-9LpAD5edg3yXyleFGpollwhRiCRvG55Euz7Db_xNZboVTlG8yKA1/exec";

function toggleMode(mode) {
    const title = document.getElementById("form-title");
    const confirmPass = document.getElementById("confirm-password");
    const loginSec = document.getElementById("login-section");
    const registerSec = document.getElementById("register-section");
    const message = document.getElementById("message");

    message.innerText = "";
    if (mode === 'register') {
        title.innerText = "新規登録";
        confirmPass.style.display = "block";
        loginSec.style.display = "none";
        registerSec.style.display = "block";
    } else {
        title.innerText = "ログイン";
        confirmPass.style.display = "none";
        loginSec.style.display = "block";
        registerSec.style.display = "none";
    }
}

async function sendData(payload) {
    const response = await fetch(GAS_URL, {
        method: "POST",
        body: JSON.stringify(payload)
    });
    return await response.json();
}

// ログイン処理の修正版
async function handleLogin() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    if (!email || !password) return updateMsg("入力を確認してください", "error");

    try {
        updateMsg("照合中...", "");
        const res = await sendData({ mode: "login", email, password });
        
        if (res.status === "success") {
            updateMsg("ログイン成功！移動します...", "success");
            
            // --- 追記：遷移処理 ---
            setTimeout(() => {
                // 遷移先のファイル名に合わせて書き換えてください
                window.location.href = "home.html"; 
            }, 1000); // 1秒後に遷移
            // ---------------------

        } else {
            updateMsg(res.message, "error");
        }
    } catch (e) {
        updateMsg("エラー：通信に失敗しました", "error");
    }
}

async function handleRegister() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirm = document.getElementById("confirm-password").value.trim();

    if (!email || !password || !confirm) return updateMsg("全て入力してください", "error");
    if (password !== confirm) return updateMsg("パスワードが不一致です", "error");

    try {
        updateMsg("登録中...", "");
        const res = await sendData({ mode: "register", email, password });
        if (res.status === "success") {
            updateMsg("登録完了！ログインしてください", "success");
            setTimeout(() => toggleMode('login'), 2000);
        } else {
            updateMsg(res.message, "error");
        }
    } catch (e) {
        updateMsg("エラー：登録に失敗しました", "error");
    }
}

function updateMsg(txt, type) {
    const el = document.getElementById("message");
    el.innerText = txt;
    el.className = "message " + type;
}