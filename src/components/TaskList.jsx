import TaskCard from "./TaskCard";

function TaskList({ tasks, toggleTask, toggleImportant, deleteTask, editTask }) {
  return (
    <div className="space-y-4 mt-5">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} toggleTask={toggleTask} toggleImportant={toggleImportant} deleteTask={deleteTask} editTask={editTask} />
      ))}
    </div>
  );
}

export default TaskList;
