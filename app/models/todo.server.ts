import type { User, TodoPage, Todo } from "@prisma/client";

import { prisma } from "~/db.server";

export function getTodoPage({
  id,
  userId,
}: Pick<TodoPage, "id"> & {
  userId: User["id"];
}) {
  return prisma.todoPage.findFirst({
    select: { id: true, title: true },
    where: { id, userId },
  });
}

export function getTodoPageListItems({
  userId,
  date,
}: {
  userId: User["id"];
  date: Date;
}) {
  console.log(date);
  // return the todo pages for the day of the given date
  return prisma.todoPage.findMany({
    where: {
      userId,
      updatedAt: {
        gte: date,
        lt: new Date(date.getTime() + 1000 * 60 * 60 * 24),
      },
    },
    select: { id: true, title: true },
    orderBy: { updatedAt: "desc" },
  });
}

export function createTodoPage({
  title,
  userId,
}: Pick<TodoPage, "title"> & {
  userId: User["id"];
}) {
  return prisma.todoPage.create({
    data: {
      title,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export function deleteTodoPage({
  id,
  userId,
}: Pick<TodoPage, "id"> & { userId: User["id"] }) {
  return prisma.todoPage.deleteMany({
    where: { id, userId },
  });
}

export function createTodo({
  content,
  todoPageId,
}: Pick<Todo, "content"> & {
  todoPageId: TodoPage["id"];
}) {
  return prisma.todo.create({
    data: {
      content,
      todoPage: {
        connect: {
          id: todoPageId,
        },
      },
    },
  });
}

export function completeTodo({
  id,
  todoPageId,
}: Pick<Todo, "id"> & { todoPageId: TodoPage["id"] }) {
  return prisma.todo.updateMany({
    where: { id, todoPageId },
    data: { completed: true },
  });
}

export function deleteTodo({
  id,
  todoPageId,
}: Pick<Todo, "id"> & { todoPageId: TodoPage["id"] }) {
  return prisma.todo.deleteMany({
    where: { id, todoPageId },
  });
}
