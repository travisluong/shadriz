import * as React from "react";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";

interface GenericType {
  [key: string]: any;
}

export function GenericCheckboxList<Type extends GenericType>({
  list,
  name,
  defaultValue,
  searchPlaceholder,
  keywordFields,
  template,
}: {
  list: Type[];
  name: string;
  defaultValue?: string[];
  searchPlaceholder: string;
  keywordFields: string[];
  template: (item: Type) => JSX.Element;
}) {
  const [search, setSearch] = React.useState("");

  let filteredList;

  if (search) {
    filteredList = list.filter((item) => {
      const keywordMatches = keywordFields?.filter((field) => {
        return item[field].toLowerCase().includes(search.toLowerCase());
      });
      return keywordMatches?.length;
    });
  } else {
    filteredList = list;
  }

  return (
    <div className="border p-2 rounded-md">
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={searchPlaceholder}
      />
      <div className="max-h-48 overflow-y-scroll">
        {filteredList.map((item) => (
          <div key={item.id} className="flex items-center gap-2 py-1">
            <Checkbox
              name={name}
              defaultChecked={defaultValue?.includes(item.id)}
              value={item.id}
            />{" "}
            {template(item)}
          </div>
        ))}
      </div>
    </div>
  );
}
