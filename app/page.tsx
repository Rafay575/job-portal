import Hero from "@/components/home/Hero";
import Section2 from "@/components/home/Section2";
import Section3 from "@/components/home/Section3";
import TrendingJobs from "@/components/home/TrendingJobs";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Hero/>
      <Section2/>
      <Section3/>
      <TrendingJobs/>
      <Button><Link href="/auth/signup/step1">SignUp</Link></Button>
    </div>
  );
}
