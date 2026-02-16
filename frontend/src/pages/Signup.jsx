import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User } from 'lucide-react';
import GoogleAuth from '../components/GoogleAuth';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signup(username, email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to signup');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-12">
            <div className="glass p-8 rounded-2xl border border-white/5">
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-blue-500/20">
                        S
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-center mb-2">Join the Challenge</h2>
                <p className="text-white/60 text-center mb-8">Start your Sudoku adventure today</p>

                {error && <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg mb-4 text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white/70">Username</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                            <input
                                type="text"
                                className="input-field pl-10"
                                placeholder="johndoe"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white/70">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                            <input
                                type="email"
                                className="input-field pl-10"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white/70">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                            <input
                                type="password"
                                className="input-field pl-10"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn-primary w-full justify-center py-3 mt-4">
                        <UserPlus size={20} />
                        Create Account
                    </button>
                </form>

                <div className="relative my-8 text-center">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                    <span className="relative px-4 text-white/30 text-xs bg-[#0c0e14]">OR CONTINUE WITH</span>
                </div>

                <GoogleAuth />

                <p className="text-center text-white/60 mt-8 text-sm">
                    Already have an account? <Link to="/login" className="text-blue-400 font-semibold hover:underline">Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
