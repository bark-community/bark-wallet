// 'use client';

import GlobalError from './global-error';

export default function Error({
  error,
  reset
}: {
  error: Error;
  reset: () => void;
}) {
  // Render the GlobalError component with the provided error and reset function
  return <GlobalError error={error} reset={reset} />;
}
