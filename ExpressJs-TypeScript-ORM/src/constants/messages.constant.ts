export const MESSAGES = {
  // User messages
  USER: {
    CREATED: "User created successfully",
    FETCHED: "User fetched successfully",
    FETCHED_ALL: "Users fetched successfully",
    UPDATED: "User updated successfully",
    DELETED: "User deleted successfully",
    NOT_FOUND: "User not found",
    ALREADY_EXISTS: "User already exists",
    INVALID_PASSWORD: "Invalid password format",
    INVALID_EMAIL: "Invalid email format",
    NO_VALID_FIELDS: "No valid fields to update",
    STATUS_UPDATED: "User status updated successfully",
  },
  USERS: {
    CREATED_SUCCESS: "User created successfully",
    FETCHED_SUCCESS: "User fetched successfully",
    UPDATED_SUCCESS: "User updated successfully",
    STATUS_UPDATED_SUCCESS: "User status updated successfully",
    CREATED_FAILED: "Failed to create user",
    FETCHED_FAILED: "Failed to fetch user",
    UPDATED_FAILED: "Failed to update user",
    STATUS_UPDATED_FAILED: "Failed to update user status",
    NOT_FOUND: "User not found",
    PASSWORD_REQUIRED: "Password is required",
    EMAIL_REQUIRED: "Email is required",
    INVALID_STATUS: "Invalid status value. Must be 'active' or 'inactive'",
  },
  // Auth messages
  AUTH: {
    LOGIN_SUCCESS: "Login successful",
    LOGIN_FAILED: "Login failed",
    INVALID_CREDENTIALS: "Invalid credentials",
    UNAUTHORIZED: "Unauthorized access",
  },
  // Error messages
  ERROR: {
    INTERNAL_SERVER: "Internal server error",
    VALIDATION: "Validation error",
    DUPLICATE_KEY: "Duplicate key error",
    NOT_FOUND: "Resource not found",
    UNAUTHORIZED: "Unauthorized access",
  },
  // Success messages
  SUCCESS: {
    OPERATION_COMPLETED: "Operation completed successfully",
  },
} as const; 