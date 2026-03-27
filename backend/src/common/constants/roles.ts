/**
 * Roles del sistema. Integrar con Prisma UserRole.
 */
export enum AppRole {
  USER = 'USER',
  BODEGUERO = 'BODEGUERO',
  PASTERO = 'PASTERO',
  ADMINISTRADOR = 'ADMINISTRADOR',
}

/**
 * Permisos asociados al rol ADMINISTRADOR.
 * Usado por RolesGuard y documentación de capacidades.
 */
export const ADMINISTRATOR_PERMISSIONS = [
  'products:read',
  'products:create',
  'products:search',
  'orders:create_manual',
  'orders:read',
  'reports:tickets',
  'reports:sales_by_product',
  'reports:sales_by_amount',
] as const;

export type AdministratorPermission = (typeof ADMINISTRATOR_PERMISSIONS)[number];
