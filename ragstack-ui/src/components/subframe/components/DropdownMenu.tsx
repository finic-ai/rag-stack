"use client";
/* Release: ee65b719 (Latest – unreleased) */

import classNames from "classnames";
import * as SubframeCore from "@subframe/core";
import React from "react";

interface DropdownItemProps
  extends React.ComponentProps<typeof SubframeCore.DropdownMenu.Item> {
  children?: string;
  icon?: SubframeCore.IconName;
  className?: string;
}

const DropdownItem = React.forwardRef<HTMLElement, DropdownItemProps>(
  function DropdownItem(
    {
      children = "Delete",
      icon = "FeatherTrash",
      className,
      ...otherProps
    }: DropdownItemProps,
    ref
  ) {
    return (
      <SubframeCore.DropdownMenu.Item asChild={true} {...otherProps}>
        <div
          className={SubframeCore.twClassNames(
            "flex pr-3 pl-3 w-full h-8 gap-1.5 items-center cursor-pointer group/adcae8d6 hover:bg-neutral-50 data-[highlighted]:bg-neutral-50",
            className
          )}
          ref={ref as any}
        >
          <SubframeCore.Icon
            className="text-neutral-700 text-body font-body group-hover/adcae8d6:text-default-font"
            name={icon}
          />
          {children ? (
            <span className="text-body font-body text-neutral-700 group-hover/adcae8d6:text-default-font">
              {children}
            </span>
          ) : null}
        </div>
      </SubframeCore.DropdownMenu.Item>
    );
  }
);

interface DropdownMenuRootProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

const DropdownMenuRoot = React.forwardRef<HTMLElement, DropdownMenuRootProps>(
  function DropdownMenuRoot(
    { children, className, ...otherProps }: DropdownMenuRootProps,
    ref
  ) {
    return (
      <div
        className={SubframeCore.twClassNames(
          "flex bg-default-background rounded shadow pt-1 pb-1 w-48 flex-col items-start group/99951515",
          className
        )}
        ref={ref as any}
        {...otherProps}
      >
        {children !== undefined ? (
          children
        ) : (
          <>
            <DropdownItem icon="FeatherPlus">Add</DropdownItem>
            <DropdownItem icon="FeatherEdit2">Edit</DropdownItem>
            <div className="flex pt-0.5 pb-0.5 flex-col items-start w-full">
              <div className="flex bg-neutral-300 flex-none h-px w-full flex-col gap-2 items-center" />
            </div>
            <DropdownItem />
          </>
        )}
      </div>
    );
  }
);

export const DropdownMenu = Object.assign(DropdownMenuRoot, {
  DropdownItem,
});
