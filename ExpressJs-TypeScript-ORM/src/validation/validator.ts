export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;


export const validateEmail = (email: string): boolean => emailRegex.test(email);

export const validatePassword = (password: string): boolean =>
  passwordRegex.test(password);
