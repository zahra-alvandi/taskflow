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
  onOpenDetail,
  onRestoreTask,
}) {
  return (
    <div className="w-full space-y-3 mt-5">
      {tasks.map((task) => (
        <div key={task.id} className="stagger-item">
          {task.type === "note" ? (
            <NoteCard
              note={task}
              deleteTask={deleteTask}
              editTask={editTask}
              onRestoreNote={onRestoreTask}
            />
          ) : (
            <TaskCard
              task={task}
              toggleTask={toggleTask}
              toggleImportant={toggleImportant}
              deleteTask={deleteTask}
              editTask={editTask}
              onAddSubtask={onAddSubtask}
              onToggleSubtask={onToggleSubtask}
              onEditSubtask={onEditSubtask}
              onDeleteSubtask={onDeleteSubtask}
              onOpenDetail={onOpenDetail}
              onRestoreTask={onRestoreTask}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default TaskList;
