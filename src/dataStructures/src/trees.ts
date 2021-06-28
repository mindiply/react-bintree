import {defaultCmp} from './search';
import {quickSort} from './sorts';

export interface BinaryTreeNode<T> {
  value: T;
  parent: null | BinaryTreeNode<T>;
  left: null | BinaryTreeNode<T>;
  right: null | BinaryTreeNode<T>;
}

export interface BinaryTree<T> {
  root: BinaryTreeNode<T> | null;
  nNodes: number;
}

export function arrayToBinaryTree<T>(
  array: T[],
  cmpFunction = defaultCmp
): BinaryTree<T> {
  const b = quickSort(array, cmpFunction);
  if (b.length > 0) {
    return {
      root: buildNode(b, 0, b.length - 1, null),
      nNodes: b.length
    };
  }
  return {
    root: null,
    nNodes: 0
  };
}

function buildNode<T>(
  array: T[],
  lowIndex: number,
  highIndex: number,
  parentNode: BinaryTreeNode<T> | null
): BinaryTreeNode<T> {
  const middleIndex = Math.floor((lowIndex + highIndex) / 2);
  const newNode: BinaryTreeNode<T> = {
    value: array[middleIndex],
    parent: parentNode,
    left: null,
    right: null
  };
  if (lowIndex < middleIndex) {
    newNode.left = buildNode(array, lowIndex, middleIndex - 1, newNode);
  }
  if (highIndex > middleIndex) {
    newNode.right = buildNode(array, middleIndex + 1, highIndex, newNode);
  }
  return newNode;
}

export function binaryTreeToArray<T>(tree: BinaryTree<T>): T[] {
  const els: T[] = [];
  if (tree.root) {
    visitTreeNode(tree.root, els);
  }
  return els;
}

interface ElementToVisit<T> {
  node: BinaryTreeNode<T>;
  visitedLeft: boolean;
  visitedRight: boolean;
}

export function binaryTreeToArrayWithLoops<T>(tree: BinaryTree<T>): T[] {
  if (!tree.root) return [];
  const els: T[] = [];

  for (
    const nodesToVisit: ElementToVisit<T>[] = [
      {
        node: tree.root,
        visitedLeft: false,
        visitedRight: false
      }
    ];
    nodesToVisit.length > 0;

  ) {
    const lastElement = nodesToVisit[nodesToVisit.length - 1];
    if (!lastElement.visitedLeft) {
      if (lastElement.node.left) {
        nodesToVisit.push({
          node: lastElement.node.left,
          visitedLeft: false,
          visitedRight: false
        });
      }
      lastElement.visitedLeft = true;
    } else if (!lastElement.visitedRight) {
      els.push(lastElement.node.value);
      if (lastElement.node.right) {
        nodesToVisit.push({
          node: lastElement.node.right,
          visitedRight: false,
          visitedLeft: false
        });
      }
      lastElement.visitedRight = true;
    } else {
      nodesToVisit.pop();
    }
  }
  return els;
}

function visitTreeNode<T>(treeNode: BinaryTreeNode<T>, elements: T[]) {
  if (treeNode.left) {
    visitTreeNode(treeNode.left, elements);
  }
  elements.push(treeNode.value);
  if (treeNode.right) {
    visitTreeNode(treeNode.right, elements);
  }
}

export function hasValue<T>(
  tree: BinaryTree<T>,
  value: T,
  cmpFunction = defaultCmp
): boolean {
  return matchesValue(tree.root, value, cmpFunction);
}

function matchesValue<T>(
  treeNode: BinaryTreeNode<T> | null,
  value: T,
  cmpFunction = defaultCmp
): boolean {
  if (treeNode === null) {
    return false;
  }
  const cmpRes = cmpFunction(value, treeNode.value);
  if (cmpRes === 0) {
    return true;
  } else if (cmpRes < 0) {
    return matchesValue(treeNode.left, value, cmpFunction);
  } else {
    return matchesValue(treeNode.right, value, cmpFunction);
  }
}

export function cloneTree<T>(tree: BinaryTree<T>): BinaryTree<T> {
  return {root: cloneTreeNode(tree.root, null), nNodes: tree.nNodes};
}

function cloneTreeNode<T>(
  node: BinaryTreeNode<T> | null,
  cloneParentNode: BinaryTreeNode<T> | null
): BinaryTreeNode<T> | null {
  if (node === null) {
    return null;
  }
  return {
    value: node.value,
    left: cloneTreeNode(node.left, node),
    right: cloneTreeNode(node.right, node),
    parent: cloneParentNode
  };
}

