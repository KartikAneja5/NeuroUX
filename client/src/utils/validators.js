export const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
export const validatePassword = (pass) => pass.length >= 6;
