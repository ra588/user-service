// Simple email validation function
export const isValidEmail = (e?: string) =>

  !!e && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
