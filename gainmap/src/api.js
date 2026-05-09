const BASE_URL = 'http://localhost:3000/api';

let token = null;   

async function getToken() { 

    if (token) return token;

    const res = await fetch(`${BASE_URL}/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: 'ADMIN' })
    });

    const data = await res.json();
    token = data.token;
    return token;
}

async function authFetch(path, options = {}) {
    const token = await getToken();
    
    const res = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
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


 }

