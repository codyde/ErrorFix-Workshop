import { Hero } from "@/components/hero";
import { ClientProducts } from "@/app/components/ClientProducts";

export default function Home() {
  return (
    <div className="space-y-16 pb-16">
      <Hero />
      <ClientProducts />
    </div>
  );
}
