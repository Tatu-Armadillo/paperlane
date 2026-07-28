import * as React from "react";

import { Input } from "@/components/ui/input";

type DateInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "onChange"
> & {
  value: string;
  onChange: (value: string) => void;
};

function toMaskedDate(raw: string): string {
  const trimmed = raw.trim();

  // Accept pasted ISO values and render them in dd/mm/yyyy.
  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (isoMatch) {
    return `${isoMatch[3]}/${isoMatch[2]}/${isoMatch[1]}`;
  }

  const digits = trimmed.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
}

function isoToMasked(iso: string): string {
  if (!iso) return "";
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return "";
  return `${match[3]}/${match[2]}/${match[1]}`;
}

function maskedToIso(masked: string): string {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(masked);
  if (!match) return "";

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);

  if (day < 1 || month < 1 || month > 12 || year < 1) return "";

  const candidate = new Date(year, month - 1, day);
  const isValid =
    candidate.getFullYear() === year &&
    candidate.getMonth() === month - 1 &&
    candidate.getDate() === day;

  if (!isValid) return "";

  return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

const DateInput = React.forwardRef<HTMLInputElement, DateInputProps>(
  ({ value, onChange, onBlur, required, ...props }, ref) => {
    const [maskedValue, setMaskedValue] = React.useState(() => isoToMasked(value));

    React.useEffect(() => {
      setMaskedValue(isoToMasked(value));
    }, [value]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const nextMaskedValue = toMaskedDate(event.target.value);
      setMaskedValue(nextMaskedValue);

      const nextIsoValue = maskedToIso(nextMaskedValue);
      onChange(nextIsoValue);

      event.currentTarget.setCustomValidity("");
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      const hasPartialDate = maskedValue.length > 0 && maskedValue.length < 10;
      const hasInvalidCompleteDate = maskedValue.length === 10 && !maskedToIso(maskedValue);

      if (hasPartialDate || hasInvalidCompleteDate) {
        event.currentTarget.setCustomValidity("Informe uma data válida no formato dd/mm/yyyy.");
      } else if (required && !maskedToIso(maskedValue)) {
        event.currentTarget.setCustomValidity("Informe uma data válida no formato dd/mm/yyyy.");
      } else {
        event.currentTarget.setCustomValidity("");
      }

      onBlur?.(event);
    };

    return (
      <Input
        {...props}
        ref={ref}
        type="text"
        inputMode="numeric"
        placeholder="dd/mm/yyyy"
        maxLength={10}
        value={maskedValue}
        onChange={handleChange}
        onBlur={handleBlur}
      />
    );
  }
);

DateInput.displayName = "DateInput";

export { DateInput };
