// Country code → Country name map (minimal but accurate)
const countryNames: Record<string, string> = {
  IN: "India",
  PL: "Poland",
  FR: "France",
  BR: "Brazil",
  US: "United States",
  GB: "United Kingdom",
  CA: "Canada",
  AU: "Australia",
  DE: "Germany",
  JP: "Japan",
  KR: "South Korea",
  ES: "Spain",
  IT: "Italy"
};

export async function GET(req: Request) {
  let countryCode = req.headers.get("x-user-country") || "";
  let city = req.headers.get("x-user-city") || "";
  let region = req.headers.get("x-user-region") || "";

  let countryName = countryNames[countryCode] || "";

  // ------ 1. Server-side geolocation detected ------
  if (countryCode && countryCode !== "UNKNOWN") {
    const displayName = [city, region, countryName].filter(Boolean).join(", ");
    
    return Response.json({
      mode: "server",
      countryCode,
      countryName,
      city,
      region,
      displayName
    });
  }

  // ------ 2. Fallback to client IP ------
  try {
    // Get the user's IP from /api/ip
    const ipRes = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/ip`);
    const { ip } = await ipRes.json();

    if (!ip) {
      return Response.json({
        mode: "none",
        countryCode: "",
        countryName: "",
        city: "",
        region: "",
        displayName: ""
      });
    }

    // Resolve IP into geolocation
    const geoRes = await fetch(`https://ipapi.co/${ip}/json/`);
    const data = await geoRes.json();

    countryCode = data.country || "";
    countryName = data.country_name || "";
    city = data.city || "";
    region = data.region || "";

    return Response.json({
      mode: "browser-ip",
      countryCode,
      countryName,
      city,
      region,
      displayName: [city, region, countryName].filter(Boolean).join(", ")
    });

  } catch (err) {
    return Response.json({
      mode: "error",
      countryCode: "",
      countryName: "",
      city: "",
      region: "",
      displayName: ""
    });
  }
}
  
