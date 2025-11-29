"use client";
import { getToken } from "@/lib/auth"; 
import { jwtDecode } from "jwt-decode"; 
import React, { useEffect } from 'react';

interface JwtPayload {
    sub: number; username: string; role: string; exp: number; iat: number;
}

export default function DashboardHome() {

    const token = getToken();
    let username = 'Guest';

    if (token) {
        try {
        const decoded = jwtDecode<JwtPayload>(token);

        if (decoded.username) {
            username = decoded.username;
        }
        } catch (e) {
        console.error("Token decoding failed: ", e);
        }
    }
    
    return (
<div className="space-y-6">
  {/* Welcome Card */}
  <div className="p-6 rounded-3xl bg-white text-center">
    <h2 className="text-xl font-semibold text-gray-800">Welcome, {username}!</h2>
  </div>

  {/* Announcement Card */}
  <div className="p-6 rounded-3xl bg-white">
    <h3 className="text-lg font-semibold text-gray-800 mb-3">Announcements:</h3>
    <ul className="space-y-2 text-gray-700 text-sm">
      <li className="flex items-start">
        <span className="mr-2">📢</span>
        Finals schedule released — Nov 30, 2025
      </li>
      <li className="flex items-start">
        <span className="mr-2">🎉</span>
        Campus event this Friday — Dec 5, 2025
      </li>
      <li className="flex items-start">
        <span className="mr-2">📄</span>
        Submission deadline: Dec 10, 2025
      </li>
    </ul>
    <button className="mt-3 text-sm text-purple-600 underline hover:text-purple-800 transition">
      View All
    </button>
  </div>
</div>


//         <div className="space-y-6">
//   {/* Welcome Card */}
//   <div className="p-6 rounded-3xl bg-white/10 backdrop-blur-xl">
//     <h2 className="text-xl font-semibold text-white">Welcome, {username}!</h2>
//   </div>

//   {/* Announcement Card */}
//   <div className="p-6 rounded-3xl bg-white/10 backdrop-blur-xl">
//     <h3 className="text-lg font-semibold text-white mb-3">Announcements</h3>
//     <ul className="space-y-2 text-white text-sm">
//       <li>📢 Finals schedule released — Nov 30, 2025</li>
//       <li>🎉 Campus event this Friday — Dec 5, 2025</li>
//       <li>📄 Submission deadline: Dec 10, 2025</li>
//     </ul>
//     <button className="mt-3 text-sm text-purple-200 underline hover:text-purple-400 transition">
//       View All
//     </button>
//   </div>
// </div>

        // <div>
        // <h2 className="text-x1 font-semibold mb-2">Welcome, {username}</h2> 
        // {token && (
        //     <>
        //     <p>Your Bearer Token:</p>
        //     <pre className="p-2 bg-slate-100 text-xs mt-2 break-all">{token}</pre> 
        //     </>
        // )}
        // </div>
    );
}