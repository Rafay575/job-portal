<<<<<<< HEAD
import { Button } from "@/components/ui/button";
import Link from "next/link";
=======
import Hero from "@/components/home/Hero";
import Section2 from "@/components/home/Section2";
import Section3 from "@/components/home/Section3";
import Section5 from "@/components/home/Section5";
import Section6 from "@/components/home/Section6";
import Section8 from "@/components/home/Section8";
import Section7 from "@/components/home/Section7";
import TrendingJobs from "@/components/home/TrendingJobs";

import Section9 from "@/components/home/Section9";
>>>>>>> a6b757683708097f235b88f5d0c12b629a7207db

export default function Home() {
  return (
    <div>
<<<<<<< HEAD
      <p className="text-[25px]">Dashboard</p>
      <Button><Link href="/auth/signup">SignUp</Link></Button>
=======
      <Hero/>
      <Section2/>
      <Section3/>
      <TrendingJobs/>
      <Section5/>
      <Section6/>
      <Section7/>
      <Section8/>
      <Section9/>
>>>>>>> a6b757683708097f235b88f5d0c12b629a7207db
    </div>
  );
}
