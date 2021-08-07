import React from 'react';
import Animated, {
  Easing,
  // @ts-ignore
  EasingNode,
} from 'react-native-reanimated';
import { useWillMount } from '@liuyunjs/hooks/lib/useWillMount';
import { useTiming } from '@liuyunjs/hooks/lib/react-native-reanimated/useTiming';
import { isNumber } from '@liuyunjs/utils/lib/isNumber';
import { MIN } from './constant';

export type Context = {
  values: ReturnType<typeof createValues>;
  mapping: Record<string | number, number>;
  index: number;
};

export type Helper = {
  reset: (elseNode?: any) => Animated.Node<any>;
  animateTo: (
    to: Animated.Adaptable<number>,
    time: Animated.Adaptable<number>,
  ) => Animated.Node<number>;
  start: () => Animated.Node<number>;
  stop: () => Animated.Node<number>;
};

const { Value, block, set, cond, Node, greaterThan, lessThan, eq } = Animated;

const createValues = (index: number) => ({
  position: new Value<number>(index),
  nextIndex: new Value<number>(index),
  duration: new Value<number>(0),
  delta: new Value<number>(0),
  prevGesture: new Value<number>(0),
  index: new Value<number>(index),
});

// @ts-ignore
const E = EasingNode || Easing;

const easing = E.bezier(0.075, 0.82, 0.165, 1);

export const useInitializer = ({
  data,
  selected,
}: {
  data: { value: string | number; label: string | number }[];
  selected?: number | string;
}) => {
  const ctx = useWillMount(() => {
    let index =
      selected == null ? 0 : data.findIndex((item) => item.value === selected);
    index = index === -1 ? 0 : index;
    const mapping: Record<string | number, number> = {};

    const values = createValues(index);

    return {
      values,
      mapping,
      index,
    } as Context;
  });

  const max = data.length - 1;
  const { position, nextIndex, duration, index } = ctx.values;

  const animateTo = (
    to: Animated.Adaptable<number>,
    time: Animated.Adaptable<number>,
  ) => {
    return block([
      anim.stop(),
      set(duration, time),
      anim.start(),
      set(nextIndex, to),
    ]);
  };

  const reset = React.useCallback(
    (elseNode?: any) => {
      return cond(
        lessThan(position, MIN),
        animateTo(MIN, 500),
        cond(
          greaterThan(position, max),
          animateTo(max, 500),
          isNumber(elseNode) || elseNode instanceof Node ? elseNode : 0,
        ),
      );
    },
    [max],
  );

  // @ts-ignore
  const anim = useTiming({
    duration,
    easing,
    toValue: nextIndex,
    position,
    onEnd: React.useCallback(() => {
      return reset(cond(eq(position, nextIndex), set(index, nextIndex)));
    }, [reset]),
  });

  return [
    ctx,
    {
      reset,
      animateTo,
      start: anim.start,
      stop: anim.stop,
    },
  ] as const;
};
