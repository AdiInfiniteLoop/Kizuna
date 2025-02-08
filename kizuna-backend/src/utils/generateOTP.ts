export const generateOTP = (): string => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();  // Generates a 6-digit OTP
    return otp;
};
