import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { supabase } from '@/services/Supabase';

type Errors = {
  email?: string;
  password?: string;
  confirmPassword?: string;
};

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [inputErrors, setInputErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState('');

  const validateFields = () => {
    const newErrors: Errors = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setInputErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function signUpWithEmail() {
    setLoading(true);
    setServerError('');

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setServerError(error.message);
      setLoading(false);
      return;
    }

    if (!data.session) {
      Alert.alert('Please check your inbox for email verification!');
      router.replace('/(auth)/login');
    } else {
      router.replace('/(tabs)/home');
    }

    setLoading(false);
  }

  const handleOnSubmit = async () => {
    const isValid = validateFields();
    if (!isValid) return;

    await signUpWithEmail();
  };

  return (
    <LinearGradient
      colors={['#82D0EE', '#3AAAD9']}
      start={[0, 0]}
      end={[1, 0]}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Sign up to get started</Text>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (inputErrors.email) setInputErrors((prev) => ({ ...prev, email: undefined }));
            }}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {inputErrors.email && <Text style={styles.errorText}>{inputErrors.email}</Text>}

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (inputErrors.password)
                setInputErrors((prev) => ({ ...prev, password: undefined }));
            }}
            secureTextEntry
          />
          {inputErrors.password && <Text style={styles.errorText}>{inputErrors.password}</Text>}

          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#999"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              if (inputErrors.confirmPassword)
                setInputErrors((prev) => ({ ...prev, confirmPassword: undefined }));
            }}
            secureTextEntry
          />
          {inputErrors.confirmPassword && (
            <Text style={styles.errorText}>{inputErrors.confirmPassword}</Text>
          )}

          <Pressable
            style={[styles.registerButton, loading && { opacity: 0.7 }]}
            onPress={handleOnSubmit}
            disabled={loading}
          >
            <LinearGradient
              colors={['#FFC371', '#FF5F6D', '#D92550']}
              start={[0, 0.5]}
              end={[1, 0.5]}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>{loading ? 'Signing Up...' : 'Sign Up'}</Text>
            </LinearGradient>
          </Pressable>

          {!!serverError && <Text style={styles.errorText}>{serverError}</Text>}

          <Pressable onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.linkText}>
              Already have an account? <Text style={styles.linkBold}>Sign In</Text>
            </Text>
          </Pressable>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
  form: { width: '100%' },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 8,
  },
  registerButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
    marginBottom: 16,
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
  errorText: {
    color: '#FFECEC',
    backgroundColor: 'rgba(255, 0, 0, 0.3)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 8,
    fontSize: 13,
  },
  linkText: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.9,
  },
  linkBold: { fontWeight: 'bold' },
});
