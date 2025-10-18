import clsx from "clsx";

const styles = {
  primary:
    "bg-primary text-white hover:bg-primary/90 active:bg-primary/80 disabled:bg-primary/40",
  secondary:
    "bg-white text-primary border border-primary hover:bg-primary/10 active:bg-primary/20 disabled:bg-white disabled:text-primary/40 disabled:border-primary/40",
  muted:
    "bg-slate-100 text-slate-600 hover:bg-slate-200 active:bg-slate-300 disabled:text-slate-400",
};

export default function Button({
  variant = "primary",
  className,
  children,
  ...props
}) {
  const variantKey = props.disabled ? "muted" : variant;

  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50",
        styles[variantKey],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
