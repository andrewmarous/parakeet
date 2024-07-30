"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
} from "react";

import { AnalyticsBrowser } from "@segment/analytics-next";

// Types
interface AnalyticsContextProps {
  pageView: (tags: string[]) => void;
}

interface AnalyticsProviderProps {
  writeKey: string;
  children: ReactNode;
}

// Set up the global context and expose a function called pageView that
// can be used when importing this context.
const AnalyticsContext = createContext<AnalyticsContextProps>({
  pageView: () => {},
});

// Set up the provider that we will use to wrap our whole app in the
// rootLayout. This provider will make our app aware of all this
// tracking code.
export const AnalyticsProvider = ({
  writeKey,
  children,
}: AnalyticsProviderProps) => {
  const analytics = useMemo(() => new AnalyticsBrowser(), []);

  useEffect(() => {
    analytics.load({ writeKey }).catch((e) => {
      console.error(e);
    });
  }, [analytics, writeKey]);

  const pageView = (tags: string[]) => {
    analytics.page({
      tags,
    });
    console.log("pageView fired", tags);
  };

  return (
    <AnalyticsContext.Provider value={{ pageView }}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = () => useContext(AnalyticsContext);
