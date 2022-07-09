import * as React from 'react';
import {
  ModalInternal,
  ModalInternalProps,
  ModalityProps,
  withModal,
} from 'react-native-smart-modal';
import { darkly } from 'rn-darkly';
import { PortalStore } from 'react-native-portal-view';
import { PickerContainer, PickerContainerProps } from './PickerContainer';
import { injectDefaultProps } from './defaultProps';

export type PickerEvent = {
  preventDefault(): void;
  isPreventDefaulted: boolean;
};

export type ModalPickerProps = ModalityProps &
  ModalInternalProps &
  Omit<PickerContainerProps, 'bgColor' | 'onCancel' | 'onConfirm'> & {
    onCancel?: (e: PickerEvent) => void;
    onConfirm?: (e: PickerEvent) => void;
    overlayColor?: string;
    indicatorColor?: string;
    itemColor?: string;
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

export const withPicker = <T extends object>(
  PickerView: React.ComponentType<T>,
  store?: PortalStore,
) => {
  const Picker: React.FC<ModalPickerProps & T> = ({
    title,
    tintColor,
    confirmText,
    cancelText,
    onCancel,
    onConfirm,
    style,
    ...rest
  }) => {
    const { onRequestClose } = rest;

    const callbackEventWrapper =
      (callback?: (e: PickerEvent) => void) => () => {
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
          bgColor={rest.overlayColor}>
          <PickerView {...(rest as any)} />
        </PickerContainer>
      </ModalInternal>
    );
  };

  const DarklyPicker = darkly(
    Picker,
    'style',
    'indicatorColor',
    'itemColor',
    'maskBackgroundColor',
    'containerStyle',
    'contentContainerStyle',
    'tintColor',
    'overlayColor',
  );

  injectDefaultProps(DarklyPicker);

  return withModal(DarklyPicker, store);
};
