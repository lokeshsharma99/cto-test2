'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if already logged in
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedLoginState = localStorage.getItem('loginState');
      if (storedLoginState) {
        try {
          const parsedState = JSON.parse(storedLoginState);
          if (parsedState.isLoggedIn) {
            router.push('/dashboard');
          }
        } catch (e) {
          // ignore
        }
      }
    }
  }, [router]);

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    // Validate email
    if (!email) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    // Validate password
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Store login state in localStorage
      localStorage.setItem(
        'loginState',
        JSON.stringify({
          email,
          isLoggedIn: true,
          timestamp: new Date().toISOString(),
        })
      );

      // Redirect to dashboard
      router.push('/dashboard');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center gap-8 py-32 px-16 bg-white dark:bg-black">
        <div className="w-full max-w-sm flex flex-col gap-8">
          {/* Header */}
          <div className="flex flex-col items-center text-center">
            <h1 className="text-2xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
              Login
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
              Enter your credentials to access your dashboard
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Email Field */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-black dark:text-zinc-50"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) {
                    setErrors({ ...errors, email: undefined });
                  }
                }}
                className={`w-full px-4 py-2 rounded-lg border text-sm transition-colors ${
                  errors.email
                    ? 'border-red-500 bg-red-50 dark:bg-red-950 focus:outline-none focus:ring-2 focus:ring-red-500'
                    : 'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-50'
                } text-black dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-600`}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="text-xs text-red-600 dark:text-red-400">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-black dark:text-zinc-50"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) {
                    setErrors({ ...errors, password: undefined });
                  }
                }}
                className={`w-full px-4 py-2 rounded-lg border text-sm transition-colors ${
                  errors.password
                    ? 'border-red-500 bg-red-50 dark:bg-red-950 focus:outline-none focus:ring-2 focus:ring-red-500'
                    : 'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-50'
                } text-black dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-600`}
                placeholder="••••••"
              />
              {errors.password && (
                <p className="text-xs text-red-600 dark:text-red-400">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-4 py-2 rounded-lg bg-black dark:bg-zinc-50 text-white dark:text-black font-medium text-sm transition-colors hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
