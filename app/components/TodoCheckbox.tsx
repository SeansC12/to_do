import { Form } from "@remix-run/react";
import type { MouseEvent } from "react";
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
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        id="terms"
        defaultChecked={isChecked}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          fetcher.submit(
            { checked: e.target.checked, id: todoId },
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
  );
}
