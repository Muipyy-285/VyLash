/**
 * Snap Camera Kit Configuration
 * 
 * Manages configuration for Snap Camera Kit AR integration.
 */

export const snapConfig = {
    // API Token from Snap Camera Kit Portal
    apiToken: import.meta.env.VITE_SNAP_API_TOKEN || '',

    // Group ID (shared across all lenses)
    groupId: import.meta.env.VITE_SNAP_GROUP_ID || '',

    /**
     * Validate configuration
     * @returns {boolean} True if configured correctly
     */
    isConfigured() {
        const errors = this.getConfigErrors();
        return errors.length === 0;
    },

    /**
     * Get configuration errors
     * @returns {string[]} Array of error messages
     */
    getConfigErrors() {
        const errors = [];

        if (!this.apiToken) {
            errors.push('VITE_SNAP_API_TOKEN is not set in .env file');
        }

        if (!this.groupId) {
            errors.push('VITE_SNAP_GROUP_ID is not set in .env file');
        }

        return errors;
    }
};

export default snapConfig;
