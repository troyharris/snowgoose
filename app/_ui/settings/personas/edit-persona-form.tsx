import { SettingsHeading } from "@/app/_ui/typography";
import { updatePersona } from "@/app/_lib/server_actions/persona.actions";
import { Persona } from "@/app/_lib/model";

export default function EditPersonaForm({ persona }: { persona: Persona }) {
  return (
    <main>
      <SettingsHeading>Edit Persona</SettingsHeading>
      <form action={updatePersona}>
        <input type="hidden" name="id" value={persona.id} />
        <div className="w-2/3 flex justify-center flex-col">
          <div className="py-2">
            <label className="text-gray-700 text-xs" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              name="name"
              defaultValue={persona.name}
              className="block w-full mt-0 px-3 border border-gray-200 focus:ring-0 focus:border-black rounded-md"
            ></input>
          </div>
          <div className="py-2">
            <label className="text-gray-700 text-xs" htmlFor="prompt">
              Prompt
            </label>
            <textarea
              name="prompt"
              defaultValue={persona.prompt}
              className="block w-full mt-0 px-3 border border-gray-200 focus:ring-0 focus:border-black rounded-md"
            ></textarea>
          </div>
          <div className="py-2">
            <button
              className="rounded-md bg-slate-200 p-2 hover:bg-slate-300"
              type="submit"
            >
              Update Persona
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}
