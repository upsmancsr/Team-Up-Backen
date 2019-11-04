import axios from 'axios';

const initialState = {
    id: null,       // user._id in MongoDB 
    firstName: '',  
    lastName: '',
    email: '',
};
  
const SET_USER_INFO = 'SET_USER_INFO';

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_USER_INFO:
            return { 
                ...state, 
                id: action.payload._id,
                firstName: action.payload.firstName,
                lastName: action.payload.lastName,
                email: action.payload.email 
            };
        default:
            return state;
    }
};

export const setUserInfo = idToken => async dispatch => {
    const userInfo = await axios.get('api/users/currentuser');
    dispatch({ 
        type: SET_USER_INFO, 
        payload: userInfo.data 
    });
};