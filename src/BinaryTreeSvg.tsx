import React, {SVGAttributes, useMemo} from 'react';
import {BinaryTree, binaryTreeToArray} from './dataStructures/src/trees';
import {computeTreeLayout} from './dataStructures/src/treeLayout';

export interface BinaryTreeSvgProps extends SVGAttributes<SVGSVGElement> {
  tree: BinaryTree<number>;
}

export const BinaryTreeSvg = ({tree}: BinaryTreeSvgProps) => {
  const {layoutTree, svgWidth, svgHeight} = useMemo(
    () => computeTreeLayout(tree),
    [tree]
  );
  const layoutNodes = binaryTreeToArray(layoutTree);


  return (
    <svg
      className="border shadow border-gray-300"
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
    >
      {layoutNodes.filter(layoutNode => layoutNode.parent).map((layoutNode, i) => (
        <line key={`l${layoutNode.x}r${layoutNode.y}`} x1={layoutNode.parent!.x + layoutNode.diameter / 2} y1={layoutNode.parent!.y + layoutNode.diameter / 2} x2={layoutNode.x + layoutNode.diameter / 2} y2={layoutNode.y + layoutNode.diameter / 2} stroke={'#888888'}>
        </line>
      ))}
      {layoutNodes.map((layoutNode, i) => (
        <g key={`l${layoutNode.x}r${layoutNode.y}`}>
          <rect
            x={layoutNode.x}
            y={layoutNode.y}
            width={layoutNode.diameter}
            height={layoutNode.diameter}
            rx={layoutNode.diameter / 2}
            stroke="#222222"
            strokeWidth="2"
            fill="#FFFFFF"
          />
          <text
            x={layoutNode.x + layoutNode.diameter / 3}
            y={layoutNode.y + layoutNode.diameter / 3}
            style={{font: 'italic 13px sans-serif'}}
            fill="#222222"
          >
            {layoutNode.value}
          </text>
        </g>
      ))}
    </svg>
  );
};
