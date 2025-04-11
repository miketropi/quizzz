import API from './api-class';

/**
 * Quiz API service for handling quiz-related API calls
 * @extends API
 */
class QuizAPI extends API {
  /**
   * Create a new QuizAPI instance
   */
  constructor() {
    // You would replace this with your actual API URL
    const baseURL = import.meta.env.VITE_API_URL || 'https://api.example.com';
    
    super({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      // Optional callbacks
      onRequest: (config) => {
        // You can modify the request config here
        console.log('Request being sent:', config);
        return config;
      },
      onResponse: (response) => {
        // You can process all responses here
        console.log('Response received:', response.status);
        return response;
      },
      onError: (error) => {
        // Handle common errors here
        console.error('API Error:', error.message);
        // You could implement retry logic, error notifications, etc.
        return Promise.reject(error);
      }
    });
  }

  /**
   * Generate a quiz from a prompt
   * @param {string} prompt - Quiz generation prompt
   * @returns {Promise} - Quiz data
   */
  generateQuiz(prompt) {
    return this.post('/quiz/generate', { prompt })
      .then(response => response.data);
  }

  /**
   * Get quizzes for the current user
   * @returns {Promise} - List of quizzes
   */
  getUserQuizzes() {
    return this.get('/quiz/user')
      .then(response => response.data);
  }

  /**
   * Get a specific quiz by ID
   * @param {string} quizId - Quiz ID
   * @returns {Promise} - Quiz data
   */
  getQuiz(quizId) {
    return this.get(`/quiz/${quizId}`)
      .then(response => response.data);
  }

  /**
   * Save a quiz
   * @param {Object} quizData - Quiz data
   * @returns {Promise} - Saved quiz
   */
  saveQuiz(quizData) {
    return this.post('/quiz', quizData)
      .then(response => response.data);
  }

  /**
   * Update a quiz
   * @param {string} quizId - Quiz ID
   * @param {Object} quizData - Updated quiz data
   * @returns {Promise} - Updated quiz
   */
  updateQuiz(quizId, quizData) {
    return this.put(`/quiz/${quizId}`, quizData)
      .then(response => response.data);
  }

  /**
   * Delete a quiz
   * @param {string} quizId - Quiz ID
   * @returns {Promise} - Delete confirmation
   */
  deleteQuiz(quizId) {
    return this.delete(`/quiz/${quizId}`)
      .then(response => response.data);
  }
}

// Create singleton instance
const quizAPI = new QuizAPI();

export default quizAPI; 