import { defaultCmp, defaultEquals } from "./search";

export interface SortResult<T> {
  data: T[];
  nComparisons: number;
}

/**
 * Given the array in input, it creates a sorted copy of it.
 *
 * @param {T[]} a
 * @param {<T>(a: T, b: T) => boolean} cmpFunction
 * @returns {SortResult<T>}
 */
export function bubbleSort<T>(a: T[], cmpFunction = defaultCmp): SortResult<T> {
  // copy the original array
  let result = {
    data: [...a],
    nComparisons: 0,
  };
  // boolean to decide to swap or not
  for (let isSwap = true; isSwap; ) {
    isSwap = false;
    //loop through array and do swap if the left number is bigger than the right number
    for (let i = 0; i < result.data.length - 1; i++) {
      result.nComparisons++;
      if (cmpFunction(result.data[i], result.data[i + 1]) > 0) {
        swap(result.data, i, i + 1);
        isSwap = true;
      }
    }
  }

  return result;
}
/*
 * Second exercise, to reduce the number of comparisons*/
export function otherBubbleSort<T>(
  a: T[],
  cmpFunction = defaultCmp
): SortResult<T> {
  // copy the original array
  let result = {
    data: [...a],
    nComparisons: 0,
  };
  let j = result.data.length;
  // boolean to decide to swap or not
  for (let isSwap = true; isSwap; ) {
    isSwap = false;
    //loop through array and do swap if the left number is bigger than the right number
    for (let i = 0; i < j - 1; i++) {
      result.nComparisons++;
      if (cmpFunction(result.data[i], result.data[i + 1]) > 0) {
        swap(result.data, i, i + 1);
        isSwap = true;
      }
    }
    j--;
  }

  return result;
}

function swap<T>(array: T[], indexA: number, indexB: number) {
  let temp = array[indexA];
  array[indexA] = array[indexB];
  array[indexB] = temp;
}

/**
 * Given the array in input, it creates a sorted copy of it.
 *
 * Uses the same principle as adding cards in your hand in sorted order.
 *
 * @param {T[]} a
 * @param {<T>(a: T, b: T) => boolean} cmpFunction
 * @returns {SortResult<T>}
 */
export function insertSort<T>(a: T[], cmpFunction = defaultCmp): SortResult<T> {
  let nComparisons = 0;
  let b: T[] = [];
  for (let i = 0; i <= a.length - 1; i++) {
    const res = findElementInsertionIndex(b, a[i]);
    nComparisons += res.nComparisons;
    b.splice(res.index, 0, a[i]);
  }
  return { data: b, nComparisons };
}

/**
 * Given a sorted array in input, and an element not in the array,
 * returns the first element in the array where it can be inserted without
 * breaking the order
 * @param {T[]} array
 * @returns {number}
 *
 * Given el, index i
 * array[i - 1] < el <= array[i]
 */
function findElementInsertionIndex<T>(
  array: T[],
  el: T,
  cmpFunction = defaultCmp
): { index: number; nComparisons: number } {
  if (array.length === 0) {
    return {
      index: 0,
      nComparisons: 1,
    };
  } else {
    for (
      let left = 0,
        right = array.length - 1,
        comparisons = 0,
        index = left + Math.floor((right - left) / 2);
      left <= right;
      index = left + Math.floor((right - left) / 2), comparisons++
    ) {
      if (
        (index === 0 && cmpFunction(array[index], el) > 0) ||
        (cmpFunction(array[index - 1], el) < 0 &&
          cmpFunction(array[index], el) >= 0)
      ) {
        return {
          index: index,
          nComparisons: comparisons,
        };
      } else if (
        cmpFunction(array[index], el) <= 0 &&
        index === array.length - 1
      ) {
        return {
          index: index + 1,
          nComparisons: comparisons,
        };
      } else if (cmpFunction(array[index], el) > 0) {
        right = index - 1;
      } else if (cmpFunction(array[index], el) < 0) {
        left = index + 1;
      }
    }
  }
  return {
    index: array.length + 1,
    nComparisons: array.length,
  };
}
/*
 * Merge Sort : alternative approach, "divide and conquer" is a sorting alogorithm whose worst case running time is much less than that of insertion sort */
export function mergeSort<T>(a: T[], cmpFunction = defaultCmp): T[] {
  //Sort the left half of the array (assuming n> 1)
  // Sort the right half of the array (assuming n>1)
  // Merge the two halves together
  //use recurssion  as the same steps are repeated
  const result = divideAndSort(a, 0, a.length - 1, cmpFunction);
  return result;
}

export function divideAndSort<T>(
  a: T[],
  startIndex: number,
  endIndex: number,
  cmpFunction = defaultCmp
): T[] {
  if (endIndex - startIndex < 1) {
    return a.slice(startIndex, startIndex + 1);
  }
  let middleIndex = startIndex + Math.floor((endIndex - startIndex) / 2);
  const left = divideAndSort(a, startIndex, middleIndex);
  const right =
    middleIndex + 1 > endIndex
      ? []
      : divideAndSort(a, middleIndex + 1, endIndex);
  let res: T[] = [];
  for (
    let leftIndex = 0, rightIndex = 0;
    leftIndex < left.length || rightIndex < right.length;

  ) {
    if (leftIndex < left.length) {
      if (rightIndex < right.length) {
        if (cmpFunction(left[leftIndex], right[rightIndex]) <= 0) {
          res.push(left[leftIndex]);
          leftIndex++;
        } else {
          res.push(right[rightIndex]);
          rightIndex++;
        }
      } else {
        res = [...res, ...left.slice(leftIndex)];
        leftIndex = left.length;
      }
    } else {
      res = [...res, ...right.slice(rightIndex)];
      rightIndex = right.length;
    }
  }
  return res;
}

export function quickSort<T>(a: T[], cmpFunction = defaultCmp): T[] {
  const res = [...a];
  _quickSort(res, 0, res.length - 1, cmpFunction);
  return res;
}

function _quickSort<T>(
  a: T[],
  lowIndex: number,
  highIndex: number,
  cmpFunction = defaultCmp
) {
  if (lowIndex < highIndex) {
    const partitionIndex = partition(a, lowIndex, highIndex, cmpFunction);
    _quickSort(a, lowIndex, partitionIndex - 1, cmpFunction);
    _quickSort(a, partitionIndex + 1, highIndex, cmpFunction);
  }
}

function partition<T>(
  a: T[],
  bottomIndex: number,
  topIndex: number,
  cmpFunction = defaultCmp
): number {
  const pivot = a[topIndex];
  let i = bottomIndex;
  for (let j = bottomIndex; j <= topIndex; j++) {
    if (cmpFunction(a[j], pivot) < 0) {
      swap(a, i, j);
      i++;
    }
  }
  swap(a, i, topIndex);
  return i;
}

function partition2<T>(
  a: T[],
  bottomIndex: number,
  topIndex: number,
  cmpFunction = defaultCmp
): number {
  const pivot = a[Math.floor((topIndex + bottomIndex) / 2)];
  for (let i = bottomIndex, j = topIndex; true; ) {
    for (; cmpFunction(a[i], pivot) < 0; i++) {}
    for (; cmpFunction(a[j], pivot) > 0; j--) {}
    if (i >= j) {
      return j;
    }
    swap(a, i, j);
  }
}
