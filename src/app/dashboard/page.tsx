"use client";

import { getToken, logoutUser } from "@/lib/auth"; 
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation'; 

import { API_BASE } from '@/lib/config';

interface Position {
  position_id?: number;
  position_tag: string;
  position_title: string;
}

export default function DashboardHome() {
  const router = useRouter();
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoaading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  //For state for create / edit
  const [positionTag, setPositionTag] = useState('');
  const [positionTitle, setPositionTitle] = useState('');
  const [editingPositionId, setEditingPositionId] = useState<number | null>(null);
    
  // ensure user is authenticated
  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push('/login');
      return;
    }
    fetchPositions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function authHeaders() {
    const token = getToken();
    return {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    };
  }

  /* method to fetch the data from the backend [GET] */
  async function fetchPositions() {
    setLoaading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/positions`, {
        method: 'GET',
        headers: authHeaders(),
      });

      if (res.status === 401) {
        // Unauthorized, og out and redirect 
        logoutUser();
        router.push('/login');
        return;
      }

      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`); 
      const data = await res.json();
      setPositions(data);
    } catch (e: any) {
      setError(e?.message || 'Failed to fetch positions');
    } finally {
      setLoaading(false);
    }
  }

  /* This handles the creation of data (positions) using the POST Method and data modification using the PUT method */
  async function handleCreateOrUpdate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);   

    const payload: Position = { position_tag: positionTag, position_title: positionTitle };

    try {
      let res; Response;
      if (editingPositionId) {
        // Update existing position
        res = await fetch(`${`${API_BASE}/positions`}/${editingPositionId}`, {
          method: 'PUT',
          headers: authHeaders(),
          body: JSON.stringify(payload),
        });
      } else {
        // Create new position
        res = await fetch(`${API_BASE}/positions`, {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify(payload),
        });
      }

      if (res.status === 401) {
        logoutUser();
        router.push('/login');
        return;
      }

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || `Request failed: ${res.status}`);
      }
      
      //success - refresh list and reset form
      setPositionTag('');
      setPositionTitle('');
      setEditingPositionId(null);
      await fetchPositions();
    } catch (e: any) {
      setError(e?.message || 'Save failed');
    }
  }

  function startEdit(p: Position) {  
    setEditingPositionId(p.position_id ?? null);
    setPositionTag(p.position_tag);
    setPositionTitle(p.position_title);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleDelete(id?: number) {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this position?')) return;
    setError(null);
    try {
      const res = await fetch(`${`${API_BASE}/positions`}/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });

      if (res.status === 401) {
        logoutUser();
        router.push('/login');
        return;   
      }

      if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
      await fetchPositions();
    } catch (e: any) {
      setError(e?.message || 'Delete failed');
    }
  }

  function handleCancelEdit() {
    setEditingPositionId(null);
    setPositionTag('');
    setPositionTitle('');
  }

  function handleLogout() {
    logoutUser();
    router.push('/login');
  }

return (
  <div className="min-h-screen bg-gradient-to-br from-purple-300 to-blue-300 flex items-center justify-center p-6">
    <div className="w-full max-w-4xl p-6 rounded-3xl shadow-2xl bg-white backdrop-blur-xl border border-gray-200">

      {/* Header */}
      <div className="text-center mb-6">
        <div className="mx-auto w-14 h-14 rounded-full bg-gradient-to-br from-purple-300 to-blue-300 flex items-center justify-center shadow-lg">
          <span className="text-2xl">📋</span>
        </div>
        <h1 className="mt-3 text-2xl font-bold text-gray-800">Position Dashboard</h1>
        <p className="text-sm text-gray-500">Manage your position roles</p>
      </div>

      {/* Form Card */}
<div className="mb-6">
  <h2 className="text-lg font-semibold mb-2 text-gray-700">
    {editingPositionId ? 'Edit Position' : 'Create New Position'}
  </h2>
  <form
    onSubmit={handleCreateOrUpdate}
    className="space-y-4 md:grid md:grid-cols-3 md:gap-4 md:space-y-0"
  >
    <input
      className="w-full px-4 py-3 bg-white/50 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-purple-300 outline-none transition-all"
      placeholder="Position Tag"
      value={positionTag}
      onChange={(e) => setPositionTag((e.target as HTMLInputElement).value)}
      required
    />
    <input
      className="w-full px-4 py-3 bg-white/50 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-purple-300 outline-none transition-all"
      placeholder="Position Title"
      value={positionTitle}
      onChange={(e) => setPositionTitle((e.target as HTMLInputElement).value)}
      required
    />

    {/* Action buttons */}
    <div className="flex gap-2">
      <button
        type="submit"
        className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-400 to-blue-400 text-white font-semibold shadow-lg hover:opacity-90 transition"
      >
        {editingPositionId ? 'Update' : 'Create'}
      </button>

      <button
        type="button"
        onClick={() => fetchPositions()}
        className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-400 to-blue-400 text-white font-semibold shadow-lg hover:opacity-90 transition"
      >
        Refresh
      </button>

      <button
        type="button"
        onClick={handleLogout}
        className="px-4 py-2 rounded-xl bg-red-500 text-white font-semibold shadow-lg hover:bg-red-600 transition"
      >
        Logout
      </button>

      {editingPositionId && (
        <button
          type="button"
          onClick={handleCancelEdit}
          className="px-4 py-2 rounded-xl bg-white border border-gray-300 text-gray-700 font-semibold shadow-sm hover:bg-gray-50 transition"
        >
          Cancel
        </button>
      )}
    </div>
  </form>
  {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
</div>


      {/* Table Section */}
      <section>
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          Positions List {loading && '(loading...)'}
        </h2>
        <div className="overflow-x-auto bg-white/70 rounded-3xl shadow-md border border-gray-200">
          <table className="w-full text-left">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-4 py-2 border-b">ID</th>
                <th className="px-4 py-2 border-b">Tag</th>
                <th className="px-4 py-2 border-b">Title</th>
                <th className="px-4 py-2 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {positions.length === 0 && !loading && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-2 text-center text-sm text-slate-500"
                  >
                    No positions found.
                  </td>
                </tr>
              )}
              {positions.map((p) => (
                <tr key={p.position_id} className="border-t">
                  <td className="px-4 py-2 align-top">{p.position_id}</td>
                  <td className="px-4 py-2 align-top">{p.position_tag}</td>
                  <td className="px-4 py-2 align-top">{p.position_title}</td>
                  <td className="px-4 py-2 align-top">
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(p)}
                        className="px-3 py-1 rounded bg-white border border-gray-300 text-sm text-gray-700 shadow-sm hover:bg-gray-50 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p.position_id)}
                        className="px-3 py-1 rounded bg-red-500 text-sm text-white shadow-sm hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </div>
);
}

// {/* Form Card */}
//       <div className="mb-6">
//         <h2 className="text-lg font-semibold mb-2 text-gray-700">
//           {editingPositionId ? 'Edit Position' : 'Create New Position'}
//         </h2>
//         <form
//           onSubmit={handleCreateOrUpdate}
//           className="space-y-4 md:grid md:grid-cols-3 md:gap-4 md:space-y-0"
//         >
//           <input
//             className="w-full px-4 py-3 bg-white/50 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-purple-300 outline-none transition-all"
//             placeholder="Position Tag"
//             value={positionTag}
//             onChange={(e) => setPositionTag((e.target as HTMLInputElement).value)}
//             required
//           />
//           <input
//             className="w-full px-4 py-3 bg-white/50 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-purple-300 outline-none transition-all"
//             placeholder="Position Title"
//             value={positionTitle}
//             onChange={(e) => setPositionTitle((e.target as HTMLInputElement).value)}
//             required
//           />

//           {/* Action buttons */}
//           <div className="flex gap-2">
//             <button
//               type="submit"
//               className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-400 to-blue-400 text-white font-semibold shadow-lg hover:opacity-90 transition"
//             >
//               {editingPositionId ? 'Update' : 'Create'}
//             </button>

//             <button
//               type="button"
//               onClick={() => fetchPositions()}
//               className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-400 to-blue-400 text-white font-semibold shadow-lg hover:opacity-90 transition"
//             >
//               Refresh
//             </button>

//             {editingPositionId && (
//               <button
//                 type="button"
//                 onClick={handleCancelEdit}
//                 className="px-4 py-2 rounded-xl bg-white border border-gray-300 text-gray-700 font-semibold shadow-sm hover:bg-gray-50 transition"
//               >
//                 Cancel
//               </button>
//             )}
//           </div>
//         </form>
//         {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
//       </div>

//     return (
//   <div className="min-h-screen bg-gradient-to-br from-purple-300 to-blue-300 flex items-center justify-center p-6">
//     <div className="w-full max-w-4xl p-6 rounded-3xl shadow-2xl bg-white backdrop-blur-xl border border-gray-200">

//       {/* Header */}
//       <div className="text-center mb-6">
//         <div className="mx-auto w-14 h-14 rounded-full bg-gradient-to-br from-purple-300 to-blue-300 flex items-center justify-center shadow-lg">
//           <span className="text-2xl">📋</span>
//         </div>
//         <h1 className="mt-3 text-2xl font-bold text-gray-800">Position Dashboard</h1>
//         <p className="text-sm text-gray-500">Manage your organizational roles</p>

//            {/* Refresh Button */}
//         <div className="flex justify-center gap-3 mt-4">
//           <button
//             onClick={() => fetchPositions()}
//             className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-400 to-blue-400 text-white font-semibold shadow-lg hover:opacity-90 transition"
//           >
//             Refresh
//           </button>
//         </div>
//       </div>

// {/* Form Card */}
// <div className="mb-6">
//   <h2 className="text-lg font-semibold mb-2 text-gray-700">
//     {editingPositionId ? 'Edit Position' : 'Create New Position'}
//   </h2>
//   <form
//     onSubmit={handleCreateOrUpdate}
//     className="space-y-4 md:grid md:grid-cols-3 md:gap-4 md:space-y-0"
//   >
//     <input
//       className="w-full px-4 py-3 bg-white/50 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-purple-300 outline-none transition-all"
//       placeholder="Position Tag"
//       value={positionTag}
//       onChange={(e) => setPositionTag((e.target as HTMLInputElement).value)}
//       required
//     />
//     <input
//       className="w-full px-4 py-3 bg-white/50 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-purple-300 outline-none transition-all"
//       placeholder="Position Title"
//       value={positionTitle}
//       onChange={(e) => setPositionTitle((e.target as HTMLInputElement).value)}
//       required
//     />

//     {/* Action buttons */}
//     <div className="flex gap-2">
//       <button
//         type="submit"
//         className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-400 to-blue-400 text-white font-semibold shadow-lg hover:opacity-90 transition"
//       >
//         {editingPositionId ? 'Update' : 'Create'}
//       </button>

//       <button
//         type="button"
//         onClick={() => fetchPositions()}
//         className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-400 to-blue-400 text-white font-semibold shadow-lg hover:opacity-90 transition"
//       >
//         Refresh
//       </button>

//       {editingPositionId && (
//         <button
//           type="button"
//           onClick={handleCancelEdit}
//           className="px-4 py-2 rounded-xl bg-white border border-gray-300 text-gray-700 font-semibold shadow-sm hover:bg-gray-50 transition"
//         >
//           Cancel
//         </button>
//       )}
//     </div>
//   </form>
//   {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
// </div>

//       {/* Table Section */}
//       <section>
//         <h2 className="text-lg font-semibold mb-4 text-gray-700">
//           Positions List {loading && '(loading...)'}
//         </h2>
//         <div className="overflow-x-auto bg-white/70 rounded-3xl shadow-md border border-gray-200">
//           <table className="w-full text-left">
//             <thead className="bg-slate-100">
//               <tr>
//                 <th className="px-4 py-2 border-b">ID</th>
//                 <th className="px-4 py-2 border-b">Tag</th>
//                 <th className="px-4 py-2 border-b">Title</th>
//                 <th className="px-4 py-2 border-b">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {positions.length === 0 && !loading && (
//                 <tr>
//                   <td
//                     colSpan={4}
//                     className="px-4 py-2 text-center text-sm text-slate-500"
//                   >
//                     No positions found.
//                   </td>
//                 </tr>
//               )}
//               {positions.map((p) => (
//                 <tr key={p.position_id} className="border-t">
//                   <td className="px-4 py-2 align-top">{p.position_id}</td>
//                   <td className="px-4 py-2 align-top">{p.position_tag}</td>
//                   <td className="px-4 py-2 align-top">{p.position_title}</td>
//                   <td className="px-4 py-2 align-top">
//                     <div className="flex gap-2">
//                       <button
//                         onClick={() => startEdit(p)}
//                         className="px-3 py-1 rounded bg-white border border-gray-300 text-sm text-gray-700 shadow-sm hover:bg-gray-50 transition"
//                       >
//                         Edit
//                       </button>
//                       <button
//                         onClick={() => handleDelete(p.position_id)}
//                         className="px-3 py-1 rounded bg-red-500 text-sm text-white shadow-sm hover:bg-red-600 transition"
//                       >
//                         Delete
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </section>
//     </div>
//   </div>
// );
// }

//   return (
//     <div className="min-h-screen bg slate-50 p-6 ">
//   <div className="max-w-4xl mx-auto">
//     <header className="flex justify-between items-center mb-6">
//       <h1 className="text-2xl font-bold">Position Dashboard</h1>
//       <div className="flex items-center gap-3">
//         <Button variant="outline" onClick={() => fetchPositions()}>Refresh</Button>
//         <Button variant="destructive" onClick={handleLogout}>Logout</Button>
//       </div>
//     </header>

//     <Card className="mb-6">
//       <CardContent>
//         <h2 className="text-lg font-semibold mb-2">{editingPositionId ? 'Edit Position' : 'Create New Position'}</h2>
//         <form onSubmit={handleCreateOrUpdate} className="grid grid-cols-1 md:grid-cols-3 gap-3">
//           <Input
//             placeholder="Position Tag"
//             value={positionTag}
//             onChange={(e) => setPositionTag((e.target as HTMLInputElement).value)}
//             required
//           />
//           <Input
//             placeholder="Position Title"
//             value={positionTitle}
//             onChange={(e) => setPositionTitle((e.target as HTMLInputElement).value)}
//             required
//           />

//           <div className="flex gap-2">
//             <Button type="submit">{editingPositionId ? 'Update' : 'Create'}</Button>
//             {editingPositionId && (
//               <Button variant="outline" onClick={handleCancelEdit}>Cancel</Button>
//             )}
//           </div>
//         </form>
//         {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
//       </CardContent>
//     </Card>

//     <section>
//       <h2 className="text-lg font-semibold mb-4">Positions List {loading && '(loading...)'}</h2>

//       <div className="overflow-x-auto bg-white rounded shadow">
//         <table className="w-full text-left">
//           <thead className="bg-slate-100">
//             <tr>
//               <th className="px-4 py-2 border-b">ID</th>
//               <th className="px-4 py-2 border-b">Tag</th>
//               <th className="px-4 py-2 border-b">Title</th>
//               <th className="px-4 py-2 border-b">Actions</th>
//             </tr> 
//           </thead>
//           <tbody>
//             {positions.length === 0 && !loading && (
//               <tr>
//                 <td colSpan={4} className="px-4 py-2 text-center text-sm text-slate-500">No positions found.</td>
//               </tr>
//             )}

//             {positions.map((p) => (
//               <tr key={p.position_id} className="border-t">
//                 <td className="px-4 py-2 align-top">{p.position_id}</td>
//                 <td className="px-4 py-2 align-top">{p.position_tag}</td>
//                 <td className="px-4 py-2 align-top">{p.position_title}</td>
//                 <td className="px-4 py-2 align-top">
//                   <div className="flex gap-2">
//                     <Button variant="outline" size="sm" onClick={() => startEdit(p)}>Edit</Button>
//                     <Button variant="destructive" size="sm" onClick={() => handleDelete(p.position_id)}>Delete</Button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>  
//       </div>
//     </section>
//   </div>
// </div>
//   );
// }


// interface JwtPayload {
//     sub: number; username: string; role: string; exp: number; iat: number;
// }

// export default function DashboardHome() {

//     const token = getToken();
//     let username = 'Guest';

//     if (token) {
//         try {
//         const decoded = jwtDecode<JwtPayload>(token);

//         if (decoded.username) {
//             username = decoded.username;
//         }
//         } catch (e) {
//         console.error("Token decoding failed: ", e);
//         }
//     }
    
//     return (
// <div className="space-y-6">
//   {/* Welcome Card */}
//   <div className="p-6 rounded-3xl bg-white text-center">
//     <h2 className="text-xl font-semibold text-gray-800">Welcome, {username}!</h2>
//   </div>

//   {/* Announcement Card */}
//   <div className="p-6 rounded-3xl bg-white">
//     <h3 className="text-lg font-semibold text-gray-800 mb-3">Announcements:</h3>
//     <ul className="space-y-2 text-gray-700 text-sm">
//       <li className="flex items-start">
//         <span className="mr-2">📢</span>
//         Finals schedule released — Nov 30, 2025
//       </li>
//       <li className="flex items-start">
//         <span className="mr-2">🎉</span>
//         Campus event this Friday — Dec 5, 2025
//       </li>
//       <li className="flex items-start">
//         <span className="mr-2">📄</span>
//         Submission deadline: Dec 10, 2025
//       </li>
//     </ul>
//     <button className="mt-3 text-sm text-purple-600 underline hover:text-purple-800 transition">
//       View All
//     </button>
//   </div>
// </div>
//     );
// }