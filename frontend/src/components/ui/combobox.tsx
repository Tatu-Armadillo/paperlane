import * as React from 'react';
import { Command } from 'cmdk';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface ComboboxOption {
  value: string;
  label: string;
}

interface ComboboxProps {
  options: ComboboxOption[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  loadingMessage?: string;
  disabled?: boolean;
  id?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  loading?: boolean;
}

export function Combobox({
  options,
  value,
  onValueChange,
  placeholder = 'Selecione...',
  searchPlaceholder = 'Buscar...',
  emptyMessage = 'Nenhum resultado.',
  loadingMessage = 'Buscando...',
  disabled,
  id,
  searchValue,
  onSearchChange,
  loading = false,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const selected = options.find((o) => o.value === value);
  const [internalSearchValue, setInternalSearchValue] = React.useState('');
  const currentSearchValue = searchValue ?? internalSearchValue;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal h-9"
          disabled={disabled}
          type="button"
        >
          {selected ? (
            selected.label
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" aria-hidden />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command shouldFilter={!onSearchChange}>
          <Command.Input
            placeholder={searchPlaceholder}
            className="h-9 w-full border-0 border-b border-slate-200 rounded-none px-3 py-2 text-sm outline-none placeholder:text-slate-400 bg-transparent"
            value={currentSearchValue}
            onValueChange={(nextValue) => {
              if (onSearchChange) {
                onSearchChange(nextValue);
                return;
              }
              setInternalSearchValue(nextValue);
            }}
          />
          <Command.List className="max-h-60 overflow-y-auto py-1">
            {loading && (
              <div className="py-6 text-center text-sm text-slate-500">
                {loadingMessage}
              </div>
            )}
            {!loading && (
              <Command.Empty className="py-6 text-center text-sm text-slate-500">
                {emptyMessage}
              </Command.Empty>
            )}
            {!loading && (
              <Command.Group>
                {options.map((option) => (
                  <Command.Item
                    key={option.value}
                    value={option.label}
                    onSelect={() => {
                      onValueChange(option.value === value ? '' : option.value);
                      setOpen(false);
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-slate-50 aria-selected:bg-slate-100 outline-none"
                  >
                    <Check
                      className={cn(
                        'h-4 w-4 text-fuchsia-600 shrink-0',
                        value === option.value ? 'opacity-100' : 'opacity-0'
                      )}
                      aria-hidden
                    />
                    {option.label}
                  </Command.Item>
                ))}
              </Command.Group>
            )}
          </Command.List>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
