import BackgroundImageCycle from "@/components/BackgroundImageCycle";

type Props = {
  children: React.ReactNode;
};

const layout = (props: Props) => {
  return (
    <div className="h-full bg-midnight-blue/75 relative">
      <BackgroundImageCycle />
      {props.children}
    </div>
  );
};

export default layout;
