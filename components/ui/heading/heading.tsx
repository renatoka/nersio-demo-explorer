import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import Input from '@/components/input/input';

interface HeadingProps {
  headingText?: string | null;
  searchable?: boolean;
  closable?: boolean;
  onClose?: () => void;
  onSearchChange?: (value: string) => void;
}

export default function Heading({
  headingText = null,
  searchable = false,
  closable = false,
  onClose = () => {},
  onSearchChange = () => {},
}: HeadingProps) {
  return (
    <header className="flex w-full flex-col justify-between gap-2 border-b border-neutral-300 bg-white px-6 sm:flex-row sm:gap-0 sm:rounded-t-lg sm:px-0 md:border-[1px]">
      <div className="mt-4 flex w-full items-center justify-between sm:m-4 sm:w-auto sm:justify-start">
        <h2>{headingText}</h2>
        {closable && (
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-50 p-2 hover:cursor-pointer sm:hidden"
            onClick={onClose}
          >
            <FontAwesomeIcon icon={faXmark} />
          </div>
        )}
      </div>
      <div className="mb-4 flex w-full justify-start gap-2 sm:m-2 sm:w-auto sm:justify-end">
        {searchable && (
          <Input
            placeholder="Search"
            type="text"
            css="w-full sm:w-64 h-9"
            onChange={(e) => onSearchChange(e.target.value)}
          />
        )}
        {closable && (
          <div
            className="hidden h-9 w-9 items-center justify-center rounded-lg bg-neutral-50 p-2 hover:cursor-pointer sm:flex"
            onClick={onClose}
          >
            <FontAwesomeIcon icon={faXmark} />
          </div>
        )}
      </div>
    </header>
  );
}
