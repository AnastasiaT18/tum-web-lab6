const BASE_URL = 'https://tum-web-lab6-production.up.railway.app/api';

let token = null;   

async function getToken() { 

    if (token) return token;

    const res = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include' // Important for sending cookies
        });

    if (!res.ok) return null;

    const data = await res.json();
    token = data.accessToken;
    return token;
}

async function authFetch(path, options = {}) {
    const currentToken = await getToken();
    
    const res = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentToken}`,
            ...options.headers
    }
});

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
    register: (email, password) => fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email, password}),
    }).then(res => res.json()),


    login: (email, password) => fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email, password}),
    }).then(res => res.json()),


    logout: () => fetch(`${BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res.json())


 }

