export interface Menu {
  id: number;
  title: string;
  path: string;
  parentId?: number;
  order: number;
  children?: Menu[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MenuFormData {
  title: string;
  path: string;
  parentId?: number;
  order: number;
}

export interface MenuGroup {
  title: string;
  items: MenuItem[];
}

export interface MenuItem {
  title: string;
  path: string;
} 