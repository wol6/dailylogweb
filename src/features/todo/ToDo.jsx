import React, { useEffect, useState } from "react";
import ToDoFooter from "../../components/layouts/ToDoFooter";

export default function ToDo() {
    const [tasks, setTasks] = useState([
        // { id: 1, text: "Buy groceries", completed: false },
    ]);
    const [filter, setFilter] = useState("All");
    const [newTask, setNewTask] = useState("");

    const addTask = () => {
        if (newTask.trim() === "") return;
        const updateTask = [...tasks,
        { id: Date.now(), text: newTask.trim(), completed: false },
        ]
        localStorage.setItem("tasks", JSON.stringify(updateTask))
        // setTasks(updateTask);
        showToDoList()
        setNewTask("");
    };

    const toggleTask = (id) => {
        const checkedList = tasks.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task
        )
        localStorage.setItem("tasks", JSON.stringify(checkedList))
        setTasks(checkedList);
    };

    const deleteTask = (id) => {
        const updatedList = tasks.filter((task) => task.id !== id)
        localStorage.setItem("tasks",JSON.stringify(updatedList))
        setTasks(updatedList);
    };

    const filteredTasks = tasks.filter((task) => {
        if (filter === "Active") return !task.completed;
        if (filter === "Completed") return task.completed;
        return true;
    });

    function showToDoList() {
        const showTaskList = localStorage.getItem("tasks") || []
        setTasks(JSON.parse(showTaskList))
    }

    useEffect(() => {
        const showTaskList = JSON.parse(localStorage.getItem("tasks")) || []
        setTasks(showTaskList)
    }, [])

    return (
        <div className="max-w-sm mx-auto mt-10 p-6 rounded-2xl bg-gray-50 shadow-lg">
            <h2 className="text-center text-2xl text-slate-700 font-bold mb-4">Things To Get Done✏️</h2>

            {/* Input + Add Button */}
            <div className="flex mb-4">
                <input
                    type="text"
                    placeholder="Add a new task..."
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    className="flex-1 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                    onClick={addTask}
                    className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                    +
                </button>
            </div>

            {/* Task List */}
            <div className="space-y-2">
                {filteredTasks.map((task) => (
                    <div
                        key={task.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-white shadow-sm"
                    >
                        <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => toggleTask(task.id)}
                            className="w-5 h-5"
                        />
                        <span
                            className={`flex-1 ml-3 ${task.completed ? "line-through text-gray-400" : ""
                                }`}
                        >
                            {task.text}
                        </span>
                        <button
                            onClick={() => deleteTask(task.id)}
                            className="text-gray-400 hover:text-red-500"
                        >
                            🗑
                        </button>
                    </div>
                ))}
            </div>

            {/* Filter Buttons */}
            <div className="flex justify-around mt-4">
                {["All", "Active", "Completed"].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-3 py-1 rounded-lg border border-gray-300 ${filter === f ? "bg-blue-500 text-white" : "bg-white"
                            }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Counter */}
            <p className="text-center text-gray-500 mt-3 text-sm">
                {tasks.filter((t) => !t.completed).length} tasks left
            </p>
            <ToDoFooter/>
        </div>
    );
}
