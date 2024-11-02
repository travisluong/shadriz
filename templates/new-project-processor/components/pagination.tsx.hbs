"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";

export function Pagination({
  page,
  totalPages,
  pageSize,
}: {
  page: number;
  totalPages: number;
  pageSize: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  function first() {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  }

  function previous() {
    const params = new URLSearchParams(searchParams);
    params.set("page", (page - 1).toString());
    router.push(`${pathname}?${params.toString()}`);
  }

  function next() {
    const params = new URLSearchParams(searchParams);
    params.set("page", (page + 1).toString());
    router.push(`${pathname}?${params.toString()}`);
  }

  function last() {
    const params = new URLSearchParams(searchParams);
    params.set("page", totalPages.toString());
    router.push(`${pathname}?${params.toString()}`);
  }

  function changePage(e: React.ChangeEvent<HTMLInputElement>) {
    const params = new URLSearchParams(searchParams);
    params.set("page", e.target.value);
    router.push(`${pathname}?${params.toString()}`);
  }

  function changePageSize(str: string) {
    const params = new URLSearchParams(searchParams);
    params.set("pageSize", str);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex items-center gap-5">
      <div>
        <Button
          variant="outline"
          size="icon"
          onClick={first}
          disabled={page <= 1}
        >
          <ChevronsLeftIcon className="h-4 w-4" />
        </Button>
      </div>
      <div>
        <Button
          variant="outline"
          size="icon"
          onClick={previous}
          disabled={page <= 1}
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>
      </div>
      <div>
        <Button
          variant="outline"
          size="icon"
          onClick={next}
          disabled={page >= totalPages}
        >
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </div>
      <div>
        <Button
          variant="outline"
          size="icon"
          onClick={last}
          disabled={page >= totalPages}
        >
          <ChevronsRightIcon className="h-4 w-4" />
        </Button>
      </div>
      <div className="text-nowrap">
        Page: {page} of {totalPages}
      </div>
      <div className="flex items-center gap-2">
        <div className="text-nowrap">Go to page:</div>
        <Input
          name="page"
          type="number"
          className="w-20"
          defaultValue={page}
          onChange={changePage}
        />
      </div>
      <div>
        <Select
          onValueChange={changePageSize}
          defaultValue={pageSize.toString()}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">Show 10</SelectItem>
            <SelectItem value="20">Show 20</SelectItem>
            <SelectItem value="50">Show 50</SelectItem>
            <SelectItem value="100">Show 100</SelectItem>
            <SelectItem value="200">Show 200</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
