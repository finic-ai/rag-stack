"use client";
/* Release: ee65b719 (Latest – unreleased) */

import classNames from "classnames";
import * as SubframeCore from "@subframe/core";
import React from "react";

interface ThumbProps
  extends React.ComponentProps<typeof SubframeCore.Switch.Thumb> {
  className?: string;
}

const Thumb = React.forwardRef<HTMLElement, ThumbProps>(function Thumb(
  { className, ...otherProps }: ThumbProps,
  ref
) {
  return (
    <SubframeCore.Switch.Thumb asChild={true} {...otherProps}>
      <div
        className={SubframeCore.twClassNames(
          "flex bg-brand-600 rounded-full w-3 h-3 flex-col gap-2 items-start group/deb91878",
          className
        )}
        ref={ref as any}
      />
    </SubframeCore.Switch.Thumb>
  );
});

interface SwitchRootProps
  extends React.ComponentProps<typeof SubframeCore.Switch.Root> {
  children?: React.ReactNode;
  className?: string;
}

const SwitchRoot = React.forwardRef<HTMLElement, SwitchRootProps>(
  function SwitchRoot(
    { children, className, ...otherProps }: SwitchRootProps,
    ref
  ) {
    return (
      <SubframeCore.Switch.Root asChild={true} {...otherProps}>
        <div
          className={SubframeCore.twClassNames(
            "flex bg-neutral-100 border border-solid border-neutral-border rounded-full pr-0.5 pl-0.5 w-8 h-4 flex-col gap-2 items-start justify-center group/7a464794 aria-[checked=true]:bg-brand-200",
            className
          )}
          ref={ref as any}
        >
          {children !== undefined ? children : <Thumb />}
        </div>
      </SubframeCore.Switch.Root>
    );
  }
);

export const Switch = Object.assign(SwitchRoot, {
  Thumb,
});
