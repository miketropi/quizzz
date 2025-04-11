import { useState } from 'react';
import { aiAPI } from '../libs';

function Home() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (event) => {
    setPrompt(event.target.value);
  };

  const handleGenerateQuiz = async () => {
    if (prompt.trim()) {
      setIsGenerating(true);
      setError(null);
      setQuiz(null);
      
      try {
        // Sử dụng AI API để tạo bài kiểm tra
        const generatedQuiz = await aiAPI.generateQuiz(prompt);
        setQuiz(generatedQuiz);
      } catch (err) {
        console.error('Không thể tạo bài kiểm tra:', err);
        setError('Không thể tạo bài kiểm tra. Vui lòng thử lại với yêu cầu khác.');
      } finally {
        setIsGenerating(false);
      }
    }
  };

  return (
    <>
      {/* Phần Giới Thiệu */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 md:py-20">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4 sm:mb-6">
            Tạo Bài Kiểm Tra <span className="text-indigo-600">Trong Vài Giây</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-2">
            Tận dụng sức mạnh của AI để tạo nội dung bài kiểm tra tương tác từ những yêu cầu đơn giản.
            Hoàn hảo cho giáo viên, người sáng tạo nội dung và những tâm hồn tò mò.
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-4 sm:p-6 md:p-8">
            <div className="mb-4 sm:mb-6">
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-4">
                Nhập chủ đề hoặc môn học của bạn 
                <span className=" ml-2 bg-gray-100 px-2 py-1 rounded-md border border-gray-300">
                  version beta, giới hạn tối đa 15 câu hỏi.
                </span>
              </label>
              <textarea
                id="prompt"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                value={prompt}
                onChange={handleInputChange}
                placeholder="Ví dụ: 'Tạo bài kiểm tra 5 câu hỏi về hệ mặt trời' hoặc 'Tạo câu hỏi kiểm tra về Thế Chiến II cho học sinh trung học'"
                rows={3}
                style={{fontSize: 'clamp(14px, 2vw, 16px)'}}
              />
            </div>

            <button
              onClick={handleGenerateQuiz}
              disabled={isGenerating || !prompt.trim()}
              className={`w-full flex justify-center items-center py-2 sm:py-3 px-3 sm:px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${
                isGenerating || !prompt.trim() ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-sm sm:text-base">Đang tạo...</span>
                </>
              ) : (
                <span className="text-sm sm:text-base">Tạo Bài Kiểm Tra</span>
              )}
            </button>
            
            {error && (
              <div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded text-sm sm:text-base">
                {error}
              </div>
            )}
          </div>
        </div>
        
        {/* Hiển thị bài kiểm tra đã tạo */}
        {quiz && (
          <div className="max-w-3xl mx-auto mt-6 sm:mt-8 bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-4 sm:p-6 md:p-8">
              <h2 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">{quiz.title}</h2>
              <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">{quiz.description}</p>
              
              <div className="space-y-4 sm:space-y-6">
                {quiz.questions.map((question, qIndex) => (
                  <div key={qIndex} className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                    <h3 className="font-medium mb-2 sm:mb-3 text-sm sm:text-base">
                      {qIndex + 1}. {question.question}
                    </h3>
                    <div className="space-y-2">
                      {question.options.map((option, oIndex) => (
                        <div 
                          key={oIndex}
                          className={`p-2 sm:p-3 rounded border text-sm sm:text-base ${
                            oIndex === question.correctAnswer 
                              ? 'bg-green-100 border-green-300' 
                              : 'bg-white border-gray-300'
                          }`}
                        >
                          {option}
                          {oIndex === question.correctAnswer && (
                            <span className="ml-1 sm:ml-2 text-green-600 font-medium text-xs sm:text-sm">(Đúng)</span>
                          )}
                        </div>
                      ))}
                      
                      {question.explanation && (
                        <p className="text-gray-600 mt-4 sm:mt-6 mb-1 sm:mb-2 text-xs sm:text-sm">
                          Giải thích: {question.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Phần Tính Năng */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-8 sm:mb-12">Tính Năng Chính</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">Nhanh Như Chớp</h3>
            <p className="text-gray-600 text-sm sm:text-base">Tạo bài kiểm tra hoàn chỉnh trong vài giây, không phải hàng giờ. Tiết kiệm thời gian cho việc tạo nội dung.</p>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">Nội Dung Thông Minh</h3>
            <p className="text-gray-600 text-sm sm:text-base">AI phân tích yêu cầu của bạn để tạo các câu hỏi liên quan, chính xác và mang tính giáo dục.</p>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">Tùy Chỉnh Linh Hoạt</h3>
            <p className="text-gray-600 text-sm sm:text-base">Xác định độ khó, loại câu hỏi và chủ đề để tạo bài kiểm tra hoàn hảo cho nhu cầu của bạn.</p>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home; 