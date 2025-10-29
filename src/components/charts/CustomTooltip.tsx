import { cn } from "../../utils/utils";

const CustomTooltip: React.FC<{
  title: string;
  percent: string;
  position: { x: number; y: number };
  visible: boolean;
}> = ({ title, percent, position, visible }) => (
  <div
    style={{
      position: "absolute",
      top: `${position.y}px`,
      left: `${position.x}px`,
      transform: "translate(-50%, -100%)",
      opacity: visible ? 1 : 0,
      transition: "opacity 0.2s ease, transform 0.2s ease",
      pointerEvents: "none",
    }}
    className={cn(
      "z-50 flex flex-col items-center gap-1 rounded-xl border border-iconHover bg-backgroundMain px-3 py-2 font-nunito text-sm font-bold text-textBlack shadow-md"
    )}
  >
    <div>{title}</div>
    <div>{percent}</div>
  </div>
);

export default CustomTooltip;
