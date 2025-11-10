// Selectors

const toDoInput = document.querySelector('.todo-input');
const toDoBtn = document.querySelector('.todo-btn');
const toDoList = document.querySelector('.todo-list');
const standardTheme = document.querySelector('.standard-theme');
const lightTheme = document.querySelector('.light-theme');
const darkerTheme = document.querySelector('.darker-theme');


// Event Listeners

toDoBtn.addEventListener('click', addToDo);
toDoList.addEventListener('click', deletecheck);
document.addEventListener("DOMContentLoaded", getTodos);
standardTheme.addEventListener('click', () => changeTheme('standard'));
lightTheme.addEventListener('click', () => changeTheme('light'));
darkerTheme.addEventListener('click', () => changeTheme('darker'));

// Check if one theme has been set previously and apply it (or std theme if not found):
let savedTheme = localStorage.getItem('savedTheme');
savedTheme === null ?
    changeTheme('standard')
    : changeTheme(localStorage.getItem('savedTheme'));

// Functions;
async function addToDo(event) {
    // Prevents form from submitting / Prevents form from relaoding;
    event.preventDefault();

    // toDo DIV;
    const toDoDiv = document.createElement("div");
    toDoDiv.classList.add('todo', `${savedTheme}-todo`);

    // Create LI
    const newToDo = document.createElement('li');
    if (toDoInput.value === '') {
            alert("You must write something!");
        } 
    else {
        // newToDo.innerText = "hey";
        newToDo.innerText = toDoInput.value;
        newToDo.classList.add('todo-item');
        toDoDiv.appendChild(newToDo);

        // Adding to Supabase if enabled, otherwise localStorage;
        if (typeof SUPABASE_ENABLED !== 'undefined' && SUPABASE_ENABLED) {
            await saveToSupabase(toDoInput.value);
        } else {
            savelocal(toDoInput.value);
        }

        // check btn;
        const checked = document.createElement('button');
        checked.innerHTML = '<i class="fas fa-check"></i>';
        checked.classList.add('check-btn', `${savedTheme}-button`);
        toDoDiv.appendChild(checked);
        // delete btn;
        const deleted = document.createElement('button');
        deleted.innerHTML = '<i class="fas fa-trash"></i>';
        deleted.classList.add('delete-btn', `${savedTheme}-button`);
        toDoDiv.appendChild(deleted);

        // Append to list;
        toDoList.appendChild(toDoDiv);

        // CLearing the input;
        toDoInput.value = '';
    }

}   


async function deletecheck(event){

    // console.log(event.target);
    const item = event.target;

    // delete
    if(item.classList[0] === 'delete-btn')
    {
        // item.parentElement.remove();
        // animation
        item.parentElement.classList.add("fall");

        //removing from Supabase if enabled, otherwise localStorage;
        if (typeof SUPABASE_ENABLED !== 'undefined' && SUPABASE_ENABLED) {
            await removeFromSupabase(item.parentElement);
        } else {
            removeLocalTodos(item.parentElement);
        }

        item.parentElement.addEventListener('transitionend', function(){
            item.parentElement.remove();
        })
    }

    // check
    if(item.classList[0] === 'check-btn')
    {
        item.parentElement.classList.toggle("completed");
        // Update completed status in Supabase if enabled
        if (typeof SUPABASE_ENABLED !== 'undefined' && SUPABASE_ENABLED) {
            await updateTodoStatus(item.parentElement);
        }
    }


}


// Supabase Functions:

// Save todo to Supabase
async function saveToSupabase(todoText){
    try {
        const { data, error } = await supabase
            .from(TODOS_TABLE)
            .insert([
                { text: todoText, completed: false }
            ])
            .select();
        
        if (error) throw error;
        
        // Store the id in the DOM element for later reference
        if (data && data.length > 0) {
            const todoElements = document.querySelectorAll('.todo');
            const lastTodo = todoElements[todoElements.length - 1];
            if (lastTodo) {
                lastTodo.dataset.id = data[0].id;
            }
        }
    } catch (error) {
        console.error('Error saving todo:', error);
        alert('Failed to save todo. Using local storage as fallback.');
        savelocal(todoText);
    }
}

