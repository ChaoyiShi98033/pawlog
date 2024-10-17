import { Pressable, StyleSheet, Text } from "react-native";
import React from "react";
import { GlobalStyles } from "../constants/styles";
import { ButtonStyles } from "../constants/buttonStyles";

export default function PressableButton({
  customStyle,
  onPressFunction,
  children,
  listBtn,
  disabled = false,
}) {
  return (
    <Pressable
      android_ripple={{ color: GlobalStyles.colors.primary }}
      onPress={onPressFunction}
      style={({ pressed }) => [
        ButtonStyles.defaultButton,
        pressed && styles.pressed,
        customStyle,
      ]}
      disabled={disabled}
    >
      {listBtn ? (
        children
      ) : (
        <Text style={ButtonStyles.buttonTitle}>{children}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({});
