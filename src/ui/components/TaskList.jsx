import TaskCard from "./TaskCard";
import NoteCard from "./NoteCard";

function TaskList({
  tasks,
  toggleTask,
  toggleImportant,
  deleteTask,
  onRestoreTask,
  editTask,
  onAddSubtask,
  onToggleSubtask,
  onEditSubtask,
  onDeleteSubtask,
  onOpenDetail,
}) {
  return (
    <div className="w-full space-y-4 mt-5">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          toggleTask={toggleTask}
          toggleImportant={toggleImportant}
          deleteTask={deleteTask}
          onRestoreTask={onRestoreTask}
          editTask={editTask}
          onAddSubtask={onAddSubtask}
          onToggleSubtask={onToggleSubtask}
          onEditSubtask={onEditSubtask}
          onDeleteSubtask={onDeleteSubtask}
          onOpenDetail={onOpenDetail}
        />
      ))}
    </div>
  );
}

export default TaskList;
