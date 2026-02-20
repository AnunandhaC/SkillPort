import React, { useState } from 'react';
import { useData } from '../context/DataProvider';
import { Users, Layout, Trash2, Plus } from 'lucide-react';

const AdminDashboard = () => {
    const { templates } = useData();
    const [activeTab, setActiveTab] = useState('users');

    // Hardcoded mock users for display (since AuthProvider only stores current user in localStorage)
    const [mockUsers, setMockUsers] = useState([
        { id: '1', name: 'John Student', role: 'student', email: 'john@edu.com' },
        { id: '2', name: 'Jane Faculty', role: 'faculty', email: 'jane@edu.com' },
        { id: '3', name: 'Admin User', role: 'admin', email: 'admin@edu.com' },
    ]);

    const handleDeleteUser = (id) => {
        if (window.confirm('Are you sure?')) {
            setMockUsers(mockUsers.filter(u => u.id !== id));
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
                <p className="text-slate-400">System configuration and user management.</p>
            </div>

            <div className="flex gap-4 border-b border-white/10 pb-1">
                <button
                    onClick={() => setActiveTab('users')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition ${activeTab === 'users' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400'}`}
                >
                    User Management
                </button>
                <button
                    onClick={() => setActiveTab('templates')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition ${activeTab === 'templates' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400'}`}
                >
                    Template Management
                </button>
            </div>

            {activeTab === 'users' && (
                <div className="glass-panel rounded-xl overflow-hidden">
                    <table className="w-full text-left text-sm text-slate-400">
                        <thead className="bg-white/5 text-slate-200 font-bold uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {mockUsers.map(user => (
                                <tr key={user.id} className="hover:bg-white/5 transition">
                                    <td className="px-6 py-4 text-white font-medium">{user.name}</td>
                                    <td className="px-6 py-4 capitalize">
                                        <span className={`px-2 py-1 rounded text-xs ${user.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : user.role === 'faculty' ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{user.email}</td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleDeleteUser(user.id)}
                                            className="p-2 hover:bg-red-500/20 text-slate-500 hover:text-red-400 rounded transition"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'templates' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {templates.map(t => (
                        <div key={t.id} className="glass-card p-6 rounded-xl border border-white/10">
                            <div className="flex justify-between items-start mb-4">
                                <Layout size={32} className="text-blue-400" />
                                <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded">Active</span>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">{t.name}</h3>
                            <p className="text-sm text-slate-400 mb-4">{t.description}</p>
                            <button className="text-sm text-blue-400 hover:text-blue-300 font-medium">Edit Template</button>
                        </div>
                    ))}
                    <button className="border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center p-6 text-slate-500 hover:border-blue-500/50 hover:text-blue-400 transition cursor-pointer">
                        <Plus size={32} className="mb-2" />
                        <span className="font-medium">Add New Template</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
