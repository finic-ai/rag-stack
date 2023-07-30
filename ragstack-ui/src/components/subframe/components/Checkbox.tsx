"use client";
/* Release: ee65b719 (Latest – unreleased) */

import classNames from "classnames";
import * as SubframeCore from "@subframe/core";
import React from "react";

interface CheckboxRootProps
  extends React.ComponentProps<typeof SubframeCore.Checkbox.Root> {
  label?: string;
  className?: string;
}

const CheckboxRoot = React.forwardRef<HTMLElement, CheckboxRootProps>(
  function CheckboxRoot(
    { label = "Label", className, ...otherProps }: CheckboxRootProps,
    ref
  ) {
    return (
      <SubframeCore.Checkbox.Root asChild={true} {...otherProps}>
        <div
          className={SubframeCore.twClassNames(
            "flex gap-1.5 items-center group/3816e3b5",
            className
          )}
          ref={ref as any}
        >
          <div className="flex border border-solid border-neutral-400 rounded flex-none w-4 h-4 flex-col gap-2 items-center justify-center group-aria-[checked=true]/3816e3b5:bg-brand-600 group-aria-[checked=true]/3816e3b5:border group-aria-[checked=true]/3816e3b5:border-solid group-aria-[checked=true]/3816e3b5:border-brand-600">
            <SubframeCore.Icon
              className="hidden text-brand-600 text-body font-body group-aria-[checked=true]/3816e3b5:inline-flex group-aria-[checked=true]/3816e3b5:text-[14px] group-aria-[checked=true]/3816e3b5:font-[600] group-aria-[checked=true]/3816e3b5:leading-[14px] group-aria-[checked=true]/3816e3b5:text-white"
              name="FeatherCheck"
            />
          </div>
          {label ? (
            <span className="text-body font-body text-default-font">
              {label}
            </span>
          ) : null}
        </div>
      </SubframeCore.Checkbox.Root>
    );
  }
);

export const Checkbox = CheckboxRoot;
