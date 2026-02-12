const express = require("express");
const fs = require("fs");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

const DATA_FILE = "tasks.json";

function readTasks() {
    return JSON.parse(fs.readFileSync(DATA_FILE));
}

function writeTasks(tasks) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
}

// Get tasks (with filter & search)
app.get("/tasks", (req, res) => {
    let tasks = readTasks();
    const { status, search } = req.query;

    if (status === "completed") {
        tasks = tasks.filter(t => t.completed);
    } else if (status === "pending") {
        tasks = tasks.filter(t => !t.completed);
    }

    if (search) {
        tasks = tasks.filter(t =>
            t.text.toLowerCase().includes(search.toLowerCase())
        );
    }

    res.json(tasks);
});

// Add task
app.post("/tasks", (req, res) => {
    const tasks = readTasks();

    const newTask = {
        id: Date.now(),
        text: req.body.text,
        priority: req.body.priority,
        dueDate: req.body.dueDate,
        completed: false
    };

    tasks.push(newTask);
    writeTasks(tasks);

    res.json(newTask);
});

// Toggle complete
app.put("/tasks/:id", (req, res) => {
    let tasks = readTasks();
    tasks = tasks.map(task =>
        task.id == req.params.id
            ? { ...task, completed: !task.completed }
            : task
    );

    writeTasks(tasks);
    res.json({ message: "Updated" });
});

// Delete task
app.delete("/tasks/:id", (req, res) => {
    let tasks = readTasks();
    tasks = tasks.filter(task => task.id != req.params.id);
    writeTasks(tasks);
    res.json({ message: "Deleted" });
});

// Dashboard stats
app.get("/stats", (req, res) => {
    const tasks = readTasks();
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;

    res.json({ total, completed, pending });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
