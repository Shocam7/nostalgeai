export async function GET(req: Request) {
  let country = req.headers.get("x-user-country") || "";
  let city = req.headers.get("x-user-city") || "";
  let region = req.headers.get("x-user-region") || "";

  // Step 1 — Server detected country
  if (country && country !== "UNKNOWN") {
    const displayName = [city, region, country].filter(Boolean).join(", ");
    return Response.json({ 
      mode: "server",
      city, region, country,
      displayName 
    });
  }

  // Step 2 — FALLBACK: use client IP to detect location
  try {
    const ipRes = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/ip`);
    const { ip } = await ipRes.json();

    if (!ip) {
      return Response.json({ 
        mode: "none",
        city: "", region: "", country: "",
        displayName: ""
      });
    }

    const geo = await fetch(`https://ipapi.co/${ip}/json/`);
    const data = await geo.json();

    city = data.city || "";
    region = data.region || "";
    country = data.country_name || "";

    return Response.json({
      mode: "browser-ip",
      city, region, country,
      displayName: [city, region, country].filter(Boolean).join(", ")
    });

  } catch (err) {
    return Response.json({
      mode: "error",
      city: "", region: "", country: "",
      displayName: ""
    });
  }
}
