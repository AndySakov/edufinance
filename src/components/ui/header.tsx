import { PropsWithChildren } from "react";
// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// import { BellIcon } from "@radix-ui/react-icons";

export interface HeaderProps {
  title: string;
}

const Header = (props: PropsWithChildren<HeaderProps>) => {
  return (
    <header className="flex justify-between items-center pb-4">
      <div>
        <h1 className="font-bold text-2xl">{props.title}</h1>
      </div>
      {/* <div className="flex items-center space-x-4">
        <BellIcon className="w-5 h-5 text-gray-500" />
        <Avatar>
          <AvatarImage src="/placeholder-user.jpg" />
          <AvatarFallback>TS</AvatarFallback>
        </Avatar>
      </div> */}
    </header>
  );
};

export default Header;
