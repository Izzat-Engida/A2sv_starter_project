// app/providers.tsx
"use client";

import { Provider } from "react-redux";
import { ReactNode } from "react";
import { store } from "@/lib/redux/store";

export function StateProvider({ children }: { children: ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
}
