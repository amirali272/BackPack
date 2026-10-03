import { forwardRef, useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export const inputClass =
  "w-full rounded-xl border border-line-soft bg-[#060c0a]/80 px-3.5 text-sm text-fg placeholder:text-subtle " +
  "shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)] transition-[border-color,box-shadow,background-color] duration-200 " +
  "hover:border-white/[0.12] focus:border-primary/60 focus:bg-[#07110d] focus:outline-none focus:ring-4 focus:ring-primary/15 " +
  "aria-[invalid=true]:border-danger/60 aria-[invalid=true]:focus:ring-danger/15 disabled:opacity-60";

type FieldShellProps = {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  children: ReactNode;
  className?: string;
};

function FieldShell({ id, label, hint, error, optional, children, className }: FieldShellProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="flex items-center justify-between text-[13px] font-medium text-fg-2">
        {label}
        {optional && <span className="text-[12px] font-normal text-subtle">Optional</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-[12.5px] text-[#ff8a94]">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-[12.5px] text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function describedBy(id: string, error?: string, hint?: string) {
  if (error) return `${id}-error`;
  if (hint) return `${id}-hint`;
  return undefined;
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  wrapperClassName?: string;
  trailing?: ReactNode;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, optional, className, wrapperClassName, trailing, id: idProp, ...rest },
  ref,
) {
  const auto = useId();
  const id = idProp ?? auto;
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} optional={optional} className={wrapperClassName}>
      <div className="relative">
        <input
          ref={ref}
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, error, hint)}
          className={cn(inputClass, "h-11", trailing && "pr-11", className)}
          {...rest}
        />
        {trailing && <div className="absolute inset-y-0 right-1.5 flex items-center">{trailing}</div>}
      </div>
    </FieldShell>
  );
});

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  wrapperClassName?: string;
};

export function Textarea({ label, hint, error, optional, className, wrapperClassName, id: idProp, ...rest }: TextareaProps) {
  const auto = useId();
  const id = idProp ?? auto;
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} optional={optional} className={wrapperClassName}>
      <textarea
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        className={cn(inputClass, "min-h-[120px] resize-y py-3 leading-relaxed", className)}
        {...rest}
      />
    </FieldShell>
  );
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  hint?: string;
  error?: string;
  wrapperClassName?: string;
};

export function Select({ label, hint, error, className, wrapperClassName, id: idProp, children, ...rest }: SelectProps) {
  const auto = useId();
  const id = idProp ?? auto;
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} className={wrapperClassName}>
      <div className="relative">
        <select
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, error, hint)}
          className={cn(inputClass, "h-11 appearance-none pr-10", className)}
          {...rest}
        >
          {children}
        </select>
        <svg
          aria-hidden
          viewBox="0 0 16 16"
          className="pointer-events-none absolute right-3.5 top-1/2 size-3.5 -translate-y-1/2 text-muted"
        >
          <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
    </FieldShell>
  );
}
