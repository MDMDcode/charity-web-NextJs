const API = "https://api-shamel.tmt3.sa/api/v1";

export async function getProject(id: string) {
  try {
    const res = await fetch(`${API}/projects/${id}`, { cache: 'no-store' });
    const json = await res.json();
    return json?.data || null;
  } catch (e) {
    console.error(e);
    return null;
  }
}