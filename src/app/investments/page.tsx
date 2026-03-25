import { EmptyState } from "@/modules/shared/components/empty-state";
import { PageHeader } from "@/modules/shared/components/page-header";
import { SectionCard } from "@/modules/shared/components/section-card";

export default function InvestmentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Investimentos"
        description="Módulo já previsto na arquitetura e no banco, aguardando a próxima etapa funcional."
      />
      <div className="grid gap-4 md:grid-cols-3">
        <SectionCard title="Ativos">
          <EmptyState title="Em breve" description="Cadastro e gestão de ativos entrarão no próximo incremento." />
        </SectionCard>
        <SectionCard title="Aportes">
          <EmptyState title="Em breve" description="Operações de aporte, compra e venda serão adicionadas depois." />
        </SectionCard>
        <SectionCard title="Patrimônio">
          <EmptyState title="Em breve" description="Visão consolidada patrimonial será conectada ao módulo de ativos." />
        </SectionCard>
      </div>
    </div>
  );
}
