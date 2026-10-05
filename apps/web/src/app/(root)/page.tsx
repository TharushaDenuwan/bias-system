import { Hero } from "@/modules/landing/hero";

export default async function Home() {
  return (
    <div className="w-full min-h-screen bg-slate-950">
      <Hero />
    </div>
  );
}
