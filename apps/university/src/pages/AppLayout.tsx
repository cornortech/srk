import { ReactNode } from "react";

export const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-full h-full flex flex-col bg-bgPrimary">
      <div className="w-full max-w-7xl mx-auto flex-grow px-6">{children}</div>
    </div>
  );
};
