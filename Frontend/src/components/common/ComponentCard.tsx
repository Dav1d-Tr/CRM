import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface ComponentCardProps {
  icon: ReactNode;
  title: string;
  information: string;
  link?: string;
  onClick?: () => void;
}

const ComponentCard: React.FC<ComponentCardProps> = ({
  icon,
  title,
  information,
  link,
  onClick
}) => {

  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) onClick();
    else if (link) navigate(link);
  };



  return (
    <article

      onClick={handleClick}
      className="cursor-pointer md:w-80  w-full"
    >
      <div className="rounded-2xl border-2 w-full h-52 text-gray-900 dark:text-white border-[#c64a64] dark:border-gray-200 bg-white dark:bg-white/[0.03] p-6 grid gap-2 hover:scale-105 transition-transform">
        <div className="flex justify-between items-center">
          <div className="text-title-md font-semibold">{title}</div>
          <div className="text-5xl text-[#b22948]">{icon}</div>
        </div>

        <div className="pb-2 border-b-4 border-[#b22948]">
          <p>{information}</p>
        </div>
      </div>
    </article>
  );
};

export default ComponentCard;
