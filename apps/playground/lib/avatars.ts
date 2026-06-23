/**
 * Real user avatars (local, in /public/avatars) + plausible CHARYA users.
 * Use these to represent people — NEVER stick figures or empty gray boxes.
 * Apply each design system's visual treatment (duotone, frames, rings, etc.)
 * via CSS on top of the <img>. Agents: READ this file, do not edit it.
 */
export type CharyaUser = {
  name: string;
  handle: string;
  avatar: string;
};

export const USERS: CharyaUser[] = [
  { name: "Bruno Tavares", handle: "@brunotvr", avatar: "/avatars/u01.jpg" },
  { name: "Diego Almeida", handle: "@dieguito", avatar: "/avatars/u02.jpg" },
  { name: "Rafael Nunes", handle: "@rafanunes", avatar: "/avatars/u03.jpg" },
  { name: "Thiago Moraes", handle: "@thiagomrs", avatar: "/avatars/u04.jpg" },
  { name: "Lucas Prado", handle: "@lucasprado", avatar: "/avatars/u05.jpg" },
  { name: "Felipe Rocha", handle: "@feliperocha", avatar: "/avatars/u06.jpg" },
  { name: "Gustavo Lima", handle: "@guslima", avatar: "/avatars/u07.jpg" },
  { name: "André Castro", handle: "@andrecastro", avatar: "/avatars/u08.jpg" },
  { name: "Mariana Costa", handle: "@maricosta", avatar: "/avatars/u09.jpg" },
  { name: "Juliana Reis", handle: "@jureis", avatar: "/avatars/u10.jpg" },
  { name: "Camila Souza", handle: "@camilasz", avatar: "/avatars/u11.jpg" },
  { name: "Beatriz Lopes", handle: "@bialopes", avatar: "/avatars/u12.jpg" },
  { name: "Patrícia Gomes", handle: "@patygomes", avatar: "/avatars/u13.jpg" },
  { name: "Renata Dias", handle: "@renatadias", avatar: "/avatars/u14.jpg" },
  { name: "Aline Carvalho", handle: "@alinecarv", avatar: "/avatars/u15.jpg" },
  { name: "Fernanda Pires", handle: "@fepires", avatar: "/avatars/u16.jpg" },
];

/** Total number of avatars available (u01..uNN). */
export const AVATAR_COUNT = USERS.length;
