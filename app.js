document.addEventListener("DOMContentLoaded", function ()
 {
    const taskForm = document.getElementById("task-form");
    const taskInput = document.getElementById("task-input");
    const expiryDateInput = document.getElementById("expiry-date");
    const taskList = document.getElementById("task-list");

    let editMode = false;
    let taskToEditId = null;

    taskForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const task = taskInput.value.trim();
        const expiryDate = expiryDateInput.value;

        if (task !== "" && expiryDate !== "")
             {
            if (editMode) {
                updateTaskInDatabase(taskToEditId, task, expiryDate);
            } else {
                addTaskToDatabase(task, expiryDate);
            }
            taskInput.value = "";
            expiryDateInput.value = "";
            editMode = false;
            taskToEditId = null;
        }
    });

    fetchTasks();

    function addTaskToDatabase(task, expiryDate)
     {
        fetch("actions.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "add", title: task, expiry_date: expiryDate }),
        }).then(() => fetchTasks());
    }

    function fetchTasks() 
    {
        fetch("actions.php?action=fetch")
            .then((response) => response.json())
            .then((tasks) => {
                taskList.innerHTML = "";
                tasks.forEach((task) => {
                    const li = document.createElement("li");
                    li.innerHTML = `
                        ${task.title} 
                        (Entry: ${new Date(task.entry_date).toLocaleDateString()}, Expiry: ${new Date(task.expiry_date).toLocaleDateString()})
                        <button onclick="editTask(${task.id}, '${task.title}', '${task.expiry_date}')">Edit</button>
                        <button onclick="deleteTask(${task.id})">Delete</button>
                    `;
                    taskList.appendChild(li);
                });
            });
    }

    window.deleteTask = function (id) 
    {
        fetch("actions.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "delete", id: id }),
        }).then(() => fetchTasks());
    };

    window.editTask = function (id, title, expiryDate) 
    {
        taskInput.value = title;
        expiryDateInput.value = expiryDate;
        editMode = true;
        taskToEditId = id;
    };

    function updateTaskInDatabase(id, title, expiryDate) 
    {
        fetch("actions.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "edit", id: id, title: title, expiry_date: expiryDate }),
        }).then(() => fetchTasks());
    }
});
