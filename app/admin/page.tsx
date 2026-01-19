'use client';

import { useState, useEffect, useCallback } from 'react';
import type { IntakeSubmission, SubmissionStatus } from '@/types/form';
import { STATUS_LABELS } from '@/types/form';
import SubmissionList from '@/components/admin/SubmissionList';

type StatusFilter = SubmissionStatus | 'all';

interface ApiResponse {
  data: IntakeSubmission[];
  counts: {
    all: number;
    new: number;
    consulting: number;
    contracted: number;
    completed: number;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const filterTabs: { key: StatusFilter; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'new', label: '신규' },
  { key: 'consulting', label: '상담중' },
  { key: 'contracted', label: '계약' },
  { key: 'completed', label: '완료' },
];

export default function AdminDashboardPage() {
  const [submissions, setSubmissions] = useState<IntakeSubmission[]>([]);
  const [counts, setCounts] = useState<ApiResponse['counts']>({
    all: 0, new: 0, consulting: 0, contracted: 0, completed: 0
  });
  const [pagination, setPagination] = useState<ApiResponse['pagination']>({
    page: 1, limit: 10, total: 0, totalPages: 0
  });
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [loading, setLoading] = useState(true);

  const fetchSubmissions = useCallback(async (status: StatusFilter, page: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: page.toString() });
      if (status !== 'all') {
        params.set('status', status);
      }

      const response = await fetch(`/api/admin/submissions?${params}`);
      if (response.ok) {
        const data: ApiResponse = await response.json();
        setSubmissions(data.data);
        setCounts(data.counts);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch submissions:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubmissions(filter, 1);
  }, [filter, fetchSubmissions]);

  const handleFilterChange = (newFilter: StatusFilter) => {
    setFilter(newFilter);
  };

  const handlePageChange = (newPage: number) => {
    fetchSubmissions(filter, newPage);
  };

  return (
    <div className="space-y-6">
      {/* 상태별 카운트 */}
      <div className="grid grid-cols-5 gap-4">
        {filterTabs.map(({ key, label }) => (
          <div
            key={key}
            className="bg-white rounded-lg shadow px-4 py-3 text-center"
          >
            <div className="text-2xl font-bold text-gray-900">
              {counts[key]}
            </div>
            <div className="text-sm text-gray-500">{label}</div>
          </div>
        ))}
      </div>

      {/* 필터 탭 */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            {filterTabs.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => handleFilterChange(key)}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                  ${filter === key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {label}
                <span className="ml-2 text-xs">
                  ({counts[key]})
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* 제출 목록 */}
        <div className="p-6">
          {loading ? (
            <div className="text-center py-12 text-gray-500">
              로딩 중...
            </div>
          ) : (
            <SubmissionList
                submissions={submissions}
                onDelete={() => fetchSubmissions(filter, pagination.page)}
              />
          )}
        </div>

        {/* 페이지네이션 */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              총 {pagination.total}개 중 {((pagination.page - 1) * pagination.limit) + 1}-
              {Math.min(pagination.page * pagination.limit, pagination.total)}개
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                이전
              </button>
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 border rounded-md text-sm ${
                    pagination.page === page
                      ? 'border-blue-500 bg-blue-50 text-blue-600'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                다음
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
