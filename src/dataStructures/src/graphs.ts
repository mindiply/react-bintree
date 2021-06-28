export type Id = number | string;

export interface Node<T> {
  id: Id;
  value: T;
  edges: Edge[];
}

export interface Edge {
  leftNodeId: Id;
  rightNodeId: Id;
}


export interface Graph<T> {
  nodes: Map<Id, Node<T>>;
  edges: Edge[];
}

export type GraphPath = Edge[];

export function createGraph<T>(initialValues?: T[]): Graph<T> {
  return {
    edges: [],
    nodes: new Map()
  }
}

export function addNode<T>(graph: Graph<T>, value: T, connectedToNodes?: Id[]) {

}

export function removeNode<T>(graph: Graph<T>, nodeId: Id) {

}

export function addEdge<T>(graph: Graph<T>, leftNodeId: Id, rightNodeId: Id) {

}

export function removeEdge<T>(graph: Graph<T>, edgeId: Id) {

}

export function shortestPathBetween<T>(graph: Graph<T>, startNodeId: Id, rightNodeId: Id): null | GraphPath {
  return null;
}
