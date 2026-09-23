function StatCard({ title, value, icon, description }) {
  const styles = {
    "Total Tasks": {
      icon: "text-[var(--primary)]",
    },
    Completed: {
      icon: "text-[var(--success)]",
    },
    Important: {
      icon: "text-[var(--warning)]",
    },
    Pending: {
      icon: "text-blue-500",
    },
  };

  const style = styles[title] || styles["Total Tasks"];

  return (
    <div
      className="
        bg-[var(--surface)]
        p-5
        rounded-3xl
        shadow-[var(--shadow-soft)]
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-[var(--shadow-soft-hover)]
      "
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-[var(--text-secondary)]">
            {title}
          </p>

          <h3 className="text-4xl font-bold mt-3 tracking-tight text-[var(--text-primary)]">
            {value}
          </h3>

          <p className="text-xs text-[var(--text-muted)] mt-2">
            {description}
          </p>
        </div>

        <div
          className={`
            w-12 h-12
            rounded-2xl
            flex
            items-center
            justify-center
            bg-[var(--surface)]
            shadow-[var(--shadow-soft-small)]
            ${style.icon}
          `}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

export default StatCard;