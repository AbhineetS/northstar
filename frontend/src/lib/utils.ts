/**
 * @module utils
 * @description Shared utility functions for the Northstar Matchday OS frontend.
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS class names, resolving conflicts intelligently.
 *
 * Combines `clsx` for conditional class handling and `tailwind-merge` to
 * deduplicate conflicting Tailwind utilities (e.g. `p-4` and `p-6` will
 * resolve to `p-6`).
 *
 * @param inputs - One or more class values, arrays, or objects.
 * @returns A deduplicated, merged class name string.
 *
 * @example
 * ```tsx
 * <div className={cn("px-4 py-2", isActive && "bg-primary text-white")} />
 * ```
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number as a locale-aware string with optional suffix.
 *
 * @param value   - The numeric value to format.
 * @param locale  - BCP 47 language tag (defaults to `"en-US"`).
 * @returns A formatted string representation of the value.
 *
 * @example
 * ```ts
 * formatNumber(1200000) // "1,200,000"
 * ```
 */
export function formatNumber(value: number, locale = "en-US"): string {
  return new Intl.NumberFormat(locale).format(value);
}

/**
 * Clamps a value between a minimum and maximum bound.
 *
 * @param value - The input value.
 * @param min   - Minimum allowed value.
 * @param max   - Maximum allowed value.
 * @returns The clamped value.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
