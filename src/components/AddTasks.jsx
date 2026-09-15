import { useEffect, useState } from "react";

function AddTask({ addTask }) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [showPriority, setShowPriority] = useState(false);
  const priorityStyles = {
    high: "text-red-600 bg-red-50 border-red-100",
    medium: "text-yellow-600 bg-yellow-50 border-yellow-100",
    low: "text-green-600 bg-green-50 border-green-100",
  };
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".priority-picker")) {
        setShowPriority(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  });
  return (
    <div>
      <form
        onSubmit={(event) => {
          addTask(event, title, priority, dueDate);
          setTitle("");
          setPriority("medium");

          setShowPriority(false);
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

        <div className="priority-picker relative">
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
                className={`w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-red-50 text-red-600 transition ${priority === "high" ? "bg-red-50" : "hover:bg-red-50"}`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <span>High</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPriority("medium");
                  setShowPriority(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm text-yellow-600 transition ${
                  priority === "medium" ? "bg-yellow-50" : "hover:bg-yellow-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                  <span>Medium</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPriority("low");
                  setShowPriority(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm text-green-600 transition ${priority === "low" ? "bg-green-50" : "hover:bg-green-50"}`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <span>Low</span>
                </div>
              </button>
            </div>
          )}
        </div>

        <input
          type="date"
          value={dueDate}
          onChange={(event) => setdueDate(event.target.value)}
          className="px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-600 outline-none focus:border-gray-400 transition"
        />

        <button className="px-6 py-3 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-700 transition cursor-pointer">
          Add
        </button>
      </form>
    </div>
  );
}

export default AddTask;
