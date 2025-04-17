import React from "react";
import { Card } from "@/shared/ui/shadcn/card";
import { ScrollArea } from "@/shared/ui/shadcn/scroll-area";
import { Input } from "@/shared/ui/shadcn/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/shadcn/select";
import { DataTable } from "@/shared/ui/shadcn/data-table";
import { ColumnDef } from "@tanstack/react-table";

interface DashboardCard {
  title: string;
  value: string | number;
  onClick?: () => void;
}

interface StatusOption {
  value: string;
  label: string;
}

type DashboardLayout = "default" | "full";

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
  dashboardLayout?: DashboardLayout;
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
  dashboardLayout = "default",
}) => {
  const getDashboardGridClass = () => {
    switch (dashboardLayout) {
      case "full":
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
      default:
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-4";
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      {description && (
        <p className="text-muted-foreground mb-6">{description}</p>
      )}

      {dashboardCards && (
        <div className={`grid ${getDashboardGridClass()} gap-4 mb-6`}>
          {dashboardCards.map((card, index) => (
            <Card
              key={index}
              className={`p-6 ${
                card.onClick ? "cursor-pointer hover:bg-gray-50" : ""
              }`}
              onClick={card.onClick}
            >
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                {card.title}
              </h3>
              <p className="text-2xl font-semibold">{card.value}</p>
            </Card>
          ))}
        </div>
      )}
      <Card className="p-6">
        <DataTable columns={columns} data={data} pagination={pagination} />
      </Card>
    </div>
  );
};

export default ManagementLayout;
