'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface LoginState {
  email?: string;
  isLoggedIn?: boolean;
}

function getInitialLoginState(): LoginState | null {
  if (typeof window === 'undefined') return null;
  const storedLoginState = localStorage.getItem('loginState');
  if (storedLoginState) {
    try {
      const parsedState = JSON.parse(storedLoginState);
      if (parsedState.isLoggedIn) {
        return parsedState;
      }
    } catch (error) {
      console.error('Failed to parse login state:', error);
    }
  }
  return null;
}

export default function DashboardPage() {
  const router = useRouter();
  const [loginState] = useState<LoginState | null>(getInitialLoginState);

  useEffect(() => {
    // If not logged in, redirect to login page (homepage)
    if (loginState === null) {
      router.push('/');
    }
  }, [loginState, router]);

  const handleLogout = () => {
    // Clear login state from localStorage
    localStorage.removeItem('loginState');
    // Redirect to home page
    router.push('/');
  };

  if (loginState === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <p className="text-zinc-600 dark:text-zinc-400">Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center gap-8 py-32 px-16 bg-white dark:bg-black">
        <div className="w-full max-w-sm flex flex-col gap-8">
          {/* Header */}
          <div className="flex flex-col items-center text-center">
            <h1 className="text-2xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
              Welcome!
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
              You have successfully logged in.
            </p>
          </div>

          {/* User Info */}
          <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-4">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Logged in as:
            </p>
            <p className="text-base font-medium text-black dark:text-zinc-50 mt-1">
              {loginState?.email}
            </p>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 rounded-lg bg-black dark:bg-zinc-50 text-white dark:text-black font-medium text-sm transition-colors hover:bg-zinc-800 dark:hover:bg-zinc-200"
          >
            Logout
          </button>
        </div>
      </main>
    </div>
  );
}
