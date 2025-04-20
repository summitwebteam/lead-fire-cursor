
import { useState } from "react";
import { Check, Columns } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type ColumnConfig = {
  id: string;
  label: string;
  visible: boolean;
};

type LeadsColumnEditorProps = {
  columns: ColumnConfig[];
  onChange: (columns: ColumnConfig[]) => void;
};

export function LeadsColumnEditor({ columns, onChange }: LeadsColumnEditorProps) {
  const toggleColumn = (columnId: string) => {
    const updatedColumns = columns.map((column) => {
      if (column.id === columnId) {
        return { ...column, visible: !column.visible };
      }
      return column;
    });
    onChange(updatedColumns);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Columns className="h-4 w-4 mr-2" />
          Columns
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {columns.map((column) => (
          <DropdownMenuCheckboxItem
            key={column.id}
            checked={column.visible}
            onCheckedChange={() => toggleColumn(column.id)}
          >
            {column.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
