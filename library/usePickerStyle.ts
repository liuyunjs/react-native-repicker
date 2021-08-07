import React from 'react';
import Animated from 'react-native-reanimated';
import { Context } from './useInitializer';

const { multiply } = Animated;

export const usePickerStyle = ({
  ctx,
  data,
  itemHeight,
  halfTotal,
}: {
  ctx: Context;
  data: { value: string | number; label: string | number }[];
  itemHeight: number;
  halfTotal: number;
}) => {
  const { position } = ctx.values;
  const total = data.length;

  return React.useMemo(
    () => ({
      height: data.length * itemHeight,
      transform: [
        {
          translateY: multiply(position, -itemHeight),
        },
      ],
      top: halfTotal * itemHeight,
    }),
    [total, halfTotal, itemHeight],
  );
};
