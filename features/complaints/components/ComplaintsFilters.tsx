type ComplaintsFiltersProps = {
  area: string;
  category: string;
  areaOptions: string[];
  categoryOptions: string[];
  onAreaChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
};

export function ComplaintsFilters({
  area,
  category,
  areaOptions,
  categoryOptions,
  onAreaChange,
  onCategoryChange,
}: ComplaintsFiltersProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <label className="flex min-w-[180px] flex-col gap-2 text-sm font-medium text-slate-700">
        Area
        <select
          value={area}
          onChange={(event) => onAreaChange(event.target.value)}
          className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:bg-white"
        >
          <option value="">All areas</option>
          {areaOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <label className="flex min-w-[180px] flex-col gap-2 text-sm font-medium text-slate-700">
        Category
        <select
          value={category}
          onChange={(event) => onCategoryChange(event.target.value)}
          className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:bg-white"
        >
          <option value="">All categories</option>
          {categoryOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
