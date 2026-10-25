import { LogoUploader } from "@/components/admin/LogoUploader";
import { PageHeader } from "@/components/admin/PageHeader";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { requireAdmin } from "@/lib/auth";
import { DEFAULT_SETTINGS } from "@/lib/data";
import type { SiteSettings } from "@/types";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
  const settings: SiteSettings = { ...DEFAULT_SETTINGS, ...(data as Partial<SiteSettings> | null) };

  return (
    <>
      <PageHeader
        title="Site settings"
        description="Business details, WhatsApp number, logo and About page content."
      />
      <div className="space-y-8">
        <LogoUploader logoPath={settings.logo_path} />
        <SettingsForm settings={settings} />
      </div>
    </>
  );
}
