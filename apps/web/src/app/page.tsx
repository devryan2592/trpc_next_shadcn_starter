import { NextPage } from "next";
import ThemeToggleButton from "@repo/ui/components/ThemeToggleButton";
import Link from "next/link";
interface HomeProps {
  // Add your page props here
}

const Home: NextPage<HomeProps> = async ({}) => {
  return (
    <div>
      <ThemeToggleButton />
    </div>
  );
};

export default Home;
