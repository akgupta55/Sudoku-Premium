import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Trophy, LogOut, User as UserIcon, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="glass sticky top-0 z-50 border-b border-white/5 py-4 px-6 mb-8">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white text-xs font-black">S</div>
                    Sudoku Premium
                </Link>

                <div className="flex items-center gap-6">
                    {user ? (
                        <>
                            <Link to="/dashboard" className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                                <LayoutDashboard size={20} />
                                <span className="hidden md:inline">Dashboard</span>
                            </Link>
                            <Link to="/leaderboard" className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                                <Trophy size={20} />
                                <span className="hidden md:inline">Leaderboard</span>
                            </Link>
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                                <UserIcon size={18} className="text-blue-400" />
                                <span className="font-medium">{user.username}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-2 hover:bg-red-500/10 hover:text-red-400 rounded-full transition-all"
                            >
                                <LogOut size={20} />
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="hover:text-blue-400">Login</Link>
                            <Link to="/signup" className="btn-primary">Sign Up</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
