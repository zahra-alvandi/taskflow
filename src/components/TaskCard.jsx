function TaskCard({ task }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">{task.title}</h3>

        <span>{task.completed ? "Done" : "Pending"}</span>
      </div>
    </div>
  );
}

export default TaskCard;
