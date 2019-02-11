/**
 * @flow
 */

import React, { Component } from 'react';
import { TouchableWithoutFeedback, ViewPagerAndroid, View } from 'react-native';
import {
  deepClone,
  uid,
  setStatus,
  getBranch,
  checkProps,
  getPageHeight,
} from './utils';
import { ItemPressArgs, Props, State } from './types';
import * as defaults from './defaults';

export default class TreeSlider extends Component<Props, State> {
  static defaultProps = {
    list: [],
    listItemHeight: defaults.listItemHeight,
    onItemPress: defaults.onItemPress,
    onPageChange: defaults.onPageChange,
    getRef: null,
  };

  viewPager = null;

  listItemHeight = 0;

  state = {
    tree: [],
    treeBranchesItemsLength: [],
    pageHeight: 0,
    activePageIndex: 0,
  };

  componentDidMount() {
    const { getRef } = this.props;
    const self = this;

    getRef({
      getBranch: () => getBranch(self.state.tree),
      goBack: this.goBack,
      goForward: this.goForward,
      getActivePageIndex: this.getActivePageIndex,
      getTree: this.getTree,
    });

    checkProps(this.props);

    this.init();
  }

  getActivePageIndex = () => this.state.activePageIndex;

  getTree = () => this.state.tree;

  init() {
    const { list } = this.props;
    const { treeBranchesItemsLength } = this.state;

    if (this.state.tree.length) {
      return;
    }

    treeBranchesItemsLength.push(list.length);

    const pageHeight = getPageHeight(
      treeBranchesItemsLength,
      this.props.listItemHeight,
    );

    this.setState(previousState => ({
      ...previousState,
      tree: [deepClone(list)],
      treeBranchesItemsLength,
      pageHeight,
    }));
  }

  onChange = async (current, index /* , pageIndex */) => {
    const { nestedPropName } = this.props;
    const nestedItems = current[nestedPropName];
    const { activePageIndex } = this.state;

    setStatus(current, activePageIndex, this.state);

    const newIndex = activePageIndex + 1;

    this.setState(
      previousState => {
        const { tree } = previousState;

        let { treeBranchesItemsLength } = this.state;

        // The pressing of the item cleans up the next sliders...
        tree.splice(newIndex);

        // ...and the items length array as well
        treeBranchesItemsLength.splice(newIndex);

        // Now we perform a reinitialization to the control variable,
        // by setting the length of the first branch,
        if (tree.length === 1) {
          treeBranchesItemsLength = [tree[0].length];
        }

        // and do an update to the tree branches control variable
        // by setting to it the length of the newly added nested item
        if (nestedItems && nestedItems.length) {
          treeBranchesItemsLength.push(nestedItems.length);
          tree.push(nestedItems);
        }

        return {
          ...previousState,
          tree,
          treeBranchesItemsLength,
          pageHeight: getPageHeight(
            treeBranchesItemsLength,
            this.props.listItemHeight,
          ),
        };
      },
      async () => {
        this.changePage({
          current,
          itemIndex: index,
          oldPageIndex: activePageIndex,
          newPageIndex: newIndex,
          hasChildren: !!nestedItems && !!nestedItems.length,
        });
      },
    );
  };

  async go(page) {
    const { activePageIndex, tree } = this.state;
    const idx = activePageIndex + page;

    if (tree[idx]) {
      this.changePage({ newPageIndex: idx });
    }
  }

  goBack = () => {
    this.go(-1);
  };

  goForward = () => {
    this.go(1);
  };

  changePage = async (options: ItemPressArgs) => {
    const { tree } = this.state;
    const {
      current,
      itemIndex,
      oldPageIndex,
      newPageIndex,
      hasChildren,
    } = options;

    const goingBack = !!current === false;
    const shouldTrigger = goingBack === false;

    if (!tree[newPageIndex]) {
      // triggers on item forward press
      this.props.onItemPress(
        current,
        itemIndex,
        oldPageIndex,
        null,
        hasChildren,
      );

      return;
    }

    /* eslint-disable */
    return new Promise(res => {
      this.setState(
        previousState => ({
          ...previousState,
          activePageIndex: newPageIndex,
        }),
        () => {
          this.viewPager.setPage(newPageIndex);

          // triggers on page swipe
          this.props.onPageChange();

          if (shouldTrigger) {
            // triggers on item forward press
            this.props.onItemPress(
              current,
              itemIndex,
              oldPageIndex,
              newPageIndex,
              hasChildren,
            );
          }

          res();
        },
      );
    });
    /* eslint-enable */
  };

  render() {
    const { tree, pageHeight } = this.state;

    return (
      <ViewPagerAndroid
        ref={viewPager => {
          this.viewPager = viewPager;
        }}
        style={{ flex: 1, height: pageHeight }}
        onPageSelected={e =>
          this.changePage({
            newPageIndex: e.nativeEvent.position,
          })
        }
      >
        {tree.map((arr, pageIndex) => (
          <View style={{ flex: 1 }}>
            <View>
              {arr.map((item, index) => (
                <TouchableWithoutFeedback
                  key={`item-${uid()}`}
                  onPress={() => this.onChange(item, index, pageIndex)}
                >
                  <View>{this.props.renderItem(item, index)}</View>
                </TouchableWithoutFeedback>
              ))}
            </View>
          </View>
        ))}
      </ViewPagerAndroid>
    );
  }
}
