import { USER_STATUS } from './appUser';

export const userStatusLabels: Record<typeof USER_STATUS[keyof typeof USER_STATUS], string> = {
  active: '활성',
  dormant: '휴면',
  suspended: '정지'
};

export const userStatusColors: Record<typeof USER_STATUS[keyof typeof USER_STATUS], { bg: string; text: string }> = {
  active: { bg: 'bg-green-100', text: 'text-green-800' },
  dormant: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  suspended: { bg: 'bg-red-100', text: 'text-red-800' }
}; 