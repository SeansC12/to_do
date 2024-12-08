import { Form, Link } from "@remix-run/react";
import { TrashIcon } from "lucide-react";

export default function CreateTodoPageTabItem() {
  return (
    <div className="flex items-stretch">
      <Link to={`/new`}>
        <div className="truncate rounded-xl px-2 py-2 text-left text-sm hover:bg-neutral-900">
          Create a new todo page
        </div>
      </Link>
    </div>
  );
}
