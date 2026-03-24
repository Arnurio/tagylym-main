"use client";

import { useEffect } from "react";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg
                    className="w-8 h-8 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    ></path>
                </svg>
            </div>
            <h2 className="text-3xl font-bold text-[#1A1A1A]">
                Something went wrong!
            </h2>
            <p className="text-gray-600 max-w-md">
                We apologize, but an unexpected error has occurred. Please try reloading the page.
            </p>
            <button
                onClick={() => reset()}
                className="px-6 py-3 bg-[#0B5CFF] text-white rounded-full font-semibold hover:bg-blue-700 transition-colors shadow-lg"
            >
                Try again
            </button>
        </div>
    );
}
