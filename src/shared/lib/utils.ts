import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Fusionne des classes Tailwind en résolvant les conflits (la dernière gagne).
 * Convention partagée par toutes les primitives UI.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
