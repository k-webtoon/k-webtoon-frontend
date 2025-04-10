import { create } from 'zustand';

interface SidebarState {
  openGroups: string[];
  toggleGroup: (groupTitle: string) => void;
}

export const useSidebarStore = create<SidebarState>((set: any) => ({
  openGroups: ['사용자 관리'],
  toggleGroup: (groupTitle: string) =>
    set((state: SidebarState) => ({
      openGroups: state.openGroups.includes(groupTitle)
        ? state.openGroups.filter((title: string) => title !== groupTitle)
        : [...state.openGroups, groupTitle],
    })),
})); 