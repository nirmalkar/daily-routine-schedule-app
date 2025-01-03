import React from 'react';
import { fetchDailyData, saveDailyData } from './api';

const TodoSection = ({ todoText, setTodoText, todos, setTodos, currentDate }) => {

  const handleTodoChange = (e) => {
    const newText = e.target.value;
    setTodoText(newText);

    const lines = newText.split('\n');
    const newTodos = lines.map((line, index) => {
      if (todos && todos.length > index) {
        return {
          text: line,
          done: todos[index].done
        };
      } else {
        return {
          text: line,
          done: false
        };
      }
    });
    console.log('newTodos:', newTodos);
    console.log('todos:', todos);
    if (newTodos.length === 0) {
        setTodos([]);
    } else {
        setTodos(newTodos);
    }
  };

  const toggleTodo = (index) => {
    setTodos(prevTodos =>
      prevTodos.map((todo, i) =>
        i === index ? { ...todo, done: !todo.done } : todo
      )
    );
  };

  const handleCopyUncheckedTodos = async () => {
    console.log('handleCopyUncheckedTodos called'); // Added console log
    const nextDay = new Date(currentDate);
    nextDay.setDate(currentDate.getDate() + 1);
    const nextDayStr = nextDay.toISOString().split('T')[0];

    try {
      const nextDayData = await fetchDailyData(nextDayStr);
      const nextDayTodos = nextDayData?.todos || [];

      const uncheckedTodos = todos.filter(todo => !todo.done);
      const mergedTodos = [...nextDayTodos, ...uncheckedTodos];

      await saveDailyData(nextDayStr, { ...nextDayData, todos: mergedTodos });

      // Update the current day's todos to reflect the changes
      setTodos(prevTodos => prevTodos.map(todo => ({ ...todo, done: false })));
      setTodoText(prevText => prevText.split('\n').map(line => line.trim()).join('\n'));

    } catch (error) {
      console.error("Error copying todos:", error);
    }
  };

  return (
    <div className="border rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">ToDo</h2>
      <div className="relative">
        <textarea
          value={todoText}
          onChange={handleTodoChange}
          className="w-full border rounded font-mono text-base"
          placeholder="Type your todos here..."
          style={{
            lineHeight: '20px',
            padding: '10px',
            paddingLeft: '32px',
            background: 'transparent',
            resize: 'vertical',
            height: '400px'
          }}
        />
        <div
          className="absolute top-[10px] left-2 z-10 pointer-events-auto"
          style={{ display: 'flex', flexDirection: 'column' }}
        >
          {todoText.split('\n').map((_, index) => (
            <div key={index} style={{ height: '20px', display: 'flex', alignItems: 'center' }}>
              <input
                type="checkbox"
                checked={todos && todos.length > index ? todos[index].done : false}
                onChange={() => toggleTodo(index)}
                className="w-4 h-4 accent-blue-500"
              />
            </div>
          ))}
        </div>
      </div>
      <button 
        onClick={handleCopyUncheckedTodos} 
        className="hover:bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded mt-2"
        title="Copy unchecked todos to the next day"
        style={{background: 'transparent'}}
      >
        &rarr;
      </button>
    </div>
  );
};

export default TodoSection;
