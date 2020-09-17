const apiVersion = 'v1';
const apiBaseUrl = process.env.SGMR_DATA_API_BASE_URL || 'http://0.0.0.0:5000';

// disabling linter as we cannot export default here (it doesn't work!)
// eslint-disable-next-line import/prefer-default-export
export const apiUrl = `${apiBaseUrl}/${apiVersion}`;
