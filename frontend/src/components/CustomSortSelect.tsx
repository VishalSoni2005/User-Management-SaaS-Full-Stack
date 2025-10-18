import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CustomSortSelect() {
  return (
    <Select>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Select a sorting mechanism" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Sort by</SelectLabel>
          <SelectItem value="firstName">First Name</SelectItem>
          <SelectItem value="lastName">Last Name</SelectItem>
          <SelectItem value="email">Email</SelectItem>
          <SelectItem value="createdAt">CreatedAt</SelectItem>
          <SelectItem value="id">ID</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default CustomSortSelect;