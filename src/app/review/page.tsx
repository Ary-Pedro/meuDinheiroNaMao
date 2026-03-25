import { EmptyState } from "@/modules/shared/components/empty-state";
import { PageHeader } from "@/modules/shared/components/page-header";
import { SectionCard } from "@/modules/shared/components/section-card";

export default function ReviewPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Revisão"
        description="Fila preparada para revisão de importações e inconsistências nos próximos incrementos."
      />
      <SectionCard title="Fila de revisão">
        <EmptyState
          title="Nenhum item pendente"
          description="A estrutura de revisão já existe, mas a importação funcional entra no próximo incremento."
        />
      </SectionCard>
    </div>
  );
}
