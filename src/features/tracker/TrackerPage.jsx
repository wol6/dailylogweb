import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs'

function TrackerPage() {
  const [logBook, setLogBook] = useState({
    entryDate: '',
    amt: '',
    note: '',
    entryType: '',
  })
  const [sum, setSum] = useState({
    cashin: '',
    cashout: '',
    balance: ''
  })
  const [entryList, setEntryList] = useState([])

  const handleChange = (e) => {
    const { name, value } = e.target
    setLogBook((prev) => {
      return { ...prev, [name]: value }
    })
  }

  const handleLog = (entryType) => {
    if (!entryType) return
    if (!handleValidation()) return
    try {
      const existingEntry = JSON.parse(localStorage.getItem('logBookStoarge')) || []
      const newEntry = { ...logBook, entryType }

      const updatedEntry = Array.isArray(existingEntry) ? [...existingEntry, newEntry] : [newEntry]
      localStorage.setItem('logBookStoarge', JSON.stringify(updatedEntry))

      sumOfCashInOut(existingEntry, logBook.amt, entryType)
      showEntryLiist()

      setLogBook({
        entryDate: '',
        amt: '',
        note: '',
        entryType: '',
      })


    } catch (e) {
      console.log(e)
    }
  }

  const handleValidation = () => {
    if (logBook.entryDate == '' || logBook.amt == '' || logBook.note == '') {
      alert('All fields must be filled.')
      return false
    }
    return true
  }

  const sumOfCashInOut = (existingEntry = [], newAmt, entryType) => {
    let totalCashIn = 0
    let totalCashOut = 0

    existingEntry.forEach((entry) => {
      if (entry.entryType === 'cashin') {
        totalCashIn += Number(entry.amt);
      } else if (entry.entryType === 'cashout') {
        totalCashOut += Number(entry.amt);
      }
    })

    if (entryType === 'cashin') {
      totalCashIn += Number(newAmt);
    } else if (entryType === 'cashout') {
      totalCashOut += Number(newAmt);
    }

    const balance = totalCashIn - totalCashOut;
    setSum({
      cashin: totalCashIn,
      cashout: totalCashOut,
      balance: balance
    })
  }

  const showEntryLiist = () => {
    const storedEntries = JSON.parse(localStorage.getItem('logBookStoarge')) || []
    setEntryList(storedEntries)
  }

  useEffect(() => {
    const storedEntries = JSON.parse(localStorage.getItem('logBookStoarge')) || []
    sumOfCashInOut(storedEntries, 0, null)
    showEntryLiist()
  }, [])

  console.log(entryList, 'arr')

  return (
    <div className="max-w-5xl mx-auto my-5 p-5 font-sans">
      <h2 className="text-center text-2xl font-semibold mb-5">💰 Daily Expense Tracker</h2>

      <div className="flex flex-col md:flex-row gap-10">
        {/* Left Side: Form */}
        <div className="w-full md:w-1/2">
          <div className="flex flex-col gap-3">
            <input
              type="date"
              name="entryDate"
              placeholder="Select Date"
              onChange={handleChange}
              value={logBook.entryDate}
              className="border px-3 py-2 rounded"
            />
            <input
              type="number"
              name="amt"
              placeholder="Amount (₹)"
              onChange={handleChange}
              value={logBook.amt}
              className="border px-3 py-2 rounded"
            />
            <input
              type="text"
              name="note"
              placeholder="Note (e.g., Lunch, Salary)"
              onChange={handleChange}
              value={logBook.note}
              className="border px-3 py-2 rounded"
            />

            <div className="flex gap-3">
              <button
                onClick={() => handleLog('cashin')}
                className="flex-1 bg-green-600 text-white py-2 rounded"
              >
                Cash In
              </button>
              <button
                onClick={() => handleLog('cashout')}
                className="flex-1 bg-red-500 text-white py-2 rounded"
              >
                Cash Out
              </button>
            </div>
          </div>

          <div className="mt-4 bg-gray-100 rounded px-3 py-2 text-right space-y-1 text-sm">
            <div className="font-bold text-green-600">Total Cash In: ₹{sum.cashin}</div>
            <div className="font-bold text-red-600">Total Cash Out: ₹{sum.cashout}</div>
            <div className="font-bold text-blue-700">Balance: ₹{sum.balance}</div>
          </div>
        </div>

        {/* Right Side: Entries */}
        <div className="w-full md:w-1/2">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl font-semibold text-gray-800">📅 Today's Entries</h3>
            <button
              onClick={() => {
                localStorage.removeItem('logBookStoarge');
                window.location.reload();
              }}
              className="bg-gray-300 text-sm text-gray-700 px-3 py-1 rounded hover:bg-gray-400"
            >
              Clear Storage
            </button>
          </div>

          <div className="max-h-64 overflow-y-auto border rounded p-2 bg-white shadow-sm">
            <ul className="list-none p-0">
              <li className="flex justify-between mb-2 px-3 py-1 font-medium bg-gray-200 rounded text-gray-700">
                <span className="w-1/3">Date</span>
                <span className="w-1/3 text-center">Amount</span>
                <span className="w-1/3 text-right">Note</span>
              </li>
              {entryList.map((list, index) => (
                <li
                  key={index}
                  className={`flex justify-between mb-2 px-3 py-1 rounded text-gray-800 ${list.entryType === 'cashin' ? 'bg-cyan-100' : 'bg-red-100'
                    }`}
                >
                  <span className="w-1/3">{dayjs(list.entryDate).format('ddd, DD MMM')}</span>
                  <span className="w-1/3 text-center">₹{list.amt}</span>
                  <span className="w-1/3 text-right">{list.note}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>


  );
}

export default TrackerPage;