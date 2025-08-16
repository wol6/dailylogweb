import React, { useEffect, useState } from "react";
import ToDoFooter from "../../components/layouts/ToDoFooter";
import Storage from "../../utils/storage";

export default function ToDo() {
    const [tasks, setTasks] = useState([]);
    const [taskType, setTaskType] = useState("Task");
    const [filter, setFilter] = useState("Active");
    const [newTask, setNewTask] = useState("");

    let now = new Date();
    let dt = now.toLocaleDateString();

    const typeStyles = {
        "Task": "bg-green-100 text-green-600",
        "Recurring Task": "bg-rose-100 text-rose-500",
        "Habit": "bg-purple-100 text-purple-600"
    };

    const typeNotes = {
        "Task": "One-time item to complete.",
        "Recurring Task": "Repeats daily.",
        "Habit": "Trackable until the 7th day after creation."
    };

    const addTask = () => {
        if (newTask.trim() === "") return;
        let enDt = "";
        if (taskType === "Habit") {
            let habitEnd = new Date();
            habitEnd.setDate(habitEnd.getDate() + 7); // habit lasts 7 days
            enDt = `${habitEnd.getMonth() + 1}/${habitEnd.getDate()}/${habitEnd.getFullYear()}`;
        }
        const updateTask = [
            ...tasks,
            { id: Date.now(), text: newTask.trim(), completed: false, type: taskType, dt, enDt }
        ];
        // localStorage.setItem("tasks", JSON.stringify(updateTask));
        Storage.set('tasks', updateTask)
        setTasks(updateTask);
        setNewTask("");
    };

    const toggleTask = (id) => {
        const checkedList = tasks.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        // localStorage.setItem("tasks", JSON.stringify(checkedList));
        Storage.set('tasks', checkedList)
        setTasks(checkedList);
    };

    const deleteTask = (id) => {
        const updatedList = tasks.filter((task) => task.id !== id);
        // localStorage.setItem("tasks", JSON.stringify(updatedList));
        Storage.set('tasks', updatedList)
        setTasks(updatedList);
    };

    const filteredTasks = tasks.filter((task) => {
        if (filter === "Active") return !task.completed;
        if (filter === "Completed") return task.completed;
        return true;
    });

    useEffect(() => {
        // let showTaskList = JSON.parse(localStorage.getItem("tasks")) || [];
        let showTaskList = Storage.get("tasks", []) || []

        // Reset recurring tasks if new day
        showTaskList = showTaskList.map((f) => {
            if (f.type === "Recurring Task" || f.type === "Habit" && f.dt !== dt) {
                return { ...f, completed: false, dt };
            }
            return f;
        });

        // Remove habits if end date reached
        showTaskList = showTaskList.filter((f) => !(f.type === "Habit" && f.enDt === dt));

        setTasks(showTaskList);
        // localStorage.setItem("tasks", JSON.stringify(showTaskList));
        Storage.set('tasks', showTaskList)
    }, []);

    return (
        <div className="max-w-sm mx-auto mt-10 p-6 rounded-2xl bg-gray-50 shadow-lg">
            <h2 className="text-center text-2xl text-slate-700 font-bold mb-4">Things To Get Done ✏️</h2>

            {/* Task Type Buttons */}
            <div className="flex justify-around mx-5 my-0">
                {["Task", "Recurring Task", "Habit"].map((f) => (
                    <div key={f} className="flex flex-col items-center">
                        <button
                            onClick={() => setTaskType(f)}
                            className={`px-2 py-0.5 rounded-lg border border-gray-300 transition 
                                ${taskType === f ? "bg-blue-500 text-white" : typeStyles[f]}`}
                            title={typeNotes[f]}
                        >
                            {f}
                        </button>
                        <span className="text-xs text-gray-500 mt-1">{ }</span>
                    </div>
                ))}
            </div>
            <span className="text-xs text-gray-500 ml-8"><b>Note:</b> {typeNotes[taskType]}</span>

            {/* Input + Add Button */}
            <div className="flex mb-4 mt-1">
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
                        className="flex flex-col p-3 rounded-lg bg-white shadow-sm border border-gray-200"
                    >
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => toggleTask(task.id)}
                                className="w-5 h-5"
                            />
                            <span
                                className={`flex-1 ml-3 ${task.completed ? "line-through text-gray-400" : ""}`}
                            >
                                {task.text}
                            </span>
                            <span
                                className={`ml-2 text-xs px-2 py-0.5 rounded-full ${task.type === "Task" ? "bg-green-100 text-green-600" :
                                    task.type === "Recurring Task" ? "bg-rose-100 text-rose-500" :
                                        "bg-purple-100 text-purple-600"
                                    }`}
                            >
                                {task.type}
                            </span>
                            <button
                                onClick={() => deleteTask(task.id)}
                                className="ml-2 text-gray-400 hover:text-red-500"
                            >
                                🗑
                            </button>
                        </div>
                        {task.type === "Habit" && (
                            <p className="text-xs text-gray-500 mt-1">Ends on: {task.enDt}</p>
                        )}
                    </div>
                ))}
            </div>

            {/* Filter Buttons */}
            <div className="flex justify-around mt-4">
                {["Active", "Completed", "All"].map((f) => (
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

            <ToDoFooter />
        </div>
    );
}
