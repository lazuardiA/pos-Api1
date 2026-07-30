const categoryColor = {
  Cardio: "text-amber",
  Strength: "text-pulse",
  Yoga: "text-signal",
  HIIT: "text-pulse",
  Zumba: "text-amber",
  Boxing: "text-pulse",
  "Personal Training": "text-signal",
};

const ClassCard = ({ gymClass, onBook }) => {
  return (
    <div className="card p-5 flex flex-col gap-3 hover:border-pulse/60 transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <span className={`text-xs font-semibold uppercase tracking-wide ${categoryColor[gymClass.category] || "text-signal"}`}>
            {gymClass.category}
          </span>
          <h3 className="font-display text-lg mt-1">{gymClass.name}</h3>
        </div>
        <span className="text-xs bg-surfaceAlt border border-line rounded px-2 py-1 text-mist whitespace-nowrap">
          {gymClass.day}
        </span>
      </div>

      {gymClass.description && (
        <p className="text-sm text-mist line-clamp-2">{gymClass.description}</p>
      )}

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-mist">
        <span>⏱ {gymClass.startTime} - {gymClass.endTime}</span>
        <span>👤 {gymClass.trainer}</span>
        <span>📍 {gymClass.room}</span>
        <span>👥 Kapasitas {gymClass.capacity}</span>
      </div>

      {onBook && (
        <button onClick={() => onBook(gymClass)} className="btn-primary mt-2 w-full">
          Booking Kelas Ini
        </button>
      )}
    </div>
  );
};

export default ClassCard;
