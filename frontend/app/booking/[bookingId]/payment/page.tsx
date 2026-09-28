import { PaymentClient } from "./PaymentClient";

export default async function PaymentPage({ params }: { params: Promise<{ bookingId: string }> }) {
  const { bookingId } = await params;
  return <PaymentClient bookingId={bookingId} />;
}
