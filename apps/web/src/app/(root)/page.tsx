import { Hero } from "@/modules/landing/hero";

export default async function Home() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Hero />
    </div>
  );
}
