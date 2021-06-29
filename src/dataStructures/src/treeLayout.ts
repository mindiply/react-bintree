import {BinaryTree, BinaryTreeNode, treeHeight} from './trees';

const nodeDiameter = 100;
const horizontalGutter = 20;
const verticalGutter = 40;

interface TreeLayoutNode {
  value: number;
  y: number;
  x: number;
  diameter: number;
  parent: TreeLayoutNode | null;
}

interface TreeLayout {
  svgWidth: number;
  svgHeight: number;
  layoutTree: BinaryTree<TreeLayoutNode>;
}

export function computeTreeLayout(tree: BinaryTree<number>): TreeLayout {
  const height = treeHeight(tree);
  const bottomTierMaxNodes = 2 ** height;
  const svgHeight =
    Math.max(400, Math.max(1, height + 1) * nodeDiameter + verticalGutter * height);
  const svgWidth =
    Math.max(400, Math.max(1, bottomTierMaxNodes) * nodeDiameter +
    (bottomTierMaxNodes - 1) * horizontalGutter);
  return {
    layoutTree: {
      root: buildLayoutNode(tree.root, 0, 0, null, {
        svgWidth,
        svgHeight,
        treeH: height
      }),
      nNodes: tree.nNodes
    },
    svgHeight,
    svgWidth
  };
}

export function buildLayoutNode(
  node: BinaryTreeNode<number> | null,
  columnIndex: number,
  rowIndex: number,
  parent: BinaryTreeNode<TreeLayoutNode> | null,
  layoutData: {
    svgWidth: number;
    svgHeight: number;
    treeH: number;
  }
): BinaryTreeNode<TreeLayoutNode> | null {
  if (node === null) {
    return null;
  }
  const {svgHeight, svgWidth, treeH} = layoutData;
  if (rowIndex === treeH) {
    return {
      parent,
      left: null,
      right: null,
      value: {
        value: node.value,
        y: svgHeight - nodeDiameter,
        x: columnIndex * (nodeDiameter + horizontalGutter),
        diameter: nodeDiameter,
        parent: parent ? parent.value : null
      }
    };
  }
  const rowNNodes = 2 ** rowIndex;
  const regionWidth = svgWidth / rowNNodes;
  const regionStart = columnIndex * regionWidth;
  const layoutNode: BinaryTreeNode<TreeLayoutNode> = {
    value: {
      value: node.value,
      y: svgHeight - (treeH - rowIndex +1) * nodeDiameter - (treeH - rowIndex) * verticalGutter,
      x: Math.floor(regionStart + (regionWidth - nodeDiameter) / 2),
      diameter: nodeDiameter,
      parent: parent ? parent.value : null
    },
    right: null,
    parent,
    left: null
  };
  layoutNode.left = buildLayoutNode(
    node.left,
    columnIndex * 2,
    rowIndex + 1,
    layoutNode,
    layoutData
  );
  layoutNode.right = buildLayoutNode(
    node.right,
    columnIndex * 2 + 1,
    rowIndex + 1,
    layoutNode,
    layoutData
  );
  return layoutNode;
}
