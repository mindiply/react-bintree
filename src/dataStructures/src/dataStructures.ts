import {defaultCmp, SearchResult} from "./search";

export interface ListElement<T> {
  element: T;
  next: ListElement<T> | null;
  prev: ListElement<T> | null;
}

export interface List<T> {
  head: null | ListElement<T>;
  tail: null | ListElement<T>;
  nElements: number;
}

export function arrayToList<T>(array: T[]): List<T> {
  if (array.length === 0) {
    return {
      head: null,
      nElements: 0,
      tail: null,
    };
  }

  const els: ListElement<T>[] = array.map((el) => ({
    element: el,
    next: null,
    prev: null,
  }));

  for (let i = 0; i < els.length; i++) {
    if (i > 0) {
      els[i].prev = els[i - 1];
    }
    if (i < els.length - 1) {
      els[i].next = els[i + 1];
    }
  }
  return {
    nElements: els.length,
    head: els[0],
    tail: els[els.length - 1],
  };
}

export function listToArray<T>(elements: List<T>): T[] {
  if (elements.nElements === 0) {
    return [];
  }
  const arrayElements: T[] = [];
  //
  for (let el = elements.head; el; el = el.next) {
    arrayElements.push(el.element);
  }
  return arrayElements;
}

export function stackPush<T>(elements: List<T>, element: T): List<T> {
  const newElement: ListElement<T> = {
    element: element,
    next: null,
    prev: elements.tail ? elements.tail : null,
  };

  if (elements.tail) {
    elements.tail.next = newElement;
  }
  elements.tail = newElement;
  elements.nElements++;
  return elements;
}

export function stackPop<T>(elements: List<T>): T | null {
  if (!elements.tail) {
    return null;
  }
  let elementToDelete = elements.tail;
  if (elementToDelete.prev) {
    let lastEelement = elementToDelete.prev;
    lastEelement.next = null;
  }
  elements.tail = elementToDelete.prev;
  elements.nElements--;

  return elementToDelete.element;
}

export function dequeue<T>(elements: List<T>): T | null {
  if (!elements.head) {
    return null;
  }
  let elementToDelete = elements.head;
  if (elementToDelete.next) {
    let firstEelement = elementToDelete.next;
    firstEelement.prev = null;
  }
  elements.head = elementToDelete.next;
  elements.nElements--;

  return elementToDelete.element;
}

export function enqueue<T>(elements: List<T>, element: T): List<T> {
  const newElement: ListElement<T> = {
    element: element,
    next: null,
    prev: elements.tail ? elements.tail : null,
  };

  if (elements.tail) {
    elements.tail.next = newElement;
  }
  elements.tail = newElement;
  elements.nElements++;
  return elements;
}

export function elementAtIndex<T>(elements: List<T>, index: number): T {
  const element = elementContainerAtIndex(elements, index);
  return element.element;

  throw new RangeError("not in range");
}
export function elementContainerAtIndex<T>(
  elements: List<T>,
  index: number
): ListElement<T> {
  for (let el = elements.head, i = 0; el && i <= index; el = el.next, i++) {
    if (i === index) {
      return el;
    }
  }

  throw new RangeError("not in range");
}
/*
* let temp = array[indexA];
  array[indexA] = array[indexB];
  array[indexB] = temp;*/

export function swap<T>(
  elements: List<T>,
  indexA: number,
  indexB: number
): List<T> {
  if (elements.nElements < 2 || indexA === indexB) {
    return elements;
  }
  if (
    indexA < 0 ||
    indexB < 0 ||
    indexA >= elements.nElements ||
    indexB >= elements.nElements
  ) {
    throw new RangeError("incorrect index for swap");
  }
  let elementA = elementContainerAtIndex(elements, indexA);
  let elementB = elementContainerAtIndex(elements, indexB);

  const aPrev = elementA.prev === elementB ? elementA : elementA.prev;
  const aNext = elementA.next === elementB ? elementA : elementA.next;
  const bPrev = elementB.prev === elementA ? elementB : elementB.prev;
  const bNext = elementB.next === elementA ? elementB : elementB.next;

  if (elements.head === elementA) {
    elements.head = elementB;
  } else if (elements.head === elementB) {
    elements.head = elementA;
  }
  elements.head!.prev = null;

  if (elements.tail === elementA) {
    elements.tail = elementB;
  } else if (elements.tail === elementB) {
    elements.tail = elementA;
  }
  elements.tail!.next = null;

  elementA.prev = bPrev;
  elementA.next = bNext;
  if (bPrev) {
    bPrev.next = elementA;
  }
  if (bNext) {
    bNext.prev = elementA;
  }
  elementB.prev = aPrev;
  elementB.next = aNext;
  if (aPrev) {
    aPrev.next = elementB;
  }
  if (aNext) {
    aNext.prev = elementB;
  }
  return elements;
}

export function findIndexOf<T>(
  a: List<T>,
  element: T,
  cmpFunction = defaultCmp
): number {
  for (
    let el = a.head, i = 0;
    el && cmpFunction(el.element, element) <= 0;
    el = el.next, i++
  ) {
    if (cmpFunction(el.element, element) === 0) return i;
  }
  throw new Error("Not implemented");
}

export function listQuicksort<T>(
  a: List<T>,
  cmpFunction = defaultCmp
): List<T> {
  if (a.nElements >= 1) {
    let lowIndex = 0;
    let highIndex = a.nElements - 1;
    _quickSortList(a, lowIndex, highIndex, cmpFunction);
  }
  return a;
}

function _quickSortList<T>(
  a: List<T>,
  bottomIndex: number,
  topIndex: number,
  cmpFunction = defaultCmp
) {
  if (bottomIndex < topIndex) {
    const partitionIndex = partition2(a, bottomIndex, topIndex, cmpFunction);
    _quickSortList(a, bottomIndex, partitionIndex - 1, cmpFunction);
    _quickSortList(a, partitionIndex + 1, topIndex, cmpFunction);
  }
}

function partition2<T>(
  a: List<T>,
  bottomIndex: number,
  topIndex: number,
  cmpFunction = defaultCmp
): number {
  const pivotIndex = Math.floor((topIndex + bottomIndex) / 2);
  const pivot = elementAtIndex(a, pivotIndex);
  for (let i = bottomIndex, j = topIndex; true; ) {
    for (; cmpFunction(elementAtIndex(a, i), pivot) < 0; i++) {}
    for (; cmpFunction(elementAtIndex(a, j), pivot) > 0; j--) {}
    if (i >= j) {
      return j;
    }
    swap(a, i, j);
  }
}

export function ListBinarySearch<T>(
    data: List<T>,
    elementToFind: T,
    cmpFn = defaultCmp
): number {
  for (
      let leftIndex = 0,
          rightIndex = data.nElements - 1,
          index = leftIndex + Math.floor((rightIndex - leftIndex) / 2);
      leftIndex <= rightIndex;
      index = leftIndex + Math.floor((rightIndex - leftIndex) / 2)
  ) {
    // check equal first
    if (cmpFn(elementAtIndex(data, index), elementToFind) === 0) {
      return index;
    } else if (cmpFn(elementAtIndex(data, index), elementToFind) < 0) {
      leftIndex = index + 1;
    } else if (cmpFn(elementAtIndex(data, index), elementToFind) > 0)  {
      rightIndex = index - 1;
    }
  }
  return -1
}