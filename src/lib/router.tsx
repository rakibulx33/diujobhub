"use client";

import NextLink from "next/link";
import {
  useParams as useNextParams,
  usePathname,
  useRouter,
  useSearchParams as useNextSearchParams,
} from "next/navigation";
import {
  type AnchorHTMLAttributes,
  type PropsWithChildren,
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
} from "react";

type To =
  | string
  | {
      pathname?: string;
      search?: string;
      hash?: string;
    };

type NavigateOptions = {
  replace?: boolean;
};

function toHref(to: To) {
  if (typeof to === "string") return to;

  const pathname = to.pathname ?? "/";
  const search = to.search ?? "";
  const hash = to.hash ?? "";

  return `${pathname}${search}${hash}`;
}

export interface LinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className"> {
  to: To;
  className?: string;
  replace?: boolean;
  scroll?: boolean;
  prefetch?: boolean | null;
}

export interface NavLinkProps extends Omit<LinkProps, "className"> {
  end?: boolean;
  className?:
    | string
    | ((state: {
        isActive: boolean;
        isPending: boolean;
      }) => string);
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { to, replace, scroll, prefetch, ...props },
  ref,
) {
  return (
    <NextLink
      href={toHref(to)}
      replace={replace}
      scroll={scroll}
      prefetch={prefetch ?? undefined}
      ref={ref}
      {...props}
    />
  );
});

export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(function NavLink(
  { to, end, className, replace, scroll, prefetch, ...props },
  ref,
) {
  const pathname = usePathname();
  const href = toHref(to);

  const isActive = useMemo(() => {
    if (!pathname) return false;
    if (end) return pathname === href;
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  }, [end, href, pathname]);

  const resolvedClassName =
    typeof className === "function"
      ? className({ isActive, isPending: false })
      : className;

  return (
    <NextLink
      href={href}
      replace={replace}
      scroll={scroll}
      prefetch={prefetch ?? undefined}
      ref={ref}
      className={resolvedClassName}
      {...props}
    />
  );
});

export function useNavigate() {
  const router = useRouter();

  return useCallback(
    (to: To, options?: NavigateOptions) => {
      const href = toHref(to);
      if (options?.replace) router.replace(href);
      else router.push(href);
    },
    [router],
  );
}

export function useLocation() {
  const pathname = usePathname();

  return {
    pathname: pathname ?? "/",
    search: "",
    hash: "",
    state: null,
    key: pathname ?? "/",
  };
}

export function useParams<T extends Record<string, string | string[]>>() {
  return useNextParams<T>();
}

export function useSearchParams() {
  const params = useNextSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const urlSearchParams = useMemo(() => new URLSearchParams(params.toString()), [params]);

  const setSearchParams = useCallback(
    (
      next:
        | string
        | URLSearchParams
        | Record<string, string | number | boolean | null | undefined>,
    ) => {
      let search = "";

      if (typeof next === "string") {
        search = next.startsWith("?") ? next : `?${next}`;
      } else if (next instanceof URLSearchParams) {
        const value = next.toString();
        search = value ? `?${value}` : "";
      } else {
        const value = new URLSearchParams();

        Object.entries(next).forEach(([key, val]) => {
          if (val !== undefined && val !== null) {
            value.set(key, String(val));
          }
        });

        const stringValue = value.toString();
        search = stringValue ? `?${stringValue}` : "";
      }

      router.push(`${pathname ?? "/"}${search}`);
    },
    [pathname, router],
  );

  return [urlSearchParams, setSearchParams] as const;
}

export function Navigate({ to, replace = false }: { to: To; replace?: boolean }) {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(to, { replace });
  }, [navigate, replace, to]);

  return null;
}

export function BrowserRouter({ children }: PropsWithChildren) {
  return <>{children}</>;
}

export function Routes({ children }: PropsWithChildren) {
  return <>{children}</>;
}

export function Route(_props: Record<string, unknown>) {
  return null;
}

export function Outlet() {
  return null;
}
