import {Button, Text, TouchableOpacity, View} from 'react-native';
import {useEffect, useState} from 'react';
import {authorize} from 'react-native-app-auth';
import auth from '@react-native-firebase/auth';
import React from 'react';

// Google: https://nearform.com/open-source/react-native-app-auth/docs/providers/google
const googleServices = require('../../android/app/google-services.json');
const GOOGLE_OAUTH_APP_GUID =
  googleServices.client[0].oauth_client[0].client_id.split('.')[0];
// const GOOGLE_OAUTH_APP_GUID = '216296903544-55p9hbjml00s0m89291ijifa1t070ha8';

const authConfig = {
  google: {
    issuer: 'https://accounts.google.com',
    clientId: `${GOOGLE_OAUTH_APP_GUID}.apps.googleusercontent.com`,
    redirectUrl: `com.googleusercontent.apps.${GOOGLE_OAUTH_APP_GUID}:/oauth2redirect/google`,
    scopes: ['openid', 'profile', 'email'],
  },
};

export default function AuthScreen() {
  // Google Sign-in handler
  const handleGoogleSignIn = async () => {
    try {
      // Get the user's ID token
      const {idToken} = await authorize(authConfig.google);

      // Build Firebase credential with ID token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign in with Firebase
      const userCredential = await auth().signInWithCredential(
        googleCredential,
      );
      console.log('Google Firebase user: ', userCredential.user);
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  // GitHub Sign-in handler
  const handleGithubSignIn = async () => {
    try {
      // const provider = new GithubAuthProvider();
      // provider.addScope('repo'); // Add desired GitHub scopes
      // Sign in with GitHub
      // const result = await signInWithRedirect(auth, provider);
      // Handle the result
      // console.log('GitHub sign-in successful:', result);
    } catch (error) {
      console.error('Error signing in with GitHub:', error);
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={handleGoogleSignIn}>
        <Text>Sign in with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleGithubSignIn}>
        <Text>Sign in with GitHub</Text>
      </TouchableOpacity>
    </View>
  );
}
