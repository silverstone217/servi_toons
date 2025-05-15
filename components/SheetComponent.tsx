"use client";
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface SheetComponentProps {
  trigger: React.ReactNode;
  content: React.ReactNode;
  title?: string;
  description?: string;
  side?: "left" | "right" | "top" | "bottom";
}

const SheetComponent = ({
  content,
  trigger,
  title,
  description,
  side = "right",
}: SheetComponentProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent
        side={side}
        className="flex flex-col gap-2.5 w-full overflow-x-hidden overflow-y-auto py-2"
      >
        <SheetHeader>
          <SheetTitle hidden={!title}>{title}</SheetTitle>
          <SheetDescription hidden={!description}>
            {description}
          </SheetDescription>
        </SheetHeader>
        {/* Content */}
        {content}
      </SheetContent>
    </Sheet>
  );
};

export default SheetComponent;
