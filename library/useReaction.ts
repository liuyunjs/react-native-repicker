import React from 'react';
import Animated from 'react-native-reanimated';
import { useReactCallback } from '@liuyunjs/hooks/lib/useReactCallback';
import { useCodeExec } from '@liuyunjs/hooks/lib/react-native-reanimated/useCodeExec';
import { Context, Helper } from './useInitializer';

const { call, onChange } = Animated;

export const useReaction = ({
  ctx,
  onChange: onChangeInput,
  data,
  selected,
  helper,
}: {
  helper: Helper;
  ctx: Context;
  selected?: number | string;
  onChange?: (selected: {
    value: string | number;
    label: string | number;
  }) => void;
  data: { value: string | number; label: string | number }[];
}) => {
  const { index, nextIndex } = ctx.values;

  const onChangeCallback = useReactCallback(([index]: readonly number[]) => {
    if (ctx.index === index) return;
    const item = data[index];
    ctx.index = index;
    if (item && onChangeInput) onChangeInput(item);
  });

  useCodeExec(() => {
    return onChange(index, call([index], onChangeCallback));
  }, []);

  React.useEffect(() => {
    if (selected == null) return;
    const targetIndex = ctx.mapping[selected];
    if (targetIndex == null || targetIndex === ctx.index) return;
    ctx.index = targetIndex;
    nextIndex.setValue(helper.animateTo(targetIndex, 500));
  }, [selected]);
};
