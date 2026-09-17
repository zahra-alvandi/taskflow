import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
          setDueDate("");
          setShowPriority(false);
        }}
        className="bg-[var(--surface)] p-3 sm:p-4 rounded-2xl shadow-[var(--shadow-soft-small)] flex flex-col gap-3 mb-6"
      >
        <input
          onChange={(event) => {
            setTitle(event.target.value);
          }}
          value={title}
          type="text"
          className="w-full min-w-0 px-4 py-3 rounded-xl bg-[var(--surface)] shadow-[var(--shadow-inset)] outline-none text-[var(--text-primary)] placeholder:text-[var(--text-muted)] transition"
          placeholder="New task..."
        />

        <div className="flex gap-2 w-full">
          <div className="priority-picker relative">
            <button
              type="button"
              onClick={() => setShowPriority(!showPriority)}
              className={`flex-1 px-3 py-3 rounded-xl border text-sm font-medium capitalize transition ${priorityStyles[priority]}`}
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
                    priority === "medium"
                      ? "bg-yellow-50"
                      : "hover:bg-yellow-50"
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

          <DatePicker
            wrapperClassName="flex-1 min-w-0"
            selected={dueDate ? new Date(dueDate + "T00:00:00") : null}
            onChange={(date) => {
              if (date) {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const day = String(date.getDate()).padStart(2, "0");

                setDueDate(`${year}-${month}-${day}`);
              } else {
                setDueDate("");
              }
            }}
            shouldCloseOnSelect={true}
            dateFormat="MMM d, yyyy"
            placeholderText="Due date"
            customInput={
              <button
                type="button"
                className="w-full min-w-0 whitespace-nowrap px-3 py-3 rounded-xl bg-[var(--surface)] shadow-[var(--shadow-inset)] text-sm text-[var(--text-secondary)] hover:cursor-pointer transition flex items-center justify-center gap-2 overflow-hidden"
              >
                <Calendar size={18} />
                <span className="truncate">
                  {dueDate
                    ? new Date(dueDate + "T00:00:00").toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        },
                      )
                    : "Due date"}
                </span>
              </button>
            }
          />

          <button className="px-4 py-3 rounded-xl bg-[#3f434b] text-white font-medium hover:bg-[#353941] transition cursor-pointer">
            Add
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddTask;
