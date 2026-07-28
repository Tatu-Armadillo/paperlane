import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

import { cn } from "../../lib/utils";
import { buttonVariants } from "./button";

interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({ className, ...props }) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
);
Pagination.displayName = "Pagination";

interface PaginationContentProps extends React.HTMLAttributes<HTMLUListElement> {
  className?: string;
}

const PaginationContent = React.forwardRef<HTMLUListElement, PaginationContentProps>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} className={cn("flex flex-row items-center gap-1", className)} {...props} />
  )
);
PaginationContent.displayName = "PaginationContent";

interface PaginationItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  className?: string;
}

const PaginationItem = React.forwardRef<HTMLLIElement, PaginationItemProps>(
  ({ className, ...props }, ref) => <li ref={ref} className={cn("", className)} {...props} />
);
PaginationItem.displayName = "PaginationItem";

interface PaginationLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  className?: string;
  isActive?: boolean;
  size?: "icon" | "default" | "sm" | "lg"; // ajuste de acordo com seus variants
}

const PaginationLink: React.FC<PaginationLinkProps> = ({
  className,
  isActive,
  size = "icon",
  ...props
}) => (
  <a
    aria-current={isActive ? "page" : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? "outline" : "ghost",
        size,
      }),
      className
    )}
    {...props}
  />
);
PaginationLink.displayName = "PaginationLink";

interface PaginationPreviousNextProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  className?: string;
}

const PaginationPrevious: React.FC<PaginationPreviousNextProps> = ({ className, ...props }) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn("gap-1 pl-2.5", className)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span>Previous</span>
  </PaginationLink>
);
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext: React.FC<PaginationPreviousNextProps> = ({ className, ...props }) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn("gap-1 pr-2.5", className)}
    {...props}
  >
    <span>Next</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
);
PaginationNext.displayName = "PaginationNext";

interface PaginationEllipsisProps extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string;
}

const PaginationEllipsis: React.FC<PaginationEllipsisProps> = ({ className, ...props }) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};
