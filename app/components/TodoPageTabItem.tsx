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
    <div
      className="flex w-full items-center justify-start rounded-xl text-left hover:bg-neutral-900"
      key={id}
    >
      <Link className="grow p-2" to={`/${date}/${id}`}>
        <div className="truncate">{title}</div>
      </Link>
      <div className="flex max-w-[31px] items-center justify-center p-2">
        <Form className="max-h-[27px]" method="delete">
          <button
            className="rounded-md px-[5px] py-[3px] transition-all hover:bg-red-950"
            type="submit"
            name="id"
            value={id}
          >
            <TrashIcon className="mb-0 stroke-red-800" width={15} />
          </button>
        </Form>
      </div>
    </div>
  );
}
