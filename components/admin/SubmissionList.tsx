'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { IntakeSubmission } from '@/types/form';
import { USER_TYPE_LABELS } from '@/types/form';
import StatusBadge from './StatusBadge';

interface SubmissionListProps {
  submissions: IntakeSubmission[];
  onDelete?: () => void;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function SubmissionList({ submissions, onDelete }: SubmissionListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`"${name}"님의 신청서를 삭제하시겠습니까?`)) {
      return;
    }

    setDeletingId(id);
    try {
      const response = await fetch(`/api/admin/submissions/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('삭제 실패');
      }

      onDelete?.();
    } catch (error) {
      console.error('Delete error:', error);
      alert('삭제 중 오류가 발생했습니다.');
    } finally {
      setDeletingId(null);
    }
  };

  if (submissions.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        제출 내역이 없습니다.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              상태
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              이름
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              유형
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              이메일
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              신청일
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              관리
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {submissions.map((submission) => (
            <tr key={submission.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={submission.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {submission.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {USER_TYPE_LABELS[submission.user_type]}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {submission.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(submission.created_at)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm space-x-3">
                <Link
                  href={`/admin/submissions/${submission.id}`}
                  className="text-blue-600 hover:text-blue-900"
                >
                  보기
                </Link>
                <button
                  onClick={() => handleDelete(submission.id, submission.name)}
                  disabled={deletingId === submission.id}
                  className="text-red-600 hover:text-red-900 disabled:opacity-50"
                >
                  {deletingId === submission.id ? '삭제중...' : '삭제'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
