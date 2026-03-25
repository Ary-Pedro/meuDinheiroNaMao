import { EmptyState } from "@/modules/shared/components/empty-state";
import { PageHeader } from "@/modules/shared/components/page-header";
import { SectionCard } from "@/modules/shared/components/section-card";

export default function SimulationsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Simulações"
        description="Cenários isolados do dado real já têm base de persistência, mas ainda não estão operacionais."
      />
      <div className="grid gap-4 md:grid-cols-3">
        <SectionCard title="Cenários">
          <EmptyState title="Em breve" description="Criação de cenários será disponibilizada no próximo incremento." />
        </SectionCard>
        <SectionCard title="Parâmetros">
          <EmptyState title="Em breve" description="Entradas controladas e projeções chegarão na etapa seguinte." />
        </SectionCard>
        <SectionCard title="Resultados">
          <EmptyState title="Em breve" description="Comparações entre cenários serão mantidas isoladas do dado real." />
        </SectionCard>
      </div>
    </div>
  );
}
