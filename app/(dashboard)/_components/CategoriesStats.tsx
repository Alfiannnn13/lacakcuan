"use client";

import { GetCategoriesStatsResponseType } from "@/app/api/stats/categories/route";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DateToUTCDate, GetFormatterForCurrency } from "@/lib/helpers";
import { TransactionType } from "@/lib/type";
import { UserSettings } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import React, { useMemo } from "react";

interface Props {
  userSettings: UserSettings;
  from: Date;
  to: Date;
}

function CategoriesStats({ userSettings, from, to }: Props) {
  const statsQuery = useQuery<GetCategoriesStatsResponseType>({
    queryKey: ["overview", "stats", "categories", from, to],
    queryFn: () =>
      fetch(
        `/api/stats/categories?from=${DateToUTCDate(from)}&to=${DateToUTCDate(
          to
        )}`
      ).then((res) => res.json()),
  });

  const formatter = useMemo(() => {
    return GetFormatterForCurrency(userSettings.currency);
  }, [userSettings.currency]);

  return (
    <div className="flex w-full flex-wrap gap-2 md:flex-nowrap">
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <CategoriesCard
          formatter={formatter}
          type="income"
          data={statsQuery.data || []}
        />
      </SkeletonWrapper>
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <CategoriesCard
          formatter={formatter}
          type="expense"
          data={statsQuery.data || []}
        />
      </SkeletonWrapper>
    </div>
  );
}

export default CategoriesStats;

function CategoriesCard({
  data,
  type,
  formatter,
}: {
  type: TransactionType;
  formatter: Intl.NumberFormat;
  data: GetCategoriesStatsResponseType;
}) {
  const filterData = data.filter((el) => el.type === type);
  const total = filterData.reduce((acc, el) => acc + (el._sum?.amount || 0), 0);

  return (
    <Card className="h-80 w-full col-span-6 overflow-hidden">
      <CardHeader>
        <CardTitle className="grid grid-flow-row justify-between gap-2 text-muted-foreground md:grid-flow-col">
            {type === "income" ? "Pemasukan" : "Pengeluaran"} berdasarkan kategori
        </CardTitle>
      </CardHeader>

      <div className="flex items-center justify-between gap-2">
        {filterData.length === 0 && (
            <div className="flex h-60 w-full flex-col items-center justify-center">
                Tidak ada data yang tersedia di periode ini
                <p className="text-sm text-muted-foreground">
                    Silahkan coba pilih kembali periode atau coba tambah baru {type === "income"? "pemasukan" : "pengeluaran"}
                </p>
                
            </div>
        )}

        {filterData.length> 0 && (
            <ScrollArea className="h-60 w-full px-4">
                <div className="flex w-full flex-col gap-4 p-4">
                    {filterData.map((item) => {
                        const amount = item._sum.amount || 0;
                        const percentage = (amount * 100) / (total || amount);

                        return (
                            <div className="flex flex-col gap-2" key={item.category} >
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center text-gray-400">
                                        {item.categoryIcon} {item.category}
                                        <span className="ml-2 text-xs text-muted-foreground">
                                            ({percentage.toFixed(0)}%)
                                        </span>
                                    </span>

                                    <span className="text-sm text-gray-400">
                                        {formatter.format(amount)}
                                    </span>
                                </div>
                                <Progress value= {percentage}
                                    indicator = {
                                        type === "income" ? "bg-emerald-500" : "bg-red-500"
                                    }
                                />
                            </div>
                        )
                    })}
                </div>
            </ScrollArea>
        )}
      </div>
    </Card>
  );
}
