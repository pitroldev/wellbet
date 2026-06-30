"use client";

import * as React from "react";
import Link from "next/link";
import {
  Ban,
  CheckCircle2,
  KeyRound,
  MailCheck,
  Pencil,
  ShieldCheck,
  TrendingDown,
  X,
} from "lucide-react";
import {
  Badge,
  Button,
  Drawer,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
  useToast,
} from "@/shared/ui";
import {
  useBanUser,
  useResetPassword,
  useUpdateUser,
  useUserDetail,
  type UserRole,
} from "@/shared/api/users";
import { relativeAge } from "@/shared/lib/relative-age";
import { cn } from "@/lib/utils";
import {
  Avatar,
  BET_STATUS,
  brl,
  CopyButton,
  KIND_LABEL,
  PAYOUT,
  RoleBadge,
  ROLE_LABEL,
  WEIGHIN_STATUS,
} from "./maps";

const ROLE_ITEMS: Record<string, string> = ROLE_LABEL;

/** Formata CPF/CNPJ a partir dos dígitos (exibição). */
function formatTaxId(raw: string | null): string | null {
  if (!raw) return null;
  const d = raw.replace(/\D/g, "");
  if (d.length === 11) return d.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  if (d.length === 14) return d.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
  return raw;
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleString("pt-BR");
}

/** Botão com confirmação leve (2 cliques): vira `confirmLabel` por 3s. */
function ConfirmButton({
  onConfirm,
  children,
  confirmLabel = "Confirmar?",
  disabled,
  variant = "outline",
}: {
  onConfirm: () => void;
  children: React.ReactNode;
  confirmLabel?: string;
  disabled?: boolean;
  variant?: "default" | "outline" | "ghost";
}): React.JSX.Element {
  const [armed, setArmed] = React.useState(false);
  React.useEffect(() => {
    if (!armed) return;
    const t = setTimeout(() => setArmed(false), 3000);
    return () => clearTimeout(t);
  }, [armed]);
  return (
    <Button
      type="button"
      size="sm"
      variant={armed ? "default" : variant}
      disabled={disabled}
      onClick={() => {
        if (armed) {
          setArmed(false);
          onConfirm();
        } else {
          setArmed(true);
        }
      }}
    >
      {armed ? confirmLabel : children}
    </Button>
  );
}

function Section({
  title,
  count,
  children,
}: {
  title: string;
  count?: React.ReactNode;
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <section className="flex flex-col gap-2">
      <h3 className="flex items-baseline gap-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--color-muted-foreground)]">
        {title}
        {count != null ? <span className="font-normal normal-case">{count}</span> : null}
      </h3>
      {children}
    </section>
  );
}

function NoDomainNotice(): React.JSX.Element {
  return (
    <p className="rounded-md border border-dashed border-[var(--color-border)] p-3 text-xs text-[var(--color-muted-foreground)]">
      Esta conta ainda não abriu o app (sem perfil financeiro). CPF/Pix, apostas e pesagens só
      existem após o primeiro acesso.
    </p>
  );
}

