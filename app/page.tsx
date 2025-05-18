import { getContents } from "@/actions/contentsActions";
import Header from "@/components/home/Header";
import LatestReleases from "@/components/home/LatestReleases";
import NewContents from "@/components/home/NewContents";
import PopularTopContent from "@/components/home/PopularTopContent";

export default async function Home() {
  const contents = await getContents();
  return (
    <div className="">
      {/* header */}
      <Header />
      <main
        className="min-h-[65dvh] flex flex-col w-full 
       pb-6 transition-all duration-500 ease-in-out"
      >
        {/* popular */}
        <PopularTopContent contents={contents} />

        {/* Latest release */}
        <LatestReleases />

        {/* new content */}
        <NewContents contents={contents} />

        {/* footer */}
      </main>
    </div>
  );
}
