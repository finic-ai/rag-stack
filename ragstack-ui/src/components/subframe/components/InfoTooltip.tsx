"use client";
/* Release: ee65b719 (Latest – unreleased) */

import classNames from "classnames";
import * as SubframeCore from "@subframe/core";
import React from "react";
import { Tooltip } from "./Tooltip";

interface InfoTooltipRootProps
  extends SubframeCore.TypescriptHelpers.Optional<
    React.ComponentProps<typeof SubframeCore.Icon>,
    "name"
  > {
  tooltipText?: string;
  size?: "Default" | "Subheader" | "Section Header" | "Header";
  className?: string;
}

const InfoTooltipRoot = React.forwardRef<HTMLElement, InfoTooltipRootProps>(
  function InfoTooltipRoot(
    {
      tooltipText = "Tooltip contents",
      size = "Default",
      className,
      ...otherProps
    }: InfoTooltipRootProps,
    ref
  ) {
    return (
      <SubframeCore.Tooltip.Provider>
        <SubframeCore.Tooltip.Root>
          <SubframeCore.Tooltip.Trigger asChild={true}>
            <SubframeCore.Icon
              className={SubframeCore.twClassNames(
                "text-neutral-700 text-body font-body group/58466bc5",
                {
                  "text-header font-header": size === "Header",
                  "text-section-header font-section-header":
                    size === "Section Header",
                  "text-subheader font-subheader": size === "Subheader",
                },
                className
              )}
              name="FeatherInfo"
              ref={ref as any}
              {...otherProps}
            />
          </SubframeCore.Tooltip.Trigger>
          <SubframeCore.Tooltip.Portal>
            <SubframeCore.Tooltip.Content
              side="right"
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
  }
);

export const InfoTooltip = InfoTooltipRoot;
