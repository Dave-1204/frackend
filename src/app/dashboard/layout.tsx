'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; 
import { getToken, logoutUser } from '@/lib/auth'; 
import { Button } from '@/components/ui/button';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    const router = useRouter();
    var [authChecked, setAuthChecked] = useState(false);

    useEffect(function() {
        const token = getToken(); // runs only on client (safe)
        if (!token) {
            router.push('/login');
        } else {
            setAuthChecked(true);
        }
    }, [router]);

    function handleLogout() {
        logoutUser();
        router.push('/login');
    }

    // Prevents rendering before token check finishes
    if (!authChecked) return null;


    return (
        <>
            <main className="p-6">
                {children}
            </main>
        </>
    );
}

            <header className="bg-white shadow-md p-4">
                <h1 className="text-xl font-bold text-center">Dashboard</h1>
            </header>
    // return (
    //     <div className="min-h-screen bg-gray-100">
    //         <header className="bg-white shadow-md p-4 flex justify-between items-center">
    //             <h1 className="text-xl font-bold">Dashboard</h1>
    //             <Button variant="outline" onClick={handleLogout}>Logout</Button>
    //         </header>
    //         <main className="p-6">
    //             {children}
    //         </main>
    //     </div>
    // );


// 'use client';

// import React, { useEffect } from 'react';
// import { useRouter } from 'next/navigation'; 
// import { getToken, logoutUser } from '@/lib/auth'; 
// import { Button } from '@/components/ui/button';

// export default function DashboardLayout({children}: { 
//     children: React.ReactNode;
// }) {

//     const router = useRouter();
//     const token = getToken();

//     if (!token) {
//         router.push('/login');
//         return null;
//     }

//     function handleLogout() {
//         logoutUser();
//         router.push('/login');
//     }

//     return (
//         <div className="min-h-screen bg-gray-100">
//             <header className="bg-white shadow-md p-4 flex justify-between items-center">
//                 <h1 className="text-xl font-bold">Dashboard</h1>
//                 <Button variant="outline" onClick={handleLogout}>Logout</Button>
//             </header>
//             <main className="p-6">
//                 {children}
//             </main>
//         </div>
//     );
// }