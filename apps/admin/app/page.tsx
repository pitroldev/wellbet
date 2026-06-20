import { redirect } from "next/navigation";

/** Raiz → fila de revisão (o shell autenticado cuida do gate de sessão). */
export default function RootPage(): never {
  redirect("/review");
}
