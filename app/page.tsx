import Header from "@/components/home/Header";
import LatestReleases from "@/components/home/LatestReleases";
import NewContent from "@/components/home/NewContent";
import PopularContent from "@/components/home/PopularContent";

export default function Home() {
  return (
    <div className="">
      {/* header */}
      <Header />
      <main
        className="min-h-[65dvh] flex flex-col w-full 
       pb-6 transition-all duration-500 ease-in-out"
      >
        {/* popular */}
        <PopularContent />

        {/* Latest release */}
        <LatestReleases />

        {/* new content */}
        <NewContent />

        {/* footer */}
      </main>
    </div>
  );
}
