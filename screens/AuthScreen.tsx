import { useState } from 'react';
import { Alert, Button, Linking, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { usePreventScreenCapture } from 'expo-screen-capture';

const clientId = process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID;

async function githubPost(path: string, params: Record<string, string>) {
  const response = await fetch(`https://github.com${path}`, {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return response.json();
}

function ProtectedForm(props: { onSignIn: () => void }) {
  usePreventScreenCapture();
  return <LoginForm {...props} />;
}

export default function AuthScreen(props: { onSignIn: () => void }) {
  return Platform.OS === 'web' ? <LoginForm {...props} /> : <ProtectedForm {...props} />;
}

function LoginForm({ onSignIn }: { onSignIn: () => void }) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [code, setCode] = useState('');

  function loginWithPassword() {
    if (login.trim() === 'admin' && password === 'password') {
      onSignIn();
    } else {
      Alert.alert('Неверный логин или пароль');
    }
  }

  async function loginWithGitHub() {
    if (!clientId) {
      Alert.alert('Настройте EXPO_PUBLIC_GITHUB_CLIENT_ID');
      return;
    }

    setBusy(true);
    try {
      const device = await githubPost('/login/device/code', { client_id: clientId });
      if (!device.device_code || !device.user_code || !device.expires_in) {
        throw new Error('Проверьте Client ID и настройку Enable Device Flow.');
      }

      setCode(device.user_code);
      let interval = device.interval || 5;
      const expiresAt = Date.now() + device.expires_in * 1000;

      while (Date.now() + interval * 1000 < expiresAt) {
        await new Promise(resolve => setTimeout(resolve, interval * 1000));
        if (Date.now() >= expiresAt) break;

        const result = await githubPost('/login/oauth/access_token', {
          client_id: clientId,
          device_code: device.device_code,
          grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
        });

        if (result.access_token) {
          onSignIn();
          return;
        }
        if (result.error === 'slow_down') {
          interval += 5;
        } else if (result.error !== 'authorization_pending') {
          throw new Error('Вход не подтверждён. Попробуйте ещё раз.');
        }
      }
      throw new Error('Код истёк. Начните вход заново.');
    } catch (error) {
      Alert.alert('Вход через GitHub', error instanceof Error ? error.message : 'Не удалось войти');
    } finally {
      setCode('');
      setBusy(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Аптека</Text>
      <Text style={styles.subtitle}>Войдите, чтобы продолжить</Text>
      <TextInput style={styles.input} placeholder="Логин" value={login} onChangeText={setLogin} autoCapitalize="none" autoCorrect={false} />
      <TextInput style={styles.input} placeholder="Пароль" value={password} onChangeText={setPassword} secureTextEntry autoCapitalize="none" autoCorrect={false} />
      <Button title="Войти" onPress={loginWithPassword} disabled={busy} />
      <Text style={styles.subtitle}>или</Text>
      <Button title={busy ? 'Ожидаем подтверждения' : 'Войти через GitHub'} onPress={loginWithGitHub} disabled={busy} />
      {code ? (
        <View>
          <Text style={styles.subtitle} selectable>Введи этот код на GitHub: {code}</Text>
          <Button title="Открыть GitHub" onPress={() => Linking.openURL('https://github.com/login/device').catch(() => Alert.alert('Не удалось открыть GitHub'))} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 26, fontWeight: 'bold', textAlign: 'center' },
  subtitle: { textAlign: 'center', marginVertical: 16 },
  input: { backgroundColor: '#f5f5f5', borderRadius: 8, padding: 12, marginBottom: 12 },
});
