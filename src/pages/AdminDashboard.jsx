import React, { useEffect, useState } from 'react';
import { useData } from '../context/DataProvider';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Layout, Plus } from 'lucide-react';

const AdminDashboard = () => {
    const { templates, opportunities, createOpportunity } = useData();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('users');
    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [error, setError] = useState('');
    const [opportunityStatus, setOpportunityStatus] = useState('');
    const [isSavingOpportunity, setIsSavingOpportunity] = useState(false);
    const [opportunityForm, setOpportunityForm] = useState({
        title: '',
        company: '',
        type: 'Internship',
        minGpa: '',
        incomeLimit: '',
        requiredSkills: '',
        description: '',
    });

    const loadUsers = async () => {
        setLoadingUsers(true);
        try {
            const { data, error: listError } = await supabase
                .from('profiles')
                .select('id, full_name, email, role, created_at')
                .order('created_at', { ascending: false });
            if (listError) throw listError;
            setUsers(data || []);
        } catch (listError) {
            setError(listError.message || 'Failed to load users.');
        } finally {
            setLoadingUsers(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

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
                <button
                    onClick={() => setActiveTab('opportunities')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition ${activeTab === 'opportunities' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400'}`}
                >
                    Opportunity Management
                </button>
            </div>

            {activeTab === 'users' && (
                <div className="space-y-6">
                    <div className="glass-panel rounded-xl overflow-hidden">
                    {error && <p className="px-6 pt-4 text-sm text-red-400">{error}</p>}
                    <table className="w-full text-left text-sm text-slate-400">
                        <thead className="bg-white/5 text-slate-200 font-bold uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Email</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loadingUsers ? (
                                <tr>
                                    <td className="px-6 py-4 text-slate-400" colSpan={3}>Loading users...</td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td className="px-6 py-4 text-slate-400" colSpan={3}>No users found.</td>
                                </tr>
                            ) : users.map(user => (
                                <tr key={user.id} className="hover:bg-white/5 transition">
                                    <td className="px-6 py-4 text-white font-medium">{user.full_name || 'Unnamed'}</td>
                                    <td className="px-6 py-4 capitalize">
                                        <span className={`px-2 py-1 rounded text-xs ${user.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : user.role === 'faculty' ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{user.email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
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
                            <button
                                type="button"
                                onClick={() => navigate(`/design-lab?action=edit&template=${encodeURIComponent(t.id)}`)}
                                className="text-sm text-blue-400 hover:text-blue-300 font-medium"
                            >
                                Edit Template
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => navigate('/design-lab?action=create')}
                        className="border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center p-6 text-slate-500 hover:border-blue-500/50 hover:text-blue-400 transition cursor-pointer"
                    >
                        <Plus size={32} className="mb-2" />
                        <span className="font-medium">Add New Template</span>
                    </button>
                </div>
            )}

            {activeTab === 'opportunities' && (
                <div className="space-y-6">
                    <div className="glass-panel rounded-xl p-6">
                        <h2 className="text-xl font-bold text-white mb-2">Add New Opportunity</h2>
                        <p className="text-sm text-slate-400 mb-5">
                            Enter the opportunity details you want students to see and match against.
                        </p>

                        <form
                            onSubmit={async (e) => {
                                e.preventDefault();
                                setOpportunityStatus('');
                                setError('');

                                try {
                                    setIsSavingOpportunity(true);
                                    await createOpportunity({
                                        ...opportunityForm,
                                        incomeLimit: opportunityForm.type === 'Scholarship' ? opportunityForm.incomeLimit : '',
                                    });
                                    setOpportunityStatus('Opportunity added successfully.');
                                    setOpportunityForm({
                                        title: '',
                                        company: '',
                                        type: 'Internship',
                                        minGpa: '',
                                        incomeLimit: '',
                                        requiredSkills: '',
                                        description: '',
                                    });
                                } catch (saveError) {
                                    setError(saveError.message || 'Failed to add opportunity.');
                                } finally {
                                    setIsSavingOpportunity(false);
                                }
                            }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-4"
                        >
                            <input
                                type="text"
                                value={opportunityForm.title}
                                onChange={(e) => setOpportunityForm((prev) => ({ ...prev, title: e.target.value }))}
                                placeholder="Opportunity title"
                                className="bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            <input
                                type="text"
                                value={opportunityForm.company}
                                onChange={(e) => setOpportunityForm((prev) => ({ ...prev, company: e.target.value }))}
                                placeholder="Company / organization"
                                className="bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            <select
                                value={opportunityForm.type}
                                onChange={(e) => setOpportunityForm((prev) => ({ ...prev, type: e.target.value, incomeLimit: e.target.value === 'Scholarship' ? prev.incomeLimit : '' }))}
                                className="bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="Internship">Internship</option>
                                <option value="Scholarship">Scholarship</option>
                            </select>
                            <input
                                type="number"
                                step="0.1"
                                min="0"
                                max="10"
                                value={opportunityForm.minGpa}
                                onChange={(e) => setOpportunityForm((prev) => ({ ...prev, minGpa: e.target.value }))}
                                placeholder="Minimum CGPA"
                                className="bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {opportunityForm.type === 'Scholarship' && (
                                <input
                                    type="number"
                                    min="0"
                                    value={opportunityForm.incomeLimit}
                                    onChange={(e) => setOpportunityForm((prev) => ({ ...prev, incomeLimit: e.target.value }))}
                                    placeholder="Maximum family income"
                                    className="bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            )}
                            <input
                                type="text"
                                value={opportunityForm.requiredSkills}
                                onChange={(e) => setOpportunityForm((prev) => ({ ...prev, requiredSkills: e.target.value }))}
                                placeholder="Required skills, comma separated"
                                className="md:col-span-2 bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <textarea
                                value={opportunityForm.description}
                                onChange={(e) => setOpportunityForm((prev) => ({ ...prev, description: e.target.value }))}
                                placeholder="Opportunity description"
                                rows={4}
                                className="md:col-span-2 bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            <div className="md:col-span-2 flex items-center justify-between gap-4">
                                <div>
                                    {error && <p className="text-sm text-red-400">{error}</p>}
                                    {opportunityStatus && <p className="text-sm text-green-400">{opportunityStatus}</p>}
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSavingOpportunity}
                                    className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-5 py-2.5 font-medium transition disabled:opacity-60"
                                >
                                    {isSavingOpportunity ? 'Saving...' : 'Add Opportunity'}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="glass-panel rounded-xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-white/10">
                            <h3 className="text-lg font-semibold text-white">Existing Opportunities</h3>
                            <p className="text-sm text-slate-400">{opportunities.length} total opportunities</p>
                        </div>
                        <div className="divide-y divide-white/5">
                            {opportunities.map((opp) => (
                                <div key={opp.id} className="px-6 py-4">
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                        <div>
                                            <h4 className="text-white font-medium">{opp.title}</h4>
                                            <p className="text-sm text-slate-400">{opp.company} • {opp.type}</p>
                                        </div>
                                        <div className="text-sm text-slate-400">
                                            {opp.minGpa !== '' && opp.minGpa !== null ? `Min CGPA ${opp.minGpa}` : 'No CGPA cutoff'}
                                            {opp.type === 'Scholarship' && opp.incomeLimit ? ` • Income up to ${opp.incomeLimit}` : ''}
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-300 mt-2">{opp.description}</p>
                                    {opp.requiredSkills?.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {opp.requiredSkills.map((skill) => (
                                                <span key={`${opp.id}-${skill}`} className="px-2 py-1 rounded-full bg-blue-500/10 text-blue-300 text-xs border border-blue-500/20">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
