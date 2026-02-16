import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Timer, RotateCcw, CheckCircle, Share2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';

const Game = () => {
    const { difficulty } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [grid, setGrid] = useState([]);
    const [solution, setSolution] = useState('');
    const [initialGrid, setInitialGrid] = useState([]);
    const [selectedCell, setSelectedCell] = useState(null);
    const [seconds, setSeconds] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [completed, setCompleted] = useState(false);
    const [mistakes, setMistakes] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    const maxMistakes = {
        'easy': Infinity,
        'medium': 5,
        'hard': 3,
        'expert': 1
    }[difficulty] || 3;

    useEffect(() => {
        fetchPuzzle();
        const interval = setInterval(() => {
            if (!isPaused && !completed) {
                setSeconds(prev => prev + 1);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [difficulty, isPaused, completed]);

    const fetchPuzzle = async () => {
        setLoading(true);
        setMistakes(0);
        setGameOver(false);
        try {
            const queryParams = new URLSearchParams(window.location.search);
            const level = queryParams.get('level');
            const url = level
                ? `/api/game/puzzle/${difficulty}?level=${level}`
                : `/api/game/puzzle/${difficulty}`;

            const res = await axios.get(url);
            const puzzleStr = res.data.puzzle;
            const solutionStr = res.data.solution;

            const parsedGrid = puzzleStr.split('').map(char => char === '-' ? null : parseInt(char));
            setGrid(parsedGrid);
            setInitialGrid([...parsedGrid]);
            setSolution(solutionStr);
            setLoading(false);
        } catch (err) {
            setError('Failed to load puzzle');
            setLoading(false);
        }
    };

    const handleCellClick = (index) => {
        if (initialGrid[index] === null) {
            setSelectedCell(index);
        }
    };

    const handleKeyPress = (e) => {
        if (selectedCell === null || completed) {
            if (e.key.startsWith('Arrow') && !completed) {
                setSelectedCell(0);
            }
            return;
        }

        const row = Math.floor(selectedCell / 9);
        const col = selectedCell % 9;

        if (e.key === 'ArrowUp' && row > 0) setSelectedCell(selectedCell - 9);
        else if (e.key === 'ArrowDown' && row < 8) setSelectedCell(selectedCell + 9);
        else if (e.key === 'ArrowLeft' && col > 0) setSelectedCell(selectedCell - 1);
        else if (e.key === 'ArrowRight' && col < 8) setSelectedCell(selectedCell + 1);

        const num = parseInt(e.key);
        if (!isNaN(num) && num >= 1 && num <= 9) {
            updateCell(num);
        } else if (e.key === 'Backspace' || e.key === 'Delete') {
            updateCell(null);
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [selectedCell, completed]);

    const updateCell = (value) => {
        if (gameOver || completed) return;

        const newGrid = [...grid];
        const isWrong = value !== null && value !== parseInt(solution[selectedCell]);

        newGrid[selectedCell] = value;
        setGrid(newGrid);

        if (isWrong) {
            const nextMistakes = mistakes + 1;
            setMistakes(nextMistakes);
            if (nextMistakes >= maxMistakes) {
                setGameOver(true);
            }
        }

        // Check if puzzle is solved
        if (!newGrid.includes(null)) {
            if (newGrid.join('') === solution) {
                handleWin();
            }
        }
    };

    const handleWin = async () => {
        setCompleted(true);
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#3b82f6', '#8b5cf6', '#ffffff']
        });

        if (user) {
            try {
                await axios.post('/api/game/score', {
                    difficulty,
                    timeTaken: seconds,
                    mistakes: mistakes,
                    level: new URLSearchParams(window.location.search).get('level') || null
                });
            } catch (err) {
                console.error('Failed to save score');
            }
        }
    };

    const handleSharePlatform = (platform) => {
        const levelText = new URLSearchParams(window.location.search).get('level') ? `Level ${new URLSearchParams(window.location.search).get('level')}` : `a ${difficulty} puzzle`;
        const text = `🏆 I just conquered ${levelText} in ${formatTime(seconds)} with only ${mistakes} mistakes on Sudoku Premium! 🧠🔥 Can you beat me? play at: ${window.location.origin}`;

        const urls = {
            twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
            whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}&summary=${encodeURIComponent(text)}`
        };

        if (urls[platform]) {
            window.open(urls[platform], '_blank');
        }
    };

    const formatTime = (s) => {
        const mins = Math.floor(s / 60);
        const secs = s % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const getRank = () => {
        if (seconds < 60 && mistakes === 0) return { name: "Sudoku God", color: "text-yellow-400" };
        if (seconds < 180) return { name: "Logic Master", color: "text-purple-400" };
        if (seconds < 300) return { name: "Pro Solver", color: "text-blue-400" };
        return { name: "Thinker", color: "text-green-400" };
    };

    if (loading) return <div className="flex justify-center items-center h-64"><div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>;

    return (
        <div className="flex flex-col h-full max-w-2xl mx-auto px-2 sm:px-4 pb-4">
            {/* Header section */}
            <div className="flex justify-between items-center mb-4 sm:mb-6 glass p-3 sm:p-4 rounded-2xl border-white/5 shrink-0">
                <div className="flex items-center gap-2 sm:gap-4" role="status" aria-live="polite">
                    <div className="flex items-center gap-1 sm:gap-2 text-blue-400 font-bold" aria-label={`Timer: ${formatTime(seconds)}`}>
                        <Timer size={18} className="sm:w-[22px] sm:h-[22px]" aria-hidden="true" />
                        <span className="text-lg sm:text-xl tabular-nums">{formatTime(seconds)}</span>
                    </div>
                    {difficulty !== 'expert' && (
                        <div
                            className="flex items-center gap-1 sm:gap-2 text-red-400 font-bold px-2 sm:px-3 py-1 bg-red-500/10 rounded-full text-xs sm:text-sm"
                            aria-label={`${mistakes} of ${maxMistakes} mistakes made`}
                        >
                            <AlertCircle size={14} className="sm:w-[16px] sm:h-[16px]" aria-hidden="true" />
                            <span className="hidden xs:inline">Mistakes: </span>{mistakes}/{maxMistakes === Infinity ? '∞' : maxMistakes}
                        </div>
                    )}
                </div>
                <div className="text-white/60 font-medium uppercase tracking-widest text-[10px] sm:text-sm">
                    {difficulty} Level
                </div>
                <button onClick={fetchPuzzle} className="p-1.5 sm:p-2 hover:bg-white/10 rounded-full transition-colors shrink-0">
                    <RotateCcw size={18} className="sm:w-[22px] sm:h-[22px]" />
                </button>
            </div>

            {error && <div className="bg-red-500/10 text-red-500 p-3 rounded-xl mb-4 flex items-center gap-3 text-xs sm:text-sm"><AlertCircle size={18} /> {error}</div>}

            {/* Main Grid Container */}
            <div className="flex-grow flex items-center justify-center min-h-0 mb-4 sm:mb-8">
                <div className="w-full aspect-square max-w-[min(94vw,70vh)] glass p-1 sm:p-2 rounded-xl sm:rounded-2xl border-white/5 grid grid-cols-9 gap-0.5 sm:gap-1 shadow-2xl">
                    {grid.map((cell, i) => {
                        const row = Math.floor(i / 9);
                        const col = i % 9;
                        const isSelected = selectedCell === i;
                        const isInitial = initialGrid[i] !== null;
                        const isWrong = !isInitial && cell !== null && cell !== parseInt(solution[i]);
                        const showRed = isWrong && (difficulty === 'easy' || (difficulty === 'medium' && mistakes >= 3));

                        const borderRight = (col === 2 || col === 5) ? 'border-r-2 border-white/30' : '';
                        const borderBottom = (row === 2 || row === 5) ? 'border-b-2 border-white/30' : '';

                        return (
                            <div
                                key={i}
                                onClick={() => handleCellClick(i)}
                                role="gridcell"
                                aria-label={`Cell ${row + 1}, ${col + 1} ${cell ? ', value ' + cell : ', empty'}${isInitial ? ', fixed' : ''}`}
                                tabIndex={isInitial ? -1 : 0}
                                className={`
                                    relative flex items-center justify-center text-lg sm:text-2xl font-bold cursor-pointer transition-all outline-none aspect-square
                                    ${isSelected ? 'bg-blue-500/30 ring-1 sm:ring-2 ring-blue-500 z-10' : 'bg-white/5 hover:bg-white/10 focus:bg-white/10'}
                                    ${isInitial ? 'text-white/90' : 'text-blue-400 font-medium'}
                                    ${showRed ? 'text-red-500 bg-red-500/20' : ''}
                                    ${borderRight} ${borderBottom}
                                    rounded-[3px] sm:rounded-md
                                `}
                            >
                                {cell}
                            </div>
                        );
                    })}
                </div>
            </div>


            {gameOver && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] px-4">
                    <div className="glass max-w-sm w-full p-8 rounded-3xl text-center border-white/10 animate-in zoom-in-95 duration-300">
                        <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-500/30">
                            <AlertCircle size={40} className="text-white" />
                        </div>
                        <h2 className="text-3xl font-bold mb-2 text-red-500">GAME OVER</h2>
                        <p className="text-white/60 mb-8">You reached the maximum mistakes for {difficulty} mode.</p>

                        <div className="grid grid-cols-2 gap-4">
                            <button onClick={() => navigate('/dashboard')} className="btn-primary justify-center bg-white/10 hover:bg-white/20 text-white border border-white/10">
                                Menu
                            </button>
                            <button onClick={() => { setGameOver(false); setMistakes(0); fetchPuzzle(); }} className="btn-primary justify-center bg-red-500 hover:bg-red-600">
                                <RotateCcw size={18} />
                                Retry
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {completed && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-[100] px-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="glass max-w-md w-full p-8 sm:p-10 rounded-[2.5rem] text-center border-white/10 shadow-[0_0_50px_rgba(59,130,246,0.2)]"
                    >
                        <div className="relative mb-8">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 rounded-full opacity-20 blur-2xl"
                            />
                            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto relative shadow-2xl shadow-green-500/20">
                                <CheckCircle size={48} className="text-white" />
                            </div>
                        </div>

                        <h2 className="text-4xl font-black mb-2 tracking-tight">SOLVED!</h2>
                        <div className={`text-sm font-bold uppercase tracking-[0.2em] mb-8 ${getRank().color}`}>
                            Rank: {getRank().name}
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-10">
                            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                <div className="text-[10px] font-black text-white/30 uppercase mb-1">Total Time</div>
                                <div className="text-2xl font-black text-blue-400 tabular-nums">{formatTime(seconds)}</div>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                <div className="text-[10px] font-black text-white/30 uppercase mb-1">Mistakes</div>
                                <div className="text-2xl font-black text-red-400 tabular-nums">{mistakes}</div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 justify-center mb-2">
                                <div className="h-px bg-white/10 flex-grow" />
                                <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Share Achievement</span>
                                <div className="h-px bg-white/10 flex-grow" />
                            </div>

                            <div className="flex justify-center gap-4">
                                <motion.button
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    onClick={() => handleSharePlatform('twitter')}
                                    className="w-12 h-12 rounded-xl bg-black border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors"
                                    title="Share on Twitter"
                                >
                                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    onClick={() => handleSharePlatform('whatsapp')}
                                    className="w-12 h-12 rounded-xl bg-[#25D366] flex items-center justify-center hover:opacity-90 transition-opacity"
                                    title="Share on WhatsApp"
                                >
                                    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    onClick={() => handleSharePlatform('linkedin')}
                                    className="w-12 h-12 rounded-xl bg-[#0077b5] flex items-center justify-center hover:opacity-90 transition-opacity"
                                    title="Share on LinkedIn"
                                >
                                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                                </motion.button>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 mt-8">
                            {new URLSearchParams(window.location.search).get('level') && (
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                        const currentLevel = parseInt(new URLSearchParams(window.location.search).get('level'));
                                        window.location.href = `/game/${difficulty}?level=${currentLevel + 1}`;
                                    }}
                                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-900/20 flex items-center justify-center gap-3 transition-all"
                                >
                                    <Play size={20} fill="currentColor" />
                                    Next Level: {parseInt(new URLSearchParams(window.location.search).get('level')) + 1}
                                </motion.button>
                            )}
                            <div className="grid grid-cols-2 gap-4">
                                <button onClick={() => navigate('/leaderboard')} className="btn-primary justify-center bg-white/5 hover:bg-white/10 text-white border border-white/10 py-3 rounded-2xl">
                                    Leaderboard
                                </button>
                                <button onClick={() => navigate('/dashboard')} className="btn-primary justify-center bg-white/5 hover:bg-white/10 text-white border border-white/10 py-3 rounded-2xl">
                                    Home
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Game;
