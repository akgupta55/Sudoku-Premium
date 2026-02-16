import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Zap, Flame, Award, Trophy } from 'lucide-react';

const Dashboard = () => {
    const navigate = useNavigate();

    const difficulties = [
        {
            id: 'easy',
            name: 'Easy',
            icon: <Zap className="text-green-400" />,
            color: 'green',
            desc: 'Perfect for beginners starting their journey.'
        },
        {
            id: 'medium',
            name: 'Medium',
            icon: <Flame className="text-orange-400" />,
            color: 'orange',
            desc: 'A solid challenge for seasoned solvers.'
        },
        {
            id: 'hard',
            name: 'Hard',
            icon: <Award className="text-red-400" />,
            color: 'red',
            desc: 'Only for the true Sudoku masters.'
        },
        {
            id: 'expert',
            name: 'Expert',
            icon: <Trophy className="text-purple-400" />,
            color: 'purple',
            desc: 'The ultimate test of logic and patience.'
        }
    ];

    return (
        <div className="max-w-4xl mx-auto py-12">
            <div className="text-center mb-16">
                <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent italic">
                    READY TO PLAY?
                </h1>
                <p className="text-white/60 text-lg">Choose your level and show your skills on the scoreboard.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {difficulties.map((level) => (
                    <div
                        key={level.id}
                        className="glass p-8 rounded-3xl border border-white/5 hover:border-white/20 transition-all group flex flex-col h-full"
                    >
                        <div className="mb-6 p-4 rounded-2xl bg-white/5 w-fit group-hover:scale-110 transition-transform">
                            {React.cloneElement(level.icon, { size: 32 })}
                        </div>
                        <h3 className="text-2xl font-bold mb-3">{level.name}</h3>
                        <p className="text-white/50 mb-8 flex-grow">{level.desc}</p>
                        <button
                            onClick={() => navigate(`/game/${level.id}`)}
                            className={`btn-primary w-full justify-center transition-all opacity-90 hover:opacity-100 shadow-lg`}
                            style={{ backgroundColor: level.id === 'expert' ? '#9333ea' : level.id === 'hard' ? '#ef4444' : level.id === 'medium' ? '#f97316' : '#22c55e' }}
                        >
                            <Play size={18} fill="currentColor" />
                            Start Game
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