// Get todos from Supabase
async function getTodos() {
    // Check if Supabase is enabled
    if (typeof SUPABASE_ENABLED !== 'undefined' && SUPABASE_ENABLED) {
        try {
            const { data: todos, error } = await supabase
                .from(TODOS_TABLE)
                .select('*')
                .order('created_at', { ascending: true });
            
            if (error) throw error;

            todos.forEach(function(todo) {
                // toDo DIV;
                const toDoDiv = document.createElement("div");
                toDoDiv.classList.add("todo", `${savedTheme}-todo`);
                toDoDiv.dataset.id = todo.id;
                
                if (todo.completed) {
                    toDoDiv.classList.add("completed");
                }

                // Create LI
                const newToDo = document.createElement('li');
                
                newToDo.innerText = todo.text;
                newToDo.classList.add('todo-item');
                toDoDiv.appendChild(newToDo);

                // check btn;
                const checked = document.createElement('button');
                checked.innerHTML = '<i class="fas fa-check"></i>';
                checked.classList.add("check-btn", `${savedTheme}-button`);
                toDoDiv.appendChild(checked);
                // delete btn;
                const deleted = document.createElement('button');
                deleted.innerHTML = '<i class="fas fa-trash"></i>';
                deleted.classList.add("delete-btn", `${savedTheme}-button`);
                toDoDiv.appendChild(deleted);

                // Append to list;
                toDoList.appendChild(toDoDiv);
            });
        } catch (error) {
            console.error('Error loading todos from Supabase:', error);
            alert('Failed to load todos from Supabase. Using local storage.');
            getLocalTodos();
        }
    } else {
        // Supabase not enabled, use localStorage
        getLocalTodos();
    }
}

// Remove todo from Supabase
async function removeFromSupabase(todoElement){
    const todoId = todoElement.dataset.id;
    
    if (!todoId) {
        // Fallback to local storage if no ID
        removeLocalTodos(todoElement);
        return;
    }

    try {
        const { error } = await supabase
            .from(TODOS_TABLE)
            .delete()
            .eq('id', todoId);
        
        if (error) throw error;
    } catch (error) {
        console.error('Error deleting todo:', error);
        removeLocalTodos(todoElement);
    }
}

// Update todo completed status in Supabase
async function updateTodoStatus(todoElement){
    const todoId = todoElement.dataset.id;
    
    if (!todoId) return;

    const isCompleted = todoElement.classList.contains("completed");

    try {
        const { error } = await supabase
            .from(TODOS_TABLE)
            .update({ completed: isCompleted })
            .eq('id', todoId);
        
        if (error) throw error;
    } catch (error) {
        console.error('Error updating todo:', error);
    }
}

// Local Storage Functions (Fallback):
function savelocal(todo){
    //Check: if item/s are there;
    let todos;
    if(localStorage.getItem('todos') === null) {
        todos = [];
    }
    else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }

    todos.push(todo);
    localStorage.setItem('todos', JSON.stringify(todos));
}



function getLocalTodos() {
    //Check: if item/s are there;
    let todos;
    if(localStorage.getItem('todos') === null) {
        todos = [];
    }
    else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }

    todos.forEach(function(todo) {
        // toDo DIV;
        const toDoDiv = document.createElement("div");
        toDoDiv.classList.add("todo", `${savedTheme}-todo`);

        // Create LI
        const newToDo = document.createElement('li');
        
        newToDo.innerText = todo;
        newToDo.classList.add('todo-item');
        toDoDiv.appendChild(newToDo);

        // check btn;
        const checked = document.createElement('button');
        checked.innerHTML = '<i class="fas fa-check"></i>';
        checked.classList.add("check-btn", `${savedTheme}-button`);
        toDoDiv.appendChild(checked);
        // delete btn;
        const deleted = document.createElement('button');
        deleted.innerHTML = '<i class="fas fa-trash"></i>';
        deleted.classList.add("delete-btn", `${savedTheme}-button`);
        toDoDiv.appendChild(deleted);

        // Append to list;
        toDoList.appendChild(toDoDiv);
    });
}


function removeLocalTodos(todo){
    //Check: if item/s are there;
    let todos;
    if(localStorage.getItem('todos') === null) {
        todos = [];
    }
    else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }

    const todoIndex =  todos.indexOf(todo.children[0].innerText);
    // console.log(todoIndex);
    todos.splice(todoIndex, 1);
    // console.log(todos);
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Change theme function:
function changeTheme(color) {
    localStorage.setItem('savedTheme', color);
    savedTheme = localStorage.getItem('savedTheme');

    document.body.className = color;
    // Change blinking cursor for darker theme:
    color === 'darker' ? 
        document.getElementById('title').classList.add('darker-title')
        : document.getElementById('title').classList.remove('darker-title');

    document.querySelector('input').className = `${color}-input`;
    // Change todo color without changing their status (completed or not):
    document.querySelectorAll('.todo').forEach(todo => {
        Array.from(todo.classList).some(item => item === 'completed') ? 
            todo.className = `todo ${color}-todo completed`
            : todo.className = `todo ${color}-todo`;
    });
    // Change buttons color according to their type (todo, check or delete):
    document.querySelectorAll('button').forEach(button => {
        Array.from(button.classList).some(item => {
            if (item === 'check-btn') {
              button.className = `check-btn ${color}-button`;  
            } else if (item === 'delete-btn') {
                button.className = `delete-btn ${color}-button`; 
            } else if (item === 'todo-btn') {
                button.className = `todo-btn ${color}-button`;
            }
        });
    });
}
