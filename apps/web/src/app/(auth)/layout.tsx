import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function AuthLayout({ children }: Props) {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <img
            src="/assets/bloonsoo.png"
            alt="Bloonsoo.com logo"
            className="h-15 w-40"
          />
        </a>
        {children}
      </div>
    </div>
  );
}
