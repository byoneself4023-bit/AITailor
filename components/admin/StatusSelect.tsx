'use client';

import { useState } from 'react';
import type { SubmissionStatus } from '@/types/form';
import { STATUS_LABELS } from '@/types/form';

interface StatusSelectProps {
  submissionId: string;
  currentStatus: SubmissionStatus;
  onStatusChange?: (newStatus: SubmissionStatus) => void;
}

const statuses: SubmissionStatus[] = ['new', 'consulting', 'contracted', 'completed'];

export default function StatusSelect({ submissionId, currentStatus, onStatusChange }: StatusSelectProps) {
  const [status, setStatus] = useState<SubmissionStatus>(currentStatus);
  const [loading, setLoading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as SubmissionStatus;
    setLoading(true);

    try {
      const response = await fetch(`/api/admin/submissions/${submissionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setStatus(newStatus);
        onStatusChange?.(newStatus);
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <select
      value={status}
      onChange={handleChange}
      disabled={loading}
      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {statuses.map((s) => (
        <option key={s} value={s}>
          {STATUS_LABELS[s]}
        </option>
      ))}
    </select>
  );
}
