import { useState, useCallback } from 'react';

type InputErrors = {
  email?: string;
  password?: string;
  confirmPassword?: string;
};

export const useInputValidation = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [inputErrors, setInputErrors] = useState<InputErrors>({});

  /**
   * Clears a specific error message by field name.
   * This is useful for clearing errors as the user types in an input.
   */
  const clearError = useCallback(
    (fieldName: keyof InputErrors) => {
      if (inputErrors[fieldName]) {
        setInputErrors((prevErrors) => {
          const newErrors = { ...prevErrors };
          delete newErrors[fieldName];
          return newErrors;
        });
      }
    },
    [inputErrors]
  );

  /**
   * Handlers for each input field. They update the state and clear
   * any existing error for that field.
   */
  const handleEmailChange = useCallback(
    (text: string) => {
      setEmail(text);
      clearError('email');
    },
    [clearError]
  );

  const handlePasswordChange = useCallback(
    (text: string) => {
      setPassword(text);
      clearError('password');
    },
    [clearError]
  );

  const handleConfirmPasswordChange = useCallback(
    (text: string) => {
      setConfirmPassword(text);
      clearError('confirmPassword');
    },
    [clearError]
  );

  /**
   * Performs validation on all fields.
   * Updates the `inputErrors` state and returns `true` if all fields are valid,
   * `false` otherwise.
   */
  const validateFields = useCallback((): boolean => {
    const newErrors: InputErrors = {};

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
  }, [email, password, confirmPassword]);

  return {
    email,
    password,
    confirmPassword,
    handleEmailChange,
    handlePasswordChange,
    handleConfirmPasswordChange,
    inputErrors,
    validateFields,
  };
};
