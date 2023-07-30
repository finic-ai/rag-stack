"use client";
/* Release: ee65b719 (Latest – unreleased) */

import classNames from "classnames";
import * as SubframeCore from "@subframe/core";
import React from "react";

interface ItemProps
  extends React.ComponentProps<typeof SubframeCore.RadioGroup.Item> {
  label?: string;
  className?: string;
}

const Item = React.forwardRef<HTMLElement, ItemProps>(function Item(
  { label = "Option 1", className, ...otherProps }: ItemProps,
  ref
) {
  return (
    <SubframeCore.RadioGroup.Item asChild={true} {...otherProps}>
      <div
        className={SubframeCore.twClassNames(
          "flex gap-2 items-center group/0f804ad9",
          className
        )}
        ref={ref as any}
      >
        <div className="flex gap-2 items-center h-4">
          <div className="flex bg-default-background border border-solid border-neutral-border rounded-full flex-none w-4 h-4 flex-col gap-2 items-center justify-center">
            <div className="flex bg-default-background rounded-full flex-none h-2 w-2 flex-col gap-2 items-start group-aria-[checked=true]/0f804ad9:bg-brand-600" />
          </div>
        </div>
        {label ? (
          <span className="text-body font-body text-default-font">{label}</span>
        ) : null}
      </div>
    </SubframeCore.RadioGroup.Item>
  );
});

interface RadioGroupRootProps
  extends React.ComponentProps<typeof SubframeCore.RadioGroup.Root> {
  children?: React.ReactNode;
  horizontal?: boolean;
  className?: string;
}

const RadioGroupRoot = React.forwardRef<HTMLElement, RadioGroupRootProps>(
  function RadioGroupRoot(
    {
      children,
      horizontal = false,
      className,
      ...otherProps
    }: RadioGroupRootProps,
    ref
  ) {
    return (
      <SubframeCore.RadioGroup.Root asChild={true} {...otherProps}>
        <div
          className={SubframeCore.twClassNames(
            "flex flex-col gap-3 items-start group/c4b6300e",
            { "flex-row gap-3": horizontal },
            className
          )}
          ref={ref as any}
        >
          {children !== undefined ? (
            children
          ) : (
            <>
              <Item label="Option 1" checked={true} value="bbfefe85" />
              <Item label="Option 2" value="72b8bf30" />
              <Item label="Option 3" value="1e11ec61" />
              <Item label="Option 4" value="47a4d600" />
              <Item label="Option 5" value="1c40c49d" />
            </>
          )}
        </div>
      </SubframeCore.RadioGroup.Root>
    );
  }
);

export const RadioGroup = Object.assign(RadioGroupRoot, {
  Item,
});
