import axios from 'axios'


export const instance = axios.create({
    baseURL: 'http://localhost:4941/api/v1',

});

export function setAuthHeader(value){
    instance.defaults.headers.common['X-Authorization'] = value;
}

export default {
    register: (registerData) => instance.post('users/register', registerData),
    login: (loginData) => instance.post('users/login', loginData),
    logout: () => instance.post(`users/logout`),
    getUser: (id) => instance.get(`users/${id}`, null),
    modifyUser: (id, userData) => instance.patch(`users/${id}`, userData),
    getUserImage: (id) => instance.get(`users/${id}/image`, {
        responseType: 'arraybuffer'}),
    modifyUserImage: (id, imageData, imageTypeString) => instance.put(`users/${id}/image`, imageData, {
        headers: { 'Content-Type': `${imageTypeString}` }}),
    deleteUserImage: (id) => instance.delete(`users/${id}/image`),
    searchEvents: (searchQuery, sortOptions) => instance.get(`events`, {params: {q: searchQuery, sortBy: sortOptions}}),
    filterEvents: (filterQuery, sortOptions) => instance.get(`events`, {params: {categoryIds: filterQuery, sortBy: sortOptions}}),
    searchFilterEvents: (searchQuery, filterQuery, sortOptions) => instance.get(`events`, {params: {q: searchQuery, categoryIds: filterQuery, sortBy: sortOptions}}),
    getAllEvents: (sortOptions) => instance.get(`events`, {params: {sortBy: sortOptions}}),
    createEvent: (eventData) => instance.post('events', eventData),
    getCategories: () => instance.get('events/categories'),
    getEvent: (id) => instance.get(`/events/${id}`),
    getSimilarEvents: (filterQuery) => instance.get(`events`, {params: {categoryIds: filterQuery, sortBy: 'DATE_ASC'}}),
    modifyEvent: (id, eventData) => instance.patch(`/events/${id}`, eventData),
    deleteEvent: (id) => instance.delete(`/events/${id}`),
    getEventImage: (id) => instance.get(`/events/${id}/image`, {
        responseType: 'arraybuffer'}),
    modifyEventImage: (id, imageData, imageTypeString) => instance.put(`/events/${id}/image`, imageData, {
        headers: { 'Content-Type': `${imageTypeString}` }}),
    getAttendees: (id) => instance.get(`/events/${id}/attendees`),
    createAttendee: (id) => instance.post(`/events/${id}/attendees`),
    deleteAttendee: (id) => instance.delete(`/events/${id}/attendees`),
    modifyAttendee: (eventId, userId) => instance.patch(`/events/${eventId}/attendees/${userId}`),
}



