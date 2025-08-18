import React from 'react'
import { NavLink } from 'react-router-dom'
import { PlusCircle, LayoutDashboard } from 'lucide-react'  // modern icons

function ToDoDashBoard() {
    const apps = [
        {
            title: "Add Task",
            description: "Quickly add your new tasks",
            icon: <PlusCircle className="w-6 h-6 text-blue-600" />,
            path: "/todo/add", 
        },
        {
            title: "Overview",
            description: "Track your tasks & progress",
            icon: <LayoutDashboard className="w-6 h-6 text-green-600" />,
            path: "/todo/overview",
        },
    ];  

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 flex flex-col items-center">
            {/* Header */}
            <h1 className="text-2xl font-bold text-slate-700 mb-8 tracking-tight">
                Dashboard
            </h1>

            {/* App Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
                {apps.map((app, index) => (
                    <NavLink
                        to={app.path}
                        key={index}
                        className="bg-white shadow-sm rounded-xl p-4 flex flex-col items-center text-center 
                                   hover:shadow-md hover:-translate-y-1 hover:bg-slate-50 transition-all duration-200"
                    >
                        <div className="mb-2">{app.icon}</div>
                        <h2 className="text-base font-semibold text-gray-800">
                            {app.title}
                        </h2>
                        <p className="text-xs text-gray-500 mt-1">{app.description}</p>
                    </NavLink>
                ))}
            </div>
        </div>
    )
}

export default ToDoDashBoard
