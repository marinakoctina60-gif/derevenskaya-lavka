import { SettingsForm } from "@/components/admin/SettingsForm";
import { getSettings } from "@/lib/store";

export const metadata = {
  title: "Настройки — кабинет",
};

export default async function AdminSettingsPage() {
  const settings = await getSettings();
  return <SettingsForm initialSettings={settings} />;
}
