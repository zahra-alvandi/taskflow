import { useMemo } from "react";
import {
  ArrowLeft,
  TrendingUp,
  Flame,
  Target,
  Award,
  BarChart3,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useTranslation } from "../../application/hooks/useTranslation";
import { CatEars, WhiskerLine } from "../components/CatDecorations";
import {
  getOverview,
  getWeeklyStats,
  getStreak,
  getHeatmap,
  getBestDayOfWeek,
  getPriorityBreakdown,
} from "../../core/services/statsService";

function StatsPage({ tasks, onBack }) {
  const { t } = useTranslation();

  const overview = useMemo(() => getOverview(tasks), [tasks]);
  const weekly = useMemo(() => getWeeklyStats(tasks), [tasks]);
  const streak = useMemo(() => getStreak(tasks), [tasks]);
  const heatmap = useMemo(() => getHeatmap(tasks), [tasks]);
  const bestDay = useMemo(() => getBestDayOfWeek(tasks), [tasks]);
  const priorities = useMemo(() => getPriorityBreakdown(tasks), [tasks]);

  return (
    <main className="flex-1 min-w-0 w-full h-full overflow-y-auto px-4 py-6 pb-32 sm:px-6 md:p-8 md:pb-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={onBack}
            className="mb-4 inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--primary)] transition"
          >
            <ArrowLeft size={16} className="rtl:rotate-180" />
            {t("task.back")}
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)] flex items-center justify-center shadow-[0_8px_20px_rgba(232,135,74,0.35)] relative">
              <CatEars
                size={18}
                className="absolute -top-2.5 start-1.5 -translate-x-1/2 text-[var(--primary)]"
              />
              <BarChart3 size={22} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{t("stats.pageTitle")}</h1>
                <WhiskerLine
                  width={32}
                  className="text-[var(--primary)] hidden sm:block"
                />
              </div>
              <p className="text-sm text-[var(--text-secondary)]">
                {t("stats.pageSubtitle")}
              </p>
            </div>
          </div>
        </div>

        {/* Overview cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <OverviewCard
            icon={<Target size={20} />}
            label={t("stats.total")}
            value={overview.total}
            tone="primary"
          />
          <OverviewCard
            icon={<Award size={20} />}
            label={t("stats.completed")}
            value={overview.completed}
            tone="success"
          />
          <OverviewCard
            icon={<Flame size={20} />}
            label={t("stats.streak")}
            value={streak.current}
            suffix={t("stats.days")}
            tone="warning"
          />
          <OverviewCard
            icon={<TrendingUp size={20} />}
            label={t("stats.completion")}
            value={`${overview.completionRate}%`}
            tone="accent"
          />
        </div>

        {/* Weekly Chart */}
        <div className="mb-6 rounded-3xl bg-[var(--surface)] p-5 shadow-[var(--shadow-soft)]">
          <h2 className="text-sm font-bold mb-4 text-[var(--text-primary)]">
            {t("stats.weeklyActivity")}
          </h2>

          <div className="h-56 -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekly} barGap={4}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border)"
                  vertical={false}
                />
                <XAxis
                  dataKey="dayName"
                  tick={{ fill: "var(--text-muted)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "var(--text-muted)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={24}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--surface)",
                    border: "none",
                    borderRadius: 12,
                    boxShadow: "var(--shadow-soft-small)",
                    fontSize: 12,
                  }}
                  cursor={{ fill: "var(--app-bg)" }}
                  formatter={(value, name) => [value, t(`stats.${name}`)]}
                  labelFormatter={(label, payload) =>
                    payload[0]?.payload?.dayShort ?? label
                  }
                />
                <Bar
                  dataKey="completed"
                  fill="var(--primary)"
                  radius={[8, 8, 0, 0]}
                />
                <Bar
                  dataKey="created"
                  fill="var(--accent)"
                  fillOpacity={0.4}
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-4 mt-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[var(--primary)]" />
              <span className="text-[var(--text-secondary)]">
                {t("stats.completed")}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[var(--accent)]/40" />
              <span className="text-[var(--text-secondary)]">
                {t("stats.created")}
              </span>
            </div>
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="mb-6 rounded-3xl bg-[var(--surface)] p-5 shadow-[var(--shadow-soft)]">
          <h2 className="text-sm font-bold mb-4 text-[var(--text-primary)]">
            {t("stats.byPriority")}
          </h2>

          <div className="space-y-3">
            <PriorityBar
              label={t("task.priority.high")}
              data={priorities.high}
              color="var(--danger)"
              softColor="var(--danger-soft)"
            />
            <PriorityBar
              label={t("task.priority.medium")}
              data={priorities.medium}
              color="var(--warning)"
              softColor="var(--warning-soft)"
            />
            <PriorityBar
              label={t("task.priority.low")}
              data={priorities.low}
              color="var(--success)"
              softColor="var(--success-soft)"
            />
          </div>
        </div>

        {/* Heatmap */}
        <div className="mb-6 rounded-3xl bg-[var(--surface)] p-5 shadow-[var(--shadow-soft)]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-[var(--text-primary)]">
              {t("stats.heatmap")}
            </h2>
            <span className="text-[10px] text-[var(--text-muted)]">
              {t("stats.last12Weeks")}
            </span>
          </div>

          <Heatmap weeks={heatmap} t={t} />
        </div>

        {/* Best Day */}
        {bestDay.count > 0 && (
          <div className="rounded-3xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)] p-6 shadow-[0_8px_20px_rgba(232,135,74,0.35)] text-white">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
                <Flame size={20} />
              </div>
              <div>
                <p className="text-xs text-white/80">{t("stats.bestDay")}</p>
                <h3 className="text-xl font-bold">{bestDay.dayName}</h3>
              </div>
            </div>
            <p className="text-sm text-white/90 mt-3">
              {t("stats.bestDayDesc").replace("{count}", bestDay.count)}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

/* 
   Overview Card
 */
function OverviewCard({ icon, label, value, suffix, tone }) {
  const tones = {
    primary: {
      bg: "bg-[var(--primary-soft)]",
      color: "text-[var(--primary)]",
    },
    success: {
      bg: "bg-[var(--success-soft)]",
      color: "text-[var(--success)]",
    },
    warning: {
      bg: "bg-[var(--warning-soft)]",
      color: "text-[var(--warning)]",
    },
    accent: {
      bg: "bg-[var(--accent-soft)]",
      color: "text-[var(--accent)]",
    },
  };

  const style = tones[tone] ?? tones.primary;

  return (
    <div className="rounded-2xl bg-[var(--surface)] p-4 shadow-[var(--shadow-soft-small)]">
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center mb-2 ${style.bg} ${style.color}`}
      >
        {icon}
      </div>
      <p className="text-[11px] text-[var(--text-muted)] mb-1">{label}</p>
      <p className="text-xl font-bold text-[var(--text-primary)] tabular-nums">
        {value}
        {suffix && (
          <span className="text-xs font-medium text-[var(--text-muted)] ms-1">
            {suffix}
          </span>
        )}
      </p>
    </div>
  );
}

/* 
   Priority Bar
 */
function PriorityBar({ label, data, color, softColor }) {
  const percent = data.total === 0 ? 0 : (data.completed / data.total) * 100;

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-[var(--text-secondary)]">
          {label}
        </span>
        <span className="text-xs tabular-nums text-[var(--text-muted)]">
          {data.completed}/{data.total}
        </span>
      </div>
      <div
        className="h-2 rounded-full overflow-hidden"
        style={{ background: softColor }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${percent}%`,
            background: color,
          }}
        />
      </div>
    </div>
  );
}

