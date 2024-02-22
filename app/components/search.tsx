import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { TextInput } from '@tremor/react';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Dataset } from '../utils/types';

const translations: Dataset = {
  searchByName: 'Search by name...',
};

export default function Search({ disabled, defaultValue }: { disabled?: boolean; defaultValue: string }) {
  const { replace } = useRouter();
  const pathname = usePathname();

  const [value, setValue] = useState(defaultValue);

  const handleSearch = useCallback(
    (term: string) => {
      setValue(term);

      const params = new URLSearchParams(window.location.search);
      term ? params.set('q', term) : params.delete('q');
      replace(`${pathname}?${params.toString()}`);
    },
    [pathname, replace]
  );

  const inputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="relative mt-5 max-w-md">
      <label htmlFor="search" className="sr-only">
        {translations.searchByName}
      </label>
      <TextInput
        autoFocus
        ref={inputRef}
        icon={MagnifyingGlassIcon}
        type="text"
        name="search"
        id="search"
        disabled={disabled}
        placeholder={translations.searchByName}
        spellCheck={false}
        autoComplete="off"
        value={value}
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
  );
}
