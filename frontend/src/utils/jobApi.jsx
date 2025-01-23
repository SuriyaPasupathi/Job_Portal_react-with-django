import api from './api';

export const jobApi = {
  getAllJobs: () => api.get('/jobs/'),
  getJob: (id) => api.get(`/jobs/${id}/`),
  createJob: (jobData) => api.post('/jobs/', jobData),
  updateJob: (id, jobData) => api.put(`/jobs/${id}/`, jobData),
  deleteJob: (id) => api.delete(`/jobs/${id}/`),
  applyForJob: (id, applicationData) => api.post(`/jobs/${id}/apply/`, applicationData),
}; 