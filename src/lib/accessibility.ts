/**
 * Accessibility utilities for Attendease
 */

// WCAG 2.1 AA contrast ratio checker
export function checkContrast(foreground: string, background: string): {
  ratio: number;
  aa: boolean;
  aaa: boolean;
} {
  const getLuminance = (color: string): number => {
    // Convert hex to RGB
    const rgb = parseInt(color.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;

    // Calculate relative luminance
    const rsrgb = r / 255;
    const gsrgb = g / 255;
    const bsrgb = b / 255;

    const rlin = rsrgb <= 0.03928 ? rsrgb / 12.92 : Math.pow((rsrgb + 0.055) / 1.055, 2.4);
    const glin = gsrgb <= 0.03928 ? gsrgb / 12.92 : Math.pow((gsrgb + 0.055) / 1.055, 2.4);
    const blin = bsrgb <= 0.03928 ? bsrgb / 12.92 : Math.pow((bsrgb + 0.055) / 1.055, 2.4);

    return 0.2126 * rlin + 0.7152 * glin + 0.0722 * blin;
  };

  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);

  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

  return {
    ratio,
    aa: ratio >= 4.5, // WCAG AA for normal text
    aaa: ratio >= 7, // WCAG AAA for normal text
  };
}

// Screen reader announcements
export function announce(message: string, priority: "polite" | "assertive" = "polite"): void {
  const announcer = document.getElementById("sr-announcer");
  
  if (announcer) {
    announcer.setAttribute("aria-live", priority);
    announcer.textContent = message;
    
    // Clear after announcement
    setTimeout(() => {
      announcer.textContent = "";
    }, 1000);
  } else {
    // Create announcer if it doesn't exist
    const newAnnouncer = document.createElement("div");
    newAnnouncer.id = "sr-announcer";
    newAnnouncer.setAttribute("role", "status");
    newAnnouncer.setAttribute("aria-live", priority);
    newAnnouncer.style.position = "absolute";
    newAnnouncer.style.left = "-10000px";
    newAnnouncer.style.width = "1px";
    newAnnouncer.style.height = "1px";
    newAnnouncer.style.overflow = "hidden";
    newAnnouncer.textContent = message;
    document.body.appendChild(newAnnouncer);
    
    setTimeout(() => {
      newAnnouncer.textContent = "";
    }, 1000);
  }
}

// Focus management
export function trapFocus(element: HTMLElement): () => void {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstFocusable = focusableElements[0] as HTMLElement;
  const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;

  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key !== "Tab") return;

    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        lastFocusable.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        firstFocusable.focus();
        e.preventDefault();
      }
    }
  };

  element.addEventListener("keydown", handleTabKey);

  // Return cleanup function
  return () => {
    element.removeEventListener("keydown", handleTabKey);
  };
}

// Skip to content link
export function addSkipLink(): void {
  if (document.getElementById("skip-link")) return;

  const skipLink = document.createElement("a");
  skipLink.id = "skip-link";
  skipLink.href = "#main-content";
  skipLink.textContent = "Skip to main content";
  skipLink.className = "sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded";
  
  document.body.insertBefore(skipLink, document.body.firstChild);
}

// Keyboard navigation helper
export function handleArrowNavigation(
  event: KeyboardEvent,
  elements: HTMLElement[],
  currentIndex: number,
  onNavigate: (newIndex: number) => void
): void {
  const { key } = event;

  if (key === "ArrowDown" || key === "ArrowRight") {
    event.preventDefault();
    const newIndex = (currentIndex + 1) % elements.length;
    elements[newIndex].focus();
    onNavigate(newIndex);
  } else if (key === "ArrowUp" || key === "ArrowLeft") {
    event.preventDefault();
    const newIndex = (currentIndex - 1 + elements.length) % elements.length;
    elements[newIndex].focus();
    onNavigate(newIndex);
  } else if (key === "Home") {
    event.preventDefault();
    elements[0].focus();
    onNavigate(0);
  } else if (key === "End") {
    event.preventDefault();
    const lastIndex = elements.length - 1;
    elements[lastIndex].focus();
    onNavigate(lastIndex);
  }
}

// Generate unique IDs for ARIA relationships
let idCounter = 0;
export function generateId(prefix: string = "a11y"): string {
  idCounter++;
  return `${prefix}-${idCounter}-${Date.now()}`;
}

// Check if reduced motion is preferred
export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Ensure minimum touch target size (44x44px per WCAG)
export function checkTouchTarget(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  const minSize = 44;
  return rect.width >= minSize && rect.height >= minSize;
}

// ARIA live region manager
export class LiveRegionManager {
  private region: HTMLElement | null = null;

  constructor(priority: "polite" | "assertive" | "off" = "polite") {
    this.createRegion(priority);
  }

  private createRegion(priority: string): void {
    this.region = document.createElement("div");
    this.region.setAttribute("role", "status");
    this.region.setAttribute("aria-live", priority);
    this.region.setAttribute("aria-atomic", "true");
    this.region.style.position = "absolute";
    this.region.style.left = "-10000px";
    this.region.style.width = "1px";
    this.region.style.height = "1px";
    this.region.style.overflow = "hidden";
    document.body.appendChild(this.region);
  }

  announce(message: string): void {
    if (this.region) {
      this.region.textContent = message;
      setTimeout(() => {
        if (this.region) this.region.textContent = "";
      }, 1000);
    }
  }

  destroy(): void {
    if (this.region) {
      document.body.removeChild(this.region);
      this.region = null;
    }
  }
}

// Initialize accessibility features on app load
export function initializeAccessibility(): void {
  addSkipLink();

  // Add announcer for screen readers
  if (!document.getElementById("sr-announcer")) {
    const announcer = document.createElement("div");
    announcer.id = "sr-announcer";
    announcer.setAttribute("role", "status");
    announcer.setAttribute("aria-live", "polite");
    announcer.setAttribute("aria-atomic", "true");
    announcer.style.position = "absolute";
    announcer.style.left = "-10000px";
    announcer.style.width = "1px";
    announcer.style.height = "1px";
    announcer.style.overflow = "hidden";
    document.body.appendChild(announcer);
  }

  // Set page language
  if (!document.documentElement.lang) {
    document.documentElement.lang = "en";
  }
}
