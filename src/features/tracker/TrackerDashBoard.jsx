import React from 'react'
import { NavLink } from 'react-router-dom'
import { PlusCircle, Wallet, BarChart3 } from 'lucide-react'  // icons for expense tracker

function TrackerDashBoard() {
  const apps = [
    {
      title: "Add Book",
      description: "Categories your expenses",
      icon: <PlusCircle className="w-6 h-6 text-blue-600" />,
      path: "/tracker/addbook",
    },
     {
      title: "Add Xpense",
      description: "Record your new expenses easily",
      icon: <PlusCircle className="w-6 h-6 text-orange-600" />,
      path: "/tracker/add",
    },
    {
      title: "My Books",
      description: "View and manage types of books",
      icon: <Wallet className="w-6 h-6 text-purple-600" />,
      path: "/tracker/viewlist",
    },
    // {
    //   title: "Reports",
    //   description: "See your spending insights",
    //   icon: <BarChart3 className="w-6 h-6 text-orange-600" />,
    //   path: "/tracker/reports",
    // },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 flex flex-col items-center">
      {/* Header */}
      <h1 className="text-2xl font-bold text-slate-700 mb-8 tracking-tight">
        Expense Tracker
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

export default TrackerDashBoard
