"use client";
/* Release: ee65b719 (Latest – unreleased) */

import classNames from "classnames";
import * as SubframeCore from "@subframe/core";
import React from "react";
import { Sidebar } from "../components/Sidebar";

interface DefaultPageLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

const DefaultPageLayout = React.forwardRef<HTMLElement, DefaultPageLayoutProps>(
  function DefaultPageLayout(
    { children, className, ...otherProps }: DefaultPageLayoutProps,
    ref
  ) {
    return (
      <div
        className={SubframeCore.twClassNames(
          "flex items-center w-full h-screen group/a57b1c43",
          className
        )}
        ref={ref as any}
        {...otherProps}
      >
        <Sidebar />
        <div className="flex grow shrink-0 basis-0 w-full h-full flex-col gap-4 items-start overflow-y-auto">
          {children}
        </div>
      </div>
    );
  }
);

export default DefaultPageLayout;
