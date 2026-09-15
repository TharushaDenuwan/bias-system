// "use client";

// import { Button } from "@repo/ui/components/button";
// import { cn } from "@repo/ui/lib/utils";
// import Link from "next/link";
// import { usePathname } from "next/navigation";

// export function Navbar() {
//   const pathname = usePathname();
//   const isHomePage = pathname === "/";

//   return (
//     <header
//       className={cn(
//         "w-full z-50 transition-all duration-300",
//         isHomePage
//           ? "absolute top-0 left-0 text-white"
//           : "sticky top-0 bg-white border-b border-gray-200 shadow-sm text-gray-900"
//       )}
//     >
//       <div className="container mx-auto px-4 h-16 flex items-center justify-between">
//         <div className="flex items-center gap-5">
//           {/* Logo */}
//           <Link
//             href="/"
//             className={cn(
//               "font-black text-2xl font-heading transition-colors",
//               isHomePage
//                 ? "text-white hover:text-gray-200"
//                 : "text-[#003580] hover:text-[#002147]"
//             )}
//           >
//             Bloonsoo
//           </Link>

//           {/* Navigation Links */}
//           <Link
//             href="/search"
//             className={cn(
//               "font-medium text-sm hover:underline transition-colors opacity-70 hover:opacity-100",
//               isHomePage
//                 ? "text-white/90 hover:text-white"
//                 : "text-gray-700 hover:text-[#003580]",
//               pathname === "/search" && "text-[#003580] font-semibold"
//             )}
//           >
//             Explore
//           </Link>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex items-center gap-2">
//           <Button
//             asChild
//             variant={isHomePage ? "ghost" : "outline"}
//             className={cn(
//               "transition-all",
//               isHomePage
//                 ? "border border-secondary/20"
//                 : "text-[#003580] border-[#003580]/20 hover:bg-[#003580]/5"
//             )}
//           >
//             <Link href="/account">List your Property</Link>
//           </Button>
//           <Button
//             asChild
//             variant={"secondary"}
//             className={cn(
//               isHomePage ? "" : "bg-[#003580] text-white hover:bg-[#002147]"
//             )}
//           >
//             <Link href="/account">My Account</Link>
//           </Button>
//         </div>
//       </div>
//     </header>
//   );
// }

"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@repo/ui/components/button";
import { cn } from "@repo/ui/lib/utils";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

type Props = {};

export function Navbar({}: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = authClient.useSession();

  return (
    <>
      {/* Sticky Navbar with Glass Effect */}
      <div
        className={cn(
          "fixed top-0 left-0 w-full z-50 h-16 flex items-center justify-between px-4 lg:px-6 bg-white/30 backdrop-blur-md border-b border-gray-200/50 shadow-sm"
        )}
      >
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/assets/bloonsoo.png" // Replace with your actual logo path
              alt="Bloonsoo Logo"
              className="h-28 w-50 object-contain"
            />
            {/* <span
              className={cn(
                "font-black text-2xl font-heading transition-colors text-gray-900 hover:text-[#003580]"
              )}
            >
              Bloonsoo
            </span> */}
          </Link>
        </div>

        {/* Centered Navigation Links */}
        <nav className="flex-1 flex justify-center items-center gap-6">
          <Link
            href="/about"
            className={cn(
              "font-medium text-sm hover:underline transition-colors text-gray-700 hover:text-[#003580]",
              pathname === "/about" && "text-[#003580] font-semibold"
            )}
          >
            About
          </Link>
          <Link
            href="/article"
            className={cn(
              "font-medium text-sm hover:underline transition-colors text-gray-700 hover:text-[#003580]",
              pathname === "/articles" && "text-[#003580] font-semibold"
            )}
          >
            Read
          </Link>
          <Link
            href="/contact"
            className={cn(
              "font-medium text-sm hover:underline transition-colors text-gray-700 hover:text-[#003580]",
              pathname === "/contact" && "text-[#003580] font-semibold"
            )}
          >
            Contact
          </Link>
          <Link
            href="/search"
            className={cn(
              "font-medium text-sm hover:underline transition-colors text-gray-700 hover:text-[#003580]",
              pathname === "/search" && "text-[#003580] font-semibold"
            )}
          >
            Explore
          </Link>
        </nav>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="ghost"
            className={cn(
              "text-gray-900 border border-gray-300 hover:bg-[#003580]/10"
            )}
          >
            <Link href="/account">List your Property</Link>
          </Button>
          <Button
            variant="outline"
            className={cn(
              "text-[#003580] border-[#003580]/20 hover:bg-[#003580]/10 cursor-pointer"
            )}
            onClick={() => {
              const activeOrgId = session?.session?.activeOrganizationId;
              if (activeOrgId) {
                router.push("/account");
              } else {
                router.push("/account/booking-details");
              }
            }}
          >
            My Account
          </Button>
        </div>
      </div>

      {/* Spacer so content isn't hidden behind navbar */}
      <div className="h-16" />
    </>
  );
}
