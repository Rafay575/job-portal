import Image from "next/image";
import { Button } from "../ui/button";

export default function Hero() {
  return (
    <div className=" min-h-[90vh] bg-primary flex  justify-center px-6 py-10 relative">
        <Image
          src="/herob.png"
          alt="logo"
          width={500}
          height={500}
          className=" w-[16%]  hidden lg:block absolute left-10 bottom-9"
        />
      <div className=" w-full lg:w-[65%]  flex flex-col space-y-3 items-center">
        <p className="!text-[50px] text-white text-center font-medium">
          Find the right talent for your company
        </p>
        <p className="!text-[30px] text-white text-center font-[300] w-[80%]">
          Connecting employers with people quickly through the UK's most
          effective job advert and CV Search service.
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-7 gap-y-5 p-5 mt-auto">
          <div className="flex flex-col gap-2">
            <div className="border-2 rounded-[10px] border-white p-5 flex flex-col items-center">
              <p className="!text-[25px]  xl:!text-[30px] text-white">Pay-Per-Application job</p>
              <p className="subheading font-light text-white text-center w-[65%]">
                Set a budget cap and only pay for the applications you receive
              </p>
              <p className="text-[30px] lg:!text-[40px] text-white font-[700]">Free to Post</p>
            </div>
            <Button type="button" className="w-full py-10 text-[30px] xl:text-[40px] bg-white text-primary hover:bg-white" >Register as Applicant</Button>
          </div>

          <div className="flex flex-col gap-2">
            <div className="border-2 rounded-[10px] border-white p-5 flex flex-col items-center">
              <p className="!text-[25px]  xl:!text-[30px] text-white">Pay-Per-Application job</p>
              <p className="subheading font-light text-white text-center w-[65%]">
                Set a budget cap and only pay for the applications you receive
              </p>
              <p className="text-[30px] lg:!text-[40px] text-white font-[700]">Free to Post</p>
            </div>
            <Button type="button" className="w-full py-10 text-[30px] xl:text-[40px] bg-white text-primary hover:bg-white" >Register as Applicant</Button>
          </div>
        </div>
      </div>
        <Image
          src="/herog.png"
          alt="logo"
          width={500}
          height={500}
          className=" w-[18%] hidden lg:block  absolute right-10 bottom-9" 
        />
    </div>
  );
}
