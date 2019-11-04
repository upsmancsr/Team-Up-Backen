import axios from 'axios';

export function signUpUser(userData, history) {
    axios.post('/api/users/signup', userData)
        .then(response => {
            history.push('/signin');      
        })
        .catch(error => {
            console.log(error);
        });
};

export function signInUser(userData, history) {
    axios.post("/api/users/signin", userData)
        .then(response => {
            // get token from api response:
            const { token } = response.data;
            // Assign token to jwtToken in localStorage:
            localStorage.setItem("jwtToken", token);
            // Assign token to axios auth header:
            toggleAuthHeader(token);
            history.push('/useraccount');
        })
        .catch(error => {
            console.log(error);
        });
};

export function toggleAuthHeader(token) {
    if (token !== false) {
        // Set axios Auth Header to the token:
        axios.defaults.headers.common['Authorization'] = token;
    } else {
        // Delete axios Auth Header:
        delete axios.defaults.headers.common['Authorization'];
    }
};

export function signOutUser() {
    // Remove the token stored in local storage:
    localStorage.removeItem("jwtToken");
    // Remove token from axios Auth Header:
    toggleAuthHeader(false);
    // history.push('/');
};