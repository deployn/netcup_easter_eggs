const refs = [
  "/",
  "/bestellen/agb.php",
  "/bestellen/domainangebote.php",
  "/bestellen/softwareangebote.php",
  "/hosting",
  "/hosting/qualitaetsgarantien.php",
  "/hosting/reseller-webhosting.php",
  "/hosting/webhosting-application-hosting.php",
  "/hosting/webhosting-testaccount.php",
  "/jobs/",
  "/kontakt/datenschutzerklaerung.php",
  "/kontakt/disclaimer.php",
  "/kontakt/impressum.php",
  "/managed-server/managed-server.php",
  "/professional/",
  "/professional/colocation/",
  "/professional/dedizierte-server/",
  "/professional/managed-server/",
  "/professional/managed-server/managed-cloud-cluster.php",
  "/professional/softwareentwicklung/",
  "/ssl-zertifikate/",
  "/ssl-zertifikate/geotrust.php",
  "/ssl-zertifikate/globe.php",
  "/ssl-zertifikate/rapid.php",
  "/ssl-zertifikate/thawte.php",
  "/support/",
  "/ueber-netcup/",
  "/ueber-netcup/auszeichnungen.php",
  "/ueber-netcup/ddos-schutz-filter.php",
  "/ueber-netcup/hardware-infrastruktur.php",
  "/ueber-netcup/rechenzentrum.php",
  "/ueber-netcup/zahlen/",
  "/vserver/",
  "/vserver/reseller_angebote_vserver.php",
  "/vserver/root-server-erweiterungen.php",
  "/vserver/storagespace.php",
  "/vserver/uebersicht_vserver_angebote.php",
  "/vserver/vergleich-linux-vserver-kvm.php",
  "/vserver/vergleich-root-server-vps.php",
  "/vserver/vps.php",
  "/vserver/vserver_guenstig_qualitaet.php",
  "/vserver/vserver_images.php",
  "/vserver/vstorage.php"
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
