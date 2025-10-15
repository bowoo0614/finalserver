'use client';

import { useState } from 'react';
import FeedList from './components/FeedList';
import FeedCreate from './components/FeedCreate';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-gray-800 text-center">jbw 게시판</h1>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-md mx-auto flex">
          <button
            onClick={() => setActiveTab('list')}
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
              activeTab === 'list'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            글보기ㄹㅇ
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
              activeTab === 'create'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            글쓰기
          </button>
        </div>
      </nav>

      {/* Tab Content */}
      <main className="max-w-md mx-auto">
        {activeTab === 'list' ? (
          <FeedList />
        ) : (
          <FeedCreate onSuccess={() => setActiveTab('list')} />
        )}
      </main>
    </div>
  );
}
