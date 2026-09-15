// import { Button } from "@repo/ui/components/button";
// import Link from "next/link";

// type Props = {};

// export async function Navbar({}: Props) {
//   return (
//     <div className="h-16 w-full flex items-center justify-between content-container mx-auto">
//       <div className="text-white font-black text-2xl font-heading">
//         Bloonsoo
//       </div>

//       <div></div>

//       <div className="flex items-center gap-2">
//         <Button
//           asChild
//           variant={"ghost"}
//           className="text-white border border-white/20"
//         >
//           <Link href="/account">List your Property</Link>
//         </Button>
//         <Button asChild variant={"outline"}>
//           <Link href="/account">My Account</Link>
//         </Button>
//       </div>
//     </div>
//   );
// }

"use client";

import { Button } from "@repo/ui/components/button";
import Link from "next/link";

type Props = {};

export function Navbar({}: Props) {
  return (
    <>
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 w-full z-50 h-16 flex items-center justify-between px-4 lg:px-6 bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        {/* Logo */}
        <div className="text-gray-900 font-black text-2xl font-heading">
          Bloonsoo
        </div>

        {/* Center placeholder */}
        <div></div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="ghost"
            className="text-gray-900 border border-gray-300"
          >
            <Link href="/account">List your Property</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/account">My Account</Link>
          </Button>
        </div>
      </div>

      {/* Spacer so content isn't hidden behind navbar */}
      <div className="h-16" />
    </>
  );
}
