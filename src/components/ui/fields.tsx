import { cn } from "@/lib/utils";

type Common = {
  label: string;
  name: string;
  /** DOM id; defaults to name. Override when the same name appears more than once on a page. */
  id?: string;
  hint?: string;
  errors?: string[];
  required?: boolean;
  className?: string;
};

function describedBy(name: string, hint?: string, errors?: string[]) {
  const ids = [hint && `${name}-hint`, errors?.length ? `${name}-error` : undefined].filter(Boolean);
  return ids.length ? ids.join(" ") : undefined;
}

function Wrapper({
  label,
  name,
  id,
  hint,
  errors,
  required,
  className,
  children,
}: Common & { children: React.ReactNode }) {
  return (
    <div className={className}>
      <label htmlFor={id ?? name} className="field-label">
        {label}
        {required && (
          <span className="text-red-700" aria-hidden>
            {" "}
            *
          </span>
        )}
      </label>
      {children}
      {hint && (
        <p id={`${id ?? name}-hint`} className="field-hint">
          {hint}
        </p>
      )}
      {errors?.length ? (
        <p id={`${id ?? name}-error`} className="field-error" role="alert">
          {errors[0]}
        </p>
      ) : null}
    </div>
  );
}

export function TextField({
  label,
  hint,
  errors,
  className,
  id,
  ...input
}: Common & Omit<React.InputHTMLAttributes<HTMLInputElement>, "name" | "className" | "id">) {
  const { name, required } = input;
  const domId = id ?? name;
  return (
    <Wrapper label={label} name={name} id={domId} hint={hint} errors={errors} required={required} className={className}>
      <input
        id={domId}
        aria-invalid={errors?.length ? true : undefined}
        aria-describedby={describedBy(domId, hint, errors)}
        className="field-input"
        {...input}
      />
    </Wrapper>
  );
}

export function TextAreaField({
  label,
  hint,
  errors,
  className,
  rows = 5,
  ...input
}: Common & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "name" | "className">) {
  const { name, required } = input;
  return (
    <Wrapper label={label} name={name} hint={hint} errors={errors} required={required} className={className}>
      <textarea
        id={name}
        rows={rows}
        aria-invalid={errors?.length ? true : undefined}
        aria-describedby={describedBy(name, hint, errors)}
        className="field-input"
        {...input}
      />
    </Wrapper>
  );
}

export function SelectField({
  label,
  hint,
  errors,
  className,
  children,
  ...input
}: Common &
  Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "name" | "className"> & {
    children: React.ReactNode;
  }) {
  const { name, required } = input;
  return (
    <Wrapper label={label} name={name} hint={hint} errors={errors} required={required} className={className}>
      <select
        id={name}
        aria-invalid={errors?.length ? true : undefined}
        aria-describedby={describedBy(name, hint, errors)}
        className="field-input"
        {...input}
      >
        {children}
      </select>
    </Wrapper>
  );
}

export function CheckboxField({
  label,
  hint,
  className,
  ...input
}: {
  label: string;
  hint?: string;
  className?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "className"> & { name: string }) {
  return (
    <div className={cn("flex items-start gap-3", className)}>
      <input
        id={input.name}
        type="checkbox"
        className="mt-1 h-4 w-4 border-ink/40 accent-ink"
        aria-describedby={hint ? `${input.name}-hint` : undefined}
        {...input}
      />
      <div>
        <label htmlFor={input.name} className="text-sm font-medium">
          {label}
        </label>
        {hint && (
          <p id={`${input.name}-hint`} className="field-hint mt-0.5">
            {hint}
          </p>
        )}
      </div>
    </div>
  );
}
