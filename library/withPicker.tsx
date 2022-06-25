import * as React from 'react';
import {
  ModalInternal,
  ModalInternalProps,
  withModal,
} from 'react-native-smart-modal';
import { darkly } from 'rn-darkly';
import { ComposeModalProps } from 'react-native-smart-modal/dist/types';
import { useReactionState } from '@liuyunjs/hooks/lib/useReactionState';
import { PickerContainer, PickerContainerProps } from './PickerContainer';
import { injectDefaultProps } from './defaultProps';

export type PickerEvent = {
  preventDefault(): void;
  isPreventDefaulted: boolean;
};

export type ModalPickerProps = ModalInternalProps &
  Omit<PickerContainerProps, 'bgColor' | 'onCancel' | 'onConfirm'> & {
    pure?: boolean;
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
) => {
  const ModalInternalPicker: React.FC<ModalPickerProps & T> = ({
    title,
    tintColor,
    confirmText,
    cancelText,
    onCancel,
    onConfirm,
    style,
    pure,
    ...rest
  }) => {
    const picker = <PickerView {...(rest as any)} />;

    if (pure) return picker;

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
          // @ts-ignore
          bgColor={rest.overlayColor}>
          {picker}
        </PickerContainer>
      </ModalInternal>
    );
  };

  const DarklyModalInternalPicker = darkly(
    ModalInternalPicker,
    'style',
    'indicatorColor',
    'itemColor',
    'maskBackgroundColor',
    'containerStyle',
    'contentContainerStyle',
    'tintColor',
    'overlayColor',
  );

  injectDefaultProps(DarklyModalInternalPicker);

  const ModalPicker = withModal(DarklyModalInternalPicker);

  const Picker: React.FC<
    Omit<ComposeModalProps<T>, 'children'> & ModalPickerProps
  > = ({ children, onWillChange, ...props }) => {
    const hasVisible = 'visible' in props;
    const pure = !children && !hasVisible;
    const [visible, setVisible] = useReactionState<boolean>(props.visible!);

    if (pure) {
      return <ModalPicker {...(props as any)} pure />;
    }

    if (hasVisible) {
      return (
        <ModalPicker
          {...(props as any)}
          onWillChange={onWillChange}
          pure={false}
        />
      );
    }

    const handleWillChange = (v: boolean) => {
      onWillChange?.(v);
      setVisible(v);
    };

    const child = React.Children.only(children) as React.ReactElement;
    const touchable = React.cloneElement(child, {
      onPress(e: any) {
        child.props.onPress?.(e);
        setVisible(!visible);
      },
    });

    return (
      <>
        {touchable}
        <ModalPicker
          {...(props as any)}
          pure={false}
          visible={visible}
          onWillChange={handleWillChange}
        />
      </>
    );
  };

  const show = (
    props: T & React.ComponentProps<typeof DarklyModalInternalPicker>,
  ) => {
    return ModalPicker.show(props);
  };
  const update = (
    key: string,
    props: T & React.ComponentProps<typeof DarklyModalInternalPicker>,
  ) => ModalPicker.update(key, props);
  const hide = (key: string) => ModalPicker.hide(key);

  return Object.assign(Picker, { show, update, hide });
};
