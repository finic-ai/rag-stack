"use client";
// @subframe/sync-disable
/* Release: ee65b719 (Latest – unreleased) */

import classNames from "classnames";
import * as SubframeCore from "@subframe/core";
import React, {useRef, useEffect} from "react";
import { ChatBubbleYou } from "./ChatBubbleYou";
import { AvatarImage } from "./AvatarImage";
import { ChatBubbleThem } from "./ChatBubbleThem";

interface NewComponentRootProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  messages: Array<any>;
}

const NewComponentRoot = React.forwardRef<HTMLElement, NewComponentRootProps>(
  function NewComponentRoot(
    { className, ...otherProps }: NewComponentRootProps,
    ref
  ) {
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
      scrollToBottom();
    }, [otherProps.messages]);

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
          {otherProps.messages.map((message) => { 
            // If message.user is true, then render ChatBubbleYou otherwise render ChatBubbleThem
            if (message.isUser) {
              return (
                <ChatBubbleYou
                  time={""}
                  message={message.message.answer}
                />
              );
            } else {
              return (
                <ChatBubbleThem
                  time={""}
                  avatar={
                    <AvatarImage src="https://res.cloudinary.com/demo/image/upload/v1690586110/CleanShot_2023-07-28_at_16.14.51_2x_lob1e0.png" />
                  }
                  name="Bot"
                  message={message.message.answer}
                />
              );
            }
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>
    );
  }
);

export const NewComponent = NewComponentRoot;
