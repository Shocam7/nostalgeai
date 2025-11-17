export async function GET(req: Request) {
  const geo = {
    ip: "",
    city: "",
    region: "",
    country: "",
    countryCode: "",
    displayName: "",
  };

  try {
    // Read IP from Vercel
    const ip =
      (req.headers.get("x-forwarded-for") || "").split(",")[0]?.trim() || "";
    geo.ip = ip;

    // Call IP geolocation API
    const res = await fetch(`https://ipapi.co/${ip}/json/`);
    const data = await res.json();

    geo.city = data.city || "";
    geo.region = data.region || "";
    geo.country = data.country_name || "";
    geo.countryCode = data.country || "";

    // Build display name for LocationTab input
    const locParts = [geo.city, geo.region, geo.country].filter(Boolean);
    geo.displayName = locParts.join(", ");

    return Response.json(geo);
  } catch (e) {
    return Response.json({
      error: "Failed to detect location",
      displayName: "",
    });
  }
}
