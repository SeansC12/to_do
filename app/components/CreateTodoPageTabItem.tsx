import { Form, Link } from "@remix-run/react";
import { TrashIcon } from "lucide-react";

export default function CreateTodoPageTabItem({ date }: { date: string }) {
  return (
    <div className="w-full hover:animate-pulse">
      <Link to={`/${date}/new`}>
        <div className="w-full truncate rounded-md bg-green-950 p-2 hover:bg-green-900">
          Create a new todo page
        </div>
      </Link>
    </div>
  );
}
