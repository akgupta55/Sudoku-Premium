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
            const res = await axios.get(`/api/game/puzzle/${difficulty}`);
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
            origin: { y: 0.6 }
        });

        if (user) {
            try {
                await axios.post('/api/game/score', {
                    difficulty,
                    timeTaken: seconds
                });
            } catch (err) {
                console.error('Failed to save score');
            }
        }
    };

    const handleShare = () => {
        const text = `I just solved a ${difficulty} Sudoku puzzle in ${formatTime(seconds)} on Sudoku Premium! Can you beat my score?`;
        if (navigator.share) {
            navigator.share({
                title: 'My Sudoku Score',
                text: text,
                url: window.location.origin,
            });
        } else {
            const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
            window.open(twitterUrl, '_blank');
        }
    };

    const formatTime = (s) => {
        const mins = Math.floor(s / 60);
        const secs = s % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
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
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] px-4">
                    <div className="glass max-w-sm w-full p-8 rounded-3xl text-center border-white/10 animate-in zoom-in-95 duration-300">
                        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
                            <CheckCircle size={40} className="text-white" />
                        </div>
                        <h2 className="text-3xl font-bold mb-2">PUZZLE SOLVED!</h2>
                        <p className="text-white/60 mb-8">You conquered the {difficulty} level in {formatTime(seconds)}.</p>

                        <div className="grid grid-cols-2 gap-4">
                            <button onClick={() => navigate('/leaderboard')} className="btn-primary justify-center bg-white/10 hover:bg-white/20 text-white border border-white/10">
                                Leaderboard
                            </button>
                            <button onClick={handleShare} className="btn-primary justify-center">
                                <Share2 size={18} />
                                Share
                            </button>
                        </div>
                        <button onClick={fetchPuzzle} className="mt-6 text-white/40 hover:text-white transition-colors">Play Again</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Game;
