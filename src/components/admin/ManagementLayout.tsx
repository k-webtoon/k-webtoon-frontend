import React from 'react';
import { Card } from "@/shared/ui/shadcn/card";
import { ScrollArea } from "@/shared/ui/shadcn/scroll-area";
import { Input } from "@/shared/ui/shadcn/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/shadcn/select";
import { DataTable } from "@/shared/ui/shadcn/data-table";
import { ColumnDef } from '@tanstack/react-table';

interface DashboardCard {
  title: string;
  value: string | number;
  onClick?: () => void;
}

interface StatusOption {
  value: string;
  label: string;
}

interface ManagementLayoutProps {
  title: string;
  description?: string;
  dashboardCards?: DashboardCard[];
  statusOptions?: StatusOption[];
  columns: ColumnDef<any>[];
  data: any[];
  filter: {
    status?: string;
    search?: string;
  };
  onFilterChange: (filter: any) => void;
  pagination: {
    page: number;
    limit: number;
    total: number;
    onPageChange: (page: number) => void;
  };
}

export const ManagementLayout: React.FC<ManagementLayoutProps> = ({
  title,
  description,
  dashboardCards,
  statusOptions,
  columns,
  data,
  filter,
  onFilterChange,
  pagination,
}) => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      {description && (
        <p className="text-muted-foreground mb-6">{description}</p>
      )}
      
      {dashboardCards && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {dashboardCards.map((card, index) => (
            <Card 
              key={index} 
              className={`p-6 ${card.onClick ? 'cursor-pointer hover:bg-gray-50' : ''}`}
              onClick={card.onClick}
            >
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                {card.title}
              </h3>
              <p className="text-2xl font-semibold">
                {card.value}
              </p>
            </Card>
          ))}
        </div>
      )}

      <Card className="p-6 mb-6">
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="검색어를 입력하세요"
              value={filter.search || ''}
              onChange={(e) => onFilterChange({ ...filter, search: e.target.value })}
              className="w-full"
            />
          </div>
          {statusOptions && (
            <div className="w-[200px]">
              <Select
                value={filter.status || 'all'}
                onValueChange={(value) => onFilterChange({ ...filter, status: value === 'all' ? '' : value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="상태 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </Card>

      <Card className="p-6">
        <DataTable
          columns={columns}
          data={data}
          pagination={pagination}
        />
      </Card>
    </div>
  );
};

export default ManagementLayout; 