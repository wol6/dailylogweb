
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
    PlusCircle,
    LayoutDashboard,
    BookOpen,
    Pencil,
    Trash2,
    ListTodo,
    X,
} from "lucide-react";
import Storage from "../../utils/storage";
import ToDoFooter from "../../components/layouts/ToDoFooter";

// Works even when crypto.randomUUID() is unavailable on mobile HTTP.
const createId = () => {
    if (
        typeof crypto !== "undefined" &&
        typeof crypto.randomUUID === "function"
    ) {
        return crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
};

function ToDoDashBoard() {
    const [books, setBooks] = useState([]);
    const [bookName, setBookName] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState("");

    useEffect(() => {
        const savedBooks = Storage.get("todoBooks", []);
        setBooks(Array.isArray(savedBooks) ? savedBooks : []);
    }, []);

    const saveBooks = (updatedBooks) => {
        Storage.set("todoBooks", updatedBooks);
        setBooks(updatedBooks);
    };

    // Create a new independent ToDo book.
    const addBook = (e) => {
        e.preventDefault();

        const name = bookName.trim();

        if (!name) return;

        const alreadyExists = books.some(
            (book) =>
                (book.name || "").toLowerCase() === name.toLowerCase()
        );

        if (alreadyExists) {
            alert("A book with this name already exists.");
            return;
        }

        const newBook = {
            id: createId(),
            name,
            createdAt: new Date().toISOString(),
            tasks: [],
            completedTasks: [],
        };

        saveBooks([...books, newBook]);
        setBookName("");
    };

    // Start renaming a book.
    const startEditing = (book) => {
        setEditingId(book.id);
        setEditName(book.name);
    };

    // Save the renamed book.
    const renameBook = (e) => {
        e.preventDefault();

        const name = editName.trim();

        if (!name) return;

        const alreadyExists = books.some(
            (book) =>
                book.id !== editingId &&
                (book.name || "").toLowerCase() === name.toLowerCase()
        );

        if (alreadyExists) {
            alert("A book with this name already exists.");
            return;
        }

        const updatedBooks = books.map((book) =>
            book.id === editingId ? { ...book, name } : book
        );

        saveBooks(updatedBooks);
        setEditingId(null);
        setEditName("");
    };

    // Delete a book and all its associated tasks and history.
    const deleteBook = (book) => {
        const proceed = window.confirm(
            `Delete "${book.name}" and all its tasks? This cannot be undone.`
        );

        if (!proceed) return;

        saveBooks(books.filter((item) => item.id !== book.id));

        if (editingId === book.id) {
            setEditingId(null);
            setEditName("");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="flex justify-center mb-3">
                        <BookOpen className="w-10 h-10 text-blue-600" />
                    </div>

                    <h1 className="text-2xl md:text-3xl font-bold text-slate-700">
                        My ToDo Books
                    </h1>

                    <p className="text-sm text-gray-500 mt-2">
                        Keep your office, home, projects, and plans separate.
                    </p>
                </div>

                {/* Create Book */}
                <form
                    onSubmit={addBook}
                    className="max-w-xl mx-auto mb-8 bg-white rounded-xl shadow-sm border border-gray-200 p-4"
                >
                    <label
                        htmlFor="bookName"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                        Create a new book
                    </label>

                    <div className="flex gap-2">
                        <input
                            id="bookName"
                            type="text"
                            placeholder="e.g. Office, Home, Picnic..."
                            value={bookName}
                            onChange={(e) => setBookName(e.target.value)}
                            maxLength={60}
                            className="min-w-0 flex-1 p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />

                        <button
                            type="submit"
                            disabled={!bookName.trim()}
                            aria-label="Create book"
                            title="Create book"
                            className="flex items-center justify-center p-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <PlusCircle className="w-5 h-5" />
                        </button>
                    </div>
                </form>

                {/* Book Count */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-slate-700">
                        Your Books
                    </h2>

                    <span className="text-sm text-gray-500">
                        {books.length} {books.length === 1 ? "book" : "books"}
                    </span>
                </div>

                {/* Books List */}
                {books.length === 0 ? (
                    <div className="bg-white border border-dashed border-gray-300 rounded-xl p-10 text-center">
                        <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />

                        <h3 className="font-semibold text-gray-700">
                            No books yet
                        </h3>

                        <p className="text-sm text-gray-500 mt-1">
                            Create your first book to start organizing tasks.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {books.map((book) => (
                            <div
                                key={book.id}
                                className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 hover:shadow-md transition"
                            >
                                {editingId === book.id ? (
                                    <form onSubmit={renameBook}>
                                        <label
                                            htmlFor={`rename-${book.id}`}
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                        >
                                            Rename book
                                        </label>

                                        <input
                                            id={`rename-${book.id}`}
                                            autoFocus
                                            value={editName}
                                            onChange={(e) =>
                                                setEditName(e.target.value)
                                            }
                                            maxLength={60}
                                            className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        />

                                        <div className="flex gap-2 mt-3">
                                            <button
                                                type="submit"
                                                disabled={!editName.trim()}
                                                className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm disabled:opacity-50"
                                            >
                                                Save
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setEditingId(null);
                                                    setEditName("");
                                                }}
                                                className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg"
                                                title="Cancel"
                                                aria-label="Cancel rename"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <>
                                        <div className="flex items-start justify-between gap-2 mb-4">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="p-2.5 bg-blue-50 rounded-lg">
                                                    <BookOpen className="w-6 h-6 text-blue-600" />
                                                </div>

                                                <div className="min-w-0">
                                                    <h3 className="font-semibold text-gray-800 break-words">
                                                        {book.name}
                                                    </h3>

                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {Array.isArray(book.tasks)
                                                            ? book.tasks.filter(
                                                                  (task) =>
                                                                      !task.completed
                                                              ).length
                                                            : 0}{" "}
                                                        active tasks
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex gap-1 shrink-0">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        startEditing(book)
                                                    }
                                                    className="p-1.5 text-gray-400 hover:text-blue-600 rounded"
                                                    title="Rename book"
                                                    aria-label={`Rename ${book.name}`}
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        deleteBook(book)
                                                    }
                                                    className="p-1.5 text-gray-400 hover:text-red-500 rounded"
                                                    title="Delete book"
                                                    aria-label={`Delete ${book.name}`}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2">
                                            <NavLink
                                                to={`/todo/add?bookId=${encodeURIComponent(book.id)}`}
                                                className="flex items-center justify-center gap-2 px-3 py-2.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-sm font-medium"
                                            >
                                                <ListTodo className="w-4 h-4" />
                                                Tasks
                                            </NavLink>

                                            <NavLink
                                                to={`/todo/overview?bookId=${encodeURIComponent(book.id)}`}
                                                className="flex items-center justify-center gap-2 px-3 py-2.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-sm font-medium"
                                            >
                                                <LayoutDashboard className="w-4 h-4" />
                                                Overview
                                            </NavLink>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <ToDoFooter/>
        </div>
    );
}

export default ToDoDashBoard;