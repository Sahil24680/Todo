import React, { useEffect } from "react";
import { View, TouchableOpacity, Text, StyleSheet, Alert } from "react-native";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { useRouter,Stack } from "expo-router";
import supabase from "./supabaseClient"; 
WebBrowser.maybeCompleteAuthSession();

export default function GoogleSignIn() {
  // Configure Google Sign-In with your credentials
  const router = useRouter(); 
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: "437662742223-f4fsv3oivtft2slr2r24tb1doftphi7j.apps.googleusercontent.com", // iOS Client ID from Google Cloud Console
    redirectUri: "com.googleusercontent.apps.437662742223-f4fsv3oivtft2slr2r24tb1doftphi7j:/auth", // Redirect URI specific for iOS
    scopes: ["profile", "email"], // Permissions to access the user's profile and email
  });

  // Runs whenever the Google Sign-In response changes
  useEffect(() => {
    if (response?.type === "success") {
      // If the sign-in is successful
      const { authentication } = response;
      const { idToken } = authentication; // extracts idToken
  
      const authenticateWithSupabase = async () => {
        const { data, error } = await supabase.auth.signInWithIdToken({//signs in user with google id token
          provider: "google",
          token: idToken, // Pass the ID token
        });
  
        if (error) {
          console.error("Supabase login error:", error.message); //for debugging
          Alert.alert("Error", "Failed to log in to Supabase.");
          return; // Exit if there's an error
        }
  
        //console.log("Supabase login successful:", data); 
        //console.log("data:",data.user.id)
  
        router.replace("/home"); // Redirect to Home only on success
      };
  
      authenticateWithSupabase(); // Call the authentication function
      //console.log("Authentication Response:", response); // response for debugging
    } else if (response?.type === "error") {
      // If the sign-in fails
      Alert.alert("Error", "Login failed. Please try again."); // Notifies the user
      console.log("Authentication Error:", response?.error); // Log the error for debugging
    }
  }, [response]); // This runs whenever the `response` changes
  
















  return (
    <>
   
    <View style={styles.container}>
      {/* Button to trigger Google Sign-In */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          if (request) {
            promptAsync(); // Start the Google Sign-In process
          } else {
            console.log("OAuth request is not ready yet."); // Log if the request is not initialized
          }
        }}
      >
        <Text style={styles.buttonText}>Sign in with Google</Text>
      </TouchableOpacity>
    </View>
    </>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9", 
  },
  button: {
    backgroundColor: "#4285F4", 
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center", 
  },
  buttonText: {
    color: "#fff", 
    fontSize: 16, 
    fontWeight: "bold", 
  },
});
