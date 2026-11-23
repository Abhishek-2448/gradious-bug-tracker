const users = [
  {
    id: "u1",
    name: "Admin User",
    email: "admin@gradious.com",
    passwordHash:
      "$2b$10$5kVlFSTTi0O9blClVCT57.4Eb1eAABtlRD55I.xNTmzlatE.14rBC",
    role: "admin",
  },
  {
    id: "u2",
    name: "Dev One",
    email: "dev1@gradious.com",
    passwordHash:
      "$2b$10$X.CqXkhv2rz01ct/az6B8u14CcHHSF8M7zo4YG8bsH3RE4CWW.hV6",
    role: "developer",
  },
  {
    id: "u3",
    name: "Dev Two",
    email: "dev2@gradious.com",
    passwordHash:
      "$2b$10$laaw2Np8XXnNF8yrPp9ez.GfKal6pE86uQ3x3ojXZIdhae.HL0UJm",
    role: "developer",
  },
  {
    id: "u4",
    name: "Reporter One",
    email: "reporter@gradious.com",
    passwordHash:
      "$2b$10$meNIehPH00ejR5dTyto0ve7XJark/vhRCPJB.18ZSxM4rafjwm4iy",
    role: "reporter",
  },
];

export const publicUser = ({ passwordHash, ...rest }) => rest;

export default users;
