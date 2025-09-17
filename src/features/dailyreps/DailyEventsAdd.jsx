import React, { useState } from "react";
import Storage from "../../utils/storage";
import DaileEventFooter from "../../components/layouts/DailyEvtFooter";

function DailyEventsAdd() {
  const [form, setForm] = useState({
    id: Date.now(), // auto ID
    name: "",
    actual:"",
    target: "",
    unit: "Reps",
  });

  const units = ["Reps", "Sets", "Minutes", "Km"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEvent = { ...form, id: Date.now() }; // fresh unique id

    const existingEvents = Storage.get("dailyEvents") || [];

    // push new event
    const updatedEvents = [...existingEvents, newEvent];

    // save array back
    Storage.set("dailyEvents", updatedEvents);

    // reset form
    setForm({ id: Date.now(), name: "",actual:"", target: "", unit: "Reps" });
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div className="mt-15 w-full max-w-sm bg-white shadow-md rounded-xl p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-3 text-center">
          Add Daily Workout
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5 mb-5">
          {/* Event Name */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-600">
              Event Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g., Push-ups"
              className="mt-1 w-full px-2 py-1.5 border rounded-md focus:ring focus:ring-blue-200 focus:border-blue-400 outline-none text-sm"
              required
            />
          </div>
          
          {/* Actual */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-600">
              Actual
            </label>
            <input
              type="number"
              name="actual"
              value={form.actual  }
              onChange={handleChange}
              placeholder="e.g., 50"
              className="mt-1 w-full px-2 py-1.5 border rounded-md focus:ring focus:ring-blue-200 focus:border-blue-400 outline-none text-sm"
              required
            />
          </div>

          {/* Target */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-600">
              Target
            </label>
            <input
              type="number"
              name="target"
              value={form.target}
              onChange={handleChange}
              placeholder="e.g., 50"
              className="mt-1 w-full px-2 py-1.5 border rounded-md focus:ring focus:ring-blue-200 focus:border-blue-400 outline-none text-sm"
              required
            />
          </div>

          {/* Unit */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-600">
              Unit
            </label>
            <select
              name="unit"
              value={form.unit}
              onChange={handleChange}
              className="mt-1 w-full px-2 py-1.5 border rounded-md focus:ring focus:ring-blue-200 focus:border-blue-400 outline-none text-sm"
            >
              {units.map((u, idx) => (
                <option key={idx} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-1.5 rounded-md hover:bg-blue-600 transition text-sm"
          >
            Save Event
          </button>
        </form>
      </div>
      <DaileEventFooter/>
    </div>
  );
}

export default DailyEventsAdd;
