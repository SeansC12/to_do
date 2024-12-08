import { Link } from "@remix-run/react";

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
    <div key={id}>
      <Link to={`/todos/${date}/${id}`}>
        <div className="truncate rounded-xl px-2 py-2 text-left text-sm hover:bg-neutral-900">
          {title}
        </div>
      </Link>
    </div>
  );
}
