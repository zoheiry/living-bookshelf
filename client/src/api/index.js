const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

// Helper to get headers
const getHeaders = (token) => {
    const headers = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

// Generic request handler
const request = async (endpoint, options = {}) => {
    const { token, ...fetchOptions } = options;

    // Set default headers if not provided or merge them
    const headers = getHeaders(token);

    const config = {
        ...fetchOptions,
        headers: {
            ...headers,
            ...fetchOptions.headers
        }
    };

    const response = await fetch(`${API_URL}${endpoint}`, config);

    // Initial error handling
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || `Request failed: ${response.statusText}`);
    }

    // Return json if content exists, otherwise null (for some delete/void ops)
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        return response.json();
    }
    return response.text(); // or null
};

// Auth API
export const authApi = {
    login: (credentials) => request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
    }),
    signup: (credentials) => request('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify(credentials)
    })
};

// Books API
export const booksApi = {
    getAll: (token) => request('/api/books', { token }),
    getById: (id, token) => request(`/api/books/${encodeURIComponent(id)}`, { token }),
    create: (bookData, token) => request('/api/books', {
        method: 'POST',
        body: JSON.stringify(bookData),
        token
    }),
    update: (id, updates, token) => request(`/api/books/${encodeURIComponent(id)}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
        token
    }),
    delete: (id, token) => request(`/api/books/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        token
    })
};

// Settings API
export const settingsApi = {
    get: (token) => request('/api/settings', { token }),
    update: (settings, token) => request('/api/settings', {
        method: 'POST',
        body: JSON.stringify(settings),
        token
    }),
    triggerTestEmail: (token) => request('/api/settings/trigger-email', {
        method: 'POST',
        token
    })
};

// Excerpt API
export const excerptApi = {
    generate: (id, token) => request(`/api/excerpt/${encodeURIComponent(id)}`, { token })
};
