import clsx from "clsx";

export default function SelectBox({
  children,
  name,
  disableSelection,
  defaultValue,
}: {
  children: React.ReactNode;
  name: string;
  disableSelection: boolean;
  defaultValue: string;
}) {
  return (
    <select
      className={clsx(
        `block w-full mt-0 px-3 text-sm border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-gray-400 rounded-md disabled:bg-slate-200 disabled:text-slate-500`,
        {
          "touch-none pointer-events-none bg-slate-200 text-slate-500":
            disableSelection === true,
        }
      )}
      id={name}
      name={name}
      defaultValue={defaultValue}
      key={defaultValue}
    >
      {children}
    </select>
  );
}
