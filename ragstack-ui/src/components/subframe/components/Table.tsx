"use client";
/* Release: ee65b719 (Latest – unreleased) */

import classNames from "classnames";
import * as SubframeCore from "@subframe/core";
import React from "react";
import { Button } from "./Button";
import { Badge } from "./Badge";

interface HeaderRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children?: React.ReactNode;
  className?: string;
}

const HeaderRow = React.forwardRef<HTMLElement, HeaderRowProps>(
  function HeaderRow(
    { children, className, ...otherProps }: HeaderRowProps,
    ref
  ) {
    return (
      <tr
        className={SubframeCore.twClassNames(
          "bg-neutral-50 group/7a979815",
          className
        )}
        ref={ref as any}
        {...otherProps}
      >
        {children !== undefined ? (
          children
        ) : (
          <>
            <Table.HeaderCell />
            <Table.HeaderCell>Email</Table.HeaderCell>
            <Table.HeaderCell>Role</Table.HeaderCell>
            <Table.HeaderCell />
          </>
        )}
      </tr>
    );
  }
);

interface HeaderCellProps
  extends React.ThHTMLAttributes<HTMLTableHeaderCellElement> {
  children?: string;
  className?: string;
}

const HeaderCell = React.forwardRef<HTMLElement, HeaderCellProps>(
  function HeaderCell(
    { children = "Name", className, ...otherProps }: HeaderCellProps,
    ref
  ) {
    return (
      <th {...otherProps}>
        <div
          className={SubframeCore.twClassNames(
            "flex pr-3 pl-3 w-full h-10 flex-col gap-2 items-start justify-center group/a3a9d884",
            className
          )}
          ref={ref as any}
        >
          {children ? (
            <span className="text-body-bold font-body-bold text-neutral-700">
              {children}
            </span>
          ) : null}
        </div>
      </th>
    );
  }
);

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children?: React.ReactNode;
  className?: string;
}

const Row = React.forwardRef<HTMLElement, RowProps>(function Row(
  { children, className, ...otherProps }: RowProps,
  ref
) {
  return (
    <tr
      className={SubframeCore.twClassNames(
        "bg-default-background border-t border-solid border-neutral-border group/5d119f8d",
        className
      )}
      ref={ref as any}
      {...otherProps}
    >
      {children !== undefined ? (
        children
      ) : (
        <>
          <Table.TextCell primary={true} />
          <Table.TextCell>john.walton@example.com</Table.TextCell>
          <Table.BadgeCell>Developer</Table.BadgeCell>
          <Table.Cell />
        </>
      )}
    </tr>
  );
});

interface CellProps extends React.TdHTMLAttributes<HTMLTableDataCellElement> {
  children?: React.ReactNode;
  className?: string;
}

const Cell = React.forwardRef<HTMLElement, CellProps>(function Cell(
  { children, className, ...otherProps }: CellProps,
  ref
) {
  return (
    <td {...otherProps}>
      <div
        className={SubframeCore.twClassNames(
          "flex pr-3 pl-3 w-full h-12 gap-1 items-center group/291d4418",
          className
        )}
        ref={ref as any}
      >
        {children !== undefined ? (
          children
        ) : (
          <div className="flex items-center justify-end grow shrink-0 basis-0 w-full">
            <Button
              variant="Neutral Tertiary"
              size="XSmall"
              icon="FeatherEdit2"
            >
              Edit
            </Button>
            <Button
              variant="Neutral Tertiary"
              size="XSmall"
              icon="FeatherTrash"
            >
              Delete
            </Button>
          </div>
        )}
      </div>
    </td>
  );
});

interface TextCellProps
  extends React.TdHTMLAttributes<HTMLTableDataCellElement> {
  primary?: boolean;
  children?: string;
  className?: string;
}

const TextCell = React.forwardRef<HTMLElement, TextCellProps>(function TextCell(
  {
    primary = false,
    children = "John Walton",
    className,
    ...otherProps
  }: TextCellProps,
  ref
) {
  return (
    <td {...otherProps}>
      <div
        className={SubframeCore.twClassNames(
          "flex pr-3 pl-3 flex-col gap-2 items-start justify-center w-full h-12 group/1c76039d",
          className
        )}
        ref={ref as any}
      >
        {children ? (
          <span
            className={SubframeCore.twClassNames(
              "text-body font-body text-neutral-500",
              { "text-body-bold font-body-bold text-neutral-700": primary }
            )}
          >
            {children}
          </span>
        ) : null}
      </div>
    </td>
  );
});

interface BadgeCellProps
  extends React.TdHTMLAttributes<HTMLTableDataCellElement> {
  children?: string;
  variant?: "Default" | "Neutral" | "Error" | "Warning" | "Success";
  className?: string;
}

