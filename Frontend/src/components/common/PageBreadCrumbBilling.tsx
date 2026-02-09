import { Link } from "react-router";
import { useSidebar } from "../../context/SidebarContext";

interface BreadcrumbProps {
  pageTitle: string;
}

const PageBreadcrumb: React.FC<BreadcrumbProps> = ({ pageTitle }) => {

   const {
    isMobileOpen,
    isExpanded,
    isHovered
  } = useSidebar();

  const sidebarWidth =
    (isHovered || isExpanded) && !isMobileOpen ? 290 : 0;

  const headerWidth =
    window.innerWidth >= 1024
      ? `calc(100% - ${sidebarWidth}px)`
      : "100%";

  return (
    <div
        style={{ width: headerWidth }}
        className={`fixed right-0 w-fit z-10 mt-10 lg:mt-13 flex ${(isExpanded || isHovered) ? "" : "lg:pl-32"} flex-wrap items-center justify-between gap-3 mb-6 w-full bg-white dark:bg-gray-900  py-3.5 px-8 lg:px-10`}
      >
      <h2
        className="hidden lg:block text-2xl font-semibold text-gray-800 dark:text-white/90"
        x-text="pageName"
      >
        {pageTitle}
      </h2>
      <nav>
        <ol className="flex items-center gap-1.5 lg:pr-3">
          <li>
            <Link
              className="inline-flex items-center gap-1.5 text-base text-gray-500 dark:text-gray-400"
              to="/"
            >
              Home
              <svg
                className="stroke-current"
                width="17"
                height="16"
                viewBox="0 0 17 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                  stroke=""
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </li>
          <li>
            <Link
              className="inline-flex items-center gap-1.5 text-base text-gray-500 dark:text-gray-400"
              to="/billed"
            >
              Facturado
              <svg
                className="stroke-current"
                width="17"
                height="16"
                viewBox="0 0 17 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                  stroke=""
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </li>
          <li className="text-xs lg:text-base text-gray-800 dark:text-white/90">
            {pageTitle}
          </li>
        </ol>
      </nav>
    </div>
  );
};

export default PageBreadcrumb;
