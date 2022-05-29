import * as React from 'react';
import { State, PanGestureHandler } from 'react-native-gesture-handler';
import { View } from 'react-native';
import Animated, {
  divide,
  block,
  Easing,
  // @ts-ignore
  EasingNode,
  cond,
  eq,
  set,
  add,
  multiply,
  sub,
  lessThan,
  or,
  greaterOrEq,
  lessOrEq,
  abs,
  greaterThan,
  log,
  pow,
  and,
  round,
  call,
  stopClock,
  startClock,
  clockRunning,
  not,
  Value,
  Clock,
  event,
  decay,
  timing,
  onChange,
  neq,
} from 'react-native-reanimated';
import { isAnyObject } from '@liuyunjs/utils/lib/isAnyObject';
import { clamp } from '@liuyunjs/utils/lib/clamp';
import { PickerItem } from './PickerItem';
import { PickerOverlay } from './PickerOverlay';

type Item =
  | { value: string | number; label: string | number }
  | string
  | number;

export type PickerViewCustomProps = {
  onChange?: (selected: number) => void;
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
const OVER_OFFSET = 100;
const DEFAULT_DURATION = 500;

const E = EasingNode || Easing;

const easing = E.bezier(0.075, 0.82, 0.165, 1);

export class PickerViewCustom extends React.PureComponent<PickerViewCustomProps> {
  static defaultProps = {
    indicatorColor: '#666',
    itemColor: '#333',
    overlayColor: '#fff',
    itemHeight: 36,
    data: [],
    itemTotal: 7,
    itemFontSize: 16,
  };

  private readonly _pan: () => void;

  private readonly _itemHeight: Animated.Value<number>;
  private readonly _dataLength: Animated.Value<number>;
  private readonly _progress: Animated.Value<number>;
  private readonly _toValue: Animated.Value<number>;
  private readonly _index: Animated.Value<number>;

  private _indexJs: number;

  private readonly _translate: Animated.Node<number>;

  constructor(props: PickerViewCustomProps) {
    super(props);

    const { itemHeight, selected, data } = props;

    this._itemHeight = new Value(itemHeight);
    this._dataLength = new Value(data.length);
    const toValue = (this._toValue = new Value<number>(
      -selected! * itemHeight!,
    ));
    const progress = (this._progress = new Value<number>(
      -selected! * itemHeight!,
    ));
    this._indexJs = -selected!;

    const gestureState = new Value<State>(State.UNDETERMINED);

    const velocity = new Value<number>(0);
    const gesture = new Value<number>(0);
    const previousGesture = new Value<number>(0);
    const index = (this._index = new Value<number>(-selected!));

    const clock = new Clock();
    const useDecay = new Value<number>(0);
    const duration = new Value<number>(DEFAULT_DURATION);
    const finished = new Value<number>(0);
    const time = new Value<number>(0);
    const frameTime = new Value<number>(0);

    this._pan = event([
      {
        nativeEvent: {
          state: gestureState,
          velocityY: velocity,
          translationY: gesture,
        },
      },
    ]);

    const maxIndex = sub(1, this._dataLength);
    const minIndex = 0;

    const maxScroll = multiply(maxIndex, this._itemHeight);
    const minScroll = multiply(minIndex, this._itemHeight);

    const isOvershotBottom = (
      next: Animated.Adaptable<number>,
      offset: Animated.Adaptable<number> = 0,
    ) => lessOrEq(next, sub(maxScroll, offset));

    const isOvershotTop = (
      next: Animated.Adaptable<number>,
      offset: Animated.Adaptable<number> = 0,
    ) => greaterOrEq(next, add(offset, minScroll));

    const isOvershotBottomCurrent = isOvershotBottom(progress);
    const isOvershotTopCurrent = isOvershotTop(progress);

    const isOvershotCurrent = or(isOvershotBottomCurrent, isOvershotTopCurrent);

    const dist = sub(gesture, previousGesture);

    const av = abs(velocity);

    const deltaTime = divide(
      log(divide(VELOCITY_THRESHOLD, av)),
      log(DECELERATION),
    );

    const kv = pow(DECELERATION, deltaTime);
    const kx = divide(multiply(DECELERATION, sub(1, kv)), sub(1, DECELERATION));
    const next = add(progress, multiply(divide(velocity, 1000), kx));

    const setIndex = cond(
      greaterThan(av, VELOCITY_THRESHOLD),
      cond(
        isOvershotTop(next),
        set(toValue, minScroll),
        cond(
          isOvershotBottom(next),
          set(toValue, maxScroll),
          set(
            toValue,
            multiply(round(divide(next, this._itemHeight)), this._itemHeight),
          ),
        ),
      ),
    );

    const shouldStartTiming = and(
      not(clockRunning(clock)),
      neq(toValue, progress),
    );

    const shouldStartDecay = and(not(clockRunning(clock)), velocity);

    this._translate = block([
      cond(
        eq(gestureState, State.ACTIVE),
        [
          stopClock(clock),
          cond(
            isOvershotCurrent,
            // 超出边界
            [set(progress, add(progress, divide(dist, 4)))],
            set(progress, add(progress, dist)),
          ),
          set(useDecay, 0),
        ],
        [
          cond(eq(gestureState, State.BEGAN), stopClock(clock)),
          cond(
            eq(gestureState, State.END),
            cond(
              isOvershotCurrent,
              // 手指拖动时超出边界，回弹
              [
                set(useDecay, 0),
                set(duration, DEFAULT_DURATION),
                set(
                  toValue,
                  cond(isOvershotBottomCurrent, maxScroll, minScroll),
                ),
              ],
              cond(
                and(
                  greaterThan(av, VELOCITY_THRESHOLD),
                  or(
                    isOvershotBottom(next, OVER_OFFSET),
                    isOvershotTop(next, OVER_OFFSET),
                  ),
                ),
                // 滑动速度足够，使用惯性滚动
                [set(useDecay, 1), setIndex],
                [set(useDecay, 0), setIndex, set(duration, deltaTime)],
              ),
            ),
          ),

          cond(
            useDecay,
            [
              cond(shouldStartDecay, [set(time, 0), set(finished, 0)]),

              decay(
                clock,
                {
                  position: progress,
                  time: time,
                  finished: finished,
                  velocity: velocity,
                },
                {
                  deceleration: DECELERATION,
                },
              ),

              cond(shouldStartDecay, startClock(clock)),

              cond(
                or(isOvershotBottomCurrent, isOvershotTopCurrent),
                set(
                  velocity,
                  multiply(
                    pow(abs(velocity), 0.4),
                    cond(lessThan(velocity, 0), -1, 1),
                  ),
                ),
              ),

              cond(finished, [
                set(velocity, 0),
                set(useDecay, 0),
                set(duration, 500),
                set(frameTime, 0),
                set(time, 0),
                set(finished, 0),
              ]),
            ],
            [
              cond(shouldStartTiming, [
                set(frameTime, 0),
                set(time, 0),
                set(finished, 0),
              ]),

              timing(
                clock,
                {
                  position: progress,
                  time: time,
                  finished: finished,
                  frameTime: frameTime,
                },
                {
                  duration: duration,
                  easing,
                  toValue: toValue,
                },
              ),
              cond(shouldStartTiming, startClock(clock)),
              cond(finished, [
                set(duration, 500),
                set(index, round(divide(toValue, this._itemHeight))),
                stopClock(clock),
              ]),
            ],
          ),

          set(gestureState, State.UNDETERMINED),
        ],
      ),
      onChange(
        index,
        call([index], (args) => this._onIndexChange(args[0])),
      ),
      set(previousGesture, gesture),
      progress,
    ]);
  }

  componentDidUpdate(prevProps: PickerViewCustomProps) {
    const { data, selected, itemHeight } = this.props;

    if (prevProps.itemHeight !== itemHeight) {
      this._itemHeight.setValue(itemHeight!);
    }

    const dataLength = data.length;

    if (prevProps.data.length !== dataLength) {
      this._scrollToIndex(clamp(0, selected!, dataLength - 1));
      this._progress.setValue(this._indexJs * itemHeight!);
      this._index.setValue(this._indexJs);
      this._dataLength.setValue(dataLength);
    } else if (prevProps.selected !== selected && -this._indexJs !== selected) {
      this._indexJs = -selected!;
      this._toValue.setValue(-selected! * itemHeight!);
    }
  }

  _onIndexChange(index: number) {
    this._indexJs = index;
    if (-index === this.props.selected) return;
    this.props.onChange?.(Math.abs(index));
  }

  _scrollToIndex = (index: number) => {
    this._indexJs = -index;
    this._toValue.setValue(-index * this.props.itemHeight!);
  };

  render() {
    const {
      itemColor,
      itemFontSize,
      itemHeight,
      itemTotal,
      indicatorColor,
      overlayColor,
      data,
    } = this.props;

    const halfTotal = Math.floor(itemTotal! / 2);

    return (
      <View
        style={{
          height: itemHeight! * itemTotal!,
          overflow: 'hidden',
          backgroundColor: overlayColor,
        }}>
        <PanGestureHandler
          onGestureEvent={this._pan}
          onHandlerStateChange={this._pan}
          failOffsetX={OFFSET}
          activeOffsetY={OFFSET}>
          <Animated.View
            style={{
              paddingVertical: halfTotal * itemHeight!,
              flexDirection: 'column',
              transform: [{ translateY: this._translate }],
            }}>
            {data.map((item, index) => {
              const isObjItem = isAnyObject(item);
              const key = isObjItem ? (item as any).value : item;
              const label = isObjItem ? (item as any).label : item;

              return (
                <PickerItem
                  onPress={this._scrollToIndex}
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
  }
}
