import React from 'react';

const RoutinesSection = ({ routines, setRoutines }) => {

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
      <div >
        {routines.map((routine, index) => (
          <div key={index} className="routine-item">
            <div style={{display: 'inline-flex', alignItems: 'center'}}>
              <input
                type="checkbox"
                checked={routine.done}
                onChange={() => toggleRoutine(index)}
                className="w-4 h-4 accent-blue-500"
                style={{marginRight: '0.5rem'}}
              />
              <span className={routine.done ? 'line-through text-gray-500' : ''}>
                {routine.name}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoutinesSection;
