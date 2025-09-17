import React, { useEffect, useState } from "react";
import { Trash2 } from "lucide-react"; // 👈 add this at the top
import Storage from "../../utils/storage";
import DaileEventFooter from "../../components/layouts/DailyEvtFooter";
function ViewEvent() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const dailyEvents = Storage.get("dailyEvents", []);
        setEvents(dailyEvents || []);
    }, []);

    // delete handler
    const handleDelete = (id) => {
        const updatedEvents = events.filter((event) => event.id !== id);
        setEvents(updatedEvents);
        Storage.set("dailyEvents", updatedEvents); // update storage
    };

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Daily Progress</h2>

            {events.length === 0 ? (
                <p className="text-gray-500">No activities added yet.</p>
            ) : (
                <div className="overflow-x-auto">
                    {/* Desktop Table */}
                    <table className="hidden md:table table-auto w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-300 px-4 py-2">#</th>
                                <th className="border border-gray-300 px-4 py-2">Activity</th>
                                <th className="border border-gray-300 px-4 py-2">Actual</th>
                                <th className="border border-gray-300 px-4 py-2">Target</th>
                                <th className="border border-gray-300 px-4 py-2">Unit</th>
                                <th className="border border-gray-300 px-4 py-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map((event, index) => (
                                <tr key={event.id}>
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        {index + 1}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {event.name}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        {event.actual}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        {event.target}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        {event.unit}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        <button
                                            onClick={() => handleDelete(event.id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Mobile Cards */}

                    <div className="md:hidden space-y-4">
                        {events.map((event, index) => (
                            <div
                                key={event.id}
                                className="flex items-center justify-between border border-gray-200 rounded-xl p-4 shadow-sm bg-white"
                            >
                                <div>
                                    <p className="font-semibold text-gray-800 text-lg">
                                        {index + 1}. {event.name}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        🎯 Actual: <span className="font-medium">{event.actual}</span>{" "}
                                        {event.unit}
                                    </p>
                                       <p className="text-sm text-gray-500 mt-1">
                                        🎯 Target: <span className="font-medium">{event.target}</span>{" "}
                                        {event.unit}
                                    </p>
                                </div>

                                <button
                                    onClick={() => handleDelete(event.id)}
                                    className="ml-3 p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition"
                                    aria-label="Delete"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>

                </div>
            )}
            <DaileEventFooter/>
        </div>
    );
}

export default ViewEvent;