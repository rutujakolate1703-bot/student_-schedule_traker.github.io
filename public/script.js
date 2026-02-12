async function loadTasks(status = "", search = "") {
    let url = "/tasks?";
    if (status) url += `status=${status}&`;
    if (search) url += `search=${search}`;

    const res = await fetch(url);
    const tasks = await res.json();

    const list = document.getElementById("taskList");
    list.innerHTML = "";

    tasks.forEach(task => {
        const li = document.createElement("li");

if (task.priority === "High") li.classList.add("high");
if (task.priority === "Medium") li.classList.add("medium");
if (task.priority === "Low") li.classList.add("low");

        li.innerHTML = `
            <b>${task.text}</b> 
            (${task.priority}) - Due: ${task.dueDate}
        `;

        if (task.completed) li.classList.add("completed");

        li.onclick = () => toggleTask(task.id);

        const delBtn = document.createElement("button");
        delBtn.textContent = "Delete";
        delBtn.onclick = (e) => {
            e.stopPropagation();
            deleteTask(task.id);
        };

        li.appendChild(delBtn);
        list.appendChild(li);
    });

    loadStats();
}

async function addTask() {
    const text = document.getElementById("taskInput").value;
    const priority = document.getElementById("priority").value;
    const dueDate = document.getElementById("dueDate").value;

    await fetch("/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, priority, dueDate })
    });

    loadTasks();
}

async function toggleTask(id) {
    await fetch(`/tasks/${id}`, { method: "PUT" });
    loadTasks();
}

async function deleteTask(id) {
    await fetch(`/tasks/${id}`, { method: "DELETE" });
    loadTasks();
}

async function loadStats() {
    const res = await fetch("/stats");
    const stats = await res.json();

    document.getElementById("total").textContent = stats.total;
    document.getElementById("completed").textContent = stats.completed;
    document.getElementById("pending").textContent = stats.pending;
}

function searchTask() {
    const search = document.getElementById("searchInput").value;
    loadTasks("", search);

    
}

loadTasks() ;{
    const li = document.createElement("li");
    if (task.priority === "High") li.classList.add("high");
if (task.priority === "Medium") li.classList.add("medium");
if (task.priority === "Low") li.classList.add("low");

li.innerHTML = `
    <b>${task.text}</b> 
    (${task.priority}) - Due: ${task.dueDate}
`;

}
