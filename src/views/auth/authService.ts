import api from '../../api/api';
import router from '../../router';

/**
 * @interface LoginCredentials
 * @description Defines the structure for the login payload, ensuring type safety.
 */
interface LoginCredentials {
    username: string;
    password: string;
}

/**
 * @interface AuthResponse
 * @description Defines the expected structure of a successful login response from the API.
 */
interface AuthResponse {
    token: string;
    // You can add other properties you expect from the login response, e.g.:
    // user: { id: number; name: string; username: string; };
}

const TOKEN_KEY = 'token'; // Use a constant for the localStorage key to avoid typos.

const AuthServices = {
    /**
     * @description Sends user credentials to the login endpoint.
     * @param {LoginCredentials} credentials - The user's username and password.
     * @returns {Promise<AuthResponse>} A promise that resolves with the authentication token and user data.
     */
    login(credentials: LoginCredentials ): Promise<{ data: AuthResponse }> {
        return api.post('/login', credentials );
    },

    /**
     * @description Logs the user out by removing the token and redirecting to the home page.
     * This function handles all logout-related side effects.
     */
    logout(): void {
        // 1. Remove the token from local storage.
        localStorage.removeItem(TOKEN_KEY);

        // 2. (Optional but recommended) Clear any user-related state in your application.
        // For example, if using Pinia:
        // const userStore = useUserStore();
        // userStore.clearUser();

        // 3. Redirect the user to the login page or home page.
        // Using replace() is often better than push() for logout, as it prevents the user
        // from using the browser's "back" button to return to a protected page.
        router.replace({ name: 'login' }); // Assuming your login route is named 'login'
    },

    /**
     * @description Fetches the profile of the currently authenticated user.
     * The request interceptor in 'http.ts' should automatically add the auth token.
     * @returns {Promise} A promise that resolves with the user's profile data.
     */
    getProfile( ) {
        return api.get('/auth/me' );
    },

    /**
     * @description Retrieves the authentication token from local storage.
     * @returns {string | null} The token, or null if it doesn't exist.
     */
    getToken(): string | null {
        return localStorage.getItem(TOKEN_KEY);
    },

    /**
     * @description Checks if a user is currently authenticated (i.e., a token exists).
     * @returns {boolean} True if a token exists, false otherwise.
     */
    isAuthenticated(): boolean {
        // The double negation (!!) converts a truthy/falsy value to a strict boolean.
        return !!this.getToken();
    }
};

export default AuthServices;
