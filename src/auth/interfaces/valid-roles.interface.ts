export const ValidRoles = {
  ADMIN: 'admin',
  SUPERUSER: 'super-user',
  USER: 'user',
} as const;

export type ValidRoles = (typeof ValidRoles)[keyof typeof ValidRoles];
