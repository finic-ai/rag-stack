"use client";
/* Release: ee65b719 (Latest – unreleased) */

import classNames from "classnames";
import * as SubframeCore from "@subframe/core";
import React from "react";
import { Tooltip } from "./Tooltip";

interface CopyToClipboardButtonRootProps
  extends React.ComponentProps<typeof SubframeCore.CopyToClipboard.Root> {
  clipboardText?: string;
  tooltipText?: string;
  className?: string;
}

const CopyToClipboardButtonRoot = React.forwardRef<
  HTMLElement,
  CopyToClipboardButtonRootProps
>(function CopyToClipboardButtonRoot(
  {
    clipboardText = "",
    tooltipText = "Copy to clipboard",
    className,
    ...otherProps
  }: CopyToClipboardButtonRootProps,
  ref
) {
  return (
    <SubframeCore.Tooltip.Provider>
      <SubframeCore.Tooltip.Root>
        <SubframeCore.Tooltip.Trigger asChild={true}>
          <SubframeCore.CopyToClipboard.Root
            clipboardText={clipboardText}
            {...otherProps}
          >
            <div
              className={SubframeCore.twClassNames(
                "flex rounded flex-col gap-2 items-center justify-center w-6 h-6 cursor-pointer group/e8c76626 hover:bg-neutral-100",
                className
              )}
              ref={ref as any}
            >
              <SubframeCore.Icon
                className="text-subtext-color text-body font-body group-hover/e8c76626:text-default-font"
                name="FeatherClipboard"
              />
            </div>
          </SubframeCore.CopyToClipboard.Root>
        </SubframeCore.Tooltip.Trigger>
        <SubframeCore.Tooltip.Portal>
          <SubframeCore.Tooltip.Content
            side="bottom"
            align="center"
            sideOffset={8}
            asChild={true}
          >
            <Tooltip>{tooltipText}</Tooltip>
          </SubframeCore.Tooltip.Content>
        </SubframeCore.Tooltip.Portal>
      </SubframeCore.Tooltip.Root>
    </SubframeCore.Tooltip.Provider>
  );
});

export const CopyToClipboardButton = CopyToClipboardButtonRoot;
