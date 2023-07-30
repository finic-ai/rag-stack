"use client";
/* Release: ee65b719 (Latest – unreleased) */

import classNames from "classnames";
import * as SubframeCore from "@subframe/core";
import React from "react";
import { IconWithBackground } from "./IconWithBackground";

interface CheckboxCardRootProps
  extends React.ComponentProps<typeof SubframeCore.Checkbox.Root> {
  iconSlot?: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

const CheckboxCardRoot = React.forwardRef<HTMLElement, CheckboxCardRootProps>(
  function CheckboxCardRoot(
    {
      iconSlot,
      title = "Enable notifications",
      description = "Be in the loop anytime something happens.",
      className,
      ...otherProps
    }: CheckboxCardRootProps,
    ref
  ) {
    return (
      <SubframeCore.Checkbox.Root asChild={true} {...otherProps}>
        <div
          className={SubframeCore.twClassNames(
            "flex border border-solid border-neutral-200 rounded pt-3 pr-3 pb-3 pl-3 gap-3 items-center cursor-pointer group/de0b4dfb hover:border hover:border-solid hover:border-neutral-300 aria-[checked=true]:border aria-[checked=true]:border-solid aria-[checked=true]:border-brand-600",
            className
          )}
          ref={ref as any}
        >
          <div className="flex h-full gap-2 items-center">
            {iconSlot !== undefined ? (
              iconSlot
            ) : (
              <IconWithBackground size="Large" icon="FeatherBell" />
            )}
          </div>
          <div className="flex flex-col items-start grow shrink-0 basis-0 w-full">
            {title ? (
              <span className="text-body-bold font-body-bold text-default-font">
                {title}
              </span>
            ) : null}
            {description ? (
              <span className="text-label font-label text-subtext-color">
                {description}
              </span>
            ) : null}
          </div>
          <div className="flex border border-solid border-neutral-300 rounded flex-none w-5 h-5 flex-col gap-2 items-center justify-center group-hover/de0b4dfb:border group-hover/de0b4dfb:border-solid group-hover/de0b4dfb:border-neutral-400 group-aria-[checked=true]/de0b4dfb:border group-aria-[checked=true]/de0b4dfb:border-solid group-aria-[checked=true]/de0b4dfb:border-brand-600 group-aria-[checked=true]/de0b4dfb:bg-brand-600">
            <SubframeCore.Icon
              className="hidden text-white text-[14px] font-[400] leading-[14px] group-aria-[checked=true]/de0b4dfb:inline-flex group-aria-[checked=true]/de0b4dfb:text-[16px] group-aria-[checked=true]/de0b4dfb:font-[400] group-aria-[checked=true]/de0b4dfb:leading-[16px]"
              name="FeatherCheck"
            />
          </div>
        </div>
      </SubframeCore.Checkbox.Root>
    );
  }
);

export const CheckboxCard = CheckboxCardRoot;
