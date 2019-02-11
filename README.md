# react-native-treeslider

A cross-platform tree slider component, based on [ViewPagerAndroid](https://facebook.github.io/react-native/docs/viewpagerandroid), for React Native.

## Demo

![react-native-treeslider sample](https://raw.githubusercontent.com/Darksoulsong/react-native-treeslider/master/treeslider-sample.gif)

## Quick Start

```
import TreeSlider from 'react-native-treeslider';

export default function ({ data }) {
  let treeSlider;

  const treeSliderOptions = {
    list: data,
    getRef: (ref) => {
      treeSlider = {
        getBranch: ref.getBranch,
        getActivePageIndex: ref.getActivePageIndex,
        goBack: ref.goBack,
        tree: ref.getTree(),
      };
    },
    nestedPropName: "subcategories",
    renderItem: (item, index) => (
      <CategoryItem
        active={item.active === true}
      >
        <Row>
          <Column>
            <CategoryTitle active={item.active === true}>
              {item.name}
            </CategoryTitle>
          </Column>
          <Column size={0.3}>
            <CategoryTotal active={item.active === true}>
              {item.subcategories !== null && "subcategories" in item === true && <Icon active={item.active === true} name="navigate-next" />}

              {(item.subcategories === null || "subcategories" in item === false) && item.quantity}
            </CategoryTotal>
          </Column>
        </Row>
      </CategoryItem>
    )
  };
}

return <TreeSlider {...treeSliderOptions} />;

```

## Props

- `list: {[x: string]: any}[]` **(required)**  
  The data list. It is mandatory that the tree list has nested properties. Eg:

  ```
  {
    name: 'Foo',
    ...
    subcategories: [{
      name: 'Bar',
      ...
      subcategories: [{...}]
    }]
  }
  ```

- `nestedPropName: string` **(required)**  
  The name of your list's nested property.

- `renderItem: (item: {}, index: number) => ReactElement` **(required)**  
  Callback which returns a React Element that represents a single item of your list.

- `onItemPress: (currentItem: {}, itemIndex: number, oldPageIndex: number, newPageIndex: number, hasChildren: boolean) => void`  
  A callback that is run when the list item is pressed.

- `onPageChange: (currentItem: {}, itemIndex: number, oldPageIndex: number, newPageIndex: number, hasChildren: boolean) => void`  
  A callback that is triggered on page swipe.

- `listItemHeight: number` **(defaults to 44)**  
  This is the height of an item. The page height is set based on the item's height.

- `getRef: (getBranch: () => void, goBack: () => void, goForward: () => void, getActivePageIndex: () => number, getTree: this.getTree ) => void`  
  Exposes some of the methods of the internal API through a reference.
  - `getBranch()`: Returns the active branch and its nested active subitems.
  - `goBack()`: Programmatically slides the pager to the left.
  - `goForward()`: Programmatically slides the pager to the right (if there's a selected item in the current page).
  - `getActivePageIndex()`: Returns the index of the active page.
  - `getTree()`: Returns the parsed tree.

## Minimum Requirements

- "react": "16.4.1",
- "react-native": "0.56.0"

<!-- @todo: terminar a  doc, publicar no npm e aplicar no app -->
