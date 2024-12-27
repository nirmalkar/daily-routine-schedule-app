import React, { useState, useEffect } from 'react';

const RoutinesSection = ({ routines, setRoutines }) => {
    const initialRoutines = [
        { name: 'Shower', done: false },
        { name: 'Eat', done: false },
        { name: 'Sleep', 'done': false },
        { name: 'Work', 'done': false },
        { name: 'Sport', 'done': false },
        { name: 'Drink Water', 'done': false },
        { name: 'Medication', 'done': false }
    ];

    useEffect(() => {
        if (routines.length === 0) {
            setRoutines(initialRoutines)
        }
    }, [])

    const toggleRoutine = (index) => {
        setRoutines(prevRoutines => {
            return prevRoutines.map((routine, i) => {
                if (i === index) {
                    return { ...routine, done: !routine.done };
                }
                return routine;
            });
        });
    };

  return (
    <div className="border rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Routines</h2>
      <div className="space-y-2">
        {routines.map((routine, index) => (
          <div key={index} className="flex items-center">
            <input
              type="checkbox"
              checked={routine.done}
              onChange={() => toggleRoutine(index)}
              className="w-4 h-4 mr-2 accent-blue-500"
            />
            <span className={routine.done ? 'line-through text-gray-500' : ''}>
              {routine.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoutinesSection;
