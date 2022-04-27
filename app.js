const baseUrl = "http://todo.zxycxy.cn"
// const baseUrl = "http://localhost:5001"

let inputBox = document.querySelector('#input-box')
let todoListDom = document.querySelector('.todo-list')
let doingListDom = document.querySelector('.doing-list')
let doneListDom = document.querySelector('.done-list')
let logoutBtn = document.querySelector('.logout')


let todoList = []
let doingList = []
let doneList = []

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function postData(url, data) {
    return fetch(baseUrl + url, {
        body: JSON.stringify(data),
        headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        method: 'POST',
        mode: "cors",
        credentials: "include"
    }).then((response) => {
        console.log(response);
        if (response.status === 403) {
            window.location.href = "/login.html"
        }
        return response
    }).then(response => response.json())
}

function getData(url) {
    return fetch(baseUrl + url, {
        headers:{
            Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        method: 'GET',
        mode: "cors",
        // credentials: "include"
    }).then((response) => {
        if (response.status === 403) {
            window.location.href = "/login.html"
        }
        return response
    }).then(response => response.json())
}

function putData(url, data) {
    return fetch(baseUrl + url, {
        body: JSON.stringify(data),
        headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        method: 'PUT',
        mode: "cors",
        // credentials: "include"
    }).then((response) => {
        console.log(response);
        if (response.status === 403) {
            window.location.href = "/login.html"
        }
        return response
    }).then(response => response.json())
}

function delData(url) {
    return fetch(baseUrl + url, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        mode: "cors",
        credentials: "include"
    }).then((response) => {
        console.log(response);
        if (response.status === 403) {
            window.location.href = "/login.html"
        }
        return response
    }).then(response => response.json())
}

function reNewView() {
    while (todoListDom.firstChild) {
        todoListDom.removeChild(todoListDom.firstChild);
    }
    while (doingListDom.firstChild) {
        doingListDom.removeChild(doingListDom.firstChild);
    }
    while (doneListDom.firstChild) {
        doneListDom.removeChild(doneListDom.firstChild);
    }
    for (const todoListElement of todoList) {
        todoListDom.append(createItem(todoListElement.content, todoListElement.id))
    }
    for (const doingListElement of doingList) {
        doingListDom.append(createItem(doingListElement.content, doingListElement.id))
    }
    for (const doneListElement of doneList) {
        doneListDom.append(createItem(doneListElement.content, doneListElement.id))
    }
}

function createItem(name, index) {
    let newTodo = document.createElement('div');
    newTodo.classList.add('item');
    newTodo.setAttribute("index", index)

    let title = document.createElement('div')
    title.classList.add('title');
    title.innerText = name

    let op = document.createElement('div')
    op.classList.add('operation')

    let todo = document.createElement('div')
    todo.classList.add('go-todo')
    todo.innerText = 'Todo'
    todo.addEventListener('click', function (e) {
        ChangeStatus(e,'todo')
    })
    let doing = document.createElement('div')
    doing.classList.add('go-doing')
    doing.innerText = 'Doing'
    doing.addEventListener('click', function (e) {
        ChangeStatus(e,'doing')
    })
    let done = document.createElement('div')
    done.classList.add('go-done')
    done.innerText = 'Done'
    done.addEventListener('click', function (e) {
        ChangeStatus(e,'done')
    })
    let del = document.createElement('div')
    del.classList.add('go-del')
    del.innerText = 'Del'
    del.addEventListener('click', function (e) {
        Del(e)
    })
    op.append(todo,doing,done,del)

    newTodo.append(title,op)

    return newTodo
}

function reNew() {
    todoList = []
    doingList = []
    doneList = []
    getData("/v1/todo/list").then(data => {
        for (let i = 0; i < data.data.length; i++) {
            let item = data.data[i]
            if (item.status === "todo") {
                todoList.push(item)
            } else if (item.status === "doing") {
                doingList.push(item)
            } else if (item.status === "done") {
                doneList.push(item)
            }
        }
        reNewView()
    })
}

function Del(e) {
    let id = e.target.parentElement.parentElement.getAttribute("index")
    delData("/v1/todo/del/" + id).then(data => {
        reNew()
    })
}

function ChangeStatus(e, status) {
    let id = e.target.parentElement.parentElement.getAttribute("index")
    putData("/v1/todo/" + status + "/" + id).then(data => {
        reNew()
    })
}

function Add(name, des = "some desc", endTime = Math.round(new Date().getTime() / 1000)) {
    postData("/v1/todo/add", {
        todo_name: name,
        description: des,
        end_time: endTime
    }).then(data => {
        console.log(data);
        reNew()
    })
}

function logout(){
    localStorage.removeItem("token")
    reNew()
}



function init() {
    reNew()
}

window.addEventListener("load", init); //页面加载完调用
inputBox.addEventListener('keypress', function (e) {
    let context = inputBox.value
    if (e.keyCode === 13 && context.length!==0) {
        Add(context);
        inputBox.value = ""
    }
});
logoutBtn.addEventListener("click", logout)
