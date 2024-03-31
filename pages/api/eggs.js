const refs = [
  "/",
  "/bestellen/domainangebote.php?art=laender",
  "/ssl-zertifikate/",
  "/ssl-zertifikate/thawte.php",
  "/professional/managed-server/managed-cloud-cluster.php",
  "/hosting/",
  "/bestellen/domainangebote.php?art=neu",
  "/ssl-zertifikate",
  "/professional/softwareentwicklung/",
  "/kontakt/datenschutzerklaerung.php",
  "/kontakt/impressum.php",
  "/vserver/arm-server",
  "/hosting/qualitaetsgarantien.php",
  "/professional/managed-server",
  "/hosting/webhosting-application-hosting.php",
  "/groupware",
  "/vserver/local-block-storage/",
  "/bestellen/domainangebote.php?art=reseller",
  "/bestellen/softwareangebote.php",
  "/ssl-zertifikate/rapid.php",
  "/hosting/reseller-webhosting.php",
  "/hosting",
  "/kontakt/disclaimer.php",
  "/bestellen/domainangebote.php?art=global",
  "/hosting/webhosting-testaccount.php",
  "/professional/managed-server/managed-privateserver.php",
  "/professional/colocation",
  "/professional/dedizierte-server/",
  "/professional/managed-server/managed-server.php",
  "/ssl-zertifikate/geotrust.php",
  "/vserver/",
  "/bestellen/domainangebote.php",
  "/professional/",
  "/vserver/vps.php",
  "/professional/managed-server/managed-privateserver-erweiterungen.php",
  "/support",
];

const fetchEgg = async (requrl) => {
  try {
    return fetch("https://www.netcup.de/api/eggs", {
      method: "post",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `requrl=${encodeURIComponent(requrl)}`,
    });
  } catch (error) {
    console.log(`failed to fetch the egg from ${requrl}`, error);
  }
};

const parseBody = async (resp) => {
  if (resp && resp.ok) {
    try {
      const body = await resp.json();
      if (body.eggs && body.eggs.length) {
        return body.eggs[0];
      }
    } catch (error) {
      console.log(`failed to parse the body of the egg from ${requrl}`, error);
    }
  }
};

const getEgg = async (requrl) => {
  const resp = await fetchEgg(requrl);
  const body = await parseBody(resp);
  return { ...body, requrl: `https://www.netcup.de${requrl}` };
};

export const getEggs = async () => {
  const eggs = await Promise.all(refs.map((ref) => getEgg(ref)));
  eggs.sort((a, b) => {
    if (a.title && b.title) {
      return a.title.localeCompare(b.title);
    }
    return a.requrl.localeCompare(b.requrl);
  });
  return eggs;
};

export default async function handler(req, res) {
  const eggs = await getEggs();
  res.status(200).json(eggs);
}
