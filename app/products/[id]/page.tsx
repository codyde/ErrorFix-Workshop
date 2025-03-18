import { ClientProductDetail } from "@/app/components/ClientProductDetail";

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const { id } = params;

  return <ClientProductDetail productId={id} />;
}
