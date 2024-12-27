import React, { useState, useEffect, useRef } from 'react';
import { X, Pencil } from 'lucide-react';

const ScheduleSection = ({ schedule, setSchedule }) => {
    const [timeboxes, setTimeboxes] = useState([]);
    const [draggedBox, setDraggedBox] = useState(null);
    const [resizing, setResizing] = useState(null);
    const [editingBox, setEditingBox] = useState(null);
    const inputRef = useRef(null);

    const timeSlots = Array.from({ length: 19 }, (_, i) => i + 6);

    const formatTime = (hour) => {
        return `${String(hour).padStart(2, '0')}:00`;
    };

    const handleMouseMove = (e) => {
        if (draggedBox) {
            e.preventDefault();
            const timeGrid = e.currentTarget;
            const rect = timeGrid.getBoundingClientRect();
            const relativeY = e.clientY - rect.top;
            const totalHeight = rect.height;
            const hourHeight = totalHeight / 18;

            const hour = 6 + Math.floor(relativeY / hourHeight);
            const minutes = Math.floor((relativeY % hourHeight) / (hourHeight / 60));
            const roundedMinutes = Math.round(minutes / 15) * 15;
            const newTime = hour + (roundedMinutes / 60);

            if (newTime >= 6 && newTime <= 24) {
                setTimeboxes(boxes => boxes.map(box => {
                    if (box.id === draggedBox) {
                        return {...box, startTime: newTime };
                    }
                    return box;
                }));
            }
        } else if (resizing) {
            e.preventDefault();
            const timeGrid = e.currentTarget;
            const rect = timeGrid.getBoundingClientRect();
            const relativeY = e.clientY - rect.top;
            const totalHeight = rect.height;
            const hourHeight = totalHeight / 18;

            const duration = (relativeY - resizing.startY) / hourHeight;
            const minDuration = 0.25; // 15 minutes

            setTimeboxes(boxes => boxes.map(box => {
                if (box.id === resizing.id) {
                    const newDuration = Math.max(minDuration, Math.round((resizing.originalDuration + duration) * 4) / 4);
                    const maxDuration = 24 - box.startTime;
                    return {...box, duration: Math.min(newDuration, maxDuration) };
                }
                return box;
            }));
        }
    };

    const handleMouseUp = () => {
      setDraggedBox(null);
      setResizing(null);
      setSchedule(timeboxes); // Crucial: Update parent state
  };

    const startResize = (e, box) => {
        e.stopPropagation();
        const timeGrid = e.currentTarget.closest('.time-grid');
        const rect = timeGrid.getBoundingClientRect();
        setResizing({
            id: box.id,
            startY: e.clientY - rect.top,
            originalDuration: box.duration
        });
    };

    const startDrag = (e, box) => {
        if (!resizing) {
            e.stopPropagation();
            setDraggedBox(box.id);
        }
    };

   const handleGridDoubleClick = (e) => {
        const timeGrid = e.currentTarget;
        const rect = timeGrid.getBoundingClientRect();
        const relativeY = e.clientY - rect.top;
        const totalHeight = rect.height;
        const hourHeight = totalHeight / 18;

        const hour = 6 + Math.floor(relativeY / hourHeight);
        const minutes = Math.floor((relativeY % hourHeight) / (hourHeight / 60));
        const roundedMinutes = Math.round(minutes / 15) * 15;
        const startTime = hour + (roundedMinutes / 60);

        const newBox = {
            id: Date.now(),
            text: '',
            startTime: Math.max(6, Math.min(23.75, startTime)),
            duration: 1
        };

        setTimeboxes([...timeboxes, newBox]);
        setEditingBox(newBox.id);
    };


    const updateBoxText = (id, newText) => {
        setTimeboxes(boxes =>
            boxes.map(box =>
                box.id === id ? { ...box, text: newText } : box
            )
        );
    };

    const deleteTimebox = (id) => {
        setTimeboxes(boxes => boxes.filter(box => box.id!== id));
        setSchedule(boxes => boxes.filter(box => box.id!== id));
    };

    useEffect(() => {
        if (schedule) {
            const prevSchedule = JSON.stringify(timeboxes);
            const nextSchedule = JSON.stringify(schedule);
            if (prevSchedule !== nextSchedule) {
                setTimeboxes(JSON.parse(JSON.stringify(schedule)));
            }
        }
    }, [schedule]);

    useEffect(() => {
        if (editingBox) {
            setTimeout(() => {
                if (inputRef.current) {
                    inputRef.current.focus();
                }
            }, 0);
        }
    }, [editingBox]);

    useEffect(() => {
        setSchedule(timeboxes);
    }, [timeboxes]);

    return (
        <div className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Schedule</h2>
            </div>
            <div
                className="relative time-grid"
                style={{ height: '400px' }}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onDoubleClick={handleGridDoubleClick}
            >
                {/* Time labels and grid lines (no changes here) */}
                <div className="absolute left-0 top-0 bottom-0 w-16 flex flex-col">
                    {timeSlots.map((hour) => (
                        <div key={hour} className="flex-1 text-right pr-2 text-sm text-gray-600 relative">
                            <span className="absolute top-0 right-2 -translate-y-1/2">{formatTime(hour)}</span>
                        </div>
                    ))}
                </div>
                <div className="absolute left-16 right-0 top-0 bottom-0">
                    {timeSlots.map((hour) => (
                        <div key={hour} className="absolute left-0 right-0 border-t border-gray-200" style={{ top: `${((hour - 6) / 18) * 100}%` }}>
                            {[1, 2, 3].map((quarter) => (
                                <div key={quarter} className="absolute left-0 right-0 border-t border-gray-100" style={{ top: `${(quarter * 25)}%` }} />
                            ))}
                        </div>
                    ))}
                </div>

                {/* Task boxes */}
                {timeboxes.map((box) => (
                    <div
                        key={box.id}
                        className={`absolute bg-blue-100 border border-blue-300 rounded shadow-sm hover:shadow ${draggedBox === box.id? 'cursor-grabbing' : 'cursor-grab'}`}
                        style={{
                            left: '3rem',
                            right: '1rem',
                            top: `${((box.startTime - 6) / 18) * 100}%`,
                            height: `${(box.duration / 18) * 100}%`,
                            zIndex: draggedBox === box.id || resizing?.id === box.id? 10 : 1,
                            backgroundColor: 'rgba(173, 216, 230, 0.5)'
                        }}
                        onMouseDown={(e) => startDrag(e, box)}
                    >
                        <div className="p-0 flex justify-between items-center">
                            {editingBox === box.id? (
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={box.text}
                                    onChange={(e) => updateBoxText(box.id, e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && setEditingBox(null)}
                                    className="w-full bg-transparent border-none focus:outline-none"
                                    autoFocus
                                />
                            ) : (
                                <div className="w-full pl-8 pr-2" onDoubleClick={() => setEditingBox(box.id)}>
                                    {box.text}
                                </div>
                            )}
                            <div className="flex">
                                <button onClick={() => setEditingBox(box.id)} className="hover:text-blue-500">
                                    <Pencil className="w-4 h-4" />
                                </button>
                                <button onClick={() => deleteTimebox(box.id)} className="hover:text-red-500">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        {/* Resize handle */}
                        <div className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize bg-transparent hover:bg-blue-200" onMouseDown={(e) => startResize(e, box)} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ScheduleSection;
