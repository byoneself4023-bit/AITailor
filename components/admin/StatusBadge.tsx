import type { SubmissionStatus } from '@/types/form';
import { STATUS_LABELS } from '@/types/form';

interface StatusBadgeProps {
  status: SubmissionStatus;
}

const statusColors: Record<SubmissionStatus, string> = {
  new: 'bg-blue-100 text-blue-800',
  consulting: 'bg-yellow-100 text-yellow-800',
  contracted: 'bg-purple-100 text-purple-800',
  completed: 'bg-green-100 text-green-800',
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
