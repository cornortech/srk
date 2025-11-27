import { Button } from '@nextui-org/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface TablePaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function TablePagination({
  page,
  totalPages,
  onPageChange,
}: TablePaginationProps) {
  if (totalPages <= 1) return null; // hide if only 1 page

  return (
    <div className="flex items-center justify-center gap-4 mt-4">
      <Button
        size="sm"
        variant="flat"
        isDisabled={page <= 1}
        onPress={() => onPageChange(page - 1)}
        className="hover:bg-green-600 hover:text-white"
      >
        <ArrowLeft size={16} /> Prev
      </Button>

      <span className="text-sm font-medium">
        Page {page} of {totalPages}
      </span>

      <Button
        size="sm"
        variant="flat"
        isDisabled={page >= totalPages}
        onPress={() => onPageChange(page + 1)}
        className="hover:bg-green-600 hover:text-white"
      >
        Next <ArrowRight size={16} />
      </Button>
    </div>
  );
}
