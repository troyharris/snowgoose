import { SettingsHeading } from "@/app/_ui/typography";
import { getCurrentAPIUser } from "@/app/_lib/auth";
import PasswordResetForm from "@/app/_ui/settings/profile/password-reset-form";

export default async function Profile() {
  const apiUser = await getCurrentAPIUser();

  if (!apiUser) return <div>Not logged in</div>;

  return (
    <main>
      <SettingsHeading>Profile Settings</SettingsHeading>
      <div className="w-2/3 flex justify-center flex-col">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
          <div className="py-2">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-700 text-xs">Email:</span>
              <span className="font-medium">{apiUser.email}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mt-4">
          <h2 className="text-xl font-semibold mb-4">Password Settings</h2>
          <PasswordResetForm />
        </div>
      </div>
    </main>
  );
}
