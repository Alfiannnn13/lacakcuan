// "use client";

// import * as React from "react";

// import { Button } from "@/components/ui/button";
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
//   CommandList,
// } from "@/components/ui/command";
// import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { useMediaQuery } from "@/hooks/use-media-query";
// import { Currencies, Currency } from "@/lib/currencies";
// import { useMutation, useQuery } from "@tanstack/react-query";
// import SkeletonWrapper from "./SkeletonWrapper";
// import { UserSettings } from "@prisma/client";
// import { UpdateUserCurrency } from "@/app/wizard/_actions/userSettings";
// import { toast } from "sonner";

// export function CurrencyComboBox() {
//   const [open, setOpen] = React.useState(false);
//   const isDesktop = useMediaQuery("(min-width: 768px)");
//   const [selectedOption, setSelectedOption] = React.useState<Currency | null>(
//     null
//   );

//   const userSettings = useQuery<UserSettings>({
//     queryKey: ["userSettings"],
//     queryFn: () => fetch("/api/user-settings").then((res) => res.json()),
//   });

//   React.useEffect(() => {
//     if (!userSettings.data) return;
//     const userCurrency = Currencies.find(
//       (currency) => currency.value === userSettings.data.currency
//     );
//     if (userCurrency) setSelectedOption(userCurrency);
//   }, [userSettings.data]);

//   const mutation = useMutation({
//     mutationFn: UpdateUserCurrency,
//   });

//   const selectOption = React.useCallback(
//     (currency: Currency | null) => {
//       if (!currency) {
//         toast.error("Pilih Mata Uang");
//         return;
//       }

//       toast.loading("Memperbarui Mata Uang....", {
//         id: "update-currency",
//       });

//       mutation.mutate(currency.value);
//     },
//     [mutation]
//   );

//   if (isDesktop) {
//     return (
//       <SkeletonWrapper isLoading={userSettings.isFetching}>
//         <Popover open={open} onOpenChange={setOpen}>
//           <PopoverTrigger asChild>
//             <Button variant="outline" className="w-full justify-start">
//               {selectedOption ? (
//                 <>{selectedOption.label}</>
//               ) : (
//                 <>Atur Mata Uang</>
//               )}
//             </Button>
//           </PopoverTrigger>
//           <PopoverContent className="w-[200px] p-0" align="start">
//             <OptionList
//               setOpen={setOpen}
//               setSelectedOption={setSelectedOption}
//             />
//           </PopoverContent>
//         </Popover>
//       </SkeletonWrapper>
//     );
//   }

//   return (
//     <SkeletonWrapper isLoading={userSettings.isFetching}>
//       <Drawer open={open} onOpenChange={setOpen}>
//         <DrawerTrigger asChild>
//           <Button variant="outline" className="w-full justify-start">
//             {selectedOption ? <>{selectedOption.label}</> : <>Atur Mata Uang</>}
//           </Button>
//         </DrawerTrigger>
//         <DrawerContent>
//           <div className="mt-4 border-t">
//             <OptionList
//               setOpen={setOpen}
//               setSelectedOption={setSelectedOption}
//             />
//           </div>
//         </DrawerContent>
//       </Drawer>
//     </SkeletonWrapper>
//   );
// }

// function OptionList({
//   setOpen,
//   setSelectedOption,
// }: {
//   setOpen: (open: boolean) => void;
//   setSelectedOption: (status: Currency | null) => void;
// }) {
//   return (
//     <Command>
//       <CommandInput placeholder="Filter Mata Uang..." />
//       <CommandList>
//         <CommandEmpty>No results found.</CommandEmpty>
//         <CommandGroup>
//           {Currencies.map((currency: Currency) => (
//             <CommandItem
//               key={currency.value}
//               value={currency.value}
//               onSelect={(value) => {
//                 setSelectedOption(
//                   Currencies.find((priority) => priority.value === value) ||
//                     null
//                 );
//                 setOpen(false);
//               }}
//             >
//               {currency.label}
//             </CommandItem>
//           ))}
//         </CommandGroup>
//       </CommandList>
//     </Command>
//   );
// }


"use client";

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
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Currencies, Currency } from "@/lib/currencies";
import { useMutation, useQuery } from "@tanstack/react-query";
import SkeletonWrapper from "./SkeletonWrapper";
import { UserSettings } from "@prisma/client";
import { toast } from "sonner";

// Fungsi API Client-side untuk mengupdate currency
async function updateCurrencyAPI(currency: string): Promise<UserSettings> {
  const response = await fetch("/api/user-settings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ currency }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to update currency");
  }

  return response.json();
}

export function CurrencyComboBox() {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [selectedOption, setSelectedOption] = React.useState<Currency | null>(null);

  const userSettings = useQuery<UserSettings>({
    queryKey: ["userSettings"],
    queryFn: () => fetch("/api/user-settings").then((res) => res.json()),
  });

  React.useEffect(() => {
    if (!userSettings.data) return;
    const userCurrency = Currencies.find(
      (currency) => currency.value === userSettings.data.currency
    );
    if (userCurrency) setSelectedOption(userCurrency);
  }, [userSettings.data]);

  // Perbaikan di bagian useMutation
  const mutation = useMutation<UserSettings, Error, string>({
    mutationFn: updateCurrencyAPI,
    onSuccess: (data) => {
      toast.success("Mata Uang berhasil diperbarui!", { id: "update-currency" });
      setSelectedOption(
        Currencies.find((c) => c.value === data.currency) || null
      );
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`, { id: "update-currency" });
    },
  });
  
  
 

  const selectOption = React.useCallback(
    (currency: Currency | null) => {
      if (!currency) {
        toast.error("Pilih Mata Uang");
        return;
      }

      toast.loading("Memperbarui Mata Uang...", { id: "update-currency" });
      mutation.mutate(currency.value);
    },
    [mutation]
  );

  if (isDesktop) {
    return (
      <SkeletonWrapper isLoading={userSettings.isFetching}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start" disabled={mutation.isPending}>
              {selectedOption ? selectedOption.label : "Atur Mata Uang"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0" align="start">
            <OptionList setOpen={setOpen} setSelectedOption={selectOption} />
          </PopoverContent>
        </Popover>
      </SkeletonWrapper>
    );
  }

  return (
    <SkeletonWrapper isLoading={userSettings.isFetching}>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button variant="outline" className="w-full justify-start">
            {selectedOption ? selectedOption.label : "Atur Mata Uang"}
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mt-4 border-t">
            <OptionList setOpen={setOpen} setSelectedOption={selectOption} />
          </div>
        </DrawerContent>
      </Drawer>
    </SkeletonWrapper>
  );
}

function OptionList({
  setOpen,
  setSelectedOption,
}: {
  setOpen: (open: boolean) => void;
  setSelectedOption: (status: Currency | null) => void;
}) {
  return (
    <Command>
      <CommandInput placeholder="Filter Mata Uang..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {Currencies.map((currency: Currency) => (
            <CommandItem
              key={currency.value}
              value={currency.value}
              onSelect={(value) => {
                setSelectedOption(
                  Currencies.find((priority) => priority.value === value) || null
                );
                setOpen(false);
              }}
            >
              {currency.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
