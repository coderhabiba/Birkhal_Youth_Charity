"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Invalid credentials");
      }
    } catch (err) {
      setError("An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center font-body-lg text-body-lg bg-surface-container-low dark:bg-background py-12">
      <main className="w-full max-w-md px-6">
        <div className="bg-surface-container-lowest dark:bg-surface-container-lowest shadow-md p-8 w-full border border-border rounded-xl">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Image 
                src="/logo.png" 
                alt="Birkhal Youth Logo" 
                width={70} 
                height={70} 
                className="object-contain drop-shadow-sm" 
                priority 
              />
            </div>
            <h1 className="font-headline-lg text-2xl md:text-3xl text-foreground font-bold mb-2">Admin Login</h1>
            <p className="font-body-md text-sm text-on-surface-variant">
              Welcome back to the Birkhal Youth Admin Console.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-600 text-sm text-center font-bold rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block font-label-md text-xs font-bold text-foreground mb-2" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-on-surface-variant" />
                </div>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@birkhal.org" 
                  required 
                  className="block w-full pl-10 pr-3 py-3 border border-border bg-surface dark:bg-background text-foreground placeholder:text-outline-variant focus:outline-none focus:border-growth-green text-sm rounded-xl" 
                />
              </div>
            </div>

            <div>
              <label className="block font-label-md text-xs font-bold text-foreground mb-2" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-on-surface-variant" />
                </div>
                <input 
                  type="password" 
                  id="password" 
                  name="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  required 
                  className="block w-full pl-10 pr-3 py-3 border border-border bg-surface dark:bg-background text-foreground placeholder:text-outline-variant focus:outline-none focus:border-growth-green text-sm rounded-xl" 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 shadow-sm font-bold text-white bg-growth-green hover:bg-[#236026] transition-colors disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer rounded-xl"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
