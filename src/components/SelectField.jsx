import clsx from "clsx";

export default function SelectField({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = "Pilih opsi",
  error,
  hint,
  className,
  disabled = false,
  ...props
}) {
  return (
    <label className={clsx("flex flex-col gap-1 text-sm", className)}>
      {label && <span className="font-medium text-slate-700">{label}</span>}
      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={clsx(
          "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:bg-slate-100",
          error && "border-red-400 focus:border-red-500 focus:ring-red-300",
        )}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.id ?? option.value} value={option.id ?? option.value}>
            {option.name ?? option.label ?? option.text ?? option.value}
          </option>
        ))}
      </select>
      {error ? (
        <span className="text-xs text-red-500">{error}</span>
      ) : (
        hint && <span className="text-xs text-slate-400">{hint}</span>
      )}
    </label>
  );
}
