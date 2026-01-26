export const INPUT_VALIDATION_RULES = {
  email: {
    required: 'Email is required',
    pattern: {
      value: /\S+@\S+\.\S+/,
      message: 'Enter a valid email',
    },
  },

  password: {
    required: 'Password is required',
    minLength: {
      value: 6,
      message: 'Password must be at least 6 characters',
    },
  },

  confirmPassword: (passwordValue: string) => ({
    required: 'Confirm password is required',
    validate: (value: string) => value === passwordValue || 'Passwords do not match',
  }),
};
