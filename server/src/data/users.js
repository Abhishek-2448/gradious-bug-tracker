const users = [
  { id: "u1", name: "Admin User", email: "admin@gradious.com", password: "admin123", role: "admin" },
  { id: "u2", name: "Dev One", email: "dev1@gradious.com", password: "dev123", role: "developer" },
  { id: "u3", name: "Dev Two", email: "dev2@gradious.com", password: "dev123", role: "developer" },
  { id: "u4", name: "Reporter One", email: "reporter@gradious.com", password: "rep123", role: "reporter" },
];

export const publicUser = ({ password, ...rest }) => rest;

export default users;