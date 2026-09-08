import { useState } from "react";

function AddTask({ addTask }) {
  const [title, setTitle] = useState("");
  return (
    <div>
      <form
        onSubmit={(event) => {
          addTask(event, title);
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
        <button className="px-6 py-3 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-700 transition cursor-pointer">
          Add
        </button>
      </form>
    </div>
  );
}

export default AddTask;
