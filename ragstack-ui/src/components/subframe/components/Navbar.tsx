"use client";
// @subframe/sync-disable
/* Release: ee65b719 (Latest – unreleased) */

import classNames from "classnames";
import * as SubframeCore from "@subframe/core";
import React from "react";

interface ItemProps extends React.HTMLAttributes<HTMLDivElement> {
  selected?: boolean;
  children?: string;
  className?: string;
}

const Item = React.forwardRef<HTMLElement, ItemProps>(function Item(
  { selected = false, children = "Home", className, ...otherProps }: ItemProps,
  ref
) {
  return (
    <div
      className={SubframeCore.twClassNames(
        "flex rounded pt-2 pr-3 pb-2 pl-3 flex-col gap-2 items-start cursor-pointer group/bb245e2d hover:bg-neutral-50 active:bg-neutral-100",
        { "bg-neutral-50": selected },
        className
      )}
      ref={ref as any}
      {...otherProps}
    >
      {children ? (
        <span className="text-body-bold font-body-bold text-default-font">
          {children}
        </span>
      ) : null}
    </div>
  );
});

interface NavbarRootProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  logo?: string;
  className?: string;
}

const NavbarRoot = React.forwardRef<HTMLElement, NavbarRootProps>(
  function NavbarRoot(
    {
      children,
      logo = "https://res.cloudinary.com/demo/image/upload/v1690994866/Icon_6_mo6skf.png",
      className,
      ...otherProps
    }: NavbarRootProps,
    ref
  ) {
    return (
      <nav
        className={SubframeCore.twClassNames(
          "flex bg-default-background border-b border-solid border-neutral-border w-full h-16 flex-col gap-2 items-start justify-center px-6 max-w-none group/6ca1b963",
          className
        )}
        ref={ref as any}
        {...otherProps}
      >
        <div className="flex gap-4 items-center w-full">
          <img className="flex-none h-7" src={logo} />
          <div className="flex grow shrink-0 basis-0 w-full h-full gap-1 items-start justify-end">
            {children !== undefined ? (
              children
            ) : (
              <>
                <Item />
                <Item selected={true}>Analytics</Item>
                <Item>Profile</Item>
                <Item>Settings</Item>
              </>
            )}
          </div>
        </div>
      </nav>
    );
  }
);

export const Navbar = Object.assign(NavbarRoot, {
  Item,
});
