import { ReactNode } from "react";
import { LogoNavbar } from "../components/logoNavbar";

interface TAuthLayout {
  leftChildren: ReactNode;
  rightChildren: ReactNode;
}

export const AuthLayout = ({ leftChildren, rightChildren }: TAuthLayout) => {
  return (
    <div className="w-full min-h-screen h-full bg-bgPrimary relative overflow-auto">
      <LogoNavbar />
      <main className="flex w-full h-full mt-28">
        <div className="flex-1 hidden md:block ">{leftChildren}</div>

        {/* Divider */}
        <div className="w-[1px] bg-white md:block hidden" />

        <div className="flex-1 flex items-center justify-center">
          {rightChildren}
        </div>
      </main>
    </div>
  );
};
