import { useFetch } from "./useFetch.js";

export function useUsers() {
  const { data } = useFetch("/users");
  const users = data || [];

  const nameOf = (id) =>
    users.find((u) => u.id === id)?.name ?? (id || "Unassigned");
  const developers = users.filter((u) => u.role === "developer");

  return { users, developers, nameOf };
}
