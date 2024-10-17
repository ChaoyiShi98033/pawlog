import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  ScrollView,
  Dimensions,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {GlobalStyles} from '../../util/constants/styles';
import {useNavigation} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native';
import {createUserWithEmailAndPassword} from 'firebase/auth';
import {auth} from '../../firebase-files/firebaseSetup';
import {writeToDB, updateToDB} from '../../firebase-files/firebaseHelper';
import {updateProfile} from 'firebase/auth';
import {getPushToken} from '../../components/notification/PushNotification';

//SignUp screen handles user sign up.
export default function SignUp () {
  const [fullName, setFullName] = useState ('');
  const [email, setEmail] = useState ('');
  const [password, setPassword] = useState ('');
  const [confirmPassword, setConfirmPassword] = useState ('');
  const navigation = useNavigation ();
  const [passwordValid, setPasswordValid] = useState ({
    minLength: false,
    upperCase: false,
    lowerCase: false,
    number: false,
    specialChar: false,
  });

  // Function to check password validity
  const checkPasswordValidity = password => {
    const minLength = password.length >= 8;
    const upperCase = /[A-Z]/.test (password);
    const lowerCase = /[a-z]/.test (password);
    const number = /[0-9]/.test (password);
    const specialChar = /[^A-Za-z0-9]/.test (password);

    setPasswordValid ({minLength, upperCase, lowerCase, number, specialChar});
  };

  // Handler for password input change
  const handlePasswordChange = text => {
    setPassword (text);
    checkPasswordValidity (text);
  };

  // Function to handle user sign up
  async function signUpHandler () {
    if (!fullName || !email || !password || !confirmPassword) {
      alert ('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      alert ('Passwords do not match');
      return;
    }
    try {
      await createUserWithEmailAndPassword (auth, email, password);
      // Navigate to the home screen
      navigation.replace ('Back');
      // Set up get push token
      const pushToken = await getPushToken ();
      //console.log("Push token:", pushToken);
      // Update user's profile with full name
      await updateProfile (auth.currentUser, {
        displayName: fullName,
      });
      // Write user's full name to the database
      writeToDB ('users', {email, fullName, pushToken});
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        alert ('Email already in use');
      } else {
        alert ('Something went wrong. Please ensure all your inputs are valid and try again!');
        console.log ('sign up error:', error.code, error.message);
      }
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.imageContainer}>
        <Image
          source={require ('../../assets/logo.png')}
          style={styles.imageStyle}
        />
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>CREATE NEW ACCOUNT</Text>
        <View style={styles.loginContainer}>
          <Text
            style={[styles.plainText, {color: GlobalStyles.colors.dark_grey}]}
          >
            Already registered?{' '}
          </Text>
          <TouchableOpacity
            onPress={() => navigation.replace ('LogIn')}
            style={styles.loginButton}
          >
            <Text style={styles.loginButtonText}>Log in here</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="full name"
          style={styles.userInfoBox}
          onChangeText={text => setFullName (text)}
          value={fullName}
          keyboardType="default"
        />
        <TextInput
          placeholder="email"
          style={styles.userInfoBox}
          onChangeText={text => setEmail (text)}
          value={email}
          keyboardType="default"
        />
        <TextInput
          placeholder="password"
          style={styles.userInfoBox}
          onChangeText={handlePasswordChange}
          value={password}
          secureTextEntry={true}
        />
        <TextInput
          placeholder="confirm password"
          style={styles.userInfoBox}
          onChangeText={text => setConfirmPassword (text)}
          value={confirmPassword}
          keyboardType="default"
          secureTextEntry={true}
        />
      </View>
      <View style={styles.passwordRuleContainer}>
          <Text style={passwordValid.minLength ? styles.valid : styles.invalid}>
            Strong Password Rules:
          </Text>
          <Text style={passwordValid.minLength ? styles.valid : styles.invalid}>
            Minimum 8 characters
          </Text>
          <Text style={passwordValid.upperCase ? styles.valid : styles.invalid}>
            At least one uppercase letter
          </Text>
          <Text style={passwordValid.lowerCase ? styles.valid : styles.invalid}>
            At least one lowercase letter
          </Text>
          <Text style={passwordValid.number ? styles.valid : styles.invalid}>
            At least one number
          </Text>
          <Text
            style={passwordValid.specialChar ? styles.valid : styles.invalid}
          >
            At least one special character
          </Text>
        </View>
      <View style={styles.buttonContainer}>
        <Text
          style={[
            styles.plainText,
            {marginHorizontal: 40, color: GlobalStyles.colors.secondary},
          ]}
        >
          By continuing, you agree with our Terms & Conditions and Privacy
          Policy
        </Text>
        <TouchableOpacity style={styles.signUpButton} onPress={signUpHandler}>
          <Text style={styles.signUpText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const {width, height} = Dimensions.get ('window');

const styles = StyleSheet.create ({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: GlobalStyles.colors.primary,
    paddingTop: height / 30,
  },
  imageContainer: {
    alignItems: 'center',
  },
  titleContainer: {},
  inputContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 30,
    marginLeft: 15,
    marginRight: 10,
  },
  passwordRuleContainer: {
    justifyContent: 'flex-start',
    marginLeft: 60,
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginHorizontal: 10,
  },

  imageStyle: {
    width: 200,
    height: 200,
    borderRadius: 100, // Make the image circular
  },

  titleText: {
    fontSize: width / 18,
    color: GlobalStyles.colors.black,
    margin: 10,
    textAlign: 'center',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  userInfoBox: {
    height: 40,
    borderRadius: 20,
    fontSize: GlobalStyles.fontSizes.large,
    width: '85%',
    justifyContent: 'center',
    marginBottom: 10,
    color: GlobalStyles.colors.secondary,
    backgroundColor: GlobalStyles.colors.light_grey,
    paddingLeft: 20,
  },
  buttonBox: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 30,
    alignItems: 'center',
  },

  loginButton: {
    borderRadius: 5,
  },
  loginButtonText: {
    color: GlobalStyles.colors.secondary,
    fontSize: width / 40,
  },
  plainText: {
    fontSize: width / 40,
    textAlign: 'center',
    marginHorizontal: 5,
  },
  valid: {
    color: GlobalStyles.colors.accent,
    fontSize: GlobalStyles.fontSizes.small,
  },
  invalid: {
    color: GlobalStyles.colors.dark_grey,
    fontSize: GlobalStyles.fontSizes.small,
  },
  signUpButton: {
    backgroundColor: GlobalStyles.colors.secondary,
    borderRadius: 20,
    padding: 10,
    width: '85%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  signUpText: {
    color: GlobalStyles.colors.white,
    fontSize: 15,
    fontWeight: 'bold',
  },
});
