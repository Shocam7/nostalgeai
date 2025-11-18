export async function GET() {
  try {
    const ipRes = await fetch("https://api.ipify.org?format=json");
    const data = await ipRes.json();

    return Response.json({
      ip: data.ip || null
    });
  } catch (e) {
    return Response.json({ ip: null });
  }
}
