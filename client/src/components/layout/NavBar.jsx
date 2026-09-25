import { NavLink, Link } from "react-router-dom";

export function NavBar() {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-2">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-indigo-600">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-extrabold text-white">
            SF
          </span>
          <span>StudyFlow</span>
        </Link>

        {/* Navigation Links for Commit 3 */}
        <nav className="flex items-center gap-1 sm:gap-4">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex min-h-[44px] items-center px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "font-semibold text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-600 hover:text-indigo-600"
              }`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/courses"
            className={({ isActive }) =>
              `flex min-h-[44px] items-center px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "font-semibold text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-600 hover:text-indigo-600"
              }`
            }
          >
            Courses
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
