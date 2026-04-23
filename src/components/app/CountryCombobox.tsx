'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { Ref } from 'react';
import { useTranslations } from 'next-intl';
import { Check, ChevronDown, Search, X } from 'lucide-react';
import type { Country } from '@/types/onboarding';

type Variant = 'full' | 'prefix';

interface CountryComboboxProps {
  ref?: Ref<HTMLButtonElement>;
  countries: Country[];
  value: number | '';
  onChange: (id: number | '') => void;
  onBlur?: () => void;
  error?: string;
  placeholder?: string;
  variant?: Variant;
  ariaLabel?: string;
  disabled?: boolean;
}

function normalize(s: string): string {
  return s.toLowerCase().trim();
}

function matches(country: Country, q: string): boolean {
  if (!q) return true;
  const needle = normalize(q).replace(/^\+/, '');
  const name = normalize(country.name);
  const code = normalize(country.code || '');
  const prefix = (country.phonePrefix || '').replace(/^\+/, '');
  return (
    name.includes(needle) ||
    code.includes(needle) ||
    prefix.includes(needle)
  );
}

function rank(country: Country, q: string): number {
  if (!q) return 0;
  const needle = normalize(q).replace(/^\+/, '');
  const name = normalize(country.name);
  const code = normalize(country.code || '');
  const prefix = (country.phonePrefix || '').replace(/^\+/, '');
  if (name.startsWith(needle)) return 0;
  if (code.startsWith(needle)) return 1;
  if (prefix.startsWith(needle)) return 2;
  if (name.includes(needle)) return 3;
  return 4;
}

export default function CountryCombobox({
  ref,
  countries,
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  variant = 'full',
  ariaLabel,
  disabled = false,
}: CountryComboboxProps) {
  const tc = useTranslations('Onboarding.common');
  const resolvedPlaceholder = placeholder ?? tc('selectCountry');
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listboxId = useId();

  const selected = useMemo(
    () => countries.find((c) => c.id === value) ?? null,
    [countries, value],
  );

  const pool = useMemo(
    () => (variant === 'prefix' ? countries.filter((c) => c.phonePrefix) : countries),
    [countries, variant],
  );

  const filtered = useMemo(() => {
    const list = pool.filter((c) => matches(c, query));
    if (!query) {
      return [...list].sort((a, b) => a.name.localeCompare(b.name));
    }
    return [...list].sort((a, b) => {
      const r = rank(a, query) - rank(b, query);
      return r !== 0 ? r : a.name.localeCompare(b.name);
    });
  }, [pool, query]);

  function closePicker() {
    setOpen(false);
    setQuery('');
    setActiveIndex(0);
  }

  function openPicker() {
    setOpen(true);
    setActiveIndex(0);
  }

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) closePicker();
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        closePicker();
      }
    }
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => searchRef.current?.focus(), 10);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open || !listRef.current) return;
    const el = listRef.current.querySelector<HTMLElement>(`[data-idx="${activeIndex}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, open]);

  function commit(idx: number) {
    const c = filtered[idx];
    if (!c) return;
    onChange(c.id);
    closePicker();
  }

  function onSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      commit(activeIndex);
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActiveIndex(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setActiveIndex(filtered.length - 1);
    }
  }

  const hasError = Boolean(error);
  const triggerBase = hasError
    ? 'flex items-center gap-2 px-3 py-3 min-h-[48px] rounded-xl border border-brand bg-card text-ink-08 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
    : 'flex items-center gap-2 px-3 py-3 min-h-[48px] rounded-xl border border-black/10 bg-card text-ink-08 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
  const triggerSize = variant === 'prefix' ? 'w-28 justify-between' : 'w-full justify-between';

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={ref}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-label={ariaLabel}
        disabled={disabled}
        onBlur={(e) => {
          // Only fire onBlur when focus leaves the whole combobox (not when opening the popup)
          if (!rootRef.current?.contains(e.relatedTarget as Node)) onBlur?.();
        }}
        onClick={() => (open ? closePicker() : openPicker())}
        className={`${triggerBase} ${triggerSize}`}
      >
        <span className="flex items-center gap-2 min-w-0">
          {selected ? (
            <>
              {selected.countryFlag && (
                <span aria-hidden className="text-lg leading-none">{selected.countryFlag}</span>
              )}
              <span className="truncate text-sm">
                {variant === 'prefix' ? selected.phonePrefix : selected.name}
              </span>
            </>
          ) : (
            <span className="text-ink-06 text-sm">{resolvedPlaceholder}</span>
          )}
        </span>
        <ChevronDown size={16} className={`text-ink-05 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          className="absolute z-50 mt-2 left-0 right-auto w-[min(22rem,calc(100vw-2rem))] rounded-xl border border-black/10 bg-card shadow-lg overflow-hidden"
          style={variant === 'full' ? { width: '100%' } : undefined}
        >
          <div className="relative border-b border-black/5">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-05 pointer-events-none" />
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActiveIndex(0);
              }}
              onKeyDown={onSearchKeyDown}
              placeholder={tc('searchCountryOrPrefix')}
              aria-label={tc('searchCountries')}
              aria-controls={listboxId}
              aria-activedescendant={filtered[activeIndex] ? `${listboxId}-opt-${filtered[activeIndex].id}` : undefined}
              autoComplete="off"
              inputMode="search"
              className="w-full pl-9 pr-9 py-3 text-base bg-transparent text-ink-08 placeholder:text-ink-06 focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setActiveIndex(0);
                  searchRef.current?.focus();
                }}
                aria-label={tc('clearSearch')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md text-ink-05 hover:text-ink-08 hover:bg-black/5"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <ul
            ref={listRef}
            id={listboxId}
            role="listbox"
            className="max-h-72 overflow-y-auto overscroll-contain"
          >
            {filtered.length === 0 ? (
              <li className="px-4 py-6 text-center text-sm text-ink-06">{tc('noCountriesMatch', { query })}</li>
            ) : (
              filtered.map((c, idx) => {
                const isActive = idx === activeIndex;
                const isSelected = c.id === value;
                return (
                  <li
                    key={c.id}
                    id={`${listboxId}-opt-${c.id}`}
                    data-idx={idx}
                    role="option"
                    aria-selected={isSelected}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onClick={() => commit(idx)}
                    className={`flex items-center gap-3 px-4 min-h-[48px] py-2 cursor-pointer text-sm ${
                      isActive ? 'bg-brand/5' : ''
                    } ${isSelected ? 'text-brand' : 'text-ink-08'}`}
                  >
                    {c.countryFlag && (
                      <span aria-hidden className="text-lg leading-none shrink-0">{c.countryFlag}</span>
                    )}
                    <span className="flex-1 truncate">{c.name}</span>
                    {c.phonePrefix && (
                      <span className="text-ink-05 tabular-nums shrink-0">{c.phonePrefix}</span>
                    )}
                    {isSelected && <Check size={16} className="text-brand shrink-0" />}
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
