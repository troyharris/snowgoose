import { deletePersona } from "@/app/_lib/server_actions/persona.actions";
import { deleteModel } from "@/app/_lib/server_actions/model.actions";
import { deleteMcpTool } from "@/app/_lib/server_actions/mcp-tool.actions";
import { deleteHistory } from "@/app/_lib/server_actions/history.actions";
import { deleteOutputFormat } from "@/app/_lib/server_actions/output-format.actions";
import { MaterialSymbol } from "react-material-symbols";
import "react-material-symbols/outlined";
import Link from "next/link";

export function DeletePersonaButton({ id }: { id: string }) {
  const deletePersonaWithId = deletePersona.bind(null, Number(id));

  return (
    <div className="w-full flex justify-end">
      <form action={deletePersonaWithId}>
        <button className="mt-3">
          {" "}
          <MaterialSymbol icon="delete" size={18} className="" />
        </button>
      </form>
    </div>
  );
}

export function EditPersonaButton({ id }: { id: string }) {
  return (
    <div className="w-full flex justify-end">
      <Link href={`/settings/personas/${id}/edit`}>
        <button className="mt-3">
          {" "}
          <MaterialSymbol icon="edit" size={18} className="" />
        </button>
      </Link>
    </div>
  );
}

export function EditOutputFormatButton({ id }: { id: string }) {
  return (
    <div className="w-full flex justify-end">
      <Link href={`/settings/output-formats/${id}/edit`}>
        <button className="mt-3">
          {" "}
          <MaterialSymbol icon="edit" size={18} className="" />
        </button>
      </Link>
    </div>
  );
}

export function DeleteOutputFormatButton({ id }: { id: string }) {
  const deleteOutputFormatWithId = deleteOutputFormat.bind(null, Number(id));

  return (
    <div className="w-full flex justify-end">
      <form action={deleteOutputFormatWithId}>
        <button className="mt-3">
          {" "}
          <MaterialSymbol icon="delete" size={18} className="" />
        </button>
      </form>
    </div>
  );
}

export function EditModelButton({ id }: { id: string }) {
  return (
    <div className="w-full flex justify-end">
      <Link href={`/settings/models/${id}/edit`}>
        <button className="mt-3">
          {" "}
          <MaterialSymbol icon="edit" size={18} className="" />
        </button>
      </Link>
    </div>
  );
}

export function DeleteModelButton({ id }: { id: string }) {
  const deleteModelWithId = deleteModel.bind(null, Number(id));

  return (
    <div className="w-full flex justify-end">
      <form action={deleteModelWithId}>
        <button className="mt-3">
          {" "}
          <MaterialSymbol icon="delete" size={18} className="" />
        </button>
      </form>
    </div>
  );
}

export function DeleteHistoryButton({ id }: { id: string }) {
  const deleteHistoryWithId = deleteHistory.bind(null, Number(id));

  return (
    <div className="w-full flex justify-end">
      <form action={deleteHistoryWithId}>
        <button className="mt-3">
          {" "}
          <MaterialSymbol icon="delete" size={18} className="" />
        </button>
      </form>
    </div>
  );
}

export function EditMCPToolButton({ id }: { id: string }) {
  return (
    <div className="w-full flex justify-end">
      <Link href={`/settings/mcp-tools/${id}/edit`}>
        <button className="mt-3">
          {" "}
          <MaterialSymbol icon="edit" size={18} className="" />
        </button>
      </Link>
    </div>
  );
}

export function DeleteMCPToolButton({ id }: { id: string }) {
  const deleteMCPToolWithId = deleteMcpTool.bind(null, Number(id));

  return (
    <div className="w-full flex justify-end">
      <form action={deleteMCPToolWithId}>
        <button className="mt-3">
          {" "}
          <MaterialSymbol icon="delete" size={18} className="" />
        </button>
      </form>
    </div>
  );
}
