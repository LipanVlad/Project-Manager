async function authenticatedFetch(url, config = {}) {
    const token = localStorage.getItem('jwt');

    if (!token) {
        window.location.href = '/login';
        return;
    }
    const headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`,
    };
    const finalConfig = {
        ...config,
        headers
    };

    const response = await fetch(url, finalConfig);

    if (response.status === 401) {
        localStorage.removeItem('jwt');
        window.location.href = '/login';
    }

    return response;
}
