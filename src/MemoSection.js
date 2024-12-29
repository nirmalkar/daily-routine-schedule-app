import React, { useState, useEffect } from 'react';

const MemoSection = ({ memo, setMemo }) => {
    const [localMemo, setLocalMemo] = useState(memo);

    useEffect(() => {
        setLocalMemo(memo);
    }, [memo]);

    const handleChange = (e) => {
        setLocalMemo(e.target.value);
        setMemo(e.target.value);
    };

    return (
        <div className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Memo</h2>
            <textarea
                value={localMemo} // Use local state for the textarea value
                onChange={handleChange}
                className="w-full h-96 p-2 border rounded dark:bg-gray-700 dark:text-white"
                placeholder="Write your notes here..."
            />
        </div>
    );
};

export default MemoSection;
