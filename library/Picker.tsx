import React from 'react';
import Animated from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { PickerOverlay } from './PickerOverlay';
import { PickerItem } from './PickerItem';
import { useInitializer } from './useInitializer';
import { usePanGesture } from './usePanGesture';
import { useReaction } from './useReaction';
import { usePickerStyle } from './usePickerStyle';

type PickerProps = {
  onChange?: (selected: {
    value: string | number;
    label: string | number;
  }) => void;
  data: { value: string | number; label: string | number }[];
  itemHeight?: number;
  selected?: number | string;
  itemTotal?: number;
  itemFontSize?: number;
  itemColor?: string;
  indicatorColor?: string;
  overlayColor?: string;
};

const OFFSET = [-10, 10];

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
  const [ctx, helper] = useInitializer({ data, selected });

  const pan = usePanGesture({ ctx, itemHeight: itemHeight!, data, helper });

  useReaction({ ctx, helper, onChange, selected, data });

  const halfTotal = (itemTotal! - 1) / 2;
  const style = usePickerStyle({
    data,
    ctx,
    itemHeight: itemHeight!,
    halfTotal,
  });

  return (
    <PanGestureHandler
      activeOffsetY={OFFSET}
      failOffsetX={OFFSET}
      enableTrackpadTwoFingerGesture
      onGestureEvent={pan}
      onHandlerStateChange={pan}>
      <Animated.View
        style={{ height: itemHeight! * itemTotal!, overflow: 'hidden' }}>
        <Animated.View style={style}>
          {data.map((item, index) => {
            if (!index) ctx.mapping = {};
            ctx.mapping[item.value] = index;
            return (
              <PickerItem
                key={item.value}
                height={itemHeight!}
                // offset={offset}
                color={itemColor!}
                fontSize={itemFontSize!}
                label={item.label}
              />
            );
          })}
        </Animated.View>
        <PickerOverlay
          overlayColor={overlayColor!}
          indicatorColor={indicatorColor!}
          height={itemHeight!}
          total={halfTotal}
        />
      </Animated.View>
    </PanGestureHandler>
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
