import React, { useState, useEffect, useRef } from 'react';
import { fetchDailyData, saveDailyData } from './api';
import TodoSection from './TodoSection';
import ScheduleSection from './ScheduleSection';
import RoutinesSection from './RoutinesSection';
import MemoSection from './MemoSection';
import Splitter from './Splitter';
import DateNavigation from './DateNavigation';
import settings from './settings.json';

const ErrorMessage = ({ message, onClose }) => (
    <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{message}</span>
        <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={onClose}>
            <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <title>Close</title>
                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
            </svg>
        </span>
    </div>
);

const DailyRoutine = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [colSizes, setColSizes] = useState({ todo: 3, schedule: 2, routines: 2, memo: 4 });
    const [todoText, setTodoText] = useState('');
    const [todos, setTodos] = useState([]);
    const [schedule, setSchedule] = useState([]);
    const [routines, setRoutines] = useState([]);
    const [memo, setMemo] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const previousDate = useRef(null);

    const formatDate = (date) => {
        return date.toISOString().split('T')[0];
    };

    useEffect(() => {
        console.log('useEffect in DailyRoutine.js loadData called with date:', currentDate);
        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);
                const dateStr = formatDate(currentDate);
                const data = await fetchDailyData(dateStr);

                if (data) {
                    if (data.date !== dateStr) {
                        throw new Error(`Date mismatch: Expected ${dateStr}, got ${data.date}`);
                    }
                    setTodoText(data.todos?.map(todo => todo.text).join('\n') || '');
                    setTodos(data.todos || []);
                    setSchedule(data.schedule || []);
                    setRoutines(data.routines && data.routines.length > 0 ? data.routines : settings.routines);
                    setMemo(data.memo || '');
                    console.log('useEffect in DailyRoutine.js data set for ', currentDate);
                }
                previousDate.current = dateStr;
            } catch (error) {
                console.error('Error loading data:', error);
                setError(error.message);
            } finally {
                console.log('useEffect in DailyRoutine.js completed:', currentDate);
                setLoading(false);
            }
        };

        if (previousDate.current === null || previousDate.current !== formatDate(currentDate)) {
            loadData();
        }
    }, [currentDate]);

    useEffect(() => {
        const saveData = async () => {
            if (loading) return;

            try {
                setError(null);
                console.log('useEffect in DailyRoutine.js saveData called with date:', currentDate);
                const dateStr = formatDate(currentDate);
                const dataToSave = {
                    date: dateStr,
                    todos,
                    schedule,
                    routines,
                    memo
                };
                await saveDailyData(dateStr, dataToSave);
            } catch (error) {
                console.error('Error saving data:', error);
                setError(error.message);
            }
        };

        const timeoutId = setTimeout(saveData, 1000);
        return () => clearTimeout(timeoutId);
    }, [todos, schedule, routines, memo, currentDate, loading]);

    const handleResize = (section, newSize, adjustSection) => {
        setColSizes(prev => ({ ...prev, [section]: newSize, [adjustSection]: prev[adjustSection] - (newSize - prev[section]) }));
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-700 p-4 w-full">
            {error && (
                <ErrorMessage 
                    message={error} 
                    onClose={() => setError(null)}
                />
            )}
            <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <DateNavigation currentDate={currentDate} setCurrentDate={setCurrentDate} />
                <div className="flex">
                    <div style={{ flex: colSizes.todo }}>
                        <TodoSection 
                            todoText={todoText} 
                            setTodoText={setTodoText} 
                            todos={todos} 
                            setTodos={setTodos} 
                            currentDate={currentDate}
                        />
                    </div>
                    <Splitter onResize={(diff) => handleResize('todo', Math.max(1, Math.min(6, colSizes.todo + diff)), 'schedule')} />
                    <div style={{ flex: colSizes.schedule }}>
                        <ScheduleSection schedule={schedule} setSchedule={setSchedule} />
                    </div>
                    <Splitter onResize={(diff) => handleResize('schedule', Math.max(1, Math.min(6, colSizes.schedule + diff)), 'routines')} />
                    <div style={{ flex: colSizes.routines }}>
                        <RoutinesSection routines={routines} setRoutines={setRoutines} />
                    </div>
                    <Splitter onResize={(diff) => handleResize('routines', Math.max(1, Math.min(6, colSizes.routines + diff)), 'memo')} />
                    <div style={{ flex: colSizes.memo }}>
                        <MemoSection memo={memo} setMemo={setMemo} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DailyRoutine;
