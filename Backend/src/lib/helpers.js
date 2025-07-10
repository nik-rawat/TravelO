// helpers.js

/**
 * Error handler function to handle and log errors
 * @param {Error} error - The error object to be handled
 * @param {string} context - The context in which the error occurred
 */
export const errorHandler = (error, context) => {
    console.error(`Error in ${context}:`, error);
    // You can also add additional error handling logic here, such as:
    // - Sending error reports to a monitoring service
    // - Logging errors to a file or database
    // - Displaying error messages to the user
  };