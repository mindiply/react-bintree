import React, {SVGAttributes} from 'react';
import {BinaryTree} from './dataStructures/src/trees';

export interface BinaryTreeSvgProps extends SVGAttributes<SVGSVGElement> {
  tree: BinaryTree<number>;
}

export const BinaryTreeSvg = ({tree}: BinaryTreeSvgProps) => {
  const totWidth = tree.nNodes * 50;
  const totHeight = tree.nNodes * 50;
  return (
    <svg
      className="border shadow border-gray-300"
      viewBox={`0 0 ${totWidth} ${totHeight}`}
    ></svg>
  );
};
