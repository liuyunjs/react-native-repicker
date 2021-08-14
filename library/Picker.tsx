import React from 'react';
import {
  ListRenderItemInfo,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
  View,
} from 'react-native';
import { useWillMount } from '@liuyunjs/hooks/lib/useWillMount';
import { useReactCallback } from '@liuyunjs/hooks/lib/useReactCallback';
import useUpdateEffect from 'react-use/esm/useUpdateEffect';
import { isFunction } from '@liuyunjs/utils/lib/isFunction';
import { PickerOverlay } from './PickerOverlay';
import { PickerItem } from './PickerItem';

type Item = { value: string | number; label: string | number };

type PickerProps = {
  onChange?: (selected: Item) => void;
  data: Item[];
  itemHeight?: number;
  selected?: number | string;
  itemTotal?: number;
  itemFontSize?: number;
  itemColor?: string;
  indicatorColor?: string;
  overlayColor?: string;
};

const keyExtractor = (item: Item) => item.value + '';

export const Picker: React.FC<PickerProps> = ({
  itemHeight,
  selected,
  data,
  itemTotal,
  itemFontSize,
  itemColor,
  onChange,
  indicatorColor,
  overlayColor,
}) => {
  const halfTotal = (itemTotal! - 1) / 2;
  const itemOffset = halfTotal * itemHeight!;
  const listRef = React.useRef<FlatList<Item>>(null);
  const ctx = useWillMount(() => {
    let index =
      selected == null ? 0 : data.findIndex((item) => item.value === selected);
    index = index === -1 ? 0 : index;
    const initialIndex = Math.max(0, index - halfTotal);
    return {
      contentOffset: {
        x: 0,
        y: index * itemHeight!,
      },
      index,
      initialIndex,
    };
  });

  const renderItem = React.useCallback(
    ({ item }: ListRenderItemInfo<Item>) => {
      return (
        <PickerItem
          label={item.label}
          color={itemColor!}
          height={itemHeight!}
          fontSize={itemFontSize!}
        />
      );
    },
    [itemHeight, itemColor, itemFontSize],
  );

  const getItemLayout = React.useCallback(
    (data: Item[] | null | undefined, index: number) => {
      return {
        index,
        length: itemHeight!,
        offset: itemHeight! * index,
      };
    },
    [itemHeight],
  );

  const onChangeCallback = (index: number) => {
    if (index === ctx.index) return;
    ctx.index = index;
    const item = data[index];
    if (item && isFunction(onChange)) {
      onChange(item);
    }
  };

  const onMomentumScrollEnd = useReactCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { y } = event.nativeEvent.contentOffset;
      onChangeCallback(Math.round(y / itemHeight!));
    },
  );

  const mapping = React.useMemo(
    () =>
      data.reduce((prev, curr, index) => {
        prev[curr.value] = index;
        return prev;
      }, {} as Record<string | number, number>),
    [data],
  );

  useUpdateEffect(() => {
    if (selected == null) return;
    let targetIndex = mapping[selected];
    let animated = true;
    if (targetIndex == null) {
      const last = data.length - 1;
      if (ctx.index > last) {
        targetIndex = last;
        animated = false;
      }
    }

    if (targetIndex == null || targetIndex < 0) return;
    listRef.current?.scrollToIndex({ index: targetIndex, animated });
    if (!animated) onChangeCallback(targetIndex);
  }, [selected, mapping]);

  const contentContainerStyle = React.useMemo(
    () => ({
      paddingTop: itemOffset,
      paddingBottom: itemOffset,
    }),
    [itemOffset],
  );

  return (
    <View
      style={{
        height: itemHeight! * itemTotal!,
        overflow: 'hidden',
        backgroundColor: overlayColor,
      }}>
      <FlatList<Item>
        // bounces={false}
        contentContainerStyle={contentContainerStyle}
        scrollsToTop={false}
        directionalLockEnabled
        disableScrollViewPanResponder
        removeClippedSubviews
        showsVerticalScrollIndicator={false}
        initialScrollIndex={ctx.initialIndex!}
        ref={listRef}
        onMomentumScrollEnd={onMomentumScrollEnd}
        getItemLayout={getItemLayout}
        initialNumToRender={itemTotal!}
        contentOffset={ctx.contentOffset}
        snapToInterval={itemHeight}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        data={data}
      />
      <PickerOverlay
        overlayColor={overlayColor!}
        indicatorColor={indicatorColor!}
        height={itemHeight!}
        total={halfTotal}
      />
    </View>
  );
};

Picker.defaultProps = {
  itemHeight: 36,
  data: [],
  itemTotal: 7,
  itemFontSize: 16,
  indicatorColor: '#666',
  itemColor: '#333',
  overlayColor: '#fff',
};
