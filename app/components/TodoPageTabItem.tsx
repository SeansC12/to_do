import { Form, Link } from "@remix-run/react";
import { TrashIcon } from "lucide-react";

export default function TodoPageTabItem({
  title,
  date,
  id,
}: {
  title: string;
  date: string;
  id: string;
}) {
  return (
    <div className="flex items-stretch" key={id}>
      <Link to={`/todos/${date}/${id}`}>
        <div className="truncate rounded-xl px-2 py-2 text-left text-sm hover:bg-neutral-900">
          {title}
        </div>
      </Link>
      <Form method="delete">
        <button
          type="submit"
          name="id"
          value={id}
          className="rounded-xl bg-red-500 p-2 text-white hover:bg-red-600"
        >
          <TrashIcon />
        </button>
      </Form>
    </div>
  );
}
