// Email validation function
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Name validation function
export const validateName = (name) => {
  return name.trim().length > 0;
};

// Phone validation function
export const validatePhoneNumber = (phoneNumber) => {
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
  return phoneRegex.test(phoneNumber) && phoneNumber.replace(/\D/g, '').length >= 10;
};
