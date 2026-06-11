export const ROLES = {
  ADMIN: 'admin',
  OPERATOR: 'operator',
};

export const PERMISSIONS = {
  VIEW_DASHBOARD: [ROLES.ADMIN, ROLES.OPERATOR],
  VIEW_SENSORS: [ROLES.ADMIN, ROLES.OPERATOR],
  VIEW_IRRIGATION: [ROLES.ADMIN, ROLES.OPERATOR],
  VIEW_BALANCE: [ROLES.ADMIN, ROLES.OPERATOR],
  VIEW_EVENTS: [ROLES.ADMIN, ROLES.OPERATOR],
  VIEW_STATUS: [ROLES.ADMIN, ROLES.OPERATOR],
  CONTROL_PUMP: [ROLES.ADMIN, ROLES.OPERATOR],
  VIEW_ANALYTICS: [ROLES.ADMIN],
  MANAGE_USERS: [ROLES.ADMIN],
  MANAGE_SETTINGS: [ROLES.ADMIN],
  EXPORT_DATA: [ROLES.ADMIN],
};

export function hasPermission(role, permission) {
  const allowed = PERMISSIONS[permission];
  if (!allowed) return false;
  return allowed.includes(role);
}

export function isAdmin(role) {
  return role === ROLES.ADMIN;
}

export function isOperator(role) {
  return role === ROLES.OPERATOR;
}
