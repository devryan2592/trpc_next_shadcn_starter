import { NextPage } from "next";
import ThemeToggleButton from "@repo/ui/components/ThemeToggleButton";
import Link from "next/link";
import { trpcServer } from "../trpc/server";
interface HomeProps {
  // Add your page props here
}

const Home: NextPage<HomeProps> = async ({}) => {
  const data = await trpcServer.healthcheck.query();


  return (
    <div>
      <ThemeToggleButton />
      <Link href="/new">{data}</Link>
    </div>
  );
};

export default Home;
