// const BASE_URL = 'https://tum-web-lab6-production.up.railway.app/api';
const BASE_URL = 'http://localhost:3000/api';


let accessToken = null;  

export async function initAuth(){
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include' // Important for sending cookies
    });

    if (!res.ok) {
        console.log('Failed to refresh token:', res.status);
        return null;}
    const data = await res.json();
    accessToken = data.accessToken;
    return data;
}



async function authFetch(path, options = {}) {
    
    const res = await fetch(`${BASE_URL}${path}`, {
        ...options,
        credentials: 'include', // Important for sending cookies
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            ...options.headers
        }
    });

    if (res.status === 401) {
        const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
            method: 'POST',
            credentials: 'include' // Important for sending cookies
        });

        if (!refreshRes.ok) {
            accessToken = null; // Clear the token if refresh fails
            throw new Error('SESSION_EXPIRED');
        }

        const refreshData = await refreshRes.json();
        accessToken = refreshData.accessToken;

        // Retry the original request with the new token
        const retryRes = await fetch(`${BASE_URL}${path}`, {
            ...options,
            credentials: 'include', // Important for sending cookies
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                ...options.headers
            }
        });

        if (!retryRes.ok) {
            const errorData = await retryRes.json().catch(() => ({}));
            throw new Error(errorData.error || errorData.message || `Request failed: ${retryRes.status}`);
        }

        if (retryRes.status === 204) return null; // No content
        return retryRes.json();
    }


    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || `Request failed: ${res.status}`);
    }

    if (res.status === 204) return null; // No content
    return res.json();
 }

 //Workouts
 export const api = {
    getWorkouts: () => authFetch('/workouts?limit=100&offset=0'),
    getWorkout: (id) => authFetch(`/workouts/${id}`),
    createWorkout: (workout) => authFetch('/workouts', {
        method: 'POST',
        body: JSON.stringify(workout)
    }),

    deleteWorkout: (id) => authFetch(`/workouts/${id}`, {
        method: 'DELETE'
    }),

    updateWorkout: (id, data) => authFetch(`/workouts/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data)
    }),

    //Exercises
    getExercises: () => authFetch('/exercises?limit=100&offset=0'),
    createExercise: (exercise) => authFetch('/exercises', {
        method: 'POST',
        body: JSON.stringify(exercise)
    }),

    deleteExercise: (id) => authFetch(`/exercises/${id}`, {
        method: 'DELETE'
    }),

    //Muscles
    getMuscles: () => authFetch('/muscles'),

    //Auth - no token needed
    register: async (email, password) => {
        const res = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email, password}),
        });

        const data = await res.json();
        accessToken = data.accessToken; // Store the access token for future requests
        return data;
    },



    login: async (email, password) => {
        const res = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email, password}),
        });

        const data = await res.json();
        accessToken = data.accessToken; // Store the access token for future requests
        return data;
    },

    logout: async () => {
        accessToken = null; // Clear the access token on logout
        await fetch(`${BASE_URL}/auth/logout`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        })}
 }