const BadgeCell = React.forwardRef<HTMLElement, BadgeCellProps>(
  function BadgeCell(
    {
      children = "Badge",
      variant = "Default",
      className,
      ...otherProps
    }: BadgeCellProps,
    ref
  ) {
    return (
      <td {...otherProps}>
        <div
          className={SubframeCore.twClassNames(
            "flex pr-3 pl-3 h-12 gap-1 items-center group/f2160c74",
            className
          )}
          ref={ref as any}
        >
          <Badge
            className={SubframeCore.twClassNames({
              hidden:
                variant === "Success" ||
                variant === "Warning" ||
                variant === "Error" ||
                variant === "Neutral",
            })}
          >
            {children}
          </Badge>
          <Badge
            className={SubframeCore.twClassNames("hidden", {
              flex: variant === "Neutral",
            })}
            variant="Neutral"
          >
            {children}
          </Badge>
          <Badge
            className={SubframeCore.twClassNames("hidden", {
              flex: variant === "Error",
            })}
            variant="Error"
          >
            {children}
          </Badge>
          <Badge
            className={SubframeCore.twClassNames("hidden", {
              flex: variant === "Warning",
            })}
            variant="Warning"
          >
            {children}
          </Badge>
          <Badge
            className={SubframeCore.twClassNames("hidden", {
              flex: variant === "Success",
            })}
            variant="Success"
          >
            {children}
          </Badge>
        </div>
      </td>
    );
  }
);

interface TableRootProps extends React.TableHTMLAttributes<HTMLTableElement> {
  children?: React.ReactNode;
  header?: React.ReactNode;
  className?: string;
}

const TableRoot = React.forwardRef<HTMLElement, TableRootProps>(
  function TableRoot(
    { children, header, className, ...otherProps }: TableRootProps,
    ref
  ) {
    return (
      <table
        className={SubframeCore.twClassNames(
          "border border-solid border-neutral-border w-full group/142dfde7",
          className
        )}
        ref={ref as any}
        {...otherProps}
      >
        <thead>
          {header !== undefined ? (
            header
          ) : (
            <HeaderRow>
              <HeaderCell />
              <HeaderCell>Email</HeaderCell>
              <HeaderCell>Role</HeaderCell>
              <HeaderCell />
            </HeaderRow>
          )}
        </thead>
        <tbody>
          {children !== undefined ? (
            children
          ) : (
            <>
              <Row>
                <TextCell primary={true} />
                <TextCell>john.walton@example.com</TextCell>
                <BadgeCell>Developer</BadgeCell>
                <Cell>
                  <div className="flex items-center justify-end grow shrink-0 basis-0 w-full">
                    <Button
                      variant="Neutral Tertiary"
                      size="XSmall"
                      icon="FeatherEdit2"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="Neutral Tertiary"
                      size="XSmall"
                      icon="FeatherTrash"
                    >
                      Delete
                    </Button>
                  </div>
                </Cell>
              </Row>
              <Row>
                <TextCell primary={true}>Roger Wade</TextCell>
                <TextCell>roger.wade@example.com</TextCell>
                <BadgeCell variant="Error">Designer</BadgeCell>
                <Cell>
                  <div className="flex items-center justify-end grow shrink-0 basis-0 w-full">
                    <Button
                      variant="Neutral Tertiary"
                      size="XSmall"
                      icon="FeatherEdit2"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="Neutral Tertiary"
                      size="XSmall"
                      icon="FeatherTrash"
                    >
                      Delete
                    </Button>
                  </div>
                </Cell>
              </Row>
              <Row>
                <TextCell primary={true}>Bob McCarthy</TextCell>
                <TextCell>bob.mccarthy@example.com</TextCell>
                <BadgeCell variant="Warning">Founder</BadgeCell>
                <Cell>
                  <div className="flex items-center justify-end grow shrink-0 basis-0 w-full">
                    <Button
                      variant="Neutral Tertiary"
                      size="XSmall"
                      icon="FeatherEdit2"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="Neutral Tertiary"
                      size="XSmall"
                      icon="FeatherTrash"
                    >
                      Delete
                    </Button>
                  </div>
                </Cell>
              </Row>
              <Row>
                <TextCell primary={true}>Henry Patel</TextCell>
                <TextCell>henry.patel@example.com</TextCell>
                <BadgeCell variant="Success">Product</BadgeCell>
                <Cell>
                  <div className="flex items-center justify-end grow shrink-0 basis-0 w-full">
                    <Button
                      variant="Neutral Tertiary"
                      size="XSmall"
                      icon="FeatherEdit2"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="Neutral Tertiary"
                      size="XSmall"
                      icon="FeatherTrash"
                    >
                      Delete
                    </Button>
                  </div>
                </Cell>
              </Row>
            </>
          )}
        </tbody>
      </table>
    );
  }
);

export const Table = Object.assign(TableRoot, {
  HeaderRow,
  HeaderCell,
  Row,
  Cell,
  TextCell,
  BadgeCell,
});
