import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

// ============================================
// Order Table Headers
// ============================================

interface TableHeaderColumn {
  label: string;
  className?: string;
}

const ORDER_TABLE_COLUMNS: TableHeaderColumn[] = [
  { label: "Order", className: "px-4" },
  { label: "Customer", className: "hidden px-4 sm:table-cell" },
  { label: "Total", className: "hidden px-4 sm:table-cell" },
  { label: "Status", className: "px-4 text-center sm:text-left" },
  { label: "Date", className: "hidden px-4 md:table-cell" },
];

export function OrderTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        {ORDER_TABLE_COLUMNS.map((column) => (
          <TableHead key={column.label} className={column.className}>
            {column.label}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
}

// ============================================
// Product/Inventory Table Headers
// ============================================

const PRODUCT_TABLE_COLUMNS: TableHeaderColumn[] = [
  { label: "Image", className: "hidden w-16 sm:table-cell" },
  { label: "Product" },
  { label: "Price", className: "hidden w-28 md:table-cell" },
  { label: "Stock", className: "hidden w-28 md:table-cell" },
  { label: "Featured", className: "hidden w-16 lg:table-cell" },
  { label: "Actions", className: "hidden w-[140px] text-right sm:table-cell" },
];

export function ProductTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        {PRODUCT_TABLE_COLUMNS.map((column) => (
          <TableHead key={column.label} className={column.className}>
            {column.label}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
}
