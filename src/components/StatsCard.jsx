function StatCard({ title, value, icon, description }) {
  return (
    <div className="bg-[var(--surface)] p-4 rounded-2xl shadow-[var(--shadow-soft-small)] transition-all duration-300">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>

          <h3 className="text-2xl sm:text-3xl font-bold mt-2">{value}</h3>

          <p className="text-xs text-gray-400 mt-2">{description}</p>
        </div>

        <div className="p-2.5 rounded-xl bg-[var(--surface)] text-[var(--text-secondary)] shadow-[var(--shadow-soft-small)]">
          {icon}
        </div>
      </div>
    </div>
  );
}

export default StatCard;
