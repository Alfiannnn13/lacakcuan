

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// import prisma from "@/lib/prisma";
// import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
  }

  const { currency } = await req.json();
  if (!currency) {
    return NextResponse.json({ error: "Currency is required" }, { status: 400 });
  }

  try {
    const updatedSettings = await prisma.userSettings.update({
      where: { userId: user.id },
      data: { currency },
    });

    return NextResponse.json(updatedSettings);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update currency" }, { status: 500 });
  }
}


export async function GET(request: Request) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  let userSettings = await prisma.userSettings.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!userSettings) {
    userSettings = await prisma.userSettings.create({
      data: {
        userId: user.id,
        currency: "IDR", // Default currency
      },
    });
  }

  revalidatePath("/");
  return Response.json(userSettings);
}
