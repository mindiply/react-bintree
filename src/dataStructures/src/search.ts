export interface SearchResult {
  index: number;
  nComparisons: number;
}

interface EqualsFn<T> {
  (a: T, b: T): boolean;
}

export function defaultCmp<T>(a: T, b: T) {
  return a < b ? -1 : a === b ? 0 : 1;
}

export function defaultEquals<T>(a: T, b: T) {
  return defaultCmp(a, b) === 0;
}

export function linearSearch<T>(
  data: T[],
  elementToFind: T,
  equalsFn = defaultEquals
): SearchResult {
  for (let i = 0; i < data.length; i++) {
    if (equalsFn(data[i], elementToFind)) {
      return {
        nComparisons: i + 1,
        index: i,
      };
    }
  }
  return {
    index: -1,
    nComparisons: data.length,
  };
}

/**
 * It will only work if the data in input is a sorted array
 *
 * @param {T[]} data
 * @param {T} elementToFind
 * @param {<T>(a: T, b: T) => boolean} equalsFn
 * @returns {SearchResult}
 */
export function binarySearch<T>(
  data: T[],
  elementToFind: T,
  cmpFn = defaultCmp
): SearchResult {
  let comparisons = 1;
  for (
    let leftIndex = 0,
      rightIndex = data.length - 1,
      index = leftIndex + Math.floor((rightIndex - leftIndex) / 2);
    leftIndex <= rightIndex;
     index = leftIndex + Math.floor((rightIndex - leftIndex) / 2), comparisons++
  ) {
    // check equal first
    if (cmpFn(data[index], elementToFind) === 0) {
      return {
        index: index,
        nComparisons: comparisons,
      };
    } else if (cmpFn(data[index], elementToFind) < 0) {
      leftIndex = index + 1;
    } else if (cmpFn(data[index], elementToFind) > 0)  {
      rightIndex = index - 1;
    }
  }
  return {
    index: -1,
    nComparisons: comparisons,
  };
}
//BinarySearch => search a sorted array by repeatedly dividing the search interval in half

//recursive function calling the function again with a decreasing smaller input
//base case => in recursion, the base case is like the safety break. It's the statement that will stop the recursion. without one, it’s possible your recursion will continuously loop forever
