import type { FetcherWithComponents } from "@remix-run/react";
import { TrashIcon } from "lucide-react";

export default function TodoCheckbox({
  content,
  todoId,
  isChecked,
  fetcher,
}: {
  content: string;
  todoId: string;
  isChecked: boolean;
  fetcher: FetcherWithComponents<unknown>;
}) {
  return (
    <div className="flex">
      <div className="flex w-full items-center space-x-2">
        <input
          type="checkbox"
          defaultChecked={isChecked}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            fetcher.submit(
              {
                intent: "modifyTodoStatus",
                checked: e.target.checked,
                id: todoId,
              },
              { method: "post" },
            );
          }}
        />
        <label htmlFor="terms" className="text-lg font-medium">
          {content}
        </label>
      </div>
      <button
        className="rounded-md px-[5px] py-[3px] transition-all hover:bg-red-950"
        onClick={() => {
          fetcher.submit(
            { intent: "deleteTodo", id: todoId },
            { method: "delete" },
          );
        }}
      >
        <TrashIcon className="mb-0 stroke-red-800" width={20} />
      </button>
    </div>
  );
}
