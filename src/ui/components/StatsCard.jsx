function StatCard({ id, title, value, description, icon, onClick, isActive }) {
  const styles = {
    total: { icon: "text-[var(--primary)]", bg: "bg-[var(--primary-soft)]" },
    completed: {
      icon: "text-[var(--success)]",
      bg: "bg-[var(--success-soft)]",
    },
    important: {
      icon: "text-[var(--warning)]",
      bg: "bg-[var(--warning-soft)]",
    },
    pending: { icon: "text-blue-500", bg: "bg-[var(--info-soft)]" },
  };

  const style = styles[id] || styles.total;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        text-left w-full
        bg-[var(--surface)]
        p-3 sm:p-5
        rounded-2xl sm:rounded-3xl
        shadow-[var(--shadow-soft)]
        transition-all
        duration-300
        cursor-pointer
        hover:-translate-y-1
        hover:shadow-[var(--shadow-soft-hover)]
        active:scale-[0.98]
        ${isActive ? "ring-2 ring-[var(--primary)] ring-offset-2 ring-offset-[var(--app-bg)]" : ""}
      `}
    >
      <div className="flex items-start justify-between gap-2 sm:gap-4">
        <div className="min-w-0">
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] truncate">
            {title}
          </p>
          <h3 className="text-2xl sm:text-4xl font-bold mt-1 sm:mt-3 tracking-tight tabular-nums">
            {value}
          </h3>
          <p className="hidden sm:block text-xs text-[var(--text-muted)] mt-2 truncate">
            {description}
          </p>
        </div>
        <div
          className={`
            w-8 h-8 sm:w-12 sm:h-12
            shrink-0
            rounded-xl sm:rounded-2xl
            flex items-center justify-center
            ${style.bg}
            ${style.icon}
            shadow-[var(--shadow-soft-small)]
          `}
        >
          <span className="hidden sm:inline">{icon}</span>
          <span className="sm:hidden scale-75">{icon}</span>
        </div>
      </div>
    </button>
  );
}

export default StatCard;
