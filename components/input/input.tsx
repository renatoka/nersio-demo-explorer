import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface InputProps {
  css?: string;
  placeholder?: string;
  type?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Input({
  css = '',
  placeholder = 'Search',
  type = 'text',
  onChange,
}: InputProps) {
  return (
    <div className="relative h-9 w-full rounded-lg bg-neutral-100">
      <input
        className={
          'h-full w-full rounded-lg border-0 bg-transparent pr-10 pl-3 font-medium text-neutral-500 focus:outline-none ' +
          css
        }
        placeholder={placeholder}
        type={type}
        onChange={onChange}
      />
      <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 transform text-neutral-900">
        <FontAwesomeIcon icon={faSearch} />
      </span>
    </div>
  );
}
