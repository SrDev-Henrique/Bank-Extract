import type * as React from "react";
import {
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink as LinkBase,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type PaginationComponentProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function PaginationComponent({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationComponentProps) {
  const goTo = (page: number, e: React.MouseEvent) => {
    e.preventDefault();
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <LinkBase
            onClick={(e) => goTo(1, e)}
            aria-label="Go to first page"
            isDisabled={currentPage === 1}
          >
            <button type="button">
              <ChevronFirstIcon size={16} />
            </button>
          </LinkBase>
        </PaginationItem>

        <PaginationItem>
          <LinkBase
            onClick={(e) => goTo(currentPage - 1, e)}
            aria-label="Go to previous page"
            isDisabled={currentPage === 1}
          >
            <button type="button">
              <ChevronLeftIcon size={16} />
            </button>
          </LinkBase>
        </PaginationItem>

        <PaginationItem>
          <Select
            value={String(currentPage)}
            onValueChange={(value) => onPageChange(Number(value))}
            aria-label="Select page"
          >
            <SelectTrigger id="select-page" className="w-fit whitespace-nowrap">
              <SelectValue placeholder="Page" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <SelectItem key={page} value={String(page)}>
                    {page}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </PaginationItem>

        <PaginationItem>
          <LinkBase
            onClick={(e) => goTo(currentPage + 1, e)}
            aria-label="Go to next page"
            isDisabled={currentPage === totalPages}
          >
            <button type="button">
              <ChevronRightIcon size={16} />
            </button>
          </LinkBase>
        </PaginationItem>

        <PaginationItem>
          <LinkBase
            onClick={(e) => goTo(totalPages, e)}
            aria-label="Go to last page"
            isDisabled={currentPage === totalPages}
          >
            <button type="button">
              <ChevronLastIcon size={16} />
            </button>
          </LinkBase>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
