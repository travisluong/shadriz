"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { SearchIcon } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export function SearchInput({ placeholder }: { placeholder?: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [text, setText] = useState("");

  function handleSearch(e: any) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    params.set("search", text);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div>
      <form className="flex items-center gap-2" onSubmit={handleSearch}>
        <Input
          type="text"
          placeholder={placeholder ?? "Search"}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Button type="submit">
          <SearchIcon />
        </Button>
      </form>
    </div>
  );
}
