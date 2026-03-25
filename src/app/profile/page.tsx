import Link from "next/link";
import { getCurrentUser } from "@/modules/shared/auth/get-current-user";
import { PageHeader } from "@/modules/shared/components/page-header";
import { SectionCard } from "@/modules/shared/components/section-card";
import { secondaryNavItems } from "@/modules/shared/components/nav-config";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Perfil"
        description="Visualização da sessão atual. Neste MVP a autenticação ainda é simulada."
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(320px,380px)_minmax(0,1fr)]">
        <SectionCard title="Sessão atual">
          <div className="space-y-4">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-sm font-medium text-emerald-800">Sessão demo ativa</p>
              <p className="mt-1 text-sm text-emerald-700">
                O usuário abaixo vem do seed inicial e representa o login provisório do MVP.
              </p>
            </div>

            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-slate-500">Nome</dt>
                <dd className="font-medium text-slate-900">{user.name}</dd>
              </div>
              <div>
                <dt className="text-slate-500">E-mail</dt>
                <dd className="font-medium text-slate-900">{user.email}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Origem</dt>
                <dd className="font-medium text-slate-900">DEMO_USER_EMAIL / seed do Prisma</dd>
              </div>
            </dl>
          </div>
        </SectionCard>

        <SectionCard title="Atalhos">
          <div className="grid gap-3 sm:grid-cols-2">
            {secondaryNavItems
              .filter((item) => item.href !== "/profile")
              .map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900"
                >
                  {item.label}
                </Link>
              ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
