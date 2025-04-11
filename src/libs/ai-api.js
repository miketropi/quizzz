import API from './api-class';

/**
 * AI API service for handling AI-related API calls
 * @extends API
 */
class AIAPI extends API {
  /**
   * Create a new AIAPI instance
   * @param {string} provider - AI provider ('deepseek' or 'openai')
   */
  constructor(provider = 'deepseek') {
    let baseURL, apiKey;
    
    // Configure based on provider
    if (provider === 'openai') {
      baseURL = 'https://api.openai.com/v1';
      apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    } else {
      // Default to DeepSeek
      baseURL = 'https://api.deepseek.com/v1';
      apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
    }
    
    super({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      timeout: 60000, // Longer timeout for AI operations
      onError: (error) => {
        // Specific error handling for AI API errors
        if (error.response) {
          console.error('AI API Error:', error.response.status, error.response.data);
        } else if (error.request) {
          console.error('AI API Request Error:', error.request);
        } else {
          console.error('AI API General Error:', error.message);
        }
        return Promise.reject(error);
      }
    });
    
    this.provider = provider;
  }

  /**
   * Generate text using the AI provider
   * @param {Object} params - Generation parameters
   * @param {string} params.prompt - The prompt to generate from
   * @param {number} params.maxTokens - Maximum tokens to generate
   * @param {number} params.temperature - Randomness temperature
   * @returns {Promise} - Generated text
   */
  generateText(params) {
    const { prompt, maxTokens = 1000, temperature = 0.7 } = params;
    
    // Format the request based on provider
    let endpoint, payload;
    
    if (this.provider === 'openai') {
      endpoint = '/chat/completions';
      payload = {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: maxTokens,
        temperature,
      };
    } else {
      // DeepSeek format
      endpoint = '/chat/completions';
      payload = {
        model: 'deepseek-chat',
        messages: [
          { role: "system", content: "You are a helpful assistant, You are an expert in creating test questions for multiple choice questions."},
          { role: 'user', content: prompt }
        ],
        max_tokens: maxTokens,
        temperature,
        response_format: {
          type: "json_object"
        },
      };
    }
    
    return this.post(endpoint, payload)
      .then(response => {
        // Extract the actual text from the response based on provider
        if (this.provider === 'openai') {
          return response.data.choices[0].message.content;
        } else {
          // DeepSeek format
          return response.data.choices[0].message.content;
        }
      });
  }

  /**
   * analysis the text of user input and return the topic and question count
   * @param {string} text - User input text
   * @returns {Promise} - Topic and question count
   */
  analysisText(text) {
    const prompt = `
    "${text}"
    - **Text Analysis**: Analyze the user's input and extract the topic and question count.
    - **Response Format**: Return the topic and question count as a JSON object with the following structure:
    {
      "topic": "Quiz topic here",
      "questionCount": 5
    }
    `;

    return this.generateText({ prompt, maxTokens: 1000, temperature: 0.7 });
  }
  

  /**
   * Generate a quiz using AI
   * @param {string} topic - Quiz topic
   * @param {number} questionCount - Number of questions to generate
   * @returns {Promise} - Generated quiz data
   */
  async generateQuiz(topic) {

    const analysis = await this.analysisText(topic);
    const response = JSON.parse(analysis);

    let questionCount = 5;
    if(response?.questionCount) {
      questionCount = parseInt(response.questionCount) > 15 ? 15 : parseInt(response.questionCount);
    }

    const prompt = `Create a quiz of multiple-choice questions on the topic of "${response.topic}".
    - **Number of Questions**: ${questionCount}.
    - **Language Detection**: Ensure that the quiz is created in the correct language based on the topic.
    - **Response Format**: Format the quiz as a JSON object with the following structure:
    {
      "title": "Quiz title here",
      "description": "Brief description of the quiz",
      "questions": [
        {
          "question": "Question text",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswer": 0, // Index of the correct answer in the options array
          "explanation": "Explanation of the correct answer"
        }
      ]
    }
    `;
    
    return this.generateText({ 
      prompt,
      maxTokens: 2000,
      temperature: 0.7
    }).then(text => {
      // Extract and parse JSON from the response
      try {
        // Find JSON part of the response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
        throw new Error('No valid JSON found in response');
      } catch (error) {
        console.error('Failed to parse AI response:', error);
        throw new Error('Failed to generate quiz: Invalid response format');
      }
    });
  }
}

// Export the class directly so users can create instances with different providers
export default AIAPI; 