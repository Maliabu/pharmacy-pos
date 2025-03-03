/* eslint-disable @typescript-eslint/no-explicit-any */
import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
// change cdmk to 1.0.4 in package and npm i again to fix command shadcn@latest bugs
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Stock } from "../dashboard/stock/dataColumns";

export default function SelectSearch(props: {products: Stock[], fields: any}) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex items-center justify-center">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between w-full"
          >
            {props.fields.value
              ? props.products.find((product) => product.id.toString()+product.name === props.fields.value)?.name
              : "Select a product..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-2">
          <Command>
            <CommandInput placeholder="Search product..." />
            <CommandEmpty>No products found.</CommandEmpty>
            <CommandGroup>
              <CommandList>
                {props.products.map((product) => (
                  <CommandItem
                    key={product.id}
                    value={product.id.toString()+product.name}
                    onSelect={props.fields.onChange}
                    className="flex justify-between cursor-pointer"
                  >
                  {product.name}
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        props.fields.value === product.id.toString()+product.name ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandList>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}