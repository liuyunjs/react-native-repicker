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

  const onReset = (time: number) => {
    if (selected == null) return;
    let targetIndex = ctx.mapping[selected];
    if (targetIndex == null) {
      const last = data.length - 1;
      if (ctx.index > last) {
        targetIndex = last;
      } else {
        targetIndex = 0;
      }
      if (targetIndex === ctx.index) return;
      onChangeCallback([targetIndex]);
      nextIndex.setValue(helper.animateTo(targetIndex, time));
      return;
    }
    if (targetIndex === ctx.index) return;
    ctx.index = targetIndex;
    nextIndex.setValue(helper.animateTo(targetIndex, time));
  };

  React.useEffect(() => onReset(500), [selected]);
  React.useEffect(() => onReset(0), [data]);
};