export function UserDrawer({
  authUserId,
  onClose,
}: {
  authUserId: string | null;
  onClose: () => void;
}): React.JSX.Element {
  const toast = useToast();
  const { data, isLoading, isError, refetch } = useUserDetail(authUserId);
  const update = useUpdateUser();
  const reset = useResetPassword();
  const ban = useBanUser();

  const [editing, setEditing] = React.useState(false);
  const [form, setForm] = React.useState({ name: "", taxId: "", pixKey: "" });
  const [roleDraft, setRoleDraft] = React.useState<UserRole | null>(null);
  const [banReason, setBanReason] = React.useState("");

  // Reseta o estado de edição ao trocar de usuário.
  React.useEffect(() => {
    setEditing(false);
    setRoleDraft(null);
    setBanReason("");
  }, [authUserId]);

  function doBan(): void {
    if (!authUserId) return;
    ban.mutate(
      { authUserId, ban: true, reason: banReason.trim() || undefined },
      {
        onSuccess: () => {
          setBanReason("");
          toast.show("Usuário banido — sessões encerradas.", "rejected");
        },
        onError: (e) => toast.show(e.message || "Falha ao banir.", "rejected"),
      },
    );
  }

  function doUnban(): void {
    if (!authUserId) return;
    ban.mutate(
      { authUserId, ban: false },
      {
        onSuccess: () => toast.show("Ban removido.", "approved"),
        onError: (e) => toast.show(e.message || "Falha ao desbanir.", "rejected"),
      },
    );
  }

  function startEdit(): void {
    if (!data) return;
    setForm({
      name: data.identity.name ?? "",
      taxId: data.domain?.taxId ?? "",
      pixKey: data.domain?.pixKey ?? "",
    });
    setEditing(true);
  }

  function saveEdit(): void {
    if (!authUserId) return;
    update.mutate(
      {
        authUserId,
        patch: {
          name: form.name.trim() || undefined,
          taxId: form.taxId.trim() || null,
          pixKey: form.pixKey.trim() || null,
        },
      },
      {
        onSuccess: () => {
          setEditing(false);
          toast.show("Dados atualizados.", "approved");
        },
        onError: () => toast.show("Falha ao salvar os dados.", "rejected"),
      },
    );
  }

  function doReset(): void {
    if (!authUserId || !data) return;
    reset.mutate(authUserId, {
      onSuccess: () =>
        toast.show(`Link de redefinição enviado para ${data.identity.email}.`, "approved"),
      onError: () => toast.show("Falha ao disparar o reset.", "rejected"),
    });
  }

  function verifyEmail(): void {
    if (!authUserId) return;
    update.mutate(
      { authUserId, patch: { emailVerified: true } },
      {
        onSuccess: () => toast.show("E-mail marcado como verificado.", "approved"),
        onError: () => toast.show("Falha ao verificar o e-mail.", "rejected"),
      },
    );
  }

  function applyRole(): void {
    if (!authUserId || !roleDraft) return;
    update.mutate(
      { authUserId, patch: { role: roleDraft } },
      {
        onSuccess: () => {
          setRoleDraft(null);
          toast.show("Papel atualizado (efetivo no próximo login do usuário).", "approved");
        },
        onError: (e) => toast.show(e.message || "Falha ao trocar o papel.", "rejected"),
      },
    );
  }

  return (
    <Drawer open={authUserId != null} onOpenChange={(o) => !o && onClose()}>
      {/* Cabeçalho fixo */}
      <div className="flex items-start justify-between gap-3 border-b border-[var(--color-border)] p-4">
        {isLoading || !data ? (
          <div className="flex items-center gap-3">
            <Skeleton className="size-11 rounded-full" />
            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-52" />
            </div>
          </div>
        ) : (
          <div className="flex min-w-0 items-center gap-3">
            <Avatar label={data.identity.name || data.identity.email} className="size-11 text-sm" />
            <div className="flex min-w-0 flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <p className="truncate text-lg font-semibold">
                  {data.identity.name ?? "—"}
                </p>
                <RoleBadge role={data.identity.role} />
                {data.identity.banned ? <Badge variant="rejected">Banido</Badge> : null}
              </div>
              <div className="flex items-center gap-1.5">
                <span className="truncate font-mono text-xs text-[var(--color-muted-foreground)]">
                  {data.identity.email}
                </span>
                <CopyButton value={data.identity.email} label="E-mail" />
                {data.identity.emailVerified ? (
                  <span className="inline-flex items-center gap-1 text-xs text-[var(--color-verdict-approved)]">
                    <CheckCircle2 className="size-3.5" aria-hidden /> Verificado
                  </span>
                ) : (
                  <Badge variant="pending">não verificado</Badge>
                )}
              </div>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          aria-label="Fechar"
          title="Fechar (Esc)"
        >
          <X className="size-4" aria-hidden />
        </Button>
      </div>

      {/* Corpo rolável */}
      <div className="flex-1 overflow-y-auto p-4">
        {isError ? (
          <div role="alert" className="flex flex-col items-center gap-2 p-8 text-sm text-[var(--color-verdict-rejected)]">
            Falha ao carregar o usuário.
            <Button variant="outline" size="sm" onClick={() => void refetch()}>
              Tentar novamente
            </Button>
          </div>
        ) : isLoading || !data ? (
          <div className="flex flex-col gap-4">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-20 w-full rounded-md" />
            <Skeleton className="h-24 w-full rounded-md" />
            <Skeleton className="h-32 w-full rounded-md" />
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {/* Banner de conta banida */}
            {data.identity.banned ? (
              <div className="flex flex-col gap-2 rounded-md border border-[var(--color-verdict-rejected)] bg-[var(--color-muted)] p-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-[var(--color-verdict-rejected)]">
                  <Ban className="size-4" aria-hidden /> Conta banida
                </div>
                {data.identity.banReason ? (
                  <p className="text-xs text-[var(--color-foreground)]">
                    Motivo: {data.identity.banReason}
                  </p>
                ) : null}
                {data.identity.bannedAt ? (
                  <p className="text-xs text-[var(--color-muted-foreground)]">
                    Banida em {fmtDate(data.identity.bannedAt)}
                  </p>
                ) : null}
                <div>
                  <ConfirmButton onConfirm={doUnban} disabled={ban.isPending}>
                    <ShieldCheck className="size-4" aria-hidden /> Desbanir
                  </ConfirmButton>
                </div>
              </div>
            ) : null}

            {/* Ações rápidas */}
            <div className="flex flex-wrap items-center gap-2">
              <ConfirmButton onConfirm={doReset} disabled={reset.isPending} variant="default">
                <KeyRound className="size-4" aria-hidden />
                Resetar senha
              </ConfirmButton>
              {!data.identity.emailVerified ? (
                <ConfirmButton onConfirm={verifyEmail} disabled={update.isPending}>
                  <MailCheck className="size-4" aria-hidden />
                  Verificar e-mail
                </ConfirmButton>
              ) : null}
              {!editing ? (
                <Button variant="outline" size="sm" onClick={startEdit}>
                  <Pencil className="size-4" aria-hidden />
                  Editar dados
                </Button>
              ) : null}
            </div>

            {/* Sinais */}
            <SignalsStrip signals={data.signals} />

            {/* Diagnóstico de payout */}
            <Section title="Diagnóstico de payout">
              <div className="flex flex-wrap items-center gap-2 rounded-md border border-[var(--color-border)] bg-[var(--color-muted)] p-3 text-sm">
                <Badge variant={PAYOUT[data.payout.verdict]?.variant}>
                  {PAYOUT[data.payout.verdict]?.label ?? data.payout.verdict}
                </Badge>
                {data.payout.payoutTransferId ? (
                  <span className="inline-flex items-center gap-1 font-mono text-xs text-[var(--color-muted-foreground)]">
                    transfer: {data.payout.payoutTransferId}
                    <CopyButton value={data.payout.payoutTransferId} label="ID de transferência" />
                  </span>
                ) : null}
              </div>
            </Section>

            {/* Dados / edição */}
            <Section title="Dados financeiros">
              {editing ? (
                <div className="flex flex-col gap-3 rounded-md border border-[var(--color-border)] p-3">
                  <Field label="Nome">
                    <Input
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    />
                  </Field>
                  <Field label="CPF / CNPJ (dígitos)">
                    <Input
                      value={form.taxId}
                      inputMode="numeric"
                      placeholder="só números"
                      onChange={(e) => setForm((f) => ({ ...f, taxId: e.target.value }))}
                    />
                  </Field>
                  <Field label="Chave Pix">
                    <Input
                      value={form.pixKey}
                      placeholder="e-mail, telefone, CPF ou aleatória"
                      onChange={(e) => setForm((f) => ({ ...f, pixKey: e.target.value }))}
                    />
                  </Field>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={saveEdit} disabled={update.isPending}>
                      {update.isPending ? "Salvando…" : "Salvar"}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : data.domain ? (
                <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 rounded-md border border-[var(--color-border)] p-3 text-sm">
                  <ReadField label="CPF / CNPJ" value={formatTaxId(data.domain.taxId)} copy={data.domain.taxId} mono />
                  <ReadField label="Chave Pix" value={data.domain.pixKey} copy={data.domain.pixKey} mono />
                </dl>
              ) : (
                <NoDomainNotice />
              )}
            </Section>

            {/* Acesso & identidade */}
            <Section title="Acesso & identidade">
              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 rounded-md border border-[var(--color-border)] p-3 text-sm">
                <ReadField label="ID (auth)" value={data.identity.authUserId} copy={data.identity.authUserId} mono />
                <ReadField label="Criado em" value={fmtDate(data.identity.createdAt)} />
                <ReadField label="Atualizado" value={fmtDate(data.identity.updatedAt)} />
              </dl>
            </Section>

            {/* Apostas */}
            <Section title="Apostas" count={data.bets.length > 0 ? `${data.bets.length}` : undefined}>
              {data.domain == null ? (
                <NoDomainNotice />
              ) : data.bets.length === 0 ? (
                <EmptyRow>Sem apostas ainda.</EmptyRow>
              ) : (
                <div className="overflow-hidden rounded-md border border-[var(--color-border)] text-sm">
                  {data.bets.map((b) => (
                    <div
                      key={b.betId}
                      className="flex items-center justify-between gap-3 border-b border-[var(--color-border)] px-3 py-2 last:border-0"
                    >
                      <Badge variant={BET_STATUS[b.status]?.variant}>
                        {BET_STATUS[b.status]?.label ?? b.status}
                      </Badge>
                      <span className="ml-auto tabular-nums text-[var(--color-muted-foreground)]">
                        stake {brl(b.stakeAmount, b.currency)}
                        {b.payoutAmount ? ` · payout ${brl(b.payoutAmount, b.currency)}` : ""}
                      </span>
                      <span
                        className="shrink-0 text-xs text-[var(--color-muted-foreground)]"
                        title={fmtDate(b.createdAt)}
                      >
                        {relativeAge(b.createdAt).label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </Section>

            {/* Pesagens */}
            <Section
              title="Pesagens & vereditos"
              count={<WeighinsSummary weighins={data.weighins} />}
            >
              {data.domain == null ? (
                <NoDomainNotice />
              ) : data.weighins.length === 0 ? (
                <EmptyRow>Sem pesagens ainda.</EmptyRow>
              ) : (
                <div className="overflow-hidden rounded-md border border-[var(--color-border)] text-sm">
                  {data.weighins.map((w) => (
                    <Link
                      key={w.id}
                      href={`/review/${w.id}`}
                      className="flex items-center gap-3 border-b border-[var(--color-border)] px-3 py-2 transition-colors last:border-0 hover:bg-[var(--color-muted)]"
                    >
                      <span className="w-20 shrink-0 text-xs text-[var(--color-muted-foreground)]">
                        {KIND_LABEL[w.kind] ?? w.kind}
                      </span>
                      <Badge variant={WEIGHIN_STATUS[w.status]?.variant}>
                        {WEIGHIN_STATUS[w.status]?.label ?? w.status}
                      </Badge>
                      <span className="ml-auto inline-flex items-center gap-1 tabular-nums">
                        <TrendingDown className="size-3.5 text-[var(--color-muted-foreground)]" aria-hidden />
                        {w.weightKg.toFixed(1)} kg
                      </span>
                      <span
                        className="shrink-0 text-xs text-[var(--color-muted-foreground)]"
                        title={fmtDate(w.capturedAt)}
                      >
                        {relativeAge(w.capturedAt).label}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </Section>

            {/* Permissões */}
            <Section title="Permissões">
              <div className="flex flex-wrap items-center gap-2 rounded-md border border-[var(--color-border)] p-3">
                <Select
                  value={roleDraft ?? data.identity.role}
                  onValueChange={(v) =>
                    setRoleDraft(v === data.identity.role ? null : (v as UserRole))
                  }
                  items={ROLE_ITEMS}
                >
                  <SelectTrigger className="w-44" aria-label="Papel do usuário">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Usuário</SelectItem>
                    <SelectItem value="reviewer">Revisor</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
                {roleDraft && roleDraft !== data.identity.role ? (
                  <>
                    <Button size="sm" onClick={applyRole} disabled={update.isPending}>
                      Aplicar “{ROLE_LABEL[roleDraft]}”
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setRoleDraft(null)}>
                      Cancelar
                    </Button>
                  </>
                ) : (
                  <span className="text-xs text-[var(--color-muted-foreground)]">
                    Mudar o papel afeta o acesso ao console e ao app.
                  </span>
                )}
              </div>
            </Section>

            {/* Zona de risco — banir (some quando já banido; aí o banner cuida do desban). */}
            {!data.identity.banned ? (
              <Section title="Zona de risco">
                <div className="flex flex-col gap-2 rounded-md border border-[var(--color-border)] p-3">
                  <p className="text-xs text-[var(--color-muted-foreground)]">
                    Banir bloqueia todo acesso (app e console) e encerra as sessões na hora.
                    Reversível.
                  </p>
                  <Input
                    value={banReason}
                    onChange={(e) => setBanReason(e.target.value)}
                    placeholder="Motivo do ban (opcional)"
                    aria-label="Motivo do ban"
                  />
                  <div>
                    <ConfirmButton onConfirm={doBan} disabled={ban.isPending} confirmLabel="Confirmar ban?">
                      <Ban className="size-4" aria-hidden /> Banir usuário
                    </ConfirmButton>
                  </div>
                </div>
              </Section>
            ) : null}
          </div>
        )}
      </div>
    </Drawer>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }): React.JSX.Element {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium text-[var(--color-muted-foreground)]">{label}</span>
      {children}
    </label>
  );
}

function ReadField({
  label,
  value,
  copy,
  mono,
}: {
  label: string;
  value: string | null;
  copy?: string | null;
  mono?: boolean;
}): React.JSX.Element {
  return (
    <>
      <dt className="text-[var(--color-muted-foreground)]">{label}</dt>
      <dd className="flex min-w-0 items-center gap-1.5">
        <span className={cn("truncate", mono && "font-mono text-xs", !value && "text-[var(--color-muted-foreground)]")}>
          {value ?? "Não informado"}
        </span>
        {copy ? <CopyButton value={copy} label={label} /> : null}
      </dd>
    </>
  );
}

function EmptyRow({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <p className="rounded-md border border-dashed border-[var(--color-border)] px-3 py-4 text-center text-xs text-[var(--color-muted-foreground)]">
      {children}
    </p>
  );
}

function SignalsStrip({
  signals,
}: {
  signals: {
    newAccount: boolean;
    rejectionsCount: number;
    payoutPending: boolean;
    noFinancialProfile: boolean;
    emailUnverified: boolean;
    orphan: boolean;
  };
}): React.JSX.Element {
  const chips: { label: string; variant: "approved" | "pending" | "rejected" | undefined }[] = [];
  if (signals.newAccount) chips.push({ label: "Conta nova", variant: "pending" });
  if (signals.rejectionsCount > 0)
    chips.push({
      label: `${String(signals.rejectionsCount)} reprovação${signals.rejectionsCount > 1 ? "ões" : ""}`,
      variant: signals.rejectionsCount >= 2 ? "rejected" : "pending",
    });
  if (signals.payoutPending) chips.push({ label: "Payout pendente", variant: "pending" });
  if (signals.noFinancialProfile) chips.push({ label: "Sem perfil financeiro", variant: "rejected" });
  if (signals.emailUnverified) chips.push({ label: "E-mail não verificado", variant: "pending" });
  if (signals.orphan) chips.push({ label: "Conta órfã", variant: undefined });

  if (chips.length === 0) {
    return (
      <p className="inline-flex items-center gap-1.5 text-xs text-[var(--color-muted-foreground)]">
        <CheckCircle2 className="size-3.5 text-[var(--color-verdict-approved)]" aria-hidden />
        Nenhum sinal de atenção — conta saudável.
      </p>
    );
  }
  return (
    <div className="flex flex-wrap gap-1.5">
      {chips.map((c) => (
        <Badge key={c.label} variant={c.variant}>
          {c.label}
        </Badge>
      ))}
    </div>
  );
}

function WeighinsSummary({
  weighins,
}: {
  weighins: { status: string; verdict: string | null }[];
}): React.JSX.Element | null {
  if (weighins.length === 0) return null;
  const approved = weighins.filter((w) => w.status === "approved" || w.verdict === "approved").length;
  const rejected = weighins.filter(
    (w) => w.status === "rejected" || w.status === "recapture" || w.verdict === "rejected",
  ).length;
  return (
    <>
      {weighins.length} · {approved} aprovadas · {rejected} reprovadas
    </>
  );
}
