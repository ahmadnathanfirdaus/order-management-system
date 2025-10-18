import clsx from "clsx";

export default function InputField({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  hint,
  className,
  ...props
}) {
  return (
    <label className={clsx("flex flex-col gap-1 text-sm", className)}>
      {label && <span className="font-medium text-slate-700">{label}</span>}
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={clsx(
          "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30",
          error && "border-red-400 focus:border-red-500 focus:ring-red-300",
        )}
        {...props}
      />
      {error ? (
        <span className="text-xs text-red-500">{error}</span>
      ) : (
        hint && <span className="text-xs text-slate-400">{hint}</span>
      )}
    </label>
  );
}
