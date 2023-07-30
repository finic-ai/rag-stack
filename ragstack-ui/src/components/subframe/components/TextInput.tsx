"use client";
/* Release: ee65b719 (Latest – unreleased) */

import classNames from "classnames";
import * as SubframeCore from "@subframe/core";
import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
  error?: boolean;
  className?: string;
}

const Input = React.forwardRef<HTMLElement, InputProps>(function Input(
  { placeholder = "", error = false, className, ...otherProps }: InputProps,
  ref
) {
  return (
    <input
      className={SubframeCore.twClassNames(
        "bg-default-background border border-solid border-neutral-border rounded pr-3 pl-3 h-8 text-body font-body text-default-font group/b0d608f7 focus-within:border focus-within:border-solid focus-within:border-brand-500",
        {
          "border border-solid border-error-400 focus-within:border focus-within:border-solid focus-within:border-error-500":
            error,
        },
        className
      )}
      placeholder={placeholder}
      ref={ref as any}
      {...otherProps}
    />
  );
});

interface TextInputRootProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  label?: string;
  children?: React.ReactNode;
  errorText?: string;
  className?: string;
}

const TextInputRoot = React.forwardRef<HTMLElement, TextInputRootProps>(
  function TextInputRoot(
    {
      label = "Label",
      children,
      errorText = "",
      className,
      ...otherProps
    }: TextInputRootProps,
    ref
  ) {
    return (
      <label
        className={SubframeCore.twClassNames(
          "flex flex-col gap-1 items-start group/be48ca43",
          className
        )}
        ref={ref as any}
        {...otherProps}
      >
        {label ? (
          <span className="text-body-bold font-body-bold text-subtext-color">
            {label}
          </span>
        ) : null}
        <div className="flex flex-col gap-1 items-start w-full">
          {children !== undefined ? (
            children
          ) : (
            <Input className="flex-none h-8 w-full" />
          )}
        </div>
        {errorText ? (
          <span className="text-body font-body text-error-800">
            {errorText}
          </span>
        ) : null}
      </label>
    );
  }
);

export const TextInput = Object.assign(TextInputRoot, {
  Input,
});
