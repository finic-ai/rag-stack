"use client";
/* Release: ee65b719 (Latest – unreleased) */

import classNames from "classnames";
import * as SubframeCore from "@subframe/core";
import React from "react";
import { ChatBubbleYou } from "./ChatBubbleYou";
import { AvatarImage } from "./AvatarImage";
import { ChatBubbleThem } from "./ChatBubbleThem";

interface NewComponentCopyRootProps
  extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const NewComponentCopyRoot = React.forwardRef<
  HTMLElement,
  NewComponentCopyRootProps
>(function NewComponentCopyRoot(
  { className, ...otherProps }: NewComponentCopyRootProps,
  ref
) {
  return (
    <div
      className={SubframeCore.twClassNames(
        "flex flex-col gap-4 items-start w-full h-full group/957046e4",
        className
      )}
      ref={ref as any}
      {...otherProps}
    >
      <ChatBubbleYou time="" message="Summarize this client's health history" />
      <ChatBubbleThem
        time=""
        avatar={
          <AvatarImage src="https://res.cloudinary.com/demo/image/upload/v1690586110/CleanShot_2023-07-28_at_16.14.51_2x_lob1e0.png" />
        }
        name="Bot"
        message="On the client's paternal side, there's a history of heart disease. Their grandfather passed away from a heart attack in his early 70s and their father has been diagnosed with high blood pressure, although it is managed with medication and diet. The client's paternal aunts and uncles have no known heart-related conditions. [claim_2.pdf]"
      />
    </div>
  );
});

export const NewComponentCopy = NewComponentCopyRoot;
