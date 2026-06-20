import type { JSX } from "react";
import { ReviewSessionView } from "@/features/review";

/**
 * Tela de revisão de uma pesagem específica.
 * O shell de dados/interação (player + checklist) é Client; esta página apenas
 * resolve o `id` da rota e delega.
 */
export default async function ReviewSessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<JSX.Element> {
  const { id } = await params;
  return <ReviewSessionView sessionId={id} />;
}
