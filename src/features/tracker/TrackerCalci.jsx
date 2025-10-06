import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import Storage from "../../utils/storage";

function TrackerCalci() {
  const [books, setBooks] = useState({});
  const [selectedBook, setSelectedBook] = useState("");
  const [entry, setEntry] = useState({
    entryDate: dayjs().format("YYYY-MM-DD"),
    amt: "",
    note: "",
    entryType: "cashin",
  });
  const [summary, setSummary] = useState({
    cashin: 0,
    cashout: 0,
    balance: 0,
  });

  // Load books on mount
  useEffect(() => {
    const stored = Storage.get("expenseBooks") || {};
    setBooks(stored);
    if (Object.keys(stored).length > 0) {
      setSelectedBook(Object.keys(stored)[0]);
    }
  }, []);

  // Calculate summary when book changes
  useEffect(() => {
    if (selectedBook && books[selectedBook]) {
      const entries = books[selectedBook];
      const cashin = entries
        .filter((e) => e.entryType === "cashin")
        .reduce((sum, e) => sum + Number(e.amt || 0), 0);
      const cashout = entries
        .filter((e) => e.entryType === "cashout")
        .reduce((sum, e) => sum + Number(e.amt || 0), 0);

      setSummary({
        cashin,
        cashout,
        balance: cashin - cashout,
      });
    }
  }, [books, selectedBook]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEntry((prev) => ({ ...prev, [name]: value }));
  };

  // Handle submit
  const handleAddEntry = (e) => {
    e.preventDefault();

    if (!selectedBook) return alert("Select a book first");
    if (!entry.amt || !entry.note) return alert("Please fill all fields");

    const updatedBooks = { ...books };
    updatedBooks[selectedBook].push(entry);
    Storage.set("expenseBooks", updatedBooks);
    setBooks(updatedBooks);

    // Reset form
    setEntry({
      entryDate: dayjs().format("YYYY-MM-DD"),
      amt: "",
      note: "",
      entryType: "cashin",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 sm:p-6">
      <h1 className="text-2xl font-bold text-slate-700 mb-4">
        Expense Calculator
      </h1>

      {/* Form Section */}
      <form
        onSubmit={handleAddEntry}
        className="bg-white w-full max-w-md shadow-md rounded-xl p-4 sm:p-6 space-y-3"
      >
        {/* Book Select */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Select Book
          </label>
          <select
            name="book"
            value={selectedBook}
            onChange={(e) => setSelectedBook(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          >
            {Object.keys(books).length === 0 ? (
              <option value="">No books available</option>
            ) : (
              Object.keys(books).map((book, idx) => (
                <option key={idx} value={book}>
                  {book}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Entry Date */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Entry Date
          </label>
          <input
            type="date"
            name="entryDate"
            value={entry.entryDate}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Amount
          </label>
          <input
            type="number"
            name="amt"
            value={entry.amt}
            onChange={handleChange}
            placeholder="Enter amount"
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Note */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Note
          </label>
          <input
            type="text"
            name="note"
            value={entry.note}
            onChange={handleChange}
            placeholder="e.g. Grocery, EMI payment"
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Entry Type */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Type
          </label>
          <select
            name="entryType"
            value={entry.entryType}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="cashin">Cash In</option>
            <option value="cashout">Cash Out</option>
          </select>
        </div>

        {/* Add Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700 transition-all"
        >
          Add Entry
        </button>
      </form>

      {/* Summary Section */}
      <div className="mt-6 w-full max-w-md bg-white shadow-sm rounded-xl p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-slate-700 mb-3 text-center">
          Summary ({selectedBook || "No Book"})
        </h2>
        <div className="grid grid-cols-3 text-center text-sm">
          <div>
            <p className="text-green-600 font-semibold">Cash In</p>
            <p className="text-gray-700">{summary.cashin}</p>
          </div>
          <div>
            <p className="text-red-600 font-semibold">Cash Out</p>
            <p className="text-gray-700">{summary.cashout}</p>
          </div>
          <div>
            <p className="text-blue-600 font-semibold">Balance</p>
            <p className="text-gray-700">{summary.balance}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrackerCalci;
