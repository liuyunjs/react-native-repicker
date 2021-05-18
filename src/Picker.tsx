import React from 'react';
import { View, Text } from 'react-native';
import { useWillMount } from '@liuyunjs/hooks/lib/useWillMount';
import { useReactCallback } from '@liuyunjs/hooks/lib/useReactCallback';
import useUpdateEffect from 'react-use/esm/useUpdateEffect';
import { Swiper, SwiperRef } from 'react-native-reswiper';
import { PickerOverlay } from './PickerOverlay';

export type PickerProps = {
  data: { value: string | number; label: string | number }[];
  selected?: string | number;
  onChange?: (value: string | number, index: number) => void;
  itemHeight?: number;
  itemTotal?: number;
  itemFontSize?: number;
  itemColor?: string;
  dark?: boolean;
};

export const Picker: React.FC<PickerProps> = ({
  data,
  selected,
  onChange: onChangeProp,
  itemHeight,
  itemTotal,
  itemFontSize,
  dark,
  itemColor = dark ? '#fff' : '#333',
}) => {
  const swiperRef = React.useRef<SwiperRef>(null);
  const initialIndex = useWillMount(() => {
    const index = data.findIndex((item) => item.value === selected);
    return index === -1 ? 0 : index;
  });
  const dataMappingRef = React.useRef<
    Record<
      string | number,
      {
        index: number;
        data: { value: string | number; label: string | number };
      }
    >
  >({});

  const halfTotal = (itemTotal! - 1) / 2;
  const sideCount = halfTotal + 1;
  const itemCount = data.length;

  const itemBuilder = React.useCallback(
    (index) => {
      const item = data[index];
      if (index === 0) {
        dataMappingRef.current = {};
      }

      dataMappingRef.current[item.value] = {
        index,
        data: item,
      };

      return (
        <View
          style={{
            height: itemHeight,
            alignItems: 'center',
            justifyContent: 'center',
            top: itemHeight! * halfTotal,
          }}>
          <Text style={{ fontSize: itemFontSize, color: itemColor }}>
            {item.label}
          </Text>
        </View>
      );
    },
    [data, itemHeight, itemFontSize, itemColor, halfTotal],
  );

  const onChange = useReactCallback((index: number) => {
    index = itemCount < sideCount ? index : sideCount + index;
    index = index % itemCount;
    onChangeProp?.(data[index].value, index);
  });

  useUpdateEffect(() => {
    if (selected == null) return;
    const item = dataMappingRef.current[selected];
    if (item == null) return;
    swiperRef.current!.setIndex(item.index);
  }, [selected]);

  return (
    <View style={{ height: itemHeight! * itemTotal!, overflow: 'hidden' }}>
      <Swiper
        ref={swiperRef}
        autoplay={false}
        pageEnabled={false}
        loop
        indicator={false}
        layout={itemHeight!}
        sideCount={sideCount}
        horizontal={false}
        onChange={onChange}
        initialIndex={initialIndex}
        itemCount={itemCount}
        itemBuilder={itemBuilder}
      />
      <PickerOverlay dark={dark} height={itemHeight!} total={halfTotal} />
    </View>
  );
};

Picker.defaultProps = {
  data: [],
  itemHeight: 36,
  itemTotal: 7,
  itemFontSize: 16,
};
