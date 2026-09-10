import { useState } from "react";

function AddTask({ addTask }) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [showPriority, setShowPriority] = useState(false);
  const priorityStyles = {
    high: "text-red-600 bg-red-50 border-red-100",
    medium: "text-yellow-600 bg-yellow-50 border-yellow-100",
    low: "text-green-600 bg-green-50 border-green-100",
  };
  return (
    <div>
      <form
        onSubmit={(event) => {
          addTask(event, title, priority);
          setTitle("");
        }}
        className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex gap-3 mb-6"
      >
        <input
          onChange={(event) => {
            setTitle(event.target.value);
          }}
          value={title}
          type="text"
          className="flex-1 px-4 py-3 rounded-xl bg-gray-50 border border-transparent outline-none focus:border-gray-200 focus:bg-white transition"
          placeholder="New task..."
        />

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowPriority(!showPriority)}
            className={`px-4 py-3 rounded-xl border text-sm font-medium capitalize transition ${priorityStyles[priority]}`}
          >
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  priority === "high"
                    ? "bg-red-500"
                    : priority === "medium"
                      ? "bg-yellow-500"
                      : "bg-green-500"
                }`}
              />

              <span>{priority}</span>

              <span className="text-xs opacity-60">⌄</span>
            </div>
          </button>
          {showPriority && (
            <div className="absolute top-full right-0 mt-2 w-32 bg-white border border-gray-200 rounded-xl shadow-lg p-1 z-10">
              <button
                type="button"
                onClick={() => {
                  setPriority("high");
                  setShowPriority(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-red-50 text-red-600 transition"
              >
                High
              </button>

              <button
                type="button"
                onClick={() => {
                  setPriority("medium");
                  setShowPriority(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-yellow-50 text-yellow-600 transition"
              >
                Medium
              </button>

              <button
                type="button"
                onClick={() => {
                  setPriority("low");
                  setShowPriority(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-green-50 text-green-600 transition"
              >
                Low
              </button>
            </div>
          )}
        </div>

        <button className="px-6 py-3 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-700 transition cursor-pointer">
          Add
        </button>
      </form>
    </div>
  );
}

export default AddTask;
