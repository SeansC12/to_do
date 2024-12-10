import type { User, TodoPage, Todo } from "@prisma/client";

import { prisma } from "~/db.server";

export function getTodoPage({
  id,
  userId,
  createdAt,
}: Pick<TodoPage, "id"> & {
  userId: User["id"];
  createdAt: Date;
}) {
  return prisma.todoPage.findFirst({
    select: { id: true, title: true },
    where: {
      id,
      userId,
      createdAt: {
        gte: createdAt,
        lt: new Date(createdAt.getTime() + 1000 * 60 * 60 * 24),
      },
    },
  });
}

export function getTodoPageListItems({
  userId,
  date,
}: {
  userId: User["id"];
  date: Date;
}) {
  console.log("prisma date", date);
  // return the todo pages for the day of the given date
  return prisma.todoPage.findMany({
    where: {
      userId,
      createdAt: {
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
  createdAt,
}: Pick<TodoPage, "title" | "createdAt"> & {
  userId: User["id"];
}) {
  return prisma.todoPage.create({
    data: {
      title,
      createdAt,
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

export function getTodo({ id }: Pick<Todo, "id">) {
  return prisma.todo.findFirst({
    where: { id },
    select: { id: true, content: true, completed: true },
  });
}

export function getAllTodos({ todoPageId }: Pick<Todo, "todoPageId">) {
  return prisma.todo.findMany({
    where: { todoPageId },
    select: { id: true, content: true, completed: true },
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

export function modifyTodoStatus({
  id,
  checkedStatus,
}: Pick<Todo, "id"> & { checkedStatus: boolean }) {
  return prisma.todo.updateMany({
    where: { id },
    data: { completed: checkedStatus },
  });
}

export function deleteTodo({ id }: Pick<Todo, "id">) {
  return prisma.todo.deleteMany({
    where: { id },
  });
}
