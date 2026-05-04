document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addBtn = document.getElementById('addBtn');
    const todoList = document.getElementById('todoList');

    fetchTasks();

    addBtn.addEventListener('click', addTask);

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    async function fetchTasks() {
        const response = await fetch('/tasks');
        const tasks = await response.json();

        todoList.innerHTML = '';
        tasks.forEach(task => renderTask(task));
    }

    async function addTask() {
        const title = taskInput.value.trim();
        if (!title) return;

        const response = await fetch('/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title: title })
        });
        const newTask = await response.json();
        renderTask(newTask);
        taskInput.value = '';
    }

    async function toggleTask(id, isCompleted) {
        await fetch(`/tasks/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ completed: isCompleted })
        });
    }

    async function deleteTask(id, listItemHtml) {
        await fetch(`/tasks/${id}`, {
            method: 'DELETE'
        });
        listItemHtml.remove();
    }

    function renderTask(task) {
        const li = document.createElement('li');
        li.className = `todo-item ${task.completed ? 'completed' : ''}`;
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => {
            const isCompleted = checkbox.checked;
            toggleTask(task.id, isCompleted);

            li.classList.toggle('completed', isCompleted);
        });

        const span = document.createElement('span');
        span.className = 'task-text';
        span.textContent = task.title;

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Usuń';
        deleteBtn.addEventListener('click', () => {
            deleteTask(task.id, li);
        });

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteBtn);

        todoList.appendChild(li);
    }
});