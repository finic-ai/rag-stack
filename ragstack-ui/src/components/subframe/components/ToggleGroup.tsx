"use client";
/* Release: ee65b719 (Latest – unreleased) */

import classNames from "classnames";
import * as SubframeCore from "@subframe/core";
import React from "react";

interface ItemProps
  extends React.ComponentProps<typeof SubframeCore.ToggleGroup.Item> {
  children?: string;
  icon?: SubframeCore.IconName;
  className?: string;
}

const Item = React.forwardRef<HTMLElement, ItemProps>(function Item(
  {
    children = "Label",
    icon = "FeatherPlus",
    className,
    ...otherProps
  }: ItemProps,
  ref
) {
  return (
    <SubframeCore.ToggleGroup.Item asChild={true} {...otherProps}>
      <div
        className={SubframeCore.twClassNames(
          "flex bg-white pr-4 pl-4 gap-2 items-center h-10 cursor-pointer group/56dea6ed hover:bg-neutral-50 aria-[checked=true]:bg-brand-50",
          className
        )}
        ref={ref as any}
      >
        <SubframeCore.Icon
          className="text-subtext-color text-[16px] font-[600] leading-[20px] group-hover/56dea6ed:text-default-font group-aria-[checked=true]/56dea6ed:text-brand-700"
          name={icon}
        />
        {children ? (
          <span className="text-body-bold font-body-bold text-subtext-color group-hover/56dea6ed:text-default-font group-aria-[checked=true]/56dea6ed:text-brand-700">
            {children}
          </span>
        ) : null}
      </div>
    </SubframeCore.ToggleGroup.Item>
  );
});

interface ToggleGroupRootProps
  extends React.ComponentProps<typeof SubframeCore.ToggleGroup.Root> {
  children?: React.ReactNode;
  className?: string;
}

const ToggleGroupRoot = React.forwardRef<HTMLElement, ToggleGroupRootProps>(
  function ToggleGroupRoot(
    { children, className, ...otherProps }: ToggleGroupRootProps,
    ref
  ) {
    return (
      <SubframeCore.ToggleGroup.Root asChild={true} {...otherProps}>
        <div
          className={SubframeCore.twClassNames(
            "flex overflow-hidden bg-neutral-border border border-solid border-neutral-border rounded gap-px items-start group/2026f10a",
            className
          )}
          ref={ref as any}
        >
          {children !== undefined ? (
            children
          ) : (
            <>
              <Item icon={null} value="0e4eacbd">
                Option 1
              </Item>
              <Item icon={null} value="1f4a4ba4">
                Option 2
              </Item>
              <Item icon={null} value="2bf248d7">
                Option 3
              </Item>
            </>
          )}
        </div>
      </SubframeCore.ToggleGroup.Root>
    );
  }
);

export const ToggleGroup = Object.assign(ToggleGroupRoot, {
  Item,
});
