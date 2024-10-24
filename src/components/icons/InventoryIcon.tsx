import { IconProps } from "../../models/IconProps";

const InventoryIcon = ({
  color = "#000000",
  size = "24",
  className,
}: IconProps) => {
  // Create conditional attributes based on className
  const svgProps = className
    ? { className } // If className is provided, use only className
    : { width: size, height: size, fill: color }; // Otherwise, use size and color

  return (
    <svg xmlns="http://www.w3.org/2000/svg" {...svgProps} viewBox="0 0 256 256">
      <path d="M144,192a8,8,0,0,1-8,8H120a8,8,0,0,1,0-16h16A8,8,0,0,1,144,192ZM120,72h16a8,8,0,0,0,0-16H120a8,8,0,0,0,0,16Zm16,48H120a8,8,0,0,0,0,16h16a8,8,0,0,0,0-16Zm80-80V216a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V40A16,16,0,0,1,56,24H200A16,16,0,0,1,216,40ZM56,152H200V104H56ZM56,40V88H200V40ZM200,216V168H56v48H200Z"></path>
    </svg>
  );
};

export default InventoryIcon;
