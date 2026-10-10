import { NextResponse } from "next/server";

import { handle } from "../../http";
import { signOut } from "../session";

export const logout = handle(async (request) => signOut(request, new NextResponse(null, { status: 204 })));
