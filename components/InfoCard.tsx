import React from "react";

interface InfoCardProps {
  title: string;
  content: React.ReactNode;
  withBorder?: boolean;
}

const InfoCard: React.FC<InfoCardProps> = ({ title, content, withBorder = true }) => {
  return (
    <div
      className={`p-4 h-400 md:w-[32%] w-full flex items-center ${
        withBorder ? "md:border-r border-b border-b-white/20 md:border-r-white/20" : ""
      }`}
    >
      <div className="flex flex-col space-y-3 w-full">
        <h2 className="text-neutral-200 bg-white/10 rounded-md px-3 py-2 md:text-3xl text-2xl font-bold">
          {title}
        </h2>
        <div className="text-neutral-500 text-light md:text-base text-sm w-full">{content}</div>
      </div>
    </div>
  );
};

export default InfoCard;
