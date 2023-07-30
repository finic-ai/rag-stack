"use client";
/* Release: ee65b719 (Latest – unreleased) */

import classNames from "classnames";
import * as SubframeCore from "@subframe/core";
import React from "react";

interface AvatarImageRootProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  size?: "Default" | "Small" | "XSmall";
  src?: string;
  className?: string;
}

const AvatarImageRoot = React.forwardRef<HTMLElement, AvatarImageRootProps>(
  function AvatarImageRoot(
    {
      size = "Default",
      src = "https://res.cloudinary.com/dnkpdfdai/image/upload/v1653246547/photo-1494790108377-be9c29b29330_b4vlzj.avif",
      className,
      ...otherProps
    }: AvatarImageRootProps,
    ref
  ) {
    return (
      <img
        className={SubframeCore.twClassNames(
          "w-9 h-9 [clip-path: circle()] object-cover group/ce9959fe",
          {
            "flex-none w-5 h-5": size === "XSmall",
            "flex-none w-7 h-7": size === "Small",
          },
          className
        )}
        src={src}
        ref={ref as any}
        {...otherProps}
      />
    );
  }
);

export const AvatarImage = AvatarImageRoot;
