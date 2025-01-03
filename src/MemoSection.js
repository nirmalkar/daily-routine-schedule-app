import React, { useState, useEffect, useRef } from 'react';
import settings from './settings.json';

const MemoSection = ({ memo, setMemo }) => {
    const [timerRunning, setTimerRunning] = useState(false);
    const [timeLeft, setTimeLeft] = useState(settings.timer * 60); // timer from settings in seconds
    const audioRef = useRef(null);

    useEffect(() => {
        let intervalId;
        if (timerRunning && timeLeft > 0) {
            intervalId = setInterval(() => {
                setTimeLeft(prevTime => prevTime - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            // Play ding sound
            if (audioRef.current) {
                audioRef.current.play();
            }
            setTimeLeft(settings.timer * 60); // Reset timer
        }
        return () => clearInterval(intervalId);
    }, [timerRunning, timeLeft]);

    const toggleTimer = () => {
        setTimerRunning(!timerRunning);
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handleMemoChange = (e) => {
        setMemo(e.target.value);
    };

    return (
        <div className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Memo</h2>
            <textarea
                value={memo}
                onChange={handleMemoChange}
                className="w-full border rounded font-mono text-base"
                placeholder="Type your memos here..."
                style={{
                    lineHeight: '20px',
                    padding: '10px',
                    background: 'transparent',
                    resize: 'vertical',
                    height: '200px'
                }}
            />
            <div className="flex items-center mt-2">
                <button 
                    onClick={toggleTimer} 
                    className="bg-transparent hover:bg-gray-200 text-gray-700 font-bold py-2 px-2 rounded"
                >
                    {timerRunning ? '⏸' : '▶️'}
                </button>
                <span className="ml-2">{formatTime(timeLeft)}</span>
            </div>
            <audio ref={audioRef} src="/timer.mp3" />
        </div>
    );
};

export default MemoSection;
