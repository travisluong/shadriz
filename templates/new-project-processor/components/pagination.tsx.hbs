"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import { useState } from "react";

export function Pagination({
  page,
  totalPages,
  pageSize,
  count,
}: {
  page: number;
  totalPages: number;
  pageSize: number;
  count: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [pageValue, setPageValue] = useState<string>(page.toString());
  const [pageSizeValue, setPageSizeValue] = useState<string>(
    pageSize.toString()
  );

  function first() {
    const params = new URLSearchParams(searchParams);
    const newPage = "1";
    params.set("page", newPage);
    setPageValue(newPage);
    router.push(`${pathname}?${params.toString()}`);
  }

  function previous() {
    const params = new URLSearchParams(searchParams);
    const newPage = (page - 1).toString();
    params.set("page", newPage);
    setPageValue(newPage);
    router.push(`${pathname}?${params.toString()}`);
  }

  function next() {
    const params = new URLSearchParams(searchParams);
    const newPage = (page + 1).toString();
    params.set("page", newPage);
    setPageValue(newPage);
    router.push(`${pathname}?${params.toString()}`);
  }

  function last() {
    const params = new URLSearchParams(searchParams);
    const newPage = totalPages.toString();
    params.set("page", newPage);
    setPageValue(newPage);
    router.push(`${pathname}?${params.toString()}`);
  }

  function handlePageKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      const params = new URLSearchParams(searchParams);
      const num = parseInt(pageValue);
      if (Number.isInteger(num)) {
        params.set("page", num.toString());
        router.push(`${pathname}?${params.toString()}`);
      } else {
        params.set("page", "1");
        router.push(`${pathname}?${params.toString()}`);
        setPageValue("1");
      }
    }
  }

  function handlePageSizeKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      const params = new URLSearchParams(searchParams);
      const num = parseInt(pageSizeValue);
      if (Number.isInteger(num)) {
        params.set("pageSize", num.toString());
        router.push(`${pathname}?${params.toString()}`);
      } else {
        params.set("pageSize", "1");
        router.push(`${pathname}?${params.toString()}`);
        setPageSizeValue("1");
      }
    }
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="text-nowrap">
        {count} {count === 1 ? "row" : "rows"}
      </div>
      <div>
        <Button
          variant="secondary"
          size="icon"
          onClick={first}
          disabled={page <= 1}
        >
          <ChevronsLeftIcon className="h-4 w-4" />
        </Button>
      </div>
      <div>
        <Button
          variant="secondary"
          size="icon"
          onClick={previous}
          disabled={page <= 1}
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>
      </div>
      <div className="text-nowrap">
        <Input
          name="page"
          className="w-14"
          value={pageValue}
          onChange={(e) => setPageValue(e.target.value)}
          onKeyDown={handlePageKeyDown}
        />
      </div>
      <div className="text-nowrap">of {totalPages}</div>
      <div>
        <Button
          variant="secondary"
          size="icon"
          onClick={next}
          disabled={page >= totalPages}
        >
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </div>
      <div>
        <Button
          variant="secondary"
          size="icon"
          onClick={last}
          disabled={page >= totalPages}
        >
          <ChevronsRightIcon className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Input
          name="pageSize"
          value={pageSizeValue}
          className="w-14"
          onChange={(e) => setPageSizeValue(e.target.value)}
          onKeyDown={handlePageSizeKeyDown}
        />
        <div className="text-nowrap">per page</div>
      </div>
    </div>
  );
}
