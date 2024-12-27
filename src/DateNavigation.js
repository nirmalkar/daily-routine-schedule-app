import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DateNavigation = ({ currentDate, setCurrentDate }) => {
  const handlePrevDay = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() - 1);
      return newDate;
    });
  };

  const handleNextDay = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + 1);
      return newDate;
    });
  };

  const handleDateDoubleClick = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className="flex items-center justify-between mb-6 max-w-screen-2xl mx-auto">
      <button 
        onClick={handlePrevDay}
        className="p-2 rounded hover:bg-gray-100"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      <h1 
        onDoubleClick={handleDateDoubleClick}
        className="text-2xl font-bold cursor-pointer"
      >
        {currentDate.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </h1>
      
      <button 
        onClick={handleNextDay}
        className="p-2 rounded hover:bg-gray-100"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
};

export default DateNavigation;