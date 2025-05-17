"use client";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type DataValueType = {
  label: string;
  value: string;
};

interface SelectProps {
  value: string;
  data: DataValueType[];
  isRequired?: boolean;
  isDisabled?: boolean;
  placeholder?: string;
  onChangeValue: (value: string) => void;
  name?: string;
}

const SelectComponent = ({
  data,
  isDisabled = false,
  isRequired = false,
  placeholder = "Choisir une option",
  value,
  onChangeValue,
  name,
}: SelectProps) => {
  return (
    <Select
      required={isRequired}
      disabled={isDisabled}
      defaultValue={value}
      onValueChange={onChangeValue}
      name={name}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {data.map((val) => (
          <SelectItem value={val.value} key={val.value}>
            {val.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SelectComponent;
