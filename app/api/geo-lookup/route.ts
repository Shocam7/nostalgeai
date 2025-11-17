export async function GET(req: Request) {
  try {
    // ❗ Read header set by middleware
    const countryCode = req.headers.get("x-user-country") || "";

    // If we have a country code (IN, BR, US, etc.), guess main city
    // (Better fallback than full IP lookup — Vercel edge hides IP sometimes)
    const countryFallbacks: Record<string, string> = {
      IN: "India",
      BR: "Brazil",
      US: "United States",
      GB: "United Kingdom",
      CA: "Canada",
      AU: "Australia",
      JP: "Japan",
      KR: "South Korea",
      FR: "France",
      DE: "Germany",
      ES: "Spain",
      IT: "Italy",
    };

    let displayName = "";

    if (countryFallbacks[countryCode]) {
      displayName = countryFallbacks[countryCode];
    }

    // Return detected or fallback location
    return Response.json({
      countryCode,
      displayName,
    });

  } catch (e) {
    return Response.json({
      countryCode: "",
      displayName: "",
    });
  }
}
