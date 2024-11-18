"use client";

import { MoveUpIcon, MoveDownIcon } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type SortOrder = "asc" | "desc" | "none";

export function Sortable({
  children,
  columnName,
}: {
  children: ReactNode;
  columnName: string;
}) {
  const [sortOrder, setSortOrder] = useState<SortOrder>("none");
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    const sort = searchParams.get("sort");
    if (sort !== columnName) {
      setSortOrder("none");
    }
  }, [searchParams, columnName]);

  function handleClick() {
    const params = new URLSearchParams(searchParams);

    switch (sortOrder) {
      case "asc":
        setSortOrder("desc");
        params.set("sortOrder", "desc");
        params.set("sort", columnName);
        break;
      case "desc":
        setSortOrder("none");
        params.delete("sortOrder");
        params.delete("sort");
        break;
      case "none":
        setSortOrder("asc");
        params.set("sortOrder", "asc");
        params.set("sort", columnName);
        break;
      default:
        const exhaustiveCheck: never = sortOrder;
        throw new Error(`unhandled case: ${exhaustiveCheck}`);
    }

    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div
      onClick={handleClick}
      className="flex items-center cursor-pointer select-none"
    >
      <div className="text-nowrap">{children}</div>
      {sortOrder === "asc" && <MoveUpIcon className="w-3 h-3" />}
      {sortOrder === "desc" && <MoveDownIcon className="w-3 h-3" />}
      {sortOrder === "none" && <div className="w-3 h-3"></div>}
    </div>
  );
}
