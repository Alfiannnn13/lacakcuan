"use client";

import { DateRangePicker } from "@/components/ui/date-range-picker";
import { MAX_DATE_RANGE_DAY } from "@/lib/date-range-picker";
import { UserSettings } from "@prisma/client";
import { differenceInDays, startOfMonth } from "date-fns";
import React, { useState } from "react";
import { toast } from "sonner";
import StatsCards from "./StatsCards";

function Overview({ userSettings }: { userSettings: UserSettings }) {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });

  return (
    <>
      <div className="container flex flex-wrap items-end justify-between gap-6 py-8 px-8">
        <h2 className="text-3xl font-bold">Rekap Transaksi</h2>
        <div className="flex items-center gap-3">
          <DateRangePicker
            initialDateFrom={dateRange.from}
            initialDateTo={dateRange.to}
            showCompare={false}
            onUpdate={(values) => {
              const { from, to } = values.range;

              if (!from || !to) return;
              if (differenceInDays(to, from) > MAX_DATE_RANGE_DAY) {
                toast.error(
                  `Maksimal pilih jangka waktu ${MAX_DATE_RANGE_DAY} hari!`
                );
                return;
              }

              setDateRange({ from, to });
            }}
          />
        </div>
      </div>
      <StatsCards
        userSettings={userSettings}
        from={dateRange.from}
        to={dateRange.to}
      />
    </>
  );
}

export default Overview;
