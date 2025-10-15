import { LoginBodyType } from "@/schemaValidations/auth.schema";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const res = (await request.json()) as LoginBodyType;
  const cookieStore = await cookies();
}
