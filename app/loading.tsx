import { cls } from './utils/constants';

export enum LoadingType {
  Text,
  Dot,
  Spinner,
}

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

interface LoadingTextProps {
  text: string;
  fullscreen?: boolean;
}

const LoadingText: React.FC<LoadingTextProps> = ({ text, fullscreen = true }) => {
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

interface LoadingDotProps {
  fullscreen?: boolean;
}

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

interface LoadingSpinnerProps {
  fullscreen?: boolean;
}

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

export default Loading;

