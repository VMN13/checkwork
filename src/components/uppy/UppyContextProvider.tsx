import { useMemo, type PropsWithChildren } from "react";
import Uppy from "@uppy/core";
import { UppyContextProvider } from "@uppy/react";

export default function UppyContextProviderWrapper({
  children,
}: PropsWithChildren) {
  const uppy = useMemo(() => {
    return new Uppy({
      autoProceed: false,
    });
  }, []);

  return <UppyContextProvider uppy={uppy}>{children}</UppyContextProvider>;
}
