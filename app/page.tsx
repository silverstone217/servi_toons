import Header from "@/components/home/Header";

export default function Home() {
  return (
    <div className="">
      {/* header */}
      <Header />
      <main className="h-[65dvh] flex flex-col items-center justify-center gap-4">
        <h2 className="text-4xl text-primary font-bold ">
          Bienvenu sur Servi Toons
        </h2>
        <p>
          Meilleure application pour lire et publier vos mangas, comics et
          manwha preferes.
        </p>
      </main>
    </div>
  );
}
