import { HandMetal, ListTodo, CheckCircle, Star, Clock } from "lucide-react";
import StatCard from "../components/StatsCard";
import TaskList from "../components/TaskList";
import AddTask from "../components/AddTasks";

function Dashboard({
  tasks,
  allTasks,
  filter,
  toggleTask,
  toggleImportant,
  deleteTask,
  editTask,
  addTask,
}) {
  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter((task) => task.completed).length;
  const importantTasks = allTasks.filter(
    (task) => task.important && !task.completed,
  ).length;
  const pendingTasks = allTasks.filter((task) => !task.completed).length;

  let pageTitle;
  if (filter === "all") {
    pageTitle = "All Tasks";
  } else if (filter === "completed") {
    pageTitle = "Completed";
  } else if (filter === "important") {
    pageTitle = "Important";
  } else {
    pageTitle = "Pending";
  }

  let pageText;
  if (tasks.length === 0) {
    if (filter === "all") {
      pageText = "No tasks found.";
    } else if (filter === "important") {
      pageText = "No important tasks.";
    } else if (filter === "completed") {
      pageText = "No completed tasks.";
    } else {
      pageText = "No pending tasks.";
    }
  }

  const statcards = [
    {
      id: 1,
      title: "Total Tasks",
      value: totalTasks,
      description: "All your tasks",
      icon: <ListTodo size={28} />,
    },
    {
      id: 2,
      title: "Completed",
      value: completedTasks,
      description: "Finished tasks",
      icon: <CheckCircle size={28} />,
    },
    {
      id: 3,
      title: "Important",
      value: importantTasks,
      description: "High priority",
      icon: <Star size={28} />,
    },
    {
      id: 4,
      title: "Pending",
      value: pendingTasks,
      description: "Waiting tasks",
      icon: <Clock size={28} />,
    },
  ];

  return (
    <main className="flex-1 p-8">
      <header className="mb-8">
        <p className="flex gap-3 text-sm text-gray-500 mb-2">
          Welcome back
          <HandMetal size={20} />
        </p>

        <h2 className="text-3xl font-bold">Good morning</h2>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {statcards.map((statcard) => {
          return (
            <StatCard
              key={statcard.id}
              title={statcard.title}
              value={statcard.value}
              description={statcard.description}
              icon={statcard.icon}
            />
          );
        })}
      </div>

      <AddTask addTask={addTask} />

      <h2 className="text-xl font-bold my-4">{pageTitle}</h2>

      {tasks.length === 0 ? (
        <p>{pageText}</p>
      ) : (
        <TaskList
          tasks={tasks}
          toggleTask={toggleTask}
          toggleImportant={toggleImportant}
          deleteTask={deleteTask}
          editTask={editTask}
        />
      )}
    </main>
  );
}

export default Dashboard;
