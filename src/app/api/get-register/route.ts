import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { firstName, lastName, email, countryCode, phone } =
      await req.json();

    if (!firstName || !lastName || !email || !countryCode || !phone) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    if (!["US", "CA"].includes(countryCode)) {
      return NextResponse.json(
        { error: "Invalid country code." },
        { status: 400 }
      );
    }

    const digitsOnly = phone.replace(/\D/g, "");

    if (digitsOnly.length < 10) {
      return NextResponse.json(
        { error: "Invalid phone number." },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("ged_leads").insert({
      first_name: firstName,
      last_name: lastName,
      email,
      country_code: countryCode,
      phone: digitsOnly,
    });

    if (error) {
      console.error("Supabase insert error:", error);

      // Allow duplicate emails
      if (error.code !== "23505") {
        return NextResponse.json(
          { error: "Failed to save. Please try again." },
          { status: 500 }
        );
      }
    }

    const response = NextResponse.json({ success: true });

    response.cookies.set("ged_access", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 30, // 30 minutes
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("API error:", err);

    return NextResponse.json(
      { error: "Unexpected error." },
      { status: 500 }
    );
  }
}