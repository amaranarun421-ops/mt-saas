'use client';

import * as React from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

export interface DropdownOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface CustomDropdownProps {
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  buttonClassName?: string;
  'aria-label'?: string;
}

/**
 * Modern custom dropdown built on Radix Popover.
 *
 * No native `<select>` — gives us full control over styling + cursor.
 * Premium polish: soft shadow on the popover, leading icon support,
 * a smooth check-mark on the selected option, hover transitions.
 */
export function CustomDropdown({
  value,
  options,
  onChange,
  placeholder = 'Select…',
  disabled = false,
  className,
  buttonClassName,
  'aria-label': ariaLabel,
}: CustomDropdownProps) {
  const [open, setOpen] = React.useState(false);
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1);
  const selected = options.find((o) => o.value === value);

  // Reset highlighted index when the popover opens
  React.useEffect(() => {
    if (open) {
      const idx = options.findIndex((o) => o.value === value);
      setHighlightedIndex(idx >= 0 ? idx : 0);
    }
  }, [open, value, options]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((i) => Math.min(i + 1, options.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      e.preventDefault();
      onChange(options[highlightedIndex].value);
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label={ariaLabel}
          disabled={disabled}
          onKeyDown={handleKeyDown}
          className={cn(
            'w-full justify-between font-normal cursor-pointer h-10 px-3',
            'bg-background hover:bg-muted/40 transition-colors',
            'border-border/80 hover:border-primary-400',
            open && 'border-primary-500 ring-2 ring-primary-500/15',
            !selected && 'text-muted-foreground',
            buttonClassName
          )}
        >
          <span className="flex items-center gap-2 min-w-0">
            {selected?.icon && <selected.icon className="h-4 w-4 shrink-0 text-primary-500" />}
            <span className="truncate">{selected?.label ?? placeholder}</span>
          </span>
          <ChevronDown
            className={cn(
              'ml-2 h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200',
              open && 'rotate-180 text-primary-500'
            )}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-1.5 min-w-[var(--radix-popover-trigger-width)] w-full"
        align="start"
        sideOffset={4}
      >
        <div className="max-h-72 overflow-y-auto custom-scrollbar rounded-md">
          {options.map((option, idx) => {
            const isSelected = option.value === value;
            const isHighlighted = idx === highlightedIndex;
            return (
              <button
                key={option.value}
                type="button"
                onMouseEnter={() => setHighlightedIndex(idx)}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={cn(
                  'w-full flex items-start gap-2.5 rounded-md px-2.5 py-2 text-sm text-left cursor-pointer transition-colors',
                  isSelected
                    ? 'bg-primary-500/10 text-primary-700 dark:bg-primary-500/15 dark:text-primary-200'
                    : isHighlighted
                    ? 'bg-muted/80'
                    : 'hover:bg-muted/60'
                )}
              >
                {option.icon && (
                  <option.icon className={cn(
                    'mt-0.5 h-4 w-4 shrink-0',
                    isSelected ? 'text-primary-500' : 'text-muted-foreground'
                  )} />
                )}
                <div className="flex-1 min-w-0">
                  <div className={cn(
                    'text-sm font-medium',
                    isSelected && 'text-primary-700 dark:text-primary-200'
                  )}>
                    {option.label}
                  </div>
                  {option.description && (
                    <div className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                      {option.description}
                    </div>
                  )}
                </div>
                <Check
                  className={cn(
                    'mt-0.5 h-4 w-4 shrink-0 transition-opacity',
                    isSelected ? 'text-primary-500 opacity-100' : 'opacity-0'
                  )}
                />
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
