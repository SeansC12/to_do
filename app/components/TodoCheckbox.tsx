import { TrashIcon } from "lucide-react";
import type { FetcherWithComponents } from "@remix-run/react";

export function TodoCheckbox({
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
      <div className="flex w-[400px] items-center space-x-2">
        <input
          type="checkbox"
          id="terms"
          defaultChecked={isChecked}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            fetcher.submit(
              {
                job: "modifyTodoStatus",
                checked: e.target.checked,
                id: todoId,
              },
              { method: "post" },
            );
          }}
        />
        <label
          htmlFor="terms"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {content}
        </label>
      </div>
      <button
        className="peer rounded-md bg-red-500 p-1 text-white hover:bg-red-600"
        onClick={() => {
          fetcher.submit(
            { job: "deleteTodo", id: todoId },
            { method: "delete" },
          );
        }}
      >
        <TrashIcon />
      </button>
    </div>
  );
}
