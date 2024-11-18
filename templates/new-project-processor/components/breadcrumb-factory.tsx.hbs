"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";

export function BreadcrumbFactory() {
  const pathname = usePathname();
  const crumbs = pathname.split("/");
  crumbs.shift();

  return (
    <Breadcrumb suppressHydrationWarning>
      <BreadcrumbList>
        {crumbs.map((crumb, index) => (
          <div key={index} className="flex items-center gap-2">
            <BreadcrumbItem>
              {crumbs.length > 1 && index === 0 && (
                <BreadcrumbLink href={"/" + crumbs.slice(0, index + 1)}>
                  {crumb}
                </BreadcrumbLink>
              )}
              {index > 0 && index < crumbs.length - 1 && (
                <BreadcrumbLink
                  href={"/" + crumbs.slice(0, index + 1).join("/")}
                >
                  {crumb}
                </BreadcrumbLink>
              )}
              {index === crumbs.length - 1 && <>{crumb}</>}
            </BreadcrumbItem>
            {index < crumbs.length - 1 && <BreadcrumbSeparator />}
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
