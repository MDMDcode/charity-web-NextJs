"use client";

import { Suspense } from "react";
import NavigationLoader from "./NavigationLoader";

export default function NavigationLoaderWrapper() {
  return (
    <Suspense fallback={null}>
      <NavigationLoader />
    </Suspense>
  );
}