import TaskCard from "./TaskCard";
import NoteCard from "./NoteCard";

function TaskList({
  tasks,
  toggleTask,
  toggleImportant,
  deleteTask,
  editTask,
  onAddSubtask,
  onToggleSubtask,
  onEditSubtask,
  onDeleteSubtask,
}) {
  return (
    <div className="w-full space-y-3 mt-5">
      {tasks.map((task) =>
        task.type === "note" ? (
          <NoteCard
            key={task.id}
            note={task}
            deleteTask={deleteTask}
            editTask={editTask}
          />
        ) : (
          <TaskCard
            key={task.id}
            task={task}
            toggleTask={toggleTask}
            toggleImportant={toggleImportant}
            deleteTask={deleteTask}
            editTask={editTask}
            onAddSubtask={onAddSubtask}
            onToggleSubtask={onToggleSubtask}
            onEditSubtask={onEditSubtask}
            onDeleteSubtask={onDeleteSubtask}
          />
        ),
      )}
    </div>
  );
}

export default TaskList;
