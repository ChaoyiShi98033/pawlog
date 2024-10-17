import { GlobalStyles } from './styles';

export const ButtonStyles = {
  defaultButton: {
    defaultStyle: {
      justifyContent: "center",
      backgroundColor: GlobalStyles.colors.secondary,
    },
    pressed: {
      opacity: 0.5,
    },
  },
  cancelButton:{
    backgroundColor: GlobalStyles.colors.red,
    paddingVertical: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: 90,
  },
  saveButton:{
    backgroundColor: GlobalStyles.colors.secondary,
    paddingVertical: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: 90,
  },
  buttonTitle:{
    color: GlobalStyles.colors.white,
    fontSize: GlobalStyles.fontSizes.large,
  },
};
