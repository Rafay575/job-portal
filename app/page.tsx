import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <p className="text-[25px]">Dashboard</p>
      <Button><Link href="/auth/signup/step/1">SignUp</Link></Button>
    </div>
  );
}
