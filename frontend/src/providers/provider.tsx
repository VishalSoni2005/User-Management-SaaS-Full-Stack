"use client";

import React, { useRef } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore } from "../store/store";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // IMPORTANT: useRef initial value must not be "undefined" generic — use null union
  const storeRef = useRef<AppStore | null>(null);

  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  // storeRef.current is not null here
  return <Provider store={storeRef.current}>{children}</Provider>;
}
