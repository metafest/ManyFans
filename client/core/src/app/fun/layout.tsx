import { ReactNode } from "react";
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="px-5 py-5">
      <main>{children}</main>
    </div>
  );
}
