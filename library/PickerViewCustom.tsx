import * as React from 'react';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import { View } from 'react-native';
import Animated, {
  useSharedValue,
  useDerivedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  Easing,
  cancelAnimation,
  withTiming,
  withDecay,
  runOnJS,
  EasingFunctionFactory,
} from 'react-native-reanimated';
import { isAnyObject } from '@liuyunjs/utils/lib/isAnyObject';
import { clamp } from '@liuyunjs/utils/lib/clamp';
import { PickerItem } from './PickerItem';
import { PickerOverlay } from './PickerOverlay';
import { useCallback } from 'react';

type Item =
  | { value: string | number; label: string | number }
  | string
  | number;

export type PickerViewCustomProps = {
  onSelected?: (selected: number) => void;
  data: Item[];
  itemHeight?: number;
  selected?: number;
  itemTotal?: number;
  itemFontSize?: number;
  itemColor?: string;
  indicatorColor?: string;
  overlayColor?: string;
};

const OFFSET = [-10, 10];
const DECELERATION = 0.998;
const VELOCITY_THRESHOLD = 5;
const DEFAULT_DURATION = 500;

const easing = Easing.bezier(0.075, 0.82, 0.165, 1);

export const PickerViewCustom: React.FC<PickerViewCustomProps> = ({
  itemHeight,
  itemTotal,
  indicatorColor,
  itemColor,
  itemFontSize,
  overlayColor,
  data,
  selected,
  onSelected,
}) => {
  const progress = useSharedValue(selected!);
  const dataLength = data.length;
  const maxIndex = Math.max(dataLength - 1, 0);
  const minIndex = 0;

  const isOvershotBottom = React.useCallback(
    (next: number, offset: number = 0) => {
      'worklet';
      return next >= maxIndex + offset;
    },
    [maxIndex],
  );

  const isOvershotTop = React.useCallback(
    (next: number, offset: number = 0) => {
      'worklet';
      return next <= minIndex - offset;
    },
    [minIndex],
  );

  const isOvershotCurrent = useDerivedValue(() => {
    const isOvershotBottomCurrent = isOvershotBottom(progress.value);
    const isOvershotTopCurrent = isOvershotTop(progress.value);
    return isOvershotBottomCurrent || isOvershotTopCurrent;
  }, [isOvershotBottom, isOvershotTop]);

  const handleSelected = React.useCallback(
    (index: number) => {
      onSelected?.(index);
    },
    [onSelected],
  );

  const resetProgress = useCallback(
    (index: number) => {
      'worklet';
      progress.value = index;
      runOnJS(handleSelected)(Math.round(index));
    },
    [handleSelected],
  );

  const animateTo = React.useCallback(
    (
      toValue: number,
      duration: number,
      easing: Animated.EasingFunction | EasingFunctionFactory,
    ) => {
      'worklet';

      toValue = isOvershotTop(toValue)
        ? minIndex
        : isOvershotBottom(toValue)
        ? maxIndex
        : Math.round(toValue);

      if (toValue === progress.value) return;
      if (!duration) return resetProgress(toValue);

      progress.value = withTiming(
        toValue,
        {
          duration,
          easing,
        },
        (finished) => {
          finished && resetProgress(toValue);
        },
      );
    },
    [
      isOvershotTop,
      isOvershotTop,
      itemHeight,
      minIndex,
      maxIndex,
      resetProgress,
    ],
  );

  const scrollToIndex = React.useCallback(
    (index: number, duration: number = DEFAULT_DURATION) => {
      animateTo(index, duration, Easing.inOut(Easing.cubic));
    },
    [animateTo],
  );

  const resetSelected = (forceReset?: boolean) => {
    if (selected != null) {
      const clampSelected = clamp(dataLength - 1, selected, 0);
      scrollToIndex(
        clampSelected,
        !forceReset && clampSelected === selected ? DEFAULT_DURATION : 0,
      );
    }
  };

  React.useLayoutEffect(() => resetSelected(true), [dataLength]);
  React.useLayoutEffect(() => resetSelected(), [selected]);

  const onGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    {
      previousGesture: number;
    }
  >(
    {
      onStart({ translationY }, _) {
        cancelAnimation(progress);
        _.previousGesture = translationY;
      },
      onActive({ translationY, velocityY }, _) {
        cancelAnimation(progress);
        let dist = translationY - _.previousGesture;
        _.previousGesture = translationY;
        isOvershotCurrent.value && (dist /= 4);
        progress.value -= dist / itemHeight!;
      },
      onEnd({ velocityY }) {
        let duration = DEFAULT_DURATION;
        let toValue = progress.value;

        if (!isOvershotCurrent.value) {
          velocityY /= -itemHeight!;
          let av = Math.abs(velocityY);
          if (av > VELOCITY_THRESHOLD) {
            duration =
              Math.log(VELOCITY_THRESHOLD / av) / Math.log(DECELERATION);
            const kv = Math.pow(DECELERATION, duration);
            const kx = (DECELERATION * (1 - kv)) / (1 - DECELERATION);
            toValue = progress.value + (velocityY / 1000) * kx;
            if (isOvershotBottom(toValue, 4) || isOvershotTop(toValue, 4)) {
              progress.value = withDecay(
                {
                  velocity: velocityY,
                  deceleration: DECELERATION,
                  clamp: [minIndex - 2, maxIndex + 2],
                },
                () => animateTo(progress.value, DEFAULT_DURATION, easing),
              );
              return;
            }
          }
        }

        animateTo(toValue, duration, easing);
      },
    },
    [
      isOvershotTop,
      isOvershotBottom,
      minIndex,
      maxIndex,
      itemHeight,
      animateTo,
    ],
  );

  const animateStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: -progress.value * itemHeight! }],
    };
  }, [itemHeight]);

  const halfTotal = Math.floor(itemTotal! / 2);

  return (
    <View
      style={{
        height: itemHeight! * itemTotal!,
        overflow: 'hidden',
        backgroundColor: overlayColor,
      }}>
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        failOffsetX={OFFSET}
        activeOffsetY={OFFSET}>
        <Animated.View
          style={[
            {
              paddingVertical: halfTotal * itemHeight!,
              flexDirection: 'column',
            },
            animateStyle,
          ]}>
          {data.map((item, index) => {
            const isObjItem = isAnyObject(item);
            const key = isObjItem ? (item as any).value : item;
            const label = isObjItem ? (item as any).label : item;

            return (
              <PickerItem
                onPress={scrollToIndex}
                index={index}
                key={key}
                label={label}
                color={itemColor!}
                height={itemHeight!}
                fontSize={itemFontSize!}
              />
            );
          })}
        </Animated.View>
      </PanGestureHandler>

      <PickerOverlay
        overlayColor={overlayColor!}
        indicatorColor={indicatorColor!}
        height={itemHeight!}
        total={halfTotal}
      />
    </View>
  );
};

PickerViewCustom.defaultProps = {
  indicatorColor: '#666',
  itemColor: '#333',
  overlayColor: '#fff',
  itemHeight: 36,
  data: [],
  itemTotal: 7,
  itemFontSize: 16,
};
