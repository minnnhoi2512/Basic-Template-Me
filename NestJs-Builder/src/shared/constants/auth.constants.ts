export const AUTH_CONSTANTS = {
  JWT_EXPIRES_IN: '1d',
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  UNAUTHORIZED_MESSAGE: {
    en: 'Invalid or expired token',
    vi: 'Token không hợp lệ hoặc đã hết hạn',
  },
}; 