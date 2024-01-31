import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function useUrlActions() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const removeMultipleQueryStrings = useCallback(
    (names: string[], newPath?: string) => {
      const params = new URLSearchParams(searchParams);
      names.forEach((name) => params.delete(name));
      return `${newPath || pathname}?${params.toString()}`;
    },
    [searchParams, pathname]
  );

  const updateQueryString = useCallback(
    (name: string, value: string, newPath?: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);
      return `${newPath || pathname}?${params.toString()}`;
    },
    [searchParams, pathname]
  );

  const updateMultipleQueryStrings = useCallback(
    (queries: [name: string, value: string][], newPath?: string) => {
      const params = new URLSearchParams(searchParams);
      queries.forEach((q) => params.set(q[0], q[1]));
      return `${newPath || pathname}?${params.toString()}`;
    },
    [searchParams, pathname]
  );

  return { removeMultipleQueryStrings, updateQueryString, updateMultipleQueryStrings, pathname, searchParams };
}
