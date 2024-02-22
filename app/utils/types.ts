// Loading components
import { cls } from './utils/constants';

export enum LoadingType {
  Text,
  Dot,
  Spinner,
}

// Loading component props
interface LoadingProps {
  type?: LoadingType;
  fullscreen?: boolean;
}

const Loading: React.FC<LoadingProps> = ({ type = LoadingType.Dot, fullscreen = true }) => {
  switch (type) {
    case LoadingType.Text:
      return <LoadingText text="Loading" fullscreen={fullscreen} />;
    case LoadingType.Dot:
      return <LoadingDot fullscreen={fullscreen} />;
    case LoadingType.Spinner:
      return <LoadingSpinner fullscreen={fullscreen} />;
    default:
      return <LoadingDot fullscreen={fullscreen} />;
  }
};

// LoadingText component props
interface LoadingTextProps {
  text: string;
  fullscreen?: boolean;
}

// LoadingText component
export const LoadingText: React.FC<LoadingTextProps> = ({ text = 'Loading', fullscreen = true }) => {
  const phrase = text.toUpperCase().split('').filter((_, i) => i < 10);

  return (
    <div
      className={cls(
        'text-center w-full h-full flex items-center justify-center font-semibold text-2xl',
        fullscreen ? 'absolute inset-0' : ''
      )}
      style={{ background: 'inherit' }}
    >
      {phrase.map((item, i) => (
        <span key={i} className={cls('inline-block my-0 mx-1 blur-0', `animate-loading${i}`)}>
          {item}
        </span>
      ))}
    </div>
  );
};

// LoadingDot component props
interface LoadingDotProps {
  fullscreen?: boolean;
}

// LoadingDot component
const LoadingDot: React.FC<LoadingDotProps> = ({ fullscreen = true }) => {
  const circleClassName = 'h-4 w-4 rounded-full bg-tremor-brand dark:bg-tremor-brand-dark';

  return (
    <div
      className={cls(
        'text-center w-full h-full flex items-center justify-center',
        fullscreen ? 'absolute inset-0' : ''
      )}
      style={{ background: 'inherit' }}
    >
      <div className="h-4 w-28 flex relative">
        {[0, 1, 2].map((index) => (
          <span key={index} className={cls(circleClassName, index === 0 ? 'absolute top-0 left-0 mr-8' : 'mr-[30px]', `animate-grow${index === 0 ? '' : 'Reverse'}`)}></span>
        ))}
      </div>
    </div>
  );
};

// LoadingSpinner component props
interface LoadingSpinnerProps {
  fullscreen?: boolean;
}

// LoadingSpinner component
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ fullscreen = true }) => {
  return (
    <div
      className={cls(
        'text-center w-full h-full flex items-center justify-center',
        fullscreen ? 'absolute inset-0' : 'scale-75'
      )}
      style={{ background: 'inherit' }}
    >
      <svg className="max-w-[256px] max-h-[128px]" viewBox="0 0 256 128" xmlns="http://www.w3.org/2000/svg">
        {/* SVG content for the spinner */}
      </svg>
    </div>
  );
};

// Represents the range of values with minimum and maximum.
export type MinMax = {
  min: number;
  max: number;
};

// Represents a filter option, which can be 'ascending', 'descending', or 'none'.
export type Filter = 'ascending' | 'descending' | 'none';

// Represents a digit, which can be any number from 0 to 9.
export type Digits = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

// Represents the number of confirmations, ranging from 0 to 32.
export type Confirmations = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32;

// Provide default values for convenience.
export const defaultMinMax: MinMax = { min: 0, max: 0 };
export const defaultFilter: Filter = 'none';
export const defaultDigits: Digits = 0;
export const defaultConfirmations: Confirmations = 0;

export default Loading;
