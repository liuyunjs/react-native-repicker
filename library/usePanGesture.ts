import React from 'react';
import Animated from 'react-native-reanimated';
import {
  useGesture,
  GestureContext,
} from '@liuyunjs/hooks/lib/react-native-reanimated/useGesture';
import { useConst } from '@liuyunjs/hooks/lib/useConst';
import { Context, Helper } from './useInitializer';
import { DECELERATION, MIN } from './constant';

const {
  set,
  sub,
  cond,
  lessThan,
  greaterThan,
  block,
  add,
  divide,
  abs,
  log,
  multiply,
  pow,
  or,
  round,
} = Animated;

export const usePanGesture = ({
  ctx,
  itemHeight,
  data,
  helper,
}: {
  helper: Helper;
  ctx: Context;
  itemHeight: number;
  data: { value: string | number; label: string | number }[];
}) => {
  const { position, prevGesture, delta } = ctx.values;

  const max = data.length - 1;

  return useGesture({
    onStart: useConst(helper.stop),
    onActive: React.useCallback(
      (_: GestureContext) => {
        const next = add(position, delta);
        const scaleCurrent = set(position, add(position, divide(delta, 3)));

        return block([
          set(delta, divide(sub(prevGesture, _.gestureY), itemHeight)),
          set(prevGesture, _.gestureY),
          cond(
            or(lessThan(next, MIN), greaterThan(next, max)),
            scaleCurrent,
            set(position, next),
          ),
        ]);
      },
      [itemHeight, max],
    ),
    onEnd: React.useCallback(
      (_: GestureContext) => {
        const av = abs(_.velocityY);

        // 计算本次滚动需要的时间
        // 0.005 是 v 缩减的最小值
        const deltaTime = divide(log(divide(5, av)), log(DECELERATION));
        const distance = divide(
          divide(
            multiply(
              multiply(divide(av, 1000), DECELERATION),
              sub(1, pow(DECELERATION, deltaTime)),
            ),
            sub(1, DECELERATION),
          ),
          itemHeight,
        );

        const isPanUp = lessThan(_.velocityY, 0);

        const nextIndex = round(
          cond(isPanUp, add(position, distance), sub(position, distance)),
        );

        const bounceTo = (th: Animated.Adaptable<number>) => {
          const dis = cond(isPanUp, sub(nextIndex, th), sub(th, nextIndex));
          const sd = pow(dis, 0.3);
          const dt = multiply(divide(dis, distance), deltaTime);

          return helper.animateTo(
            cond(isPanUp, add(th, sd), sub(th, sd)),
            sub(deltaTime, dt),
          );
        };

        return block([
          set(prevGesture, 0),
          set(delta, 0),
          helper.reset(
            cond(
              greaterThan(av, 5),
              cond(
                lessThan(nextIndex, MIN),
                bounceTo(MIN),
                cond(
                  greaterThan(nextIndex, max),
                  bounceTo(max),
                  helper.animateTo(nextIndex, deltaTime),
                ),
              ),
              helper.animateTo(round(position), 300),
            ),
          ),
        ]);
      },
      [max, itemHeight],
    ),
  })[0];
};
