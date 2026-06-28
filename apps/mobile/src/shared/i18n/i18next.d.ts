/**
 * Tipagem do i18next a partir do recurso pt (fonte da forma das chaves). Assim
 * `t("home.title")` é validado em tempo de compilação e uma chave errada quebra
 * o typecheck — rede de segurança para a internacionalização das telas.
 */
import "i18next";

import type { resources } from "./messages";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "translation";
    resources: (typeof resources)["pt"];
  }
}
