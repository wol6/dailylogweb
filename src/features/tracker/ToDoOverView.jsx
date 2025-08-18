import React, { useEffect, useState } from 'react'
import Storage from '../../utils/storage'
import { typeStyles } from '../todo/ToDo'

function ToDoOverView() {
    const [completedList, setCompletedList] = useState([])
    const [taskCount, setTaskCount] = useState({
        task: 0,
        recurring: 0,
        habit: 0,
    })

    useEffect(() => {
        const saved = Storage.get('completedTask', [])

        // compute counts
        const counts = { task: 0, recurring: 0, habit: 0 }
        saved.forEach((task) => {
            if (task.type === 'Task') counts.task++
            if (task.type === 'Recurring Task') counts.recurring++
            if (task.type === 'Habit') counts.habit++
        })

        setTaskCount(counts)
        setCompletedList(saved)
    }, [])

    const clearList = () => {
        localStorage.removeItem('completedTask')
        setCompletedList([])
        setTaskCount({ task: 0, recurring: 0, habit: 0 })
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

            {/* Summary */}
            {completedList.length > 0 && (
                <div className="grid grid-cols-3 gap-3 max-w-5xl mx-auto mb-6">
                    <div className="bg-white rounded-xl shadow-sm p-3 text-center">
                        <p className="text-xs text-gray-500">Tasks</p>
                        <p className="text-lg font-bold text-green-600">{taskCount.task}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-3 text-center">
                        <p className="text-xs text-gray-500">Recurring</p>
                        <p className="text-lg font-bold text-rose-500">{taskCount.recurring}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-3 text-center">
                        <p className="text-xs text-gray-500">Habits</p>
                        <p className="text-lg font-bold text-purple-600">{taskCount.habit}</p>
                    </div>
                </div>
            )}

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
                            className="bg-white rounded-xl shadow-sm p-4 flex flex-col 
                hover:shadow-md transition-all duration-200"
                        >
                            {/* Title */}
                            <h2 className="text-base md:text-lg font-semibold text-gray-800 line-through">
                                {task.text}
                            </h2>

                            {/* Type Badge */}
                            {task.type && (
                                <span
                                    className={`inline-flex self-start mt-1 px-2.5 py-1 
                    rounded-full text-xs font-medium w-auto 
                    ${typeStyles[task.type]}`}
                                >
                                    {task.type}
                                </span>
                            )}

                            {/* Completed Date */}
                            <p className="text-[11px] md:text-xs text-gray-400 mt-3">
                                ✅ Completed on{' '}
                                <span className="text-gray-700">{task.cdt || 'N/A'}</span>
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ToDoOverView
