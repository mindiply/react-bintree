import React, {useCallback, useRef, useState} from 'react';
import './App.css';
import {
  addElement, arrayToBinaryTree,
  BinaryTree,
  binaryTreeToArray, cloneTree
} from './dataStructures/src/trees'
import {BinaryTreeSvg} from './BinaryTreeSvg';

function App() {
  const [tree, setTree] = useState<BinaryTree<number>>({nNodes: 0, root: null});
  const [newNumberText, setNewNumberText] = useState('');
  const numberRef = useRef(newNumberText);
  numberRef.current = newNumberText;

  const handleChangeNumberText = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setNewNumberText(e.target.value),
    []
  );
  const handleAddTree = useCallback(() => {
    let n: number | null = null;
    try {
      n = parseInt(numberRef.current);
    } catch (err) {
      // noop
    }
    if (n === null) {
      return;
    }
    setTree(oldTree => {
      let updatedTree = cloneTree(oldTree);
      addElement(updatedTree, n!)
      return updatedTree;
    });
    setNewNumberText('');
  }, []);

  return (
    <div className="absolute inset-0 flex flex-col items-stretch p-16">
      <div className="py-16 text-lg">{'Illustrated binary trees'}</div>
      <div className="mb-8 flex items-center">
        <input
          className="w-32 p-4 border border-black"
          value={newNumberText || ''}
          onChange={handleChangeNumberText}
        />
        <button
          className="ml-4 p-4 rounded shadow bg-gray-700 border border-gray-600 hover:bg-gray-600"
          onClick={handleAddTree}
        >
          {'Add Node'}
        </button>
      </div>

      <div className="mb-8 items-center text-sm">
        <div>{`Elements in the tree with # ${
          tree.nNodes
        } elements: ${binaryTreeToArray(tree)}`}</div>
      </div>

      <BinaryTreeSvg tree={tree} width={'80%'} height={'80%'} />
    </div>
  );
}

export default App;
