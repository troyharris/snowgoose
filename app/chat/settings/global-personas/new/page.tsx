import { SettingsHeading } from "@/app/_ui/typography";
import { createGlobalPersona } from "@/app/_lib/server_actions/persona.actions";
import { isCurrentUserAdmin } from "@/app/_lib/auth";

export default async function NewPersona() {
  const isAdmin = await isCurrentUserAdmin();

  if (!isAdmin) {
    return <div>Not Allowed</div>;
  }

  return (
    <main>
      <SettingsHeading>New Global Persona</SettingsHeading>
      <form action={createGlobalPersona}>
        <div className="w-2/3 flex justify-center flex-col">
          <div className="py-2">
            <label className="text-gray-700 text-xs" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              name="name"
              className="block w-full mt-0 px-3 border border-gray-200 focus:ring-0 focus:border-black rounded-md"
            />
          </div>
          <div className="py-2">
            <label className="text-gray-700 text-xs" htmlFor="prompt">
              Prompt
            </label>
            <textarea
              name="prompt"
              className="block w-full mt-0 px-3 border border-gray-200 focus:ring-0 focus:border-black rounded-md"
            ></textarea>
          </div>
          {isAdmin && (
            <div className="py-2">
              <label className="text-gray-700 text-xs" htmlFor="personaType">
                Persona Type
              </label>
              <select
                name="personaType"
                className="block w-full mt-0 px-3 border border-gray-200 focus:ring-0 focus:border-black rounded-md"
              >
                <option value="global">Global</option>
                <option value="user">User</option>
              </select>
            </div>
          )}
          <div className="py-2">
            <button
              className="rounded-md bg-slate-200 p-2 hover:bg-slate-300"
              type="submit"
            >
              Add Persona
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}
