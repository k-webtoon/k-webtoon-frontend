import { WebtoonStatus } from './webtoon';

export const webtoonStatusLabels: Record<WebtoonStatus, string> = {
  [WebtoonStatus.ACTIVE]: '연재중',
  [WebtoonStatus.INACTIVE]: '완결/숨김',
  [WebtoonStatus.DELETED]: '삭제됨',
  [WebtoonStatus.PENDING]: '승인대기',
  [WebtoonStatus.BLOCKED]: '블라인드'
};

export const webtoonStatusColors: Record<WebtoonStatus, { bg: string; text: string }> = {
  [WebtoonStatus.ACTIVE]: { bg: 'bg-green-100', text: 'text-green-800' },
  [WebtoonStatus.INACTIVE]: { bg: 'bg-blue-100', text: 'text-blue-800' },
  [WebtoonStatus.DELETED]: { bg: 'bg-red-100', text: 'text-red-800' },
  [WebtoonStatus.PENDING]: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  [WebtoonStatus.BLOCKED]: { bg: 'bg-purple-100', text: 'text-purple-800' }
}; 