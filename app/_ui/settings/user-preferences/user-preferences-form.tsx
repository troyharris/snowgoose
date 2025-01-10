import { updateUserSettings, fetchUserSettings } from "@/app/_lib/api";
import { ModelSelect } from "./model-select";
import { Suspense } from "react";

export default async function UserSettingsForm() {
  const settings = await fetchUserSettings();

  return (
    <main>
      <form action={updateUserSettings}>
        <div className="w-2/3 flex justify-center flex-col">
          <input type="hidden" name="id" value={settings.id} />
          <input type="hidden" name="user_id" value={settings.user_id} />
          {/* Appearance Mode */}
          <div className="py-2">
            <label className="text-gray-700 text-xs" htmlFor="appearance_mode">
              Appearance Mode
            </label>
            <select
              name="appearance_mode"
              defaultValue={settings.appearance_mode}
              className="block w-full mt-0 px-3 text-sm border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-gray-400 rounded-md disabled:bg-slate-200 disabled:text-slate-500"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>

          {/* Summary Model Preference */}
          <div className="py-2">
            <label className="text-gray-700 text-xs" htmlFor="api_vendor_id">
              API Vendor
            </label>
            <Suspense>
              <ModelSelect defaultValue={settings.summary_model_preference_id} />
            </Suspense>
          </div>

          {/* Submit Button */}
          <div className="py-2">
            <button
              className="rounded-md bg-slate-200 p-2 hover:bg-slate-300"
              type="submit"
            >
              Update Settings
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}