export interface LogoProps {
  variant: "light" | "dark";
}

const LogoDark = () => {
  return (
    <h1 className="font-bold text-2xl">
      <span className="text-black">Edu</span>
      <span className="text-gray-600">Finance</span>
    </h1>
  );
};

const LogoLight = () => {
  return (
    <h1 className="mx-6 text-3xl text-white">
      <span className="font-bold">Edu</span>
      <span className="font-thin">Finance</span>
    </h1>
  );
};

const Logo = (props: LogoProps) => {
  if (props.variant === "dark") {
    return <LogoDark />;
  } else {
    return <LogoLight />;
  }
};

export default Logo;
