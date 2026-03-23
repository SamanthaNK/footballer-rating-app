export const isValidEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email.trim());
};

export const isValidPassword = (password) => {
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    return password.length >= 8 && hasLetter && hasNumber;
};

export const validateRegister = ({ fullName, email, password }) => {
    if (!fullName?.trim() || fullName.trim().length < 2) {
        return 'Full name must be at least 2 characters.';
    }
    if (!isValidEmail(email)) {
        return 'Please enter a valid email address.';
    }
    if (!isValidPassword(password)) {
        return 'Password must be 8+ characters with a letter and a number.';
    }
    return null;
};

export const validateLogin = ({ email, password }) => {
    if (!isValidEmail(email)) {
        return 'Please enter a valid email address.';
    }
    if (!password) {
        return 'Password is required.';
    }
    return null;
};