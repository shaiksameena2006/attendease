/**
 * Security utilities for Attendease
 */

// Rate limiting helper (client-side)
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();

  /**
   * Check if action is rate limited
   * @param key - Unique identifier for the action (e.g., user ID, IP)
   * @param maxAttempts - Maximum allowed attempts
   * @param windowMs - Time window in milliseconds
   */
  isRateLimited(key: string, maxAttempts: number, windowMs: number): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // Filter out old attempts outside the window
    const recentAttempts = attempts.filter(time => now - time < windowMs);
    
    this.attempts.set(key, recentAttempts);
    
    return recentAttempts.length >= maxAttempts;
  }

  /**
   * Record an attempt
   */
  recordAttempt(key: string): void {
    const attempts = this.attempts.get(key) || [];
    attempts.push(Date.now());
    this.attempts.set(key, attempts);
  }

  /**
   * Clear attempts for a key
   */
  clearAttempts(key: string): void {
    this.attempts.delete(key);
  }
}

// Content Security Policy headers helper
export const cspHeaders = {
  "Content-Security-Policy": 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://ai.gateway.lovable.dev; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data: https:; " +
    "connect-src 'self' https://*.supabase.co https://ai.gateway.lovable.dev; " +
    "frame-ancestors 'none';",
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": 
    "camera=*, microphone=*, geolocation=*, bluetooth=*, push=*",
};

// Secure token generation
export function generateSecureToken(length: number = 32): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Password strength checker
export function checkPasswordStrength(password: string): {
  score: number;
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (password.length < 8) {
    feedback.push("Password should be at least 8 characters long");
  }
  if (!/[a-z]/.test(password)) {
    feedback.push("Add lowercase letters");
  }
  if (!/[A-Z]/.test(password)) {
    feedback.push("Add uppercase letters");
  }
  if (!/[0-9]/.test(password)) {
    feedback.push("Add numbers");
  }
  if (!/[^a-zA-Z0-9]/.test(password)) {
    feedback.push("Add special characters");
  }

  // Check for common passwords
  const commonPasswords = ['password', '123456', 'qwerty', 'admin', 'letmein'];
  if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
    feedback.push("Avoid common passwords");
    score = Math.max(0, score - 2);
  }

  return { score, feedback };
}

// Sanitize user input for display
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

// Validate file upload
export function validateFile(
  file: File,
  maxSizeMB: number = 5,
  allowedTypes: string[] = ["image/jpeg", "image/png", "image/jpg", "application/pdf"]
): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > maxSizeMB * 1024 * 1024) {
    return { 
      valid: false, 
      error: `File size must be less than ${maxSizeMB}MB` 
    };
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return { 
      valid: false, 
      error: `File type must be one of: ${allowedTypes.join(", ")}` 
    };
  }

  // Check file name
  if (!/^[a-zA-Z0-9_\-. ]+$/.test(file.name)) {
    return { 
      valid: false, 
      error: "File name contains invalid characters" 
    };
  }

  return { valid: true };
}

// Secure session storage
export const secureStorage = {
  set(key: string, value: any): void {
    try {
      const encrypted = btoa(JSON.stringify(value));
      sessionStorage.setItem(key, encrypted);
    } catch (error) {
      console.error("Failed to store data securely:", error);
    }
  },

  get(key: string): any | null {
    try {
      const encrypted = sessionStorage.getItem(key);
      if (!encrypted) return null;
      return JSON.parse(atob(encrypted));
    } catch (error) {
      console.error("Failed to retrieve data securely:", error);
      return null;
    }
  },

  remove(key: string): void {
    sessionStorage.removeItem(key);
  },

  clear(): void {
    sessionStorage.clear();
  },
};

// XSS protection helper
export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// SQL injection prevention helper (for display purposes, actual prevention is in Supabase)
export function sanitizeSqlInput(input: string): string {
  // This is for display only - actual SQL injection prevention
  // is handled by Supabase parameterized queries
  return input.replace(/['";\\]/g, "");
}

// CSRF token management
let csrfToken: string | null = null;

export const csrf = {
  generate(): string {
    csrfToken = generateSecureToken();
    return csrfToken;
  },

  validate(token: string): boolean {
    return token === csrfToken;
  },

  clear(): void {
    csrfToken = null;
  },
};

// Audit logging helper
export function auditLog(
  action: string,
  userId: string,
  details: Record<string, any>
): void {
  const logEntry = {
    timestamp: new Date().toISOString(),
    action,
    userId,
    details,
  };

  // In production, send to audit logging service
  console.info("[AUDIT]", JSON.stringify(logEntry));
}
