"use client";

import { useMemo } from "react";
import type { CurrentUser } from "@/modules/shared/auth/get-current-user";
import { useAppTheme } from "@/modules/shared/components/theme-provider";

function getInitials(name: string) {
  const [firstName = "", lastName = ""] = name.trim().split(/\s+/);
  return `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase() || "U";
}

export function ProfileContent({ user }: { user: CurrentUser }) {
  const { isDarkMode, themeMode, toggleThemeMode } = useAppTheme();
  const initials = useMemo(() => getInitials(user.name), [user.name]);

  const panelClass = "rounded-3xl border border-[var(--app-border)] bg-[var(--app-surface-muted)] p-4 md:p-6 xl:p-8";

  const cardClass = "rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-4 shadow-sm";
  const contentCardClass = "rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-5 shadow-sm md:p-7";
  const titleClass = "font-medium text-[var(--app-heading)]";
  const subtitleClass = "text-sm text-[var(--app-muted)]";
  const separatorTopClass = "border-t border-[var(--app-border)]";
  const separatorBottomClass = "border-b border-[var(--app-border)]";
  const navClass = "space-y-2 text-[var(--app-text)]";
  const activeNavClass = isDarkMode
    ? "flex items-center justify-between rounded-xl bg-slate-900 px-3 py-2 font-medium text-[var(--app-heading)]"
    : "flex items-center justify-between rounded-xl bg-slate-100 px-3 py-2 font-medium text-[var(--app-heading)]";
  const strongTextClass = "text-[var(--app-heading)]";
  const mutedTextClass = "text-[var(--app-muted)]";
  const lineClass = "divide-y divide-[var(--app-border)] text-base";
  const fieldLabelClass = "text-[var(--app-heading)]";
  const fieldValueClass = "text-[var(--app-text)]";
  const avatarClass = isDarkMode
    ? "flex size-14 items-center justify-center rounded-full bg-slate-700 text-sm font-semibold text-[var(--app-heading)]"
    : "flex size-14 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700";
  const avatarLargeClass = isDarkMode
    ? "flex size-16 items-center justify-center rounded-full bg-slate-700 text-base font-semibold text-[var(--app-heading)]"
    : "flex size-16 items-center justify-center rounded-full bg-slate-200 text-base font-semibold text-slate-700";

  return (
    <section className={panelClass}>
      <div className="grid gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
        <div className="space-y-5">
          <article className={cardClass}>
            <div className="flex items-center gap-3">
              <div className={avatarClass}>{initials}</div>
              <div>
                <p className={titleClass}>{user.name}</p>
                <p className={subtitleClass}>{user.email}</p>
              </div>
            </div>

            <div className={`my-4 ${separatorTopClass}`} />

            <nav className={navClass}>
              <div className={activeNavClass}>
                <span>Meu perfil</span>
                <span aria-hidden="true">›</span>
              </div>
              <div className="flex items-center justify-between px-3 py-2">
                <span>Configurações</span>
                <span aria-hidden="true">›</span>
              </div>
              <div className="flex items-center justify-between px-3 py-2">
                <span>Notificações</span>
                <span className={subtitleClass}>Ativo</span>
              </div>
              <div className={`px-3 py-2 font-medium ${strongTextClass}`}>Sair</div>
            </nav>
          </article>

          <article className={cardClass}>
            <div className="mb-3 flex items-center justify-between">
              <h2 className={`text-lg font-semibold ${strongTextClass}`}>Configurações</h2>
            </div>
            <div className={`pt-3 text-sm ${separatorTopClass} text-[var(--app-text)]`}>
              <div className="flex items-center justify-between py-2">
                <span>Tema</span>
                <button
                  type="button"
                  onClick={toggleThemeMode}
                  className={
                    isDarkMode
                      ? "rounded-md border border-[var(--app-border)] bg-slate-900 px-2.5 py-1 text-[var(--app-heading)] transition hover:bg-slate-800"
                      : "rounded-md border border-slate-300 bg-slate-50 px-2.5 py-1 text-slate-600 transition hover:bg-slate-100"
                  }
                >
                  {themeMode === "dark" ? "Escuro" : "Claro"}
                </button>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Idioma</span>
                <span className={mutedTextClass}>PT-BR</span>
              </div>
            </div>
          </article>
        </div>

        <article className={contentCardClass}>
          <div className={`mb-5 flex items-start justify-between pb-5 ${separatorBottomClass}`}>
            <div className="flex items-center gap-3">
              <div className={avatarLargeClass}>{initials}</div>
              <div>
                <p className={`text-2xl font-medium ${strongTextClass}`}>{user.name}</p>
                <p className={mutedTextClass}>{user.email}</p>
              </div>
            </div>
          </div>

          <dl className={lineClass}>
            <div className="flex items-center justify-between py-5">
              <dt className={fieldLabelClass}>Nome</dt>
              <dd className={fieldValueClass}>{user.name}</dd>
            </div>
            <div className="flex items-center justify-between py-5">
              <dt className={fieldLabelClass}>Conta de e-mail</dt>
              <dd className={fieldValueClass}>{user.email}</dd>
            </div>
            <div className="flex items-center justify-between py-5">
              <dt className={fieldLabelClass}>Celular</dt>
              <dd className={mutedTextClass}>Adicionar número</dd>
            </div>
            <div className="flex items-center justify-between py-5">
              <dt className={fieldLabelClass}>Localização</dt>
              <dd className={fieldValueClass}>Brasil</dd>
            </div>
          </dl>

          <button
            type="button"
            className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Salvar alterações
          </button>
        </article>
      </div>
    </section>
  );
}
