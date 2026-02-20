import ProfileEditForm from "@/components/profile-edit-form";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


export default function page() {
  return (
    <div className="shadow rounded-t-[20px] rounded-t-[20px] overflow-hidden">
      <div className="flex flex-col md:flex-row  md:gap-8 p-2 bg-primary/10 ">
        <Avatar className="w-[150px] h-[150px] cursor-pointer">
          {/* <AvatarImage src="/avatar22.png" className="object-cover"/> */}
          <AvatarFallback className="text-[60px]">AS</AvatarFallback>
        </Avatar> 

        <div className=" flex flex-col gap-3 justify-between items-start grow p-2">
          <div>
            <div className="flex items-center gap-3 ">
              <p className="text-2xl sm:text-3xl lg:text-4xl italic font-medium">
                Abdullah Sajjad
              </p>
              <p className="hidden md:block text-[10px] text-white bg-primary px-2 py-1 rounded-[20px]">
                Job Seeker
              </p>
            </div>
            <p className="text-md sm:text-lg md:text-xl italic text-muted-foreground">
              Website developer
            </p>
          </div>

          <div className=" flex flex-wrap gap-x-8">
            <div className="flex flex-col gap-0">
              <Label className="text-primary text-md font-normal italic">
                Email:
              </Label>
              <p className="text-muted-foreground italic text-md underline">
                abdullahmug2332@gmail.com
              </p>
            </div>
            <div>
              <Label className="text-primary text-md font-normal italic">
                Phone:
              </Label>
              <p className="text-muted-foreground italic text-md ">
                03144644174
              </p>
            </div>
            <div>
              <Label className="text-primary text-md font-normal italic">
                Address:
              </Label>
              <p className="text-muted-foreground italic text-md ">
                Lahore, Pakistan
              </p>
            </div>
          </div>
        </div>
      </div>
      <ProfileEditForm />
    </div>
  );
}
