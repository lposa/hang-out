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

type RegisterFormData = {
  email: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterScreen() {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<RegisterFormData>({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const watchedPassword = watch('password');

  const onSubmit: SubmitHandler<RegisterFormData> = async (formData) => {
    setLoading(true);
    const { email, password } = formData;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    //TODO: Check if user exists on server side

    if (error) {
      Alert.alert(`Something went wrong - ${error.message}`);
    }

    if (!data.session) {
      Alert.alert('Please check your inbox for email verification!');
      router.replace('/(auth)/login');
    } else {
      router.replace('/(tabs)/home');
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <HangOutLogo style={styles.logo} height={100} />

        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Sign up to get started</Text>

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

          <FormInput
            control={control}
            name="confirmPassword"
            placeholder="Confirm Password"
            secureTextEntry
            rules={INPUT_VALIDATION_RULES.confirmPassword(watchedPassword)}
          />

          {errors.confirmPassword && (
            <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>
          )}

          <Pressable
            style={[styles.registerButton, (loading || !isValid) && { opacity: 0.5 }]}
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
                <Text style={styles.buttonText}>Sign Up</Text>
              )}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#000000',
    marginBottom: 40,
    textAlign: 'center',
    opacity: 0.9,
  },
  form: { width: '100%' },

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
    backgroundColor: 'rgba(255, 0, 0, 0.5)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 13,
  },
  linkText: {
    color: '#000000',
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.9,
  },
  linkBold: { fontWeight: 'bold' },
  logo: {
    marginBottom: 50,
    marginHorizontal: 'auto',
  },
});
