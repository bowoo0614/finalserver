'use client';

import { useState } from 'react';
import axios from 'axios';

interface FeedCreateProps {
  onSuccess: () => void;
}

export default function FeedCreate({ onSuccess }: FeedCreateProps) {
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    content?: string;
  }>({});

  const validateForm = () => {
    const errors: { name?: string; content?: string } = {};

    if (!name.trim()) {
      errors.name = '이름을 입력해주세요.';
    } else if (name.trim().length > 50) {
      errors.name = '이름은 50자를 초과할 수 없습니다.';
    }

    if (!content.trim()) {
      errors.content = '내용을 입력해주세요.';
    } else if (content.trim().length > 1000) {
      errors.content = '내용은 1000자를 초과할 수 없습니다.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      await axios.post('http://localhost:3000/feeds', {
        name: name.trim(),
        content: content.trim(),
      });

      // 폼 초기화
      setName('');
      setContent('');
      setValidationErrors({});
      
      // 성공 시 글보기 탭으로 이동
      onSuccess();
    } catch (err: any) {
      console.error('Error creating feed:', err);
      setError(
        err.response?.data?.message || 
        '글 작성에 실패했습니다. 다시 시도해주세요.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 이름 입력 */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            이름
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              validationErrors.name
                ? 'border-red-300 focus:ring-red-500'
                : 'border-gray-300'
            }`}
            placeholder="이름을 입력하세요"
            disabled={loading}
          />
          {validationErrors.name && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
          )}
        </div>

        {/* 내용 입력 */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            내용
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
              validationErrors.content
                ? 'border-red-300 focus:ring-red-500'
                : 'border-gray-300'
            }`}
            placeholder="내용을 입력하세요"
            disabled={loading}
          />
          <div className="flex justify-between items-center mt-1">
            {validationErrors.content && (
              <p className="text-sm text-red-600">{validationErrors.content}</p>
            )}
            <p className={`text-sm ml-auto ${
              content.length > 1000 ? 'text-red-500' : 'text-gray-500'
            }`}>
              {content.length}/1000
            </p>
          </div>
        </div>

        {/* 오류 메시지 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* 제출 버튼 */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
            loading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              작성 중...
            </div>
          ) : (
            '글 작성하기'
          )}
        </button>
      </form>
    </div>
  );
}
