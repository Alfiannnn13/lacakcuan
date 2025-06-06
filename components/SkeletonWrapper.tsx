import React, { ReactNode } from 'react'
import { Skeleton } from './ui/skeleton';
import { cn } from '@/lib/utils';

function SkeletonWrapper({
    children,
    isLoading,
    fullWidth = true,
}: {
    children: ReactNode;
    isLoading: boolean;
    fullWidth?: boolean;
}) {
    if (!isLoading) return children;
  return (
    <Skeleton className={cn(fullWidth && "w-full")}>
        <div className="opacity-10">{children}</div>
    </Skeleton>
  )
}

export default SkeletonWrapper

// import React, { ReactNode } from 'react';
// import { Skeleton } from './ui/skeleton';
// import { cn } from '@/lib/utils';

// function SkeletonWrapper({
//   children,
//   isLoading,
//   fullWidth = true,
// }: {
//   children: ReactNode;
//   isLoading: boolean;
//   fullWidth?: boolean;
// }) {
//   // Jika sedang loading, tampilkan skeleton
//   if (isLoading) {
//     return (
//       <Skeleton className={cn(fullWidth && "w-full")}>
//         {/* Menampilkan loading skeleton */}
//       </Skeleton>
//     );
//   }

//   // Jika tidak loading, tampilkan konten aslinya
//   return (
//     <div className="opacity-10">
//       {children}
//     </div>
//   );
// }

// export default SkeletonWrapper;
