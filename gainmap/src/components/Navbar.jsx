function Navbar({darkMode, setDarkMode}) {
    return (
        <nav className="max-w-full mx-auto px-4 sm:px-6 py-5 sm:py-7 mb-2">
            <div className="flex items-center justify-between">
                <div>
                <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-stone-900 dark:text-stone-50">
                    Gain<span className="text-brand">Map</span>
                </h1>                                        
                <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5 tracking-wide uppercase">
                    Track your fitness journey</p>
                </div>

                <button onClick={() => setDarkMode(!darkMode)}
                    className="flex items-center gap-2 text-sm px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-all"                        >
                    {darkMode ? "☀️ Light" : "🌙 Dark"}
                </button>
            </div>
        </nav>
    )


}

export default Navbar
