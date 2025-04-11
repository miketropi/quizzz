import API from './api-class';
import quizAPI from './quiz-api';
import AIAPI from './ai-api';

// Create default AI API instance with DeepSeek
const aiAPI = new AIAPI();

// Export all API services
export {
  API,      // Base API class for extending
  quizAPI,  // Quiz API singleton
  aiAPI,    // Default AI API instance with DeepSeek
  AIAPI     // AI API class for creating custom instances
};

// Example usage in components:
/*
import { quizAPI, aiAPI } from '@/libs';

// Using quiz API
const generateQuiz = async (prompt) => {
  try {
    const quiz = await quizAPI.generateQuiz(prompt);
    return quiz;
  } catch (error) {
    console.error('Quiz generation failed:', error);
    throw error;
  }
};

// Using AI API
const generateQuizWithAI = async (topic, questionCount) => {
  try {
    const quiz = await aiAPI.generateQuiz(topic, questionCount);
    return quiz;
  } catch (error) {
    console.error('AI quiz generation failed:', error);
    throw error;
  }
};
*/ 