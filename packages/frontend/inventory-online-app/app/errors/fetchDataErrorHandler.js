/**
 * Wraps an asynchronous function to handle API errors centrally.
 * * @param {Function} fn - The asynchronous function to execute (e.g., () => getData(...)).
 * @param {Function} [setIsLoading] - State setter function to toggle the loading state (e.g., setIsLoading).
 * @param {Function} [setErrorMessage] - State setter function to store the error message.
 * @returns {Promise<any|null>} Returns the function data on success, or null if an error occurs.
 */
const errorHandler = async (fn, setLoading = null, setErrorMsg = null) => {
    try {
        return await fn()
    } catch (error) {
        const status = error.status || error.response?.status
        const message = error.message || error.response?.data?.message || 'Error inesperado'

        if (setErrorMsg) {
            if (status === 404) {
                setErrorMsg('Recurso no encontrado');
            } else {
                setErrorMsg(message);
            }
        }
        return null
    } finally {
        if (setLoading) setLoading(false);
    }
}

export { errorHandler }