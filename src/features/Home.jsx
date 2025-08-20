import React from "react";
import { NavLink } from "react-router-dom";

function Home() {
    const apps = [
        {
            title: "Expense Tracker",
            description: "Track your daily spending with ease.",
            icon: "🪙",
            path: "/tracker",
        },
        {
            title: "To-Do List",
            description: "Stay on top of your tasks.",
            icon: "✏️",
            path: "/todo",
        },
        {
            title: "Daily Reps",
            description: "Log workouts, reps, and progress towards fitness goals.",
            icon: "💪",
            path: "/dailyrep", // route for workout tracker
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-6 flex flex-col items-center">
            {/* Header */}
            <h1 className="text-3xl font-bold text-slate-700 mb-8">
                My Console
            </h1>

            {/* App Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
                {apps.map((app, index) => (
                    <NavLink
                        to={app.path}
                        key={index}
                        className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center text-center hover:shadow-lg transition duration-200"
                    >
                        <div className="text-5xl mb-4">{app.icon}</div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">
                            {app.title}
                        </h2>
                        <p className="text-gray-600 mb-4">{app.description}</p>
                    </NavLink>
                ))}
            </div>

            {/* Footer */}
            <footer className="mt-10 text-sm text-gray-500">
                © {new Date().getFullYear()} Daily•Logs{" "}
                <span className="text-gray-400">|</span> Version 2.0.0
            </footer>
        </div>
    );
}

export default Home;
