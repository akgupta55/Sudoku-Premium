import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trophy, Clock, User, Award, Medal } from 'lucide-react';

const Leaderboard = () => {
    const [scores, setScores] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchScores = async () => {
            try {
                const res = await axios.get('/api/game/leaderboard');
                setScores(res.data);
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch scores');
                setLoading(false);
            }
        };
        fetchScores();
    }, []);

    const formatTime = (s) => {
        const mins = Math.floor(s / 60);
        const secs = s % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const getRankIcon = (index) => {
        if (index === 0) return <Award className="text-yellow-400" size={24} />;
        if (index === 1) return <Medal className="text-gray-300" size={24} />;
        if (index === 2) return <Medal className="text-orange-400" size={24} />;
        return <span className="text-white/20 font-bold ml-1">{index + 1}</span>;
    };

    if (loading) return <div className="flex justify-center py-20 animate-pulse text-blue-400">Loading Rankings...</div>;

    return (
        <div className="max-w-3xl mx-auto py-8">
            <div className="text-center mb-12">
                <Trophy className="mx-auto text-yellow-400 mb-4" size={56} />
                <h1 className="text-4xl font-bold mb-2">Hall of Fame</h1>
                <p className="text-white/60">The fastest Sudoku solvers in the world.</p>
            </div>

            <div className="glass rounded-3xl overflow-hidden border border-white/5">
                <div className="grid grid-cols-12 gap-4 p-6 bg-white/5 border-b border-white/5 text-xs font-bold uppercase tracking-widest text-white/50">
                    <div className="col-span-1">Rank</div>
                    <div className="col-span-1"></div>
                    <div className="col-span-5">Player</div>
                    <div className="col-span-3 text-center">Difficulty</div>
                    <div className="col-span-2 text-right">Time</div>
                </div>

                <div className="divide-y divide-white/5">
                    {scores.length > 0 ? scores.map((score, i) => (
                        <div key={score._id} className="grid grid-cols-12 gap-4 p-6 items-center hover:bg-white/[0.02] transition-colors">
                            <div className="col-span-1 flex justify-center">
                                {getRankIcon(i)}
                            </div>
                            <div className="col-span-1">
                                <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/20 flex items-center justify-center">
                                    <User size={14} className="text-blue-400" />
                                </div>
                            </div>
                            <div className="col-span-5">
                                <span className="font-semibold text-white/90">{score.userId?.username || 'Anonymous'}</span>
                            </div>
                            <div className="col-span-3 text-center">
                                <span className={`px-2 py-1 rounded-md text-[10px] uppercase font-bold border ${score.difficulty === 'expert' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' :
                                    score.difficulty === 'hard' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                                        score.difficulty === 'medium' ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' :
                                            'bg-green-500/10 border-green-500/20 text-green-400'
                                    }`}>
                                    {score.difficulty}
                                </span>
                            </div>
                            <div className="col-span-2 text-right font-mono text-blue-400 font-bold">
                                {formatTime(score.timeTaken)}
                            </div>
                        </div>
                    )) : (
                        <div className="p-12 text-center text-white/30 italic">No scores yet. Be the first!</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
