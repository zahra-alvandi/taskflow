import { HandMetal, ListTodo, CheckCircle, Star, Clock } from "lucide-react";
import StatCard from "../components/StatsCard";
import TaskList from "../components/TaskList";

function Dashboard({ tasks, toggleTask, toggleImportant, deleteTask, editTask }) {
  const statcards = [
    {
      id: 1,
      title: "Total Tasks",
      value: 5,
      description: "All your tasks",
      icon: <ListTodo size={28} />,
    },
    {
      id: 2,
      title: "Completed",
      value: 5,
      description: "Finished tasks",
      icon: <CheckCircle size={28} />,
    },
    {
      id: 3,
      title: "Important",
      value: 5,
      description: "High priority",
      icon: <Star size={28} />,
    },
    {
      id: 4,
      title: "Pending",
      value: 5,
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
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
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
      <TaskList tasks={tasks} toggleTask={toggleTask} toggleImportant={toggleImportant} deleteTask={deleteTask} editTask={editTask} />
    </main>
  );
}

export default Dashboard;
