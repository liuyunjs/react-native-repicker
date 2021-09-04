import React from 'react';
import { GestureResponderEvent } from 'react-native';
import { Modal } from 'react-native-smart-modal';
import { PickerContainerProps, PickerContainer } from './PickerContainer';

export type PickerModalProps = PickerContainerProps & {
  picker: React.ReactElement;
};

export const PickerModal: React.FC<PickerModalProps> = ({
  title,
  tintColor,
  confirmText,
  cancelText,
  onCancel,
  onConfirm,
  style,
  children,
  bgColor,
  picker,
}) => {
  const [visible, setVisible] = React.useState(false);
  const child = React.Children.only(children as React.ReactElement);
  const touchable = React.cloneElement(child, {
    onPress: (e: GestureResponderEvent) => {
      setVisible(true);
      child.props.onPress?.(e);
    },
  });

  return (
    <>
      {touchable}
      <Modal namespace="picker" visible={visible} onChange={setVisible}>
        <PickerContainer
          title={title}
          confirmText={confirmText}
          onConfirm={() => {
            setVisible(false);
            onConfirm?.();
          }}
          cancelText={cancelText}
          onCancel={() => {
            setVisible(false);
            onCancel?.();
          }}
          tintColor={tintColor}
          style={style}
          bgColor={bgColor}>
          {picker}
        </PickerContainer>
      </Modal>
    </>
  );
};
