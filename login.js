const baseUrl = "https://todoapi.mjclouds.com"
// const baseUrl = "http://localhost:8080"


let uname = document.querySelector("#username")
let passwd = document.querySelector("#password")
let runame = document.querySelector("#rusername")
let rpasswd = document.querySelector("#rpassword")
let phone = document.querySelector("#rphone")
let email = document.querySelector("#remail")
let code = document.querySelector("#code")
let loginBtn = document.querySelector("#loginBtn")
let codeBtn = document.querySelector("#getCode")
let regBtn = document.querySelector("#RegisterBtn")


function postData(url, data) {
    return fetch(baseUrl + url, {
        body: JSON.stringify(data),
        headers: {
            'content-type': 'application/json',
        },
        method: 'POST',
        mode: "cors",
        credentials: "include",
    }).then(response => response.json())
}

function getData(url) {
    return fetch(baseUrl + url, {
        method: 'GET',
        credentials: "include",
    }).then(response => response.json())
}


function Login() {
    postData("/v1/user/login", {
        "user_name": uname.value,
        "passwd": passwd.value
    }).then((data) => {
        console.log(data);
        if (data.code !== 2000) {
            alert(data.message)
        } else {
            localStorage.setItem("token", data.data[0].token)
            console.log(localStorage)
            window.location.href = "/"
        }
    })
}

function GetCode() {
    let phoneNum = phone.value
    getData('/v1/user/register/code/' + phoneNum).then(data => {
        if (data.code !== 2000) {
            alert(data.message)
        } else alert("发送成功，有效时间三分钟")
    })
}

function Reg() {
    postData("/v1/user/register", {
        "user_name": runame.value,
        "password": rpasswd.value,
        "email": email.value,
        "phone": phone.value,
        "code": code.value
    }).then((data) => {
        if (data.code !== 2000) {
            alert(data.message)
        } else {
            alert("success")
        }
    })
}

loginBtn.addEventListener("click", Login)
codeBtn.addEventListener("click", GetCode)
regBtn.addEventListener("click", Reg)