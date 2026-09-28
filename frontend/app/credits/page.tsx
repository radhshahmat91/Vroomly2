import Link from "next/link";

const fleet = [
  ["Toyota Corolla Altis", "LuvsMG481", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:2020_Toyota_Corolla_Altis_petrol_version_front.jpg"],
  ["Honda CR-V", "Ee2mba", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Facelift_2020_Honda_CR-V.jpg"],
  ["Toyota Premio", "Shadman Samee", "CC BY-SA 2.0", "https://commons.wikimedia.org/wiki/File:Toyota_Premio,_Bangladesh._(32038852164).jpg"],
  ["BMW 3 Series", "Charles / usf1fan2", "CC BY 2.0", "https://commons.wikimedia.org/wiki/File:BMW_3-Series_(G20)_330_e_(2022)_(52569079269).jpg"],
  ["Mercedes-Benz C-Class", "Charles / usf1fan2", "CC0", "https://commons.wikimedia.org/wiki/File:Mercedes-Benz_C_200_(W206,_2025)_(54740572519).jpg"],
  ["Hyundai Tucson", "SSJF01", "CC0", "https://commons.wikimedia.org/wiki/File:Hyundai_Tucson_(NX4).png"],
  ["Tesla Model 3", "Raneko2", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Tesla_Model3.jpg"],
  ["Nissan X-Trail", "Dx6682", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:T33_NISSAN_X-TRAIL.jpg"],
  ["Hyundai Ioniq", "Benespit", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Hyundai_Ioniq.jpg"],
  ["Mitsubishi Pajero", "Stahlkocher", "CC BY-SA 3.0 / GFDL", "https://commons.wikimedia.org/wiki/File:Mitsubishi_Pajero.jpg"],
  ["Suzuki Alto", "FSO", "Public domain", "https://commons.wikimedia.org/wiki/File:Suzuki_Alto.jpg"],
  ["Kia Sportage", "Corvettec6r", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:2022_Kia_Sportage.jpg"],
  ["Toyota Hiace", "Oq10pass", "CC0", "https://commons.wikimedia.org/wiki/File:Toyota_HiAce_Van_DX_%2720_(1).jpg"],
  ["Honda Civic", "Bull-Doser", "Public domain", "https://commons.wikimedia.org/wiki/File:%2722_Honda_Civic.jpg"],
] as const;

export default function CreditsPage() {
  return (
    <main className="container-page py-12 sm:py-16">
      <div className="max-w-3xl">
        <Link href="/" className="text-sm font-medium text-route-600 hover:underline">← Back to Vroomly</Link>
        <h1 className="mt-4 font-display text-5xl text-ink">Demo fleet assets</h1>
        <p className="mt-3 text-sm leading-6 text-ink-soft/70">
          The seeded Vroomly fleet uses real photographs matched to each vehicle model. Images are served from Wikimedia Commons at 1280px so the cards stay sharp without loading the full-resolution originals.
        </p>
      </div>

      <div className="mt-10 grid gap-3 sm:grid-cols-2">
        {fleet.map(([car, author, license, source]) => (
          <div key={car} className="rounded-xl border border-line bg-paper-raised p-4">
            <p className="font-display text-lg text-ink">{car}</p>
            <p className="mt-1 text-xs text-ink-soft/60">Photo by {author} · {license}</p>
            <a href={source} target="_blank" rel="noreferrer" className="mt-3 inline-block text-xs font-medium text-route-600 hover:underline">View photo source ↗</a>
          </div>
        ))}
      </div>
    </main>
  );
}
