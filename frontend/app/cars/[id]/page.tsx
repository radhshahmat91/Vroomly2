import { CarDetailClient } from "./CarDetailClient";

export default async function CarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CarDetailClient carId={id} />;
}
