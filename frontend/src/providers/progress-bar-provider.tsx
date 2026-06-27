"use client";

import { ProgressProvider } from "@bprogress/next/app";

const ProgressBarProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ProgressProvider
      height="1.5px"
      color="var(--primary)"
      options={{ showSpinner: false }}
      // These props force the progress bar to trigger
      shallowRouting={false} // don’t skip any route changes
      disableSameURL={false} // trigger even if query changes are the only diff
      startPosition={0.1} // doesn’t matter much, gives a nicer start
      delay={0} // start immediately
      stopDelay={150} // little delay so it feels smoother
    >
      {children}
    </ProgressProvider>
  );
};

export default ProgressBarProvider;
