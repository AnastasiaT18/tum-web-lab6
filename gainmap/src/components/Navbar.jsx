function Navbar({darkMode, setDarkMode}) {
    return (
        <nav className="max-w-full mx-auto mb-8 bg-stone-50 dark:bg-stone-900 p-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-medium text-stone-800 dark:text-stone-100">Gain<span className="text-orange-400">Map</span></h1>
                    <p className="text-sm text-stone-800  dark:text-stone-100">Track your fitness journey</p>
                </div>

                <button onClick={() => setDarkMode(!darkMode)}
                    className="text-sm px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-600 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors"
                        >
                    {darkMode ? "☀️ Light" : "🌙 Dark"}
                </button>
            </div>
        </nav>
    )


}

export default Navbar
