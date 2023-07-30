"use client";
/* Release: ee65b719 (Latest – unreleased) */

import classNames from "classnames";
import * as SubframeCore from "@subframe/core";
import React from "react";
import { DropdownMenu } from "./DropdownMenu";

interface DropdownButtonRootProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "Default" | "Small" | "XSmall";
  icon?: SubframeCore.IconName;
  children?: string;
  dropdownMenu?: React.ReactNode;
  className?: string;
}

const DropdownButtonRoot = React.forwardRef<
  HTMLElement,
  DropdownButtonRootProps
>(function DropdownButtonRoot(
  {
    size = "Default",
    icon = null,
    children = "Dropdown",
    dropdownMenu,
    className,
    type = "button",
    ...otherProps
  }: DropdownButtonRootProps,
  ref
) {
  return (
    <SubframeCore.DropdownMenu.Root>
      <SubframeCore.DropdownMenu.Trigger asChild={true}>
        <button
          className={SubframeCore.twClassNames(
            "flex bg-default-background border border-solid border-neutral-border rounded pr-4 pl-4 gap-2 items-center justify-center h-10 cursor-pointer group/0d533080 hover:bg-neutral-50 active:bg-neutral-100 disabled:bg-neutral-200 disabled:cursor-default hover:disabled:bg-neutral-200 hover:disabled:cursor-default active:disabled:bg-neutral-200 active:disabled:cursor-default",
            {
              "flex-none w-auto h-6 pt-0 pr-2 pb-0 pl-2 flex-row gap-1":
                size === "XSmall",
              "pt-0 pr-3 pb-0 pl-3 flex-none w-auto h-8 flex-row gap-1":
                size === "Small",
            },
            className
          )}
          ref={ref as any}
          type={type}
          {...otherProps}
        >
          <SubframeCore.Icon
            className={SubframeCore.twClassNames(
              "text-neutral-700 text-[16px] font-[400] leading-[20px] group-disabled/0d533080:text-neutral-400 group-hover/0d533080:group-disabled/0d533080:text-neutral-400 group-active/0d533080:group-disabled/0d533080:text-neutral-400",
              { "text-label font-label": size === "XSmall" || size === "Small" }
            )}
            name={icon}
          />
          <div
            className={SubframeCore.twClassNames(
              "hidden gap-2 items-center justify-center flex-none w-4 h-4",
              { "flex-none w-3 h-3": size === "XSmall" || size === "Small" }
            )}
          >
            <SubframeCore.Loader
              className={SubframeCore.twClassNames(
                "text-white text-body font-body group-disabled/0d533080:text-neutral-400",
                {
                  "text-label font-label":
                    size === "XSmall" || size === "Small",
                }
              )}
            />
          </div>
          {children ? (
            <span
              className={SubframeCore.twClassNames(
                "text-body-bold font-body-bold text-neutral-700 group-disabled/0d533080:text-neutral-400",
                {
                  "text-label-bold font-label-bold":
                    size === "XSmall" || size === "Small",
                }
              )}
            >
              {children}
            </span>
          ) : null}
          <SubframeCore.Icon
            className={SubframeCore.twClassNames(
              "text-neutral-700 text-body font-body group-disabled/0d533080:text-neutral-400",
              {
                "text-label-bold font-label-bold":
                  size === "XSmall" || size === "Small",
              }
            )}
            name="FeatherChevronDown"
          />
        </button>
      </SubframeCore.DropdownMenu.Trigger>
      <SubframeCore.DropdownMenu.Portal>
        <SubframeCore.DropdownMenu.Content
          side="bottom"
          align="start"
          sideOffset={8}
          asChild={true}
        >
          <div className="flex justify-between items-start">
            {dropdownMenu !== undefined ? (
              dropdownMenu
            ) : (
              <DropdownMenu>
                <DropdownMenu.DropdownItem icon="FeatherPlus">
                  Add
                </DropdownMenu.DropdownItem>
                <DropdownMenu.DropdownItem icon="FeatherEdit2">
                  Edit
                </DropdownMenu.DropdownItem>
                <div className="flex pt-0.5 pb-0.5 flex-col items-start w-full">
                  <div className="flex bg-neutral-300 flex-none h-px w-full flex-col gap-2 items-center" />
                </div>
                <DropdownMenu.DropdownItem />
              </DropdownMenu>
            )}
          </div>
        </SubframeCore.DropdownMenu.Content>
      </SubframeCore.DropdownMenu.Portal>
    </SubframeCore.DropdownMenu.Root>
  );
});

export const DropdownButton = DropdownButtonRoot;
