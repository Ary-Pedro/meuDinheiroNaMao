import { getCurrentUser } from "@/modules/shared/auth/get-current-user";
import { PageHeader } from "@/modules/shared/components/page-header";
import { ProfileContent } from "@/app/profile/profile-content";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Perfil"
        description="Visualização do perfil da sessão atual."
      />
      <ProfileContent user={user} />
    </div>
  );
}
