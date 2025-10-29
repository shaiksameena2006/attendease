/**
 * Performance optimization utilities for Attendease
 */

// Debounce function for search inputs
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

// Throttle function for scroll events
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Lazy load images
export function lazyLoadImage(img: HTMLImageElement): void {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const lazyImage = entry.target as HTMLImageElement;
          if (lazyImage.dataset.src) {
            lazyImage.src = lazyImage.dataset.src;
            lazyImage.classList.remove("lazy");
            observer.unobserve(lazyImage);
          }
        }
      });
    },
    {
      rootMargin: "50px",
    }
  );

  observer.observe(img);
}

// Memoize expensive computations
export function memoize<T extends (...args: any[]) => any>(
  func: T
): (...args: Parameters<T>) => ReturnType<T> {
  const cache = new Map<string, ReturnType<T>>();

  return function memoized(...args: Parameters<T>): ReturnType<T> {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = func(...args);
    cache.set(key, result);
    return result;
  };
}

// Calculate attendance percentage (memoized)
export const calculateAttendancePercentage = memoize(
  (present: number, total: number): number => {
    if (total === 0) return 0;
    return Math.round((present / total) * 100);
  }
);

// Batch database operations
export async function batchOperations<T>(
  items: T[],
  operation: (item: T) => Promise<void>,
  batchSize: number = 50
): Promise<void> {
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    await Promise.all(batch.map(operation));
  }
}

// Optimize image for upload
export async function optimizeImage(
  file: File,
  maxWidth: number = 1920,
  maxHeight: number = 1080,
  quality: number = 0.85
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    img.onload = () => {
      let { width, height } = img;

      // Calculate new dimensions
      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      ctx?.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Failed to optimize image"));
          }
        },
        "image/jpeg",
        quality
      );
    };

    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(file);
  });
}

// Prefetch data for better UX
export function prefetchData(url: string): void {
  const link = document.createElement("link");
  link.rel = "prefetch";
  link.href = url;
  document.head.appendChild(link);
}

// Service Worker cache management
export async function clearServiceWorkerCache(cacheName?: string): Promise<void> {
  if ("caches" in window) {
    if (cacheName) {
      await caches.delete(cacheName);
    } else {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
    }
  }
}

// Web Worker helper for heavy computations
export function createWorker(workerFunction: Function): Worker {
  const blob = new Blob([`(${workerFunction.toString()})()`], {
    type: "application/javascript",
  });
  const url = URL.createObjectURL(blob);
  return new Worker(url);
}

// IndexedDB helper for offline storage
export const indexedDB = {
  async openDB(dbName: string, version: number = 1): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open(dbName, version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains("offline_data")) {
          db.createObjectStore("offline_data", { keyPath: "id", autoIncrement: true });
        }
      };
    });
  },

  async saveData(dbName: string, storeName: string, data: any): Promise<void> {
    const db = await this.openDB(dbName);
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    store.add(data);
    await tx.complete;
  },

  async getData(dbName: string, storeName: string): Promise<any[]> {
    const db = await this.openDB(dbName);
    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    return store.getAll();
  },
};

// Measure performance
export function measurePerformance(label: string, fn: () => void): void {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`[Performance] ${label}: ${(end - start).toFixed(2)}ms`);
}
