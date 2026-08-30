import { useState } from "react";

function App() {
  const [tasks, setTask] = useState([
    {
      id: 1,
      title: "Learn JavaScript",
      completed: false,
      important: true,
    },
    {
      id: 2,
      title: "Practice React",
      completed: false,
      important: false,
    },
    {
      id: 3,
      title: "Build TaskFlow",
      completed: true,
      important: true,
    },
  ]);

  const deleteTask = (id) => {
    const newTasks = tasks.filter((task) => {
      return task.id !== id;
    });

    setTask(newTasks);
  };

  const [title, setTitle] = useState("");

  const addTask = (event) => {
    event.preventDefault();

    const newTask = {
      id: Date.now(),
      title: title,
      completed: false,
      important: true,
    };

    setTask([...tasks, newTask]);
  };

  const toggleTask = (id) => {
    const updateTasks = tasks.map((task) => {
      if (id === task.id) {
        return {
          ...task,
          completed: !task.completed,
        };
      }

      return task;
    });

    setTask(updateTasks);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10 font-mono">
      <h1 className="text-4xl font-bold mb-8">TaskFlow</h1>

      <form
        onSubmit={addTask}
        className="border flex justify-between px-5 py-6 rounded-lg mb-5 border-gray-400 shadow-md shadow-gray-400"
      >
        <input
          onChange={(event) => {
            setTitle(event.target.value);
          }}
          type="text"
          className="rounded-lg w-1/2 px-2 py-3"
          placeholder="New task..."
        />
        <button className="bg-gray-400 px-5 rounded-xl">Add</button>
      </form>

      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            className="bg-white p-4 rounded-lg shadow flex justify-between cursor-pointer hover:scale-x-105 transition-all"
            key={task.id}
            onClick={() => toggleTask(task.id)}
          >
            <span>{task.title}</span>

            <span>{task.completed ? "✅" : "⭕"}</span>

            <button
              onClick={(event) => {
                (event.stopPropagation(), deleteTask(task.id));
              }}
              className="border border-red-400 px-2 py-1 rounded-lg text-red-700 transition-all cursor-pointer"
            >
              {" "}
              Delete 🗑️
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
