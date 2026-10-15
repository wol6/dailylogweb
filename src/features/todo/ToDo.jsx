
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { LayoutDashboard } from "lucide-react";
import ToDoFooter from "../../components/layouts/ToDoFooter";
import Storage from "../../utils/storage";

export const typeStyles = {
    Task: "bg-green-100 text-green-600",
    "Recurring Task": "bg-rose-100 text-rose-500",
    Habit: "bg-purple-100 text-purple-600",
};

// Generate an ID even when crypto.randomUUID() is unavailable.
const createId = () => {
    if (
        typeof crypto !== "undefined" &&
        typeof crypto.randomUUID === "function"
    ) {
        return crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
};

// Keep dates consistent and easy to compare.
const getDateKey = (date = new Date()) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

// Display habit dates in the familiar local date format.
const displayDate = (dateKey) => {
    if (!dateKey) return "";

    const [year, month, day] = dateKey.split("-").map(Number);

    if (!year || !month || !day) return dateKey;

    return new Date(year, month - 1, day).toLocaleDateString();
};

export default function ToDo() {
    const [searchParams] = useSearchParams();
    const bookId = searchParams.get("bookId");

    const [book, setBook] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [taskType, setTaskType] = useState("Task");
    const [filter, setFilter] = useState("Active");
    const [newTask, setNewTask] = useState("");

    const dt = getDateKey();

    const typeNotes = {
        Task: "One-time item to complete.",
        "Recurring Task": "Repeats daily.",
        Habit: "Trackable until the 7th day after creation.",
    };

    // Load and initialize tasks for the selected book only.
    useEffect(() => {
        if (!bookId) {
            setBook(null);
            setTasks([]);
            return;
        }

        const savedBooks = Storage.get("todoBooks", []);
        const books = Array.isArray(savedBooks) ? savedBooks : [];

        const selectedBook = books.find(
            (item) => item.id === bookId
        );

        if (!selectedBook) {
            setBook(null);
            setTasks([]);
            return;
        }

        const savedTasks = Array.isArray(selectedBook.tasks)
            ? selectedBook.tasks
            : [];

        // Reset recurring tasks and habits for the new day.
        let updatedTasks = savedTasks.map((task) => {
            if (
                (task.type === "Recurring Task" ||
                    task.type === "Habit") &&
                task.dt !== dt
            ) {
                return {
                    ...task,
                    completed: false,
                    dt,
                };
            }

            return task;
        });

        // Remove a habit after its end date has passed.
        updatedTasks = updatedTasks.filter(
            (task) =>
                !(
                    task.type === "Habit" &&
                    task.enDt &&
                    task.enDt < dt
                )
        );

        const updatedBook = {
            ...selectedBook,
            tasks: updatedTasks,
            completedTasks: Array.isArray(selectedBook.completedTasks)
                ? selectedBook.completedTasks
                : [],
        };

        const needsSaving =
            JSON.stringify(updatedTasks) !== JSON.stringify(savedTasks) ||
            !Array.isArray(selectedBook.completedTasks);

        if (needsSaving) {
            Storage.set(
                "todoBooks",
                books.map((item) =>
                    item.id === bookId ? updatedBook : item
                )
            );
        }

        setBook(updatedBook);
        setTasks(updatedTasks);
    }, [bookId]);

    // Save changes to the selected book, preserving every other book.
    const saveBookChanges = (changes) => {
        const savedBooks = Storage.get("todoBooks", []);
        const books = Array.isArray(savedBooks) ? savedBooks : [];

        let updatedBook = null;

        const updatedBooks = books.map((item) => {
            if (item.id !== bookId) return item;

            updatedBook = {
                ...item,
                ...changes,
            };

            return updatedBook;
        });

        if (!updatedBook) {
            window.alert(
                "Book not found. Open Tasks from your ToDo Books dashboard."
            );
            return null;
        }

        Storage.set("todoBooks", updatedBooks);
        setBook(updatedBook);

        return updatedBook;
    };

    // Add a task to the current book.
    const addTask = () => {
        const text = newTask.trim();

        if (!text) return;

        if (!bookId || !book) {
            window.alert(
                "Please open a book from your ToDo Books dashboard first."
            );
            return;
        }

        let enDt = "";

        if (taskType === "Habit") {
            const habitEnd = new Date();
            habitEnd.setDate(habitEnd.getDate() + 7);
            enDt = getDateKey(habitEnd);
        }

        const task = {
            id: createId(),
            text,
            completed: false,
            type: taskType,
            cdt: dt,
            dt,
            enDt,
            completedCount: 0,
        };

        const updatedTasks = [...tasks, task];
        const updatedBook = saveBookChanges({
            tasks: updatedTasks,
        });

        if (!updatedBook) return;

        setTasks(updatedBook.tasks);
        setNewTask("");
    };

    // Complete a task and update its history in the current book.
    const toggleTask = (id) => {
        const task = tasks.find((item) => item.id === id);

        // Prevent completing the same task twice on the same day.
        if (!task || task.completed || !book) return;

        const proceed = window.confirm(
            "You cannot undo the completed task"
        );

        if (!proceed) return;

        const completedTask = {
            ...task,
            completed: true,
            cdt: task.dt,
            completedOn: getDateKey(),
            completedCount: (task.completedCount || 0) + 1,
        };

        const checkedList = tasks.map((item) =>
            item.id === id ? completedTask : item
        );

        const oldCompleted = Array.isArray(book.completedTasks)
            ? book.completedTasks
            : [];

        // Keep the latest history record for this task.
        const updatedCompletedList = [
            ...oldCompleted.filter((item) => item.id !== id),
            completedTask,
        ];

        const updatedBook = saveBookChanges({
            tasks: checkedList,
            completedTasks: updatedCompletedList,
        });

        if (!updatedBook) return;

        setTasks(updatedBook.tasks);
    };

    // Delete a task from the selected book.
    const deleteTask = (id) => {
        const updatedList = tasks.filter((task) => task.id !== id);

        const updatedBook = saveBookChanges({
            tasks: updatedList,
        });

        if (!updatedBook) return;

        setTasks(updatedBook.tasks);
    };

    const filteredTasks = tasks.filter((task) => {
        if (filter === "Active") return !task.completed;
        if (filter === "Completed") return task.completed;
        return true;
    });

    return (
        <div className="max-w-sm mx-auto mt-10 p-6 rounded-2xl bg-gray-50 shadow-lg">
            <div className="relative mb-4">
                <h2 className="text-center text-2xl text-slate-700 font-bold pr-9">
                    Things To Get Done ✏️
                </h2>

                {book && (
                    <NavLink
                        to={`/todo/overview?bookId=${encodeURIComponent(book.id)}`}
                        title="Overview"
                        aria-label="Open ToDo overview"
                        className="absolute right-0 top-0 p-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200"
                    >
                        <LayoutDashboard className="w-5 h-5" />
                    </NavLink>
                )}
            </div>

            {/* Task Type Buttons */}
            <div className="flex justify-around mx-5 my-0">
                {["Task", "Recurring Task", "Habit"].map((f) => (
                    <div key={f} className="flex flex-col items-center">
                        <button
                            onClick={() => setTaskType(f)}
                            className={`px-2 py-0.5 rounded-lg border border-gray-300 transition
                                ${taskType === f
                                    ? "bg-blue-500 text-white"
                                    : typeStyles[f]
                                }`}
                            title={typeNotes[f]}
                        >
                            {f}
                        </button>
                        <span className="text-xs text-gray-500 mt-1">
                            { }
                        </span>
                    </div>
                ))}
            </div>

            <span className="text-xs text-gray-500 ml-8">
                <b>Note:</b> {typeNotes[taskType]}
            </span>

            {/* Input + Add Button */}
            <div className="flex mb-4 mt-1">
                <input
                    type="text"
                    placeholder="Add a new task..."
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    className="flex-1 min-w-0 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                <button
                    type="button"
                    onClick={addTask}
                    disabled={!newTask.trim()}
                    className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
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
                                checked={Boolean(task.completed)}
                                disabled={task.completed}
                                onChange={() => toggleTask(task.id)}
                                className="w-5 h-5 shrink-0"
                            />

                            <span
                                className={`flex-1 min-w-0 ml-3 break-words ${task.completed
                                        ? "line-through text-gray-400"
                                        : ""
                                    }`}
                            >
                                {task.text}
                            </span>

                            <span
                                className={`ml-2 shrink-0 text-xs px-2 py-0.5 rounded-full ${typeStyles[task.type] ||
                                    "bg-purple-100 text-purple-600"
                                    }`}
                            >
                                {task.type}
                            </span>

                            <button
                                type="button"
                                onClick={() => deleteTask(task.id)}
                                className="ml-2 shrink-0 text-gray-400 hover:text-red-500"
                                aria-label={`Delete ${task.text}`}
                            >
                                🗑
                            </button>
                        </div>

                        {task.type === "Habit" && (
                            <p className="text-xs text-gray-500 mt-1">
                                Ends on: {displayDate(task.enDt)}
                            </p>
                        )}
                    </div>
                ))}
            </div>

            {/* Filter Buttons */}
            <div className="flex justify-around mt-4">
                {["Active", "Completed", "All"].map((f) => (
                    <button
                        key={f}
                        type="button"
                        onClick={() => setFilter(f)}
                        className={`px-3 py-1 rounded-lg border border-gray-300 ${filter === f
                                ? "bg-blue-500 text-white"
                                : "bg-white"
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