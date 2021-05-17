import axios from 'axios'


export const instance = axios.create({
    baseURL: 'http://localhost:4941/api/v1',

});

export function setAuthHeader(value){
    instance.defaults.headers.common['X-Authorization'] = value;
}

export default {
    register: (registerData) => instance.post('users/register', registerData, {withCredentials: false}),
    login: (loginData) => instance.post('users/login', loginData, {withCredentials: false}),
    logout: () => instance.post(`users/logout`, {withCredentials: false}),
    getUser: (id) => instance.get(`users/${id}`, null),
    modifyUser: (id) => instance.patch(`users/${id}`, null),
    getUserImage: (id) => instance.get(`users/${id}/image`, null),
    modifyUserImage: (id) => instance.put(`users/${id}/image`),
    deleteUserImage: (id) => instance.delete(`users/${id}/image`),
    searchEvents: () => instance.get(`events`),
    createEvent: () => instance.post('events', ),
    getCategories: () => instance.get('events/categories', ),
    getEvent: (id) => instance.get(`/events/${id}`),
    modifyEvent: (id) => instance.patch(`/events/${id}`),
    deleteEvent: (id) => instance.delete(`/events/${id}`),
    getEventImage: (id) => instance.get(`/events/${id}/image`),
    modifyEventImage: (id) => instance.put(`/events/${id}/image`),
    getAttendees: (id) => instance.get(`/events/${id}/attendees`),
    createAttendee: (id) => instance.post(`/events/${id}/attendees`),
    deleteAttendee: (id) => instance.delete(`/events/${id}/attendees`),
    modifyAttendee: (eventId, userId) => instance.patch(`/events/${eventId}/attendees/${userId}`),
}



