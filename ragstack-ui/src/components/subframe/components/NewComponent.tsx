"use client";
/* Release: ee65b719 (Latest – unreleased) */

import classNames from "classnames";
import * as SubframeCore from "@subframe/core";
import React from "react";
import { ChatBubbleYou } from "./ChatBubbleYou";
import { AvatarImage } from "./AvatarImage";
import { ChatBubbleThem } from "./ChatBubbleThem";

interface NewComponentRootProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const NewComponentRoot = React.forwardRef<HTMLElement, NewComponentRootProps>(
  function NewComponentRoot(
    { className, ...otherProps }: NewComponentRootProps,
    ref
  ) {
    return (
      <div
        className={SubframeCore.twClassNames(
          "flex flex-col gap-2 items-start w-full h-full cursor-pointer group/c5157938",
          className
        )}
        ref={ref as any}
        {...otherProps}
      >
        <div className="flex flex-col gap-4 items-start grow shrink-0 basis-0 h-full w-full">
          <ChatBubbleYou
            time=""
            message="Summarize this client's health history"
          />
          <ChatBubbleThem
            time=""
            avatar={
              <AvatarImage src="https://res.cloudinary.com/demo/image/upload/v1690586110/CleanShot_2023-07-28_at_16.14.51_2x_lob1e0.png" />
            }
            name="Bot"
            message="On the client's paternal side, there's a history of heart disease. Their grandfather passed away from a heart attack in his early 70s and their father has been diagnosed with high blood pressure, although it is managed with medication and diet. The client's paternal aunts and uncles have no known heart-related conditions. [claim_2.pdf]"
          />
          <ChatBubbleThem
            time=""
            avatar={
              <AvatarImage src="https://res.cloudinary.com/demo/image/upload/v1690586110/CleanShot_2023-07-28_at_16.14.51_2x_lob1e0.png" />
            }
            name="Bot"
            message="On the maternal side, diabetes is prevalent. Both the client's mother and aunt were diagnosed with Type 2 diabetes in their 50s. Their maternal grandparents lived into their 80s and 90s but were also diagnosed with Type 2 diabetes. [claim_3.pdf]"
          />
          <ChatBubbleThem
            time=""
            avatar={
              <AvatarImage src="https://res.cloudinary.com/demo/image/upload/v1690586110/CleanShot_2023-07-28_at_16.14.51_2x_lob1e0.png" />
            }
            name="Bot"
            message="As for the client's personal health, they have regular check-ups and maintain a healthy lifestyle to mitigate these inherited risks. Their last physical examination, including blood work, was reported to be all clear. [claim_4.pdf]"
          />
        </div>
      </div>
    );
  }
);

export const NewComponent = NewComponentRoot;
