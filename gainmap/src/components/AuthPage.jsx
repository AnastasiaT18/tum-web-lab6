import {api} from "../api";
import { useState } from "react";
import toast from "react-hot-toast";  // ← default import


function AuthPage({onAuthSuccess}) {

    const [mode, setMode] = useState("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try{
            if (mode === "login") {
                await api.login(email, password);
            }
            else {
                await api.register(email, password);
            }
            onAuthSuccess();
        }catch(err){
            console.error('Authentication error:', err);
            toast.error(err.message || 'An error occurred during authentication');
        }finally{
            setLoading(false);
        }
        
    }

    return (
        <div className="font-sans min-h-screen bg-stone-50 dark:bg-stone-950 transition-colors duration-300 flex flex-col items-center justify-center">
            <div className="w-full max-w-sm">

                {/* Logo / title */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-50 tracking-tight">
                        GainMap
                    </h1>
                    <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                        {mode === "login" ? "Log in to your account" : "Create a new account"}
                    </p>
                </div>

                <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-sm border border-stone-200/60 dark:border-stone-800 p-6">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-stone-600 dark:text-stone-400 uppercase tracking-wide"> Email</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required 
                                className="w-full px-3 py-2.5 rounded-xl text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand transition-colors"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-stone-600 dark:text-stone-400 uppercase tracking-wide"> Password</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={mode === "login" ? "••••••••" : "Min. 6 characters"} required 
                                className="w-full px-3 py-2.5 rounded-xl text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand transition-colors"
                            />
                        </div>
                        <button 
                            type="submit"
                            disabled={loading}
                            className = "mt-1 w-full px-4 py-3 bg-brand text-white rounded-xl font-medium text-sm hover:bg-brand-light active:scale-[0.98] transition-all shadow-sm shadow-brand/30 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                            {loading ? (mode === "login" ? "Logging in..." : "Registering...") : (mode === "login" ? "Log In" : "Register"  )}
                        </button>
                    </form>
                </div>

                 <p className="mt-4 text-center text-sm text-stone-500 dark:text-stone-400">
                    {mode === "login" ? "Don't have an account? " : "Already have an account? "}
                    <button onClick={()=> {setMode(mode === "login" ? "register" : "login"); setEmail(""); setPassword("");}} className="text-brand font-medium hover:underline">
                        {mode === "login" ? "Sign Up" : "Log In"}
                    </button>
                </p>
            </div>
        </div>
    );
}

export default AuthPage;