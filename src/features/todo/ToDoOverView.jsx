
import React, { useEffect, useState } from "react";
import { NavLink, useSearchParams } from "react-router-dom";
import Storage from "../../utils/storage";
import { typeStyles } from "./ToDo";
import ToDoFooter from "../../components/layouts/ToDoFooter";
import { Calendar, Trash2, Clock, CheckCircle2 } from "lucide-react";

const displayDate = (dateKey) => {
    if (!dateKey) return "N/A";

    const [year, month, day] = dateKey.split("-").map(Number);

    if (!year || !month || !day) return dateKey;

    return new Date(year, month - 1, day).toLocaleDateString();
};

function ToDoOverView() {
    const [searchParams] = useSearchParams();
    const bookId = searchParams.get("bookId");

    const [book, setBook] = useState(null);
    const [completedList, setCompletedList] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load completion history from the selected book.
    useEffect(() => {
        setLoading(true);

        if (!bookId) {
            setBook(null);
            setCompletedList([]);
            setLoading(false);
            return;
        }

        const books = Storage.get("todoBooks", []);
        const selectedBook = books.find((item) => item.id === bookId);

        if (!selectedBook) {
            setBook(null);
            setCompletedList([]);
            setLoading(false);
            return;
        }

        const history = Array.isArray(selectedBook.completedTasks)
            ? selectedBook.completedTasks
            : [];

        setBook({
            ...selectedBook,
            completedTasks: history,
        });

        setCompletedList(history);
        setLoading(false);
    }, [bookId]);

    // Save history without affecting any other book.
    const saveCompletedList = (updatedList) => {
        const books = Storage.get("todoBooks", []);
        let updatedBook = null;

        const updatedBooks = books.map((item) => {
            if (item.id !== bookId) return item;

            updatedBook = {
                ...item,
                completedTasks: updatedList,
            };

            return updatedBook;
        });

        if (!updatedBook) {
            alert("This book could not be found. Return to your books.");
            return false;
        }

        Storage.set("todoBooks", updatedBooks);
        setBook(updatedBook);
        setCompletedList(updatedList);

        return true;
    };

    const clearList = () => {
        const proceed = window.confirm(
            `Clear all completed-task history for "${book.name}"?`
        );

        if (!proceed) return;

        saveCompletedList([]);
    };

    const deleteTask = (id) => {
        const updatedList = completedList.filter(
            (task) => task.id !== id
        );

        saveCompletedList(updatedList);
    };

    if (loading) {
        return (
            <div className="p-8 text-center text-gray-500">
                Loading overview...
            </div>
        );
    }

    if (!book) {
        return (
            <div className="max-w-md mx-auto mt-10 p-6 text-center">
                <h1 className="text-xl font-bold text-slate-700">
                    ToDo book not found
                </h1>

                <p className="text-sm text-gray-500 mt-2">
                    Open the overview from one of your ToDo Books.
                </p>

                <NavLink
                    to="/todo"
                    className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                    Back to ToDo Books
                </NavLink>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                    <div>

                        <h1 className="text-xl md:text-2xl font-bold text-slate-700 mt-2 break-words">
                            {book.name} — Overview
                        </h1>

                        <p className="text-sm text-gray-500 mt-1">
                            Completed Tasks: {completedList.length}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <NavLink
                            to={`/todo/add?bookId=${encodeURIComponent(book.id)}`}
                            className="px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                        >
                            View Tasks
                        </NavLink>

                        {completedList.length > 0 && (
                            <button
                                type="button"
                                onClick={clearList}
                                className="flex items-center justify-center gap-2 bg-red-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-red-600 transition"
                            >
                                <Trash2 className="w-4 h-4" />
                                Clear History
                            </button>
                        )}
                    </div>
                </div>

                {/* Completed Tasks */}
                {completedList.length === 0 ? (
                    <div className="bg-white rounded-xl border border-dashed border-gray-300 p-8 text-center">
                        <CheckCircle2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />

                        <p className="font-medium text-gray-700">
                            No completed tasks yet
                        </p>

                        <p className="text-sm text-gray-500 mt-1">
                            Tasks you complete in {book.name} will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {completedList.map((task, index) => (
                            <div
                                key={task.id ?? index}
                                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col hover:shadow-md transition text-sm min-w-0"
                            >
                                {/* Title and actions */}
                                <div className="flex items-start justify-between gap-2">
                                    <h2 className="font-semibold text-gray-800 line-through break-words min-w-0">
                                        {task.text}
                                    </h2>

                                    <div className="flex items-center gap-2 shrink-0">
                                        {task.type !== "Task" &&
                                            task.completedCount > 0 && (
                                                <span
                                                    className="bg-green-100 text-green-700 text-[10px] font-semibold px-2 py-1 rounded-full"
                                                    title="Times completed"
                                                >
                                                    ✨ {task.completedCount}
                                                </span>
                                            )}

                                        <button
                                            type="button"
                                            onClick={() => deleteTask(task.id)}
                                            className="text-gray-400 hover:text-red-500 transition"
                                            title="Delete history item"
                                            aria-label={`Delete history for ${task.text}`}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Type */}
                                {task.type && (
                                    <span
                                        className={`inline-flex self-start mt-3 px-2 py-1 rounded-full text-[10px] font-medium ${
                                            typeStyles[task.type] ||
                                            "bg-gray-100 text-gray-600"
                                        }`}
                                    >
                                        {task.type}
                                    </span>
                                )}

                                {/* Dates */}
                                <div className="flex flex-col mt-3 gap-2">
                                    <p className="flex items-start gap-2 text-xs text-gray-500">
                                        <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                                        <span>
                                            Created on:{" "}
                                            <span className="text-gray-700">
                                                {displayDate(task.cdt)}
                                            </span>
                                        </span>
                                    </p>

                                    {task.completedOn && (
                                        <p className="flex items-start gap-2 text-xs text-gray-500">
                                            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                                            <span>
                                                Completed on:{" "}
                                                <span className="text-gray-700">
                                                    {displayDate(task.completedOn)}
                                                </span>
                                            </span>
                                        </p>
                                    )}

                                    {task.enDt && (
                                        <p className="flex items-start gap-2 text-xs text-gray-500">
                                            <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                                            <span>
                                                Ends on:{" "}
                                                <span className="text-gray-700">
                                                    {displayDate(task.enDt)}
                                                </span>
                                            </span>
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <ToDoFooter />
            </div>
        </div>
    );
}

export default ToDoOverView;