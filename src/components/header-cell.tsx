import { Header } from "../types";

export default function HeaderCell({ header }: { header: Header }) {
  return (
    <div className="border border-gray-300 rounded-md grid place-items-center p-2 font-bold">
      {header.label}
    </div>
  );
}
