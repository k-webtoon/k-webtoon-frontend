import React, { useMemo, useState } from 'react';
import { ManagementLayout } from '@/components/admin/ManagementLayout';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import {
  CommentStatus,
  CommentStatusEnum,
  commentStatusColors,
  commentStatusLabels,
  Comment
} from '@/entities/admin/model/types';

const CommentManagement: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<CommentStatus | ''>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 더미 데이터 생성
  const comments: Comment[] = useMemo(() => {
    const statuses = Object.values(CommentStatusEnum);
    const authors = ['김독자', '이독자', '박독자', '최독자', '정독자'];
    const webtoons = ['여신강림', '화산귀환', '나 혼자만 레벨업', '전지적 독자 시점', '갓 오브 하이스쿨'];
    
    return Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      content: `댓글 내용 ${i + 1}입니다. 이것은 더미 데이터입니다.`,
      author: authors[i % authors.length],
      webtoonTitle: webtoons[i % webtoons.length],
      status: statuses[i % statuses.length],
      reportCount: Math.floor(Math.random() * 10),
      likes: Math.floor(Math.random() * 100),
      createdAt: new Date(2024, 0, 1 + Math.floor(i / 2)),
      updatedAt: new Date(2024, 0, 1 + Math.floor(i / 2) + (Math.random() > 0.7 ? 1 : 0)),
    }));
  }, []);

  const filteredComments = useMemo(() => {
    return comments.filter(comment => {
      const matchesSearch =
        comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comment.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comment.webtoonTitle.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = !statusFilter || comment.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [comments, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    const total = comments.length;
    const reported = comments.filter(c => c.status === CommentStatusEnum.REPORTED).length;
    const hidden = comments.filter(c => c.status === CommentStatusEnum.HIDDEN).length;
    const resolved = comments.filter(c => c.status === CommentStatusEnum.RESOLVED).length;

    return { total, reported, hidden, resolved };
  }, [comments]);

  const dashboardCards = [
    {
      title: '전체 댓글',
      value: stats.total,
      description: '총 댓글 수',
      onClick: () => setStatusFilter('')
    },
    {
      title: '신고된 댓글',
      value: stats.reported,
      description: '처리 대기 중',
      onClick: () => setStatusFilter(CommentStatusEnum.REPORTED)
    },
    {
      title: '숨김 처리된 댓글',
      value: stats.hidden,
      description: '사용자/운영자에 의해 숨겨짐',
      onClick: () => setStatusFilter(CommentStatusEnum.HIDDEN)
    },
    {
      title: '처리 완료된 댓글',
      value: stats.resolved,
      description: '신고 처리 완료',
      onClick: () => setStatusFilter(CommentStatusEnum.RESOLVED)
    }
  ];

  const columns: ColumnDef<Comment>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
    },
    {
      accessorKey: 'content',
      header: '내용',
      cell: ({ row }) => (
        <div className="max-w-md truncate">{row.original.content}</div>
      ),
    },
    {
      accessorKey: 'author',
      header: '작성자',
    },
    {
      accessorKey: 'webtoonTitle',
      header: '웹툰',
    },
    {
      accessorKey: 'status',
      header: '상태',
      cell: ({ row }) => {
        const status = row.original.status;
        const { bg, text } = commentStatusColors[status];
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>
            {commentStatusLabels[status]}
          </span>
        );
      },
    },
    {
      accessorKey: 'reportCount',
      header: '신고 수',
    },
    {
      accessorKey: 'likes',
      header: '좋아요',
    },
    {
      accessorKey: 'createdAt',
      header: '작성일',
      cell: ({ row }) => row.original.createdAt.toLocaleDateString(),
    },
    {
      accessorKey: 'updatedAt',
      header: '수정일',
      cell: ({ row }) => row.original.updatedAt.toLocaleDateString(),
    },
  ];

  const statusOptions = Object.values(CommentStatusEnum).map(status => ({
    value: status,
    label: commentStatusLabels[status]
  }));

  const paginatedData = filteredComments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredComments.length / itemsPerPage);

  return (
    <ManagementLayout
      title="댓글 관리"
      description="웹툰 댓글을 관리하고 모니터링합니다."
      dashboardCards={[
        {
          title: "전체 댓글",
          value: stats.total,
          onClick: () => setStatusFilter('')
        },
        {
          title: "신고된 댓글",
          value: stats.reported,
          onClick: () => setStatusFilter(CommentStatusEnum.REPORTED)
        },
        {
          title: "숨김 처리된 댓글",
          value: stats.hidden,
          onClick: () => setStatusFilter(CommentStatusEnum.HIDDEN)
        },
        {
          title: "처리 완료된 댓글",
          value: stats.resolved,
          onClick: () => setStatusFilter(CommentStatusEnum.RESOLVED)
        }
      ]}
      statusOptions={[
        { value: 'active', label: '활성' },
        { value: 'reported', label: '신고됨' },
        { value: 'hidden', label: '숨김' },
        { value: 'resolved', label: '해결됨' },
      ]}
      columns={columns}
      data={paginatedData}
      filter={{
        status: statusFilter,
        search: searchTerm,
      }}
      onFilterChange={(newFilter) => {
        setStatusFilter(newFilter.status);
        setSearchTerm(newFilter.search);
      }}
      pagination={{
        page: currentPage,
        limit: itemsPerPage,
        total: filteredComments.length,
        onPageChange: setCurrentPage,
      }}
    />
  );
};

export default CommentManagement; 