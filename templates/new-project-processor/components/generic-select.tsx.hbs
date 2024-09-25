"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface GenericType {
  [key: string]: any;
}

export function GenericSelect<Type extends GenericType>({
  list,
  name,
  placeholder,
  valueField,
  labelField,
  defaultValue,
}: {
  list: GenericType[];
  name: string;
  placeholder: string;
  valueField: string;
  labelField: string;
  defaultValue?: string | null;
}) {
  const [value, setValue] = useState(defaultValue);

  function handleValueChange(val: string) {
    if (val === "none") {
      setValue("");
    } else {
      setValue(val);
    }
  }

  return (
    <Select
      name={name}
      value={value ?? undefined}
      onValueChange={handleValueChange}
    >
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem key="none" value="none">
          {placeholder}
        </SelectItem>
        {list.map((item) => (
          <SelectItem key={item[valueField]} value={item[valueField]}>
            {item[labelField]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
