import { useFetch } from "./useFetch.js";

// Loads the user list and offers helpers to look people up by id.
export function useUsers() {
  const { data } = useFetch("/users");
  const users = data || [];

  const nameOf = (id) => users.find((u) => u.id === id)?.name ?? (id || "Unassigned");
  const developers = users.filter((u) => u.role === "developer");

  return { users, developers, nameOf };
}
