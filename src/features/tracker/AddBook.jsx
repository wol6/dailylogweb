import React, { useState, useEffect } from "react";
import Storage from "../../utils/storage";

function AddBook() {
  const [bookName, setBookName] = useState("");
  const [books, setBooks] = useState({});

  // Load books from localStorage on mount
  useEffect(() => {
    // const storedBooks = JSON.parse(localStorage.getItem("expenseBooks")) || {};
    const storedBooks = Storage.get("expenseBooks") || {};
    setBooks(storedBooks);
  }, []);

  // Handle book creation
  const handleAddBook = () => {
    const trimmedName = bookName.trim();
    if (!trimmedName) {
      alert("Please enter a valid book name");
      return;
    }

    if (books[trimmedName]) {
      alert("Book already exists!");
      return;
    }

    const updatedBooks = { ...books, [trimmedName]: [] };
    setBooks(updatedBooks);
    // localStorage.setItem("expenseBooks", JSON.stringify(updatedBooks));
    Storage.set("expenseBooks",updatedBooks)

    setBookName("");
    alert(`Book "${trimmedName}" added successfully!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold text-slate-700 mb-6 tracking-tight">
        Add New Book
      </h1>

      {/* Input section */}
      <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-sm">
        <input
          type="text"
          placeholder="Enter book name (e.g. EMI Book)"
          value={bookName}
          onChange={(e) => setBookName(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAddBook}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all duration-200"
        >
          Add Book
        </button>
      </div>

      {/* Book list */}
      <div className="mt-8 w-full max-w-sm">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">My Books</h2>
        {Object.keys(books).length === 0 ? (
          <p className="text-gray-500 text-sm">No books added yet.</p>
        ) : (
          <ul className="space-y-2">
            {Object.keys(books).map((book, idx) => (
              <li
                key={idx}
                className="bg-white p-3 rounded-lg shadow-sm border text-gray-700 font-medium"
              >
                {book}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default AddBook;
