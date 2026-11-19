import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './navigation/RootNavigator';
import AuthScreen from './screens/AuthScreen';

export default function App() {
  const [signedIn, setSignedIn] = useState(false);

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      {signedIn ? <RootNavigator /> : <AuthScreen onSignIn={() => setSignedIn(true)} />}
    </SafeAreaProvider>
  );
}
