import api from './api';

export const jobApi = {
  createJob: (jobData) => api.post('/jobs/', jobData),
  
  updateJob: (jobId, jobData) => api.put(`/jobs/${jobId}/`, jobData),
  
  deleteJob: (jobId) => api.delete(`/jobs/${jobId}/`),
  
  getJobs: () => api.get('/jobs/'),
  
  getJobDetails: (jobId) => api.get(`/jobs/${jobId}/`),
  
  getMyPostedJobs: () => api.get('/jobs/my_posted_jobs/'),
  
  applyForJob: (jobId, coverLetter) => 
    api.post(`/jobs/${jobId}/apply/`, { cover_letter: coverLetter }),
};

export default jobApi; 