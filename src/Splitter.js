import React, { useState, useCallback, useEffect, useRef } from 'react';

const Splitter = ({ onResize }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [accumulatedDiff, setAccumulatedDiff] = useState(0);
  const splitterRef = useRef(null);

  const handleMouseDown = useCallback((e) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setAccumulatedDiff(0);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging || !splitterRef.current) return;

    const diff = e.clientX - startX;
    const gridElement = splitterRef.current.parentElement;
    
    if (gridElement) {
      const gridWidth = gridElement.offsetWidth;
      if (gridWidth > 0) {
        const colWidth = gridWidth / 12;
        const newAccumulatedDiff = accumulatedDiff + diff;
        const colDiff = newAccumulatedDiff / colWidth;

        // Apply resize when accumulated difference reaches 0.25 columns
        if (Math.abs(colDiff) >= 0.25) {
          const resizeAmount = Math.sign(colDiff) * 0.25;
          onResize(resizeAmount);
          setAccumulatedDiff(newAccumulatedDiff - (resizeAmount * colWidth));
          setStartX(e.clientX);
        } else {
          setAccumulatedDiff(newAccumulatedDiff);
          setStartX(e.clientX);
        }
      }
    }
  }, [isDragging, startX, accumulatedDiff, onResize]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setAccumulatedDiff(0);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={splitterRef}
      className={`w-px hover:w-0.5 bg-gray-300 hover:bg-blue-400 cursor-col-resize 
        active:bg-blue-600 transition-all duration-150
        ${isDragging ? 'w-0.5 bg-blue-600' : ''}`}
      onMouseDown={handleMouseDown}
      style={{ height: '100%' }}
    />
  );
};

export default Splitter;