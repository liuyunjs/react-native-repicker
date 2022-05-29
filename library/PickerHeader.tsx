import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as React from 'react';
import { DarklyText } from 'rn-darkly';

export type PickerHeaderProps = {
  cancelText?: string;
  onCancel?: () => void;
  confirmText?: string;
  onConfirm?: () => void;
  tintColor?: string;
  title?: string;
  forceDark?: boolean;
};

export const PickerHeader: React.FC<PickerHeaderProps> = ({
  confirmText,
  onConfirm,
  cancelText,
  onCancel,
  title,
  tintColor,
  forceDark,
}) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity
        disabled={!onCancel}
        style={styles.btn}
        onPress={onCancel}>
        <DarklyText
          forceDark={forceDark}
          dark_style={styles.darkCancelText}
          style={styles.btnText}>
          {cancelText}
        </DarklyText>
      </TouchableOpacity>
      <DarklyText
        forceDark={forceDark}
        dark_style={styles.darkTitle}
        style={styles.title}>
        {title}
      </DarklyText>
      <TouchableOpacity
        disabled={!onConfirm}
        style={styles.btn}
        onPress={onConfirm}>
        <Text style={[styles.btnText, { color: tintColor }]}>
          {confirmText}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

PickerHeader.defaultProps = {
  tintColor: '#1073ea',
  title: '请选择',
  cancelText: '取消',
  confirmText: '确定',
};

const styles = StyleSheet.create({
  header: {
    height: 60,
    flexDirection: 'row',
    paddingTop: 10,
    alignItems: 'center',
  },

  btn: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },

  btnText: {
    fontSize: 16,
    color: '#666',
  },

  darkCancelText: {
    color: '#aaa',
  },

  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },

  darkTitle: {
    color: '#ddd',
  },
});
