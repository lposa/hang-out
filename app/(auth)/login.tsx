import { FormInput } from '@/components/elements';
import { LoaderSpinner } from '@/components/elements/LoaderSpinner';
import { INPUT_VALIDATION_RULES } from '@/constants';
import { supabase } from '@/services/Supabase';
import { HangOutLogo } from '@/svg/logo';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

type LoginFormData = {
  email: '';
  password: '';
};

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    setLoading(true);
    const { email, password } = data;

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      Alert.alert(`Something went wrong - ${error.message}`);
    } else {
      router.replace('/(tabs)/home');
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <HangOutLogo style={styles.logo} height={100} />
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

        <View style={styles.form}>
          <FormInput
            control={control}
            name="email"
            placeholder="Email"
            rules={INPUT_VALIDATION_RULES.email}
          />

          {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

          <FormInput
            control={control}
            name="password"
            placeholder="Password"
            secureTextEntry
            rules={INPUT_VALIDATION_RULES.password}
          />

          {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

          <Pressable
            style={[styles.loginButton, (loading || !isValid) && { opacity: 0.5 }]}
            onPress={handleSubmit(onSubmit)}
            disabled={loading || !isValid}
          >
            <LinearGradient
              colors={['#FFC371', '#FF5F6D', '#D92550']}
              start={[0, 0.5]}
              end={[1, 0.5]}
              style={styles.buttonGradient}
            >
              {loading ? (
                <LoaderSpinner size={24} color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Sign In</Text>
              )}
            </LinearGradient>
          </Pressable>

          <Pressable onPress={() => router.push('/(auth)/register')}>
            <Text style={styles.linkText}>
              Don&#39;t have an account? <Text style={styles.linkBold}>Sign Up</Text>
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: { fontSize: 16, color: '#FFFFFF', marginBottom: 40, textAlign: 'center', opacity: 0.9 },
  form: { width: '100%' },

  loginButton: { borderRadius: 12, overflow: 'hidden', marginTop: 8, marginBottom: 24 },
  buttonGradient: { padding: 16, alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  linkText: { color: '#FFFFFF', fontSize: 14, textAlign: 'center', opacity: 0.9 },
  linkBold: { fontWeight: 'bold' },
  logo: { marginBottom: 50, marginHorizontal: 'auto' },
  errorText: {
    color: '#FFECEC',
    backgroundColor: 'rgba(255, 0, 0, 0.5)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 13,
  },
});
