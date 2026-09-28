import { EditCarClient } from "./EditCarClient";

export default async function EditCarPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EditCarClient carId={id} />;
}
