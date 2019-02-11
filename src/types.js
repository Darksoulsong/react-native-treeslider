/**
 * @flow
 */
import {} from 'react';
export type Tree = any[][];

export type Item = { [x: string]: any };

export type ItemPressArgs = {
  current: {},
  itemIndex: number,
  oldPageIndex: number,
  newPageIndex: number,
  hasChildren: boolean,
};

export type Props = {
  list: any[],
  nestedPropName: string,
  renderItem: (item: {}, index: number) => any,
  onItemPress?: (args: ItemPressArgs) => void,
  onPageChange?: (args: {}) => void,
  listItemHeight?: number,
  getRef?: (
    getBranch: () => Item,
    goBack: () => void,
    goForward: () => void,
    getActivePageIndex: () => number,
    getTree: () => Item,
  ) => void,
};

export type State = {
  tree: Tree,
  treeBranchesItemsLength: number[],
  listItemHeight: number,
  activePageIndex: number,
};
