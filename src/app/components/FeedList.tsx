'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

interface Feed {
  id: number;
  name: string;
  content: string;
  created_at: string;
}

interface Comment {
  id: number;
  content: string;
  feedId: number;
  order: number;
}

export default function FeedList() {
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [comments, setComments] = useState<Record<number, Comment[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>({});
  const [submittingComments, setSubmittingComments] = useState<Record<number, boolean>>({});

  const fetchFeeds = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get<Feed[]>('https://serverserver-production.up.railway.app/feeds');
      setFeeds(response.data);
    } catch (err) {
      setError('글을 불러오는데 실패했습니다.');
      console.error('Error fetching feeds:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (feedId: number) => {
    try {
      const response = await axios.get<Comment[]>(`https://serverserver-production.up.railway.app/feeds/${feedId}/comments`);
      setComments(prev => ({
        ...prev,
        [feedId]: response.data
      }));
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  const handleCommentSubmit = async (feedId: number) => {
    const content = commentInputs[feedId]?.trim();
    if (!content) return;

    try {
      setSubmittingComments(prev => ({ ...prev, [feedId]: true }));
      
      await axios.post(`https://serverserver-production.up.railway.app/feeds/${feedId}/comments`, {
        content,
      });

      // 댓글 입력창 초기화
      setCommentInputs(prev => ({ ...prev, [feedId]: '' }));
      
      // 댓글 목록 새로고침
      await fetchComments(feedId);
    } catch (err) {
      console.error('Error creating comment:', err);
    } finally {
      setSubmittingComments(prev => ({ ...prev, [feedId]: false }));
    }
  };

  const handleCommentInputChange = (feedId: number, value: string) => {
    setCommentInputs(prev => ({ ...prev, [feedId]: value }));
  };

  useEffect(() => {
    fetchFeeds();
  }, []);

  useEffect(() => {
    // 각 피드의 댓글을 가져옴
    feeds.forEach(feed => {
      fetchComments(feed.id);
    });
  }, [feeds]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">글을 불러오는 중...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchFeeds}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      {feeds.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">아직 작성된 글이 없습니다.</p>
          <p className="text-gray-400 text-sm mt-1">첫 번째 글을 작성해보세요!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {feeds.map((feed) => (
            <div
              key={feed.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-800 text-lg">{feed.name}</h3>
                <span className="text-xs text-gray-500 ml-2">
                  {formatDate(feed.created_at)}
                </span>
              </div>
              <div className="text-gray-700 whitespace-pre-wrap leading-relaxed mb-4">
                {feed.content}
              </div>

              {/* 댓글 섹션 */}
              <div className="border-t border-gray-100 pt-4">
                {/* 댓글 목록 */}
                {comments[feed.id] && comments[feed.id].length > 0 && (
                  <div className="space-y-2 mb-4">
                    {comments[feed.id].map((comment) => (
                      <div
                        key={comment.id}
                        className="bg-gray-50 rounded-md p-3 text-sm"
                      >
                        <div className="flex items-start justify-between mb-1">
                          <span className="font-medium text-gray-600">
                            #{comment.order}
                          </span>
                        </div>
                        <div className="text-gray-700 whitespace-pre-wrap">
                          {comment.content}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 댓글 입력창 */}
                <div className="flex gap-2">
                  <textarea
                    value={commentInputs[feed.id] || ''}
                    onChange={(e) => handleCommentInputChange(feed.id, e.target.value)}
                    placeholder="댓글을 입력하세요..."
                    rows={2}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
                    disabled={submittingComments[feed.id]}
                  />
                  <button
                    onClick={() => handleCommentSubmit(feed.id)}
                    disabled={!commentInputs[feed.id]?.trim() || submittingComments[feed.id]}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      !commentInputs[feed.id]?.trim() || submittingComments[feed.id]
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {submittingComments[feed.id] ? '등록중...' : '등록'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
