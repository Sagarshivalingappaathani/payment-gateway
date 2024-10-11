// components/Card.tsx
import React from "react";
import { RightIcon } from "@/public/svg";

interface CardProps {
  index: number;
  data: {
    image: JSX.Element;
    passType: string;
    price: string;
    duration: string;
    static: string[];
  };
  isProcessing: number | null;
  onChoose: (index: number) => void;
}

const Card: React.FC<CardProps> = ({ index, data, isProcessing, onChoose }) => {
  return (
    <div className="flex flex-col max-w-[360px] md:w-[384px] min-h-[518px] md:min-h-[572px] p-6 bg-white group rounded-2xl border xl:border-none border-[#0B0641] relative">
      <div className="flex flex-row gap-5 items-center">
        <span>{data.image}</span>
        <span className="text-3xl font-bold">{data.passType}</span>
      </div>
      <span className="flex mt-4 text-[#A9A9AA] text-[22px]">
        What You&apos;ll Get
      </span>
      {data.static.map((myData, idx) => (
        <div key={idx} className="flex flex-row gap-3 items-start mt-6 text-left text-lg">
          <div className="pt-1 shrink-0">
            <RightIcon />
          </div>
          <span>{myData}</span>
        </div>
      ))}
      <div className="border border-dashed border-[#A9A9AA] tracking-widest my-4" />
      <div className="h-28">
        <div className="flex flex-col gap-4 justify-between absolute left-6 right-6 bottom-6">
          <div className="flex items-baseline">
            <span className="text-4xl font-bold">₹ {data.price}</span>
            <span>{data.duration}</span>
          </div>
          <div className="flex align-bottom">
            <button
              className="w-full rounded-xl font-semibold text-xl px-4 py-3 bg-[#365CCE] text-white"
              onClick={() => onChoose(index)} // Open modal with selected card index
              disabled={isProcessing !== null && isProcessing !== index} // Disable if another card is processing
            >
              {isProcessing === index ? "Processing..." : "Choose"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
