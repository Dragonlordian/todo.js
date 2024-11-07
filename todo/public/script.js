async function addTodo(){
    let todoInput = document.getElementById('todoInput')
    const data = {todoText:`${todoInput.value}`} 
    let res = await fetch('/todos',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })

    let responseData = await res.json()

    if(res.status == 400 || res.status == 500){
        messageBox(responseData.message,1)
    }else{
        messageBox('',3)
        showTodos([responseData])
    }
}

function messageBox(msg,lvl){
    try{
        let messageBox = document.getElementById('messageBox')

        switch(lvl)
        {
        case 0:
            messageBox.style.color = 'blue'
            messageBox.innerHTML = `Info: ${msg}`
            break
        case 1:
            messageBox.style.color = 'red'
            messageBox.innerHTML = `Err: ${msg}`
            break
        case 2:
            messageBox.style.color = 'white'
            messageBox.innerHTML = msg
            break
        case 3:
            messageBox.innerHTML = ''
            break
        default:
            messageBox.style.color = 'white'
            messageBox.innerHTML = msg
            break
    }
    }catch(e){
        throw e
    }
}

function deleteTodo(id){
    let res = fetch(`/todos/${id}`,{
        method: 'DELETE'
    })

    document.getElementById(id).remove()

    if(!(document.getElementById('todos').hasChildNodes())){
        messageBox('No todos',0)
    }
}



function editTodo(id) {
    const addBtn = document.getElementById('addBtn')
    const input = document.getElementById('todoInput')
    const text = document.getElementById(id).childNodes[0].data

    addBtn.onclick = () => saveEditedTodo(id)

    addBtn.innerHTML = 'SAVE'
    input.value = text
    input.focus()
}

async function saveEditedTodo(id) {
    const input = document.getElementById('todoInput')
    const addBtn = document.getElementById('addBtn')
    const data = { todoText: input.value }

    try {
        const res = await fetch(`/todos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        const responseData = await res.json()

        if (res.status === 400 || res.status === 500) {
            messageBox(responseData.message, 1)
        } else {
            document.getElementById(id).childNodes[0].data = input.value
            messageBox('', 3)
        }
    } catch (error) {
        console.error('Error saving the todo:', error)
        messageBox('An error occurred', 1)
    } finally {
        addBtn.innerHTML = 'Add'
        addBtn.onclick = addTodo
    }
}




function createTodoItem(todo) {
    let li = document.createElement('li');
    li.setAttribute('id', todo._id);

    let todoText = document.createTextNode(todo.todoText);
    li.appendChild(todoText);

    let buttonGroup = document.createElement('div');
    buttonGroup.classList.add('button-group');

    let editSpan = document.createElement('span');
    editSpan.appendChild(document.createTextNode('Edit'));
    editSpan.classList.add('edit');
    editSpan.onclick = () => editTodo(todo._id);

    let deleteSpan = document.createElement('span');
    deleteSpan.appendChild(document.createTextNode('Delete'));
    deleteSpan.classList.add('delete');
    deleteSpan.onclick = () => deleteTodo(todo._id);

    buttonGroup.appendChild(editSpan);
    buttonGroup.appendChild(deleteSpan);
    li.appendChild(buttonGroup);

    return li;
}


async function showTodos(todos) {
    let todoList = document.getElementById('todos')

    if(todos.length === 0){
        messageBox('No todos found, try adding some:)',0)
    }else{
        todos.forEach(todo => {
            let li = createTodoItem(todo)
            todoList.appendChild(li)
        })
        messageBox('',3)
    }
}

async function loadTodos(){
    let res = await fetch('/todos',{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
        }
    })

    let todos = await res.json()

    await showTodos(todos)
}

async function init(){
    messageBox('Loading todos, please wait...', 0)
    await loadTodos()
}

window.onload = () =>{
    main()
}

async function main() {
    await init()
    let addBtn = document.getElementById('addBtn')
    addBtn.onclick = addTodo
}