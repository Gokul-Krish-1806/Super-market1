const API_URL = "http://localhost:9090/api/auth";

function showMsg(msg){
    const el = document.getElementById("msg");
    if(el) el.innerText = msg;
}

async function parse(res){
    const text = await res.text();
    return { message: text };
}

// Signup → Login page
async function signup(){
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const res = await fetch(`${API_URL}/signup`, {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify({username,password})
    });

    const data = await parse(res);
    showMsg(data.message);
    if(res.ok) setTimeout(()=>location="index.html",1000);
}

// Login → Dashboard
async function login(){
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const res = await fetch(`${API_URL}/login`, {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify({username,password})
    });

    const data = await parse(res);
    showMsg(data.message);
    if(res.ok){
        localStorage.setItem("username",username);
        location="dashboard.html";
    }
}

// Reset → Login page
async function resetPassword(){
    const username = document.getElementById("username").value;
    const password = document.getElementById("newPassword").value;

    const res = await fetch(`${API_URL}/reset-password`,{
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify({username,password})
    });

    const data = await parse(res);
    showMsg(data.message);
    if(res.ok) setTimeout(()=>location="index.html",1000);
}

function logout(){
    localStorage.clear();
    location="index.html";
}
