import * as React from 'react';

import { OAuthProvider } from "firebase/auth";
import * as AppleAuthentication from 'expo-apple-authentication';

import { socialSignIn } from '../../../database';


export default function AppleButton() {

    return (
        <AppleAuthentication.AppleAuthenticationButton
            buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
            buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
            cornerRadius={5}
            style={{ width: 200, height: 44 }}
            onPress={() => {
                AppleAuthentication.signInAsync({
                    requestedScopes: [
                        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                        AppleAuthentication.AppleAuthenticationScope.EMAIL,
                    ],
                    nonce: 'da homies',
                }).then((credential) => {
                    console.log("cred is");
                    console.log(credential);
                    // signed in

                    const provider = new OAuthProvider('apple.com');
                    const authCredential = provider.credential({
                        idToken: credential.identityToken,
                        rawNonce: 'da homies',
                    });
                    socialSignIn(authCredential);
                }).catch((err) => {

                    alert("Error Signin In with Apple")
                });;

            }}
        />
    );
}