export function addElement<T>(
  tree: BinaryTree<T>,
  value: T,
  cmpFunction = defaultCmp
): BinaryTree<T> {
  tree.root = addElementToTreeNode(tree.root, value, cmpFunction);
  tree.nNodes++;
  return tree;
}

/**
 *
 * @param {BinaryTreeNode<T> | null} node
 * @param {T} value
 * @param {<T>(a: T, b: T) => number} cmpFunction
 * @returns {BinaryTreeNode<T>} returns the root of the tree we added a node to.
 */
function addElementToTreeNode<T>(
  node: BinaryTreeNode<T> | null,
  value: T,
  cmpFunction = defaultCmp
): BinaryTreeNode<T> {
  if (node === null) {
    return {
      value,
      left: null,
      right: null,
      parent: null
    };
  }
  if (value <= node.value) {
    if (node.left === null) {
      node.left = {
        value,
        left: null,
        right: null,
        parent: node
      };
    } else {
      addElementToTreeNode(node.left, value, cmpFunction);
    }
  } else {
    if (node.right === null) {
      node.right = {
        value,
        left: null,
        right: null,
        parent: node
      };
    } else {
      addElementToTreeNode(node.right, value, cmpFunction);
    }
  }
  return node;
}

export function deleteElement<T>(
  tree: BinaryTree<T>,
  value: T,
  cmpFunction = defaultCmp
): BinaryTree<T> {
  const nodeToDelete = identifyNodeToDelete(tree.root, value, cmpFunction);
  if (nodeToDelete === null) {
    return tree;
  }
  tree.nNodes--;
  const parentNode = nodeToDelete.parent;
  if (nodeToDelete.left === null && nodeToDelete.right === null) {
    if (parentNode === null) {
      tree.root = null;
    } else {
      if (parentNode.left === nodeToDelete) {
        parentNode.left = null;
      } else {
        parentNode.right = null;
      }
    }
  } else if (nodeToDelete.right === null) {
    if (parentNode === null) {
      tree.root = nodeToDelete.left;
    } else {
      if (parentNode.left === nodeToDelete) {
        parentNode.left = nodeToDelete.left;
      } else {
        parentNode.right = nodeToDelete.left;
      }
    }
    if (nodeToDelete.left) {
      nodeToDelete.left.parent = parentNode;
    }
  } else if (nodeToDelete.left === null) {
    if (parentNode === null) {
      tree.root = nodeToDelete.right;
    } else {
      if (parentNode.left === nodeToDelete) {
        parentNode.left = nodeToDelete.right;
      } else {
        parentNode.right = nodeToDelete.right;
      }
    }
    if (nodeToDelete.right) {
      nodeToDelete.right.parent = parentNode;
    }
  } else {
    const maxLeftSubtreeElement = identifyRightmostElement(nodeToDelete.left);
    const parentLeftRight = maxLeftSubtreeElement.parent!;
    maxLeftSubtreeElement.left = nodeToDelete.left;
    nodeToDelete.left.parent = maxLeftSubtreeElement;
    maxLeftSubtreeElement.right = nodeToDelete.right;
    nodeToDelete.right.parent = maxLeftSubtreeElement;
    if (parentLeftRight.left === maxLeftSubtreeElement) {
      parentLeftRight.left = null;
    } else if (parentLeftRight.right) {
      parentLeftRight.right = null;
    }
    if (parentNode === null) {
      tree.root = maxLeftSubtreeElement;
    } else {
      if (parentNode.left === nodeToDelete) {
        parentNode.left = maxLeftSubtreeElement;
      } else {
        parentNode.right = maxLeftSubtreeElement;
      }
    }
    maxLeftSubtreeElement.parent = parentNode;
  }
  return tree;
}

function identifyNodeToDelete<T>(
  node: BinaryTreeNode<T> | null,
  valueToDelete: T,
  cmpFunction = defaultCmp
): BinaryTreeNode<T> | null {
  if (node === null) {
    return null;
  }
  const cmpRes = cmpFunction(valueToDelete, node.value);
  if (cmpRes === 0) {
    return node;
  } else if (cmpRes < 0) {
    return identifyNodeToDelete(node.left, valueToDelete, cmpFunction);
  } else {
    return identifyNodeToDelete(node.right, valueToDelete, cmpFunction);
  }
}

function identifyRightmostElement<T>(
  node: BinaryTreeNode<T>
): BinaryTreeNode<T> {
  if (node.right) {
    return identifyRightmostElement(node.right);
  } else {
    return node;
  }
}
