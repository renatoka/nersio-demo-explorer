import React from 'react';
import Input from '@/components/input/input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

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
    <div className="flex w-full flex-col justify-between rounded-t-lg border-[1px] border-b border-neutral-300 bg-white md:flex-row">
      <div className="m-4 mr-0">
        <h2>{headingText}</h2>
      </div>
      <div className="m-2 flex w-full justify-start gap-2 md:w-auto md:justify-end">
        {searchable && (
          <Input
            placeholder="Search"
            type="text"
            css="w-64 h-9"
            onChange={(e) => onSearchChange(e.target.value)}
          />
        )}
        {closable && (
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-50 p-2 hover:cursor-pointer"
            onClick={onClose}
          >
            <FontAwesomeIcon icon={faXmark} />
          </div>
        )}
      </div>
    </div>
  );
}
