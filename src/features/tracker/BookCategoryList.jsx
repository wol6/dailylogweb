import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Storage from "../../utils/storage";
import { BookOpen } from "lucide-react";

function BookCategoryList() {
  const [books, setBooks] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const storedBooks = Storage.get("expenseBooks") || {};
    setBooks(storedBooks);
  }, []);

  const handleOpenBook = (bookName) => {
    navigate(`/tracker/viewbook/${encodeURIComponent(bookName)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 flex flex-col items-center">
      {/* Header */}
      <h1 className="text-2xl font-bold text-slate-700 mb-8 tracking-tight">
        My Books
      </h1>

      {/* Book Cards */}
      {Object.keys(books).length === 0 ? (
        <p className="text-gray-500 text-sm">No books available. Please add one.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
          {Object.keys(books).map((book, idx) => (
            <div
              key={idx}
              onClick={() => handleOpenBook(book)}
              className="bg-white shadow-sm rounded-xl p-4 flex flex-col items-center text-center 
                         hover:shadow-md hover:-translate-y-1 hover:bg-slate-50 transition-all duration-200 cursor-pointer"
            >
              <BookOpen className="w-6 h-6 text-indigo-600 mb-2" />
              <h2 className="text-base font-semibold text-gray-800">{book}</h2>
              <p className="text-xs text-gray-500 mt-1">
                {books[book].length} expense entries
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BookCategoryList;
