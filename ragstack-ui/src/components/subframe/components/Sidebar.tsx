"use client";
/* Release: ee65b719 (Latest – unreleased) */

import classNames from "classnames";
import * as SubframeCore from "@subframe/core";
import React from "react";

interface ItemProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: SubframeCore.IconName;
  children?: string;
  selected?: boolean;
  className?: string;
}

const Item = React.forwardRef<HTMLElement, ItemProps>(function Item(
  {
    icon = "FeatherHome",
    children = "Overview",
    selected = false,
    className,
    ...otherProps
  }: ItemProps,
  ref
) {
  return (
    <div
      className={SubframeCore.twClassNames(
        "flex rounded pt-2 pr-3 pb-2 pl-3 gap-2 items-center w-full cursor-pointer group/02cd1448 hover:bg-neutral-50",
        { "bg-neutral-100": selected },
        className
      )}
      ref={ref as any}
      {...otherProps}
    >
      <div className="flex pb-0.5 gap-2 items-start">
        <SubframeCore.Icon
          className={SubframeCore.twClassNames(
            "text-neutral-500 text-[18px] font-[500] leading-[28px] group-hover/02cd1448:text-neutral-800",
            { "text-neutral-900": selected }
          )}
          name={icon}
        />
      </div>
      {children ? (
        <span
          className={SubframeCore.twClassNames(
            "text-body-bold font-body-bold text-neutral-600 group-hover/02cd1448:text-neutral-800",
            { "text-neutral-900": selected }
          )}
        >
          {children}
        </span>
      ) : null}
    </div>
  );
});

interface SidebarRootProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  hideLogo?: boolean;
  className?: string;
}

const SidebarRoot = React.forwardRef<HTMLElement, SidebarRootProps>(
  function SidebarRoot(
    { children, hideLogo = false, className, ...otherProps }: SidebarRootProps,
    ref
  ) {
    return (
      <nav
        className={SubframeCore.twClassNames(
          "flex bg-white border-r border-solid border-neutral-border pt-5 flex-col gap-6 items-start w-48 h-full group/1651a160",
          className
        )}
        ref={ref as any}
        {...otherProps}
      >
        <div
          className={SubframeCore.twClassNames(
            "flex pr-6 pl-6 flex-col gap-2 items-start w-full",
            { hidden: hideLogo }
          )}
        >
          <img
            className="flex-none h-9"
            src="https://res.cloudinary.com/demo/image/upload/v1683583714/logo_awqb7m.png"
          />
        </div>
        <div className="flex pr-3 pl-3 grow shrink-0 basis-0 h-full w-full flex-col gap-1 items-start">
          {children !== undefined ? (
            children
          ) : (
            <>
              <Item selected={true} />
              <Item icon="FeatherBarChart">Analytics</Item>
              <Item icon="FeatherDatabase">Database</Item>
              <Item icon="FeatherSettings">Settings</Item>
            </>
          )}
        </div>
      </nav>
    );
  }
);

export const Sidebar = Object.assign(SidebarRoot, {
  Item,
});
