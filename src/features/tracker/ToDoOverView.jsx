import React, { useEffect, useState } from 'react'
import Storage from '../../utils/storage'
import { typeStyles } from '../todo/ToDo'
import ToDoFooter from '../../components/layouts/ToDoFooter'
import { Calendar, Trash2, Clock } from 'lucide-react'

function ToDoOverView() {
    const [completedList, setCompletedList] = useState([])

    useEffect(() => {
        const saved = Storage.get('completedTask', [])
        setCompletedList(saved)
    }, [])

    const clearList = () => {
        const isConfirm = confirm("Are You Sure...")
        if (!isConfirm) return
        localStorage.removeItem('completedTask')
        setCompletedList([])
    }

    const deleteTask = (index) => {
        const updated = [...completedList]
        updated.splice(index, 1)
        setCompletedList(updated)
        Storage.set('completedTask', updated)
    }


    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
            {/* Header Row */}
            <div className="flex items-center justify-between mb-6 max-w-5xl mx-auto">
                <h1 className="text-xl md:text-2xl font-bold text-slate-700">
                    Completed Tasks
                </h1>
                {completedList.length > 0 && (
                    <button
                        onClick={clearList}
                        className="bg-red-500 text-white text-sm px-4 py-1.5 rounded-lg 
              shadow-sm hover:bg-red-600 hover:shadow-md 
              transition-all duration-200"
                    >
                        Clear List
                    </button>
                )}
            </div>

            {/* Completed Task List */}
            {completedList.length === 0 ? (
                <p className="text-center text-gray-500 text-sm">
                    No completed tasks yet 🎯
                </p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
                    {completedList.map((task, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-lg shadow-sm p-3 flex flex-col 
                hover:shadow-md transition-all duration-200 text-sm"
                        >
                            {/* Header Row: Title + Count + Delete */}
                            <div className="flex items-center justify-between gap-2">
                                <h2 className="text-sm md:text-base font-semibold text-gray-800 line-through truncate">
                                    {task.text}
                                </h2>

                                <div className="flex items-center gap-2">
                                    {task.completedCount > 0 && (
                                        <span
                                            className="bg-green-100 text-green-700 text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-sm"
                                            title="Times completed"
                                        >
                                            ✨ {task.completedCount}
                                        </span>
                                    )}
                                    <button
                                        onClick={() => deleteTask(index)}
                                        className="text-gray-400 hover:text-red-500 transition"
                                        title="Delete task"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Type Badge */}
                            {task.type && (
                                <span
                                    className={`inline-flex self-start mt-2 px-2 py-0.5 
                    rounded-full text-[10px] font-medium w-auto 
                    ${typeStyles[task.type]}`}
                                >
                                    {task.type}
                                </span>
                            )}

                            {/* Dates */}
                            <div className="flex flex-col mt-2 gap-1">
                                <p className="flex items-center gap-1 text-[11px] text-gray-500">
                                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                    Created on <span className="text-gray-700">{task.cdt || 'N/A'}</span>
                                </p>
                                {task.enDt && (
                                    <p className="flex items-center gap-1 text-[11px] text-gray-500">
                                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                                        Ends on <span className="text-gray-700">{task.enDt}</span>
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <ToDoFooter />
        </div>
    )
}

export default ToDoOverView
