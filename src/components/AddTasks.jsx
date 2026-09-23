import { useEffect, useState } from "react";
import { Calendar, Plus } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function AddTask({ addTask }) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [showPriority, setShowPriority] = useState(false);
  const [dueDate, setDueDate] = useState("");

  const priorityStyles = {
    high: "text-[var(--danger)] bg-[var(--danger-soft)]",
    medium: "text-[var(--warning)] bg-[var(--warning-soft)]",
    low: "text-[var(--success)] bg-[var(--success-soft)]",
  };

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
  }, []);

  const handleSubmit = (event) => {
    addTask(event, title, priority, dueDate);

    setTitle("");
    setPriority("medium");
    setDueDate("");
    setShowPriority(false);
  };

  return (
    <div className="mb-8">
      <form
        onSubmit={handleSubmit}
        className="bg-[var(--surface)] p-5 rounded-3xl shadow-[var(--shadow-soft-small)]"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold tracking-tight">Add New Task</h2>

          <Plus size={20} className="text-[var(--primary)]" />
        </div>

        <div className="flex flex-col lg:flex-row gap-3">
          {/* Title */}
          <input
            onChange={(event) => setTitle(event.target.value)}
            value={title}
            type="text"
            placeholder="What do you want to do?"
            className="flex-1 min-w-0 px-4 py-3 rounded-xl bg-[var(--app-bg)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none shadow-[var(--shadow-inset)] transition"
          />

          {/* Priority */}
          <div className="priority-picker relative lg:w-32 shrink-0">
            <button
              type="button"
              onClick={() => setShowPriority(!showPriority)}
              className={`w-full px-3 py-3 rounded-xl text-sm font-medium capitalize transition ${priorityStyles[priority]}`}
            >
              <div className="flex items-center justify-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    priority === "high"
                      ? "bg-[var(--danger)]"
                      : priority === "medium"
                        ? "bg-[var(--warning)]"
                        : "bg-[var(--success)]"
                  }`}
                />

                <span>{priority}</span>

                <span className="text-xs opacity-60">⌄</span>
              </div>
            </button>

            {showPriority && (
              <div className="absolute top-full left-0 mt-2 w-full bg-[var(--surface)] rounded-xl shadow-[var(--shadow-soft)] p-1 z-20">
                {["high", "medium", "low"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setPriority(item);
                      setShowPriority(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm capitalize transition ${
                      priority === item
                        ? "bg-[var(--primary-soft)] text-[var(--primary)]"
                        : "text-[var(--text-secondary)] hover:bg-[var(--app-bg)]"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Date */}
          <DatePicker
            wrapperClassName="lg:w-40 shrink-0"
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
            placeholderText="Pick a date"
            customInput={
              <button
                type="button"
                className="w-full px-3 py-3 rounded-xl bg-[var(--app-bg)] shadow-[var(--shadow-inset)] text-sm text-[var(--text-secondary)] flex items-center justify-center gap-2 whitespace-nowrap"
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
                    : "Pick a date"}
                </span>
              </button>
            }
          />

          {/* Add */}
          <button
            type="submit"
            className="lg:w-40 shrink-0 px-5 py-3 rounded-xl bg-[var(--primary)] text-white font-medium flex items-center justify-center gap-2 shadow-[0_6px_14px_rgba(99,102,241,0.28)] hover:bg-[var(--primary-hover)] transition"
          >
            <Plus size={18} />
            Add Task
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddTask;
