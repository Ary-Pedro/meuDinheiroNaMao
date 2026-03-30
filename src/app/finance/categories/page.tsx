import { CategoryKind } from "@prisma/client";
import { CategoriesForm } from "@/modules/finance/components/categories-form";
import { CategoryRowActions } from "@/modules/finance/components/category-row-actions";
import { getCurrentUser } from "@/modules/shared/auth/get-current-user";
import { DataTable } from "@/modules/shared/components/data-table";
import { EmptyState } from "@/modules/shared/components/empty-state";
import { MobileList } from "@/modules/shared/components/mobile-list";
import { PageHeader } from "@/modules/shared/components/page-header";
import { SectionCard } from "@/modules/shared/components/section-card";
import { getCategoryKindLabel, toCategoryKindOptions } from "@/modules/shared/utils/labels";
import { financeComposition } from "@/server/composition/finance";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const user = await getCurrentUser();
  const categories = await financeComposition.listCategoriesService.execute(user.id);
  const kindOptions = toCategoryKindOptions([CategoryKind.INCOME, CategoryKind.EXPENSE]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Categorias e subcategorias"
        description="Organize receitas e despesas. Transferências internas ficam em um fluxo dedicado."
      />

      <div className="grid items-start gap-4 2xl:grid-cols-[minmax(360px,420px)_minmax(0,1fr)]">
        <SectionCard title="Nova categoria">
          <CategoriesForm kinds={kindOptions} />
        </SectionCard>

        <SectionCard title="Categorias cadastradas">
          {categories.length ? (
            <>
              <MobileList>
                {categories.map((category) => (
                  <div key={category.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <p className="font-medium text-slate-900">{category.name}</p>
                    <p className="text-sm text-slate-500">{getCategoryKindLabel(category.kind)}</p>
                    <p className="mt-1 text-sm text-slate-600">
                      {category.subcategories.length
                        ? category.subcategories.map((subcategory) => subcategory.name).join(", ")
                        : "Sem subcategorias"}
                    </p>
                    <div className="mt-3">
                      <CategoryRowActions category={category} kinds={kindOptions} />
                    </div>
                  </div>
                ))}
              </MobileList>

              <DataTable headers={["Categoria", "Tipo", "Subcategorias", "Ações"]}>
                {categories.map((category) => (
                  <tr key={category.id} className="border-b border-slate-100">
                    <td className="px-3 py-3 font-medium text-slate-900">{category.name}</td>
                    <td className="px-3 py-3 text-slate-600">{getCategoryKindLabel(category.kind)}</td>
                    <td className="px-3 py-3 text-slate-600">
                      {category.subcategories.length
                        ? category.subcategories.map((subcategory) => subcategory.name).join(", ")
                        : "-"}
                    </td>
                    <td className="px-3 py-3 text-slate-600">
                      <CategoryRowActions category={category} kinds={kindOptions} />
                    </td>
                  </tr>
                ))}
              </DataTable>
            </>
          ) : (
            <EmptyState
              title="Nenhuma categoria cadastrada ainda"
              description="Crie categorias para classificar receitas e despesas."
            />
          )}
        </SectionCard>
      </div>
    </div>
  );
}
