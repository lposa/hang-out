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

export const PROFILE_INPUT_VALIDATION_RULES = {
  firstName: {
    required: 'Name is required',
  },
  lastName: {
    required: 'Name is required',
  },
  birthday: {
    required: 'Birthday is required',
    validate: (value: any) => {
      if (!value || typeof value !== 'string') {
        return 'Birthday is required';
      }
      const birthDate = new Date(value);
      if (isNaN(birthDate.getTime())) {
        return 'Invalid date';
      }
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        const actualAge = age - 1;
        if (actualAge < 13) {
          return 'You must be at least 13 years old';
        }
      } else if (age < 13) {
        return 'You must be at least 13 years old';
      }
      
      if (birthDate > today) {
        return 'Birthday cannot be in the future';
      }
      
      return true;
    },
  },
};