/* 
   Heatmap
 */
function Heatmap({ weeks, t }) {
  const getColor = (count) => {
    if (count === 0) return "var(--app-bg)";
    if (count === 1) return "var(--primary-soft)";
    if (count <= 3) return "var(--primary)";
    if (count <= 5) return "var(--primary-hover)";
    return "var(--primary-hover)";
  };

  const getOpacity = (count) => {
    if (count === 0) return 1;
    if (count === 1) return 1;
    if (count <= 3) return 0.7;
    if (count <= 5) return 0.85;
    return 1;
  };

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex gap-1 min-w-max">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((day, di) => (
              <div
                key={di}
                className="w-3 h-3 rounded-sm transition-all hover:scale-125"
                style={{
                  background: day ? getColor(day.count) : "transparent",
                  opacity: day ? getOpacity(day.count) : 0,
                }}
                title={
                  day
                    ? `${day.count} ${t("stats.tasks")} · ${day.date.toLocaleDateString(undefined, { month: "short", day: "numeric" })}`
                    : ""
                }
              />
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-1.5 mt-3 text-[10px] text-[var(--text-muted)]">
        <span>{t("stats.less")}</span>
        <div className="w-3 h-3 rounded-sm bg-[var(--app-bg)]" />
        <div className="w-3 h-3 rounded-sm bg-[var(--primary-soft)]" />
        <div className="w-3 h-3 rounded-sm bg-[var(--primary)] opacity-70" />
        <div className="w-3 h-3 rounded-sm bg-[var(--primary)] opacity-85" />
        <div className="w-3 h-3 rounded-sm bg-[var(--primary-hover)]" />
        <span>{t("stats.more")}</span>
      </div>
    </div>
  );
}

export default StatsPage;
