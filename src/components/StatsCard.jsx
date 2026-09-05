function StatCard({ title, value, icon, description }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>

          <h3 className="text-3xl font-bold mt-3">{value}</h3>

          <p className="text-xs text-gray-400 mt-2">{description}</p>
        </div>

        <div className="p-3 rounded-xl bg-gray-100 text-gray-700">{icon}</div>
      </div>
    </div>
  );
}

export default StatCard;
