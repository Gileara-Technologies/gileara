import NotFoundComponent from "@/components/NotFound";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "404 - Page Not Found | Gileara Technologies",
  description: "The page you're looking for doesn't exist. Let's get you back on track.",
};

export default function NotFound() {
  return (
    <>
      <Navbar />
      <NotFoundComponent />
    </>
  );
}
