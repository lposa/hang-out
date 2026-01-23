import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { supabase } from '@/services/Supabase';
import { HangOutLogo } from '@/svg/logo';
import { useInputValidation } from '@/hooks/useInputValidation';

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { email, password, handleEmailChange, handlePasswordChange, inputErrors, validateFields } =
    useInputValidation();

  const signInWithEmail = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      Alert.alert(`Something went wrong - ${error.message}`);
    }

    setLoading(false);
    router.replace('/(tabs)/home');
  };

  const handleSubmit = async () => {
    const isValid = validateFields();
    if (!isValid) return;

    await signInWithEmail();
  };

  return (
    <LinearGradient
      colors={['#82D0EE', '#3AAAD9']}
      start={[0, 0]}
      end={[1, 0]}
      style={styles.container}
    >
      <View style={styles.content}>
        <HangOutLogo style={styles.logo} height={100} />
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

        <View style={styles.form}>
          <TextInput
            style={[styles.input, inputErrors.email && { borderColor: 'red', borderWidth: 1 }]}
            placeholder="Email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={handleEmailChange}
            onBlur={validateFields}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {inputErrors.email && <Text style={styles.errorText}>{inputErrors.email}</Text>}

          <TextInput
            style={[styles.input, inputErrors.password && { borderColor: 'red', borderWidth: 1 }]}
            placeholder="Password"
            placeholderTextColor="#999"
            value={password}
            onChangeText={handlePasswordChange}
            onBlur={validateFields}
            secureTextEntry
          />

          {inputErrors.password && <Text style={styles.errorText}>{inputErrors.password}</Text>}

          <Pressable
            style={[styles.loginButton, !!inputErrors && { opacity: 0.5 }]}
            onPress={handleSubmit}
            disabled={loading || !!inputErrors}
          >
            <LinearGradient
              colors={['#FFC371', '#FF5F6D', '#D92550']}
              start={[0, 0.5]}
              end={[1, 0.5]}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Sign In</Text>
            </LinearGradient>
          </Pressable>

          <Pressable onPress={() => router.push('/(auth)/register')}>
            <Text style={styles.linkText}>
              Don&#39;t have an account? <Text style={styles.linkBold}>Sign Up</Text>
            </Text>
          </Pressable>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 40,
    textAlign: 'center',
    opacity: 0.9,
  },
  form: {
    width: '100%',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
  },
  loginButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
    marginBottom: 24,
  },
  buttonGradient: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkText: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.9,
  },
  linkBold: {
    fontWeight: 'bold',
  },
  logo: {
    marginBottom: 50,
    marginHorizontal: 'auto',
  },
  errorText: {
    color: '#FFECEC',
    backgroundColor: 'rgba(255, 0, 0, 0.5)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 8,
    fontSize: 13,
  },
});
