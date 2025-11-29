"use client";

// Save token to localStorage
export function saveToken(token: string) {
    if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
    }
}

// Get token from localStorage
export function getToken(): string | null {
    if (typeof window !== "undefined") {
        return localStorage.getItem("token");
    }
    return null;
}

// Remove token from localStorage (logout)
export function logoutUser() {
    if (typeof window !== "undefined") {
        localStorage.removeItem("token");
    }
}
