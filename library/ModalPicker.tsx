import * as React from 'react';
import { ModalInternal, ModalInternalProps } from 'react-native-smart-modal';
import { PickerContainerProps, PickerContainer } from './PickerContainer';
import { PickerViewCustom, PickerViewCustomProps } from './PickerViewCustom';

export type PickerEvent = {
  preventDefault(): void;
  isPreventDefaulted: boolean;
};

export type ModalPickerProps = Omit<PickerViewCustomProps, 'onChange'> &
  Omit<ModalInternalProps, 'children'> &
  Omit<PickerContainerProps, 'bgColor' | 'onCancel' | 'onConfirm'> & {
    pure?: boolean;
    onCancel?: (e: PickerEvent) => void;
    onConfirm?: (e: PickerEvent) => void;
  };

const createPickerEvent = (): PickerEvent => {
  const event = {
    isPreventDefaulted: false,
    preventDefault() {
      event.isPreventDefaulted = true;
    },
  };
  return event;
};

export const ModalPicker: React.FC<ModalPickerProps> = ({
  title,
  tintColor,
  confirmText,
  cancelText,
  onCancel,
  onConfirm,
  style,
  onSelected,
  data,
  itemHeight,
  selected,
  itemTotal,
  itemFontSize,
  itemColor,
  indicatorColor,
  overlayColor,
  pure,
  ...rest
}) => {
  const picker = (
    <PickerViewCustom
      indicatorColor={indicatorColor}
      overlayColor={overlayColor}
      onSelected={onSelected}
      data={data}
      itemColor={itemColor}
      itemHeight={itemHeight}
      itemFontSize={itemFontSize}
      selected={selected}
      itemTotal={itemTotal}
    />
  );

  if (pure) return picker;

  const { onRequestClose } = rest;

  const callbackEventWrapper = (callback?: (e: PickerEvent) => void) => () => {
    const event = createPickerEvent();
    callback?.(event);
    if (!event.isPreventDefaulted) {
      onRequestClose?.();
    }
  };

  return (
    <ModalInternal {...rest}>
      <PickerContainer
        forceDark={rest.forceDark}
        title={title}
        confirmText={confirmText}
        onConfirm={callbackEventWrapper(onConfirm)}
        cancelText={cancelText}
        onCancel={callbackEventWrapper(onCancel)}
        tintColor={tintColor}
        style={style}
        bgColor={overlayColor}>
        {picker}
      </PickerContainer>
    </ModalInternal>
  );
};
