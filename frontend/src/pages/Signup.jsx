import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: { opacity: 1, x: 0 }
    };

    return (
        <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-md w-full"
            >
                <div className="glass p-8 sm:p-10 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500"></div>

                    <div className="flex justify-center mb-8">
                        <motion.div
                            whileHover={{ scale: 1.05, rotate: -5 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-indigo-500/20 relative group"
                        >
                            <span className="relative z-10">S</span>
                            <div className="absolute inset-0 bg-white/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <motion.div
                                animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
                                transition={{ repeat: Infinity, duration: 2.5 }}
                                className="absolute inset-x-0 -bottom-2 h-4 bg-purple-500 blur-xl rounded-full"
                            />
                        </motion.div>
                    </div>

                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-black tracking-tight mb-2">Join the Elite</h2>
                        <p className="text-white/40 font-medium">Create your Sudoku identity</p>
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl mb-6 text-sm flex items-center gap-3"
                            >
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <motion.div variants={itemVariants} className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-white/30 ml-1">Username</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-blue-400 transition-colors" size={20} />
                                <input
                                    type="text"
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/10 outline-none focus:bg-white/10 focus:border-blue-500/50 transition-all font-medium"
                                    placeholder="yourname"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                        </motion.div>
                        <motion.div variants={itemVariants} className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-white/30 ml-1">Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-blue-400 transition-colors" size={20} />
                                <input
                                    type="email"
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/10 outline-none focus:bg-white/10 focus:border-blue-500/50 transition-all font-medium"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </motion.div>
                        <motion.div variants={itemVariants} className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-white/30 ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-blue-400 transition-colors" size={20} />
                                <input
                                    type="password"
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/10 outline-none focus:bg-white/10 focus:border-blue-500/50 transition-all font-medium"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </motion.div>
                        <motion.button
                            variants={itemVariants}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-900/20 flex items-center justify-center gap-3 group transition-all"
                        >
                            <UserPlus size={20} className="group-hover:-translate-y-1 transition-transform" />
                            Create Account
                        </motion.button>
                    </form>

                    <div className="relative my-10 text-center">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                        <span className="relative px-6 text-white/20 text-[10px] font-black tracking-[0.2em] bg-[#0c0e14]">JOIN THE HACKATHON</span>
                    </div>

                    <GoogleAuth />

                    <p className="text-center text-white/40 mt-10 text-sm font-medium">
                        Already have an account? <Link to="/login" className="text-blue-400 hover:text-blue-300 font-bold transition-colors">Sign in</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Signup;
