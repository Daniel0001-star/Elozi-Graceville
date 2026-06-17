/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product } from '../types';

/**
 * Heapsort implementation to sort an array of Products in-place or returning a new array.
 * We can sort by numeric fields like 'price', or string fields like 'name'.
 */
export function heapSort(
  products: Product[],
  key: 'price' | 'name',
  direction: 'asc' | 'desc' = 'asc'
): Product[] {
  const arr = [...products];
  const n = arr.length;

  // Build max heap (or min heap depending on direction)
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i, key, direction);
  }

  // Extract elements from heap one by one
  for (let i = n - 1; i > 0; i--) {
    // Move current root to end
    const temp = arr[0];
    arr[0] = arr[i];
    arr[i] = temp;

    // Call max heapify on the reduced heap
    heapify(arr, i, 0, key, direction);
  }

  return arr;
}

function heapify(
  arr: Product[],
  n: number,
  i: number,
  key: 'price' | 'name',
  direction: 'asc' | 'desc'
): void {
  let extremaIndex = i; // Initialize largest/smallest as root
  const left = 2 * i + 1;
  const right = 2 * i + 2;

  // Helper to compare values
  const compare = (val1: any, val2: any): boolean => {
    if (direction === 'asc') {
      // For ascending sorted result using typical max heap extraction, 
      // we need a Max Heap, so we find if child is greater than parental element.
      return val1 > val2;
    } else {
      // For descending sorted result using typical min heap extraction,
      // we need a Min Heap, so we find if child is less than parental element.
      return val1 < val2;
    }
  };

  if (left < n && compare(arr[left][key], arr[extremaIndex][key])) {
    extremaIndex = left;
  }

  if (right < n && compare(arr[right][key], arr[extremaIndex][key])) {
    extremaIndex = right;
  }

  // Of root is not extrema, swap and continue heapifying
  if (extremaIndex !== i) {
    const swap = arr[i];
    arr[i] = arr[extremaIndex];
    arr[extremaIndex] = swap;

    // Recursively heapify the affected sub-tree
    heapify(arr, n, extremaIndex, key, direction);
  }
}

/**
 * Searches the list of products by key, then returns them sorted using Heap Sort.
 * Matches user requirements of "implement a heap sort for searching the database".
 */
export function searchAndSortProducts(
  products: Product[],
  searchQuery: string,
  sortKey: 'price' | 'name',
  direction: 'asc' | 'desc' = 'asc'
): Product[] {
  const query = searchQuery.trim().toLowerCase();
  
  // First, filter by query
  const filtered = products.filter(p => 
    p.name.toLowerCase().includes(query) || 
    p.description.toLowerCase().includes(query) ||
    p.category.toLowerCase().includes(query)
  );

  // Then heap-sort the search results
  return heapSort(filtered, sortKey, direction);
}
