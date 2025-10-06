import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function BookView() {
  const { book } = useParams();
  const [bookEntries, setBookEntries] = useState([]);

  useEffect(() => {
    const storedBooks = JSON.parse(localStorage.getItem("expenseBooks")) || {};
    setBookEntries(storedBooks[book] || []);
  }, [book]);

  // Delete entry by index
  const handleDelete = (index) => {
    const updatedEntries = [...bookEntries];
    updatedEntries.splice(index, 1); // remove entry at index
    setBookEntries(updatedEntries);

    // update localStorage
    const storedBooks = JSON.parse(localStorage.getItem("expenseBooks")) || {};
    storedBooks[book] = updatedEntries;
    localStorage.setItem("expenseBooks", JSON.stringify(storedBooks));
  };

  // Summary: total cash in/out and net
  const summary = bookEntries.reduce(
    (acc, entry) => {
      const amt = parseFloat(entry.amt);
      if (entry.entryType === "cashin") {
        acc.totalCashIn += amt;
      } else {
        acc.totalCashOut += amt;
      }
      return acc;
    },
    { totalCashIn: 0, totalCashOut: 0 }
  );
  summary.net = summary.totalCashIn - summary.totalCashOut;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{book}</h1>

      {/* Summary */}
      <div className="mb-6 p-6 bg-gray-100 rounded-lg shadow flex justify-around text-center">
        <div>
          <p className="text-gray-600">Total Cash In</p>
          <p className="text-green-600 font-bold text-xl">₹{summary.totalCashIn}</p>
        </div>
        <div>
          <p className="text-gray-600">Total Cash Out</p>
          <p className="text-red-600 font-bold text-xl">₹{summary.totalCashOut}</p>
        </div>
        <div>
          <p className="text-gray-600">Net</p>
          <p
            className={`font-bold text-xl ${
              summary.net >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            ₹{summary.net}
          </p>
        </div>
      </div>

      {/* Book Entries */}
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {bookEntries.map((entry, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg shadow border-l-4 relative ${
              entry.entryType === "cashin" ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"
            }`}
          >
            <p className="font-semibold text-gray-700">{entry.entryDate}</p>
            <p className="text-gray-600">{entry.note}</p>
            <p
              className={`mt-2 font-bold ${
                entry.entryType === "cashin" ? "text-green-600" : "text-red-600"
              }`}
            >
              ₹{entry.amt} ({entry.entryType})
            </p>

            {/* Delete Button */}
            <button
              onClick={() => handleDelete(index)}
              className="absolute top-2 right-2 text-blue-600 hover:text-red-800 font-bold"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BookView;
