import Nav from "@/components/Nav";
import HomeExperience from "@/components/home/HomeExperience";
import BookConsultation from "@/components/BookConsultation";
import Chatbot from "@/components/Chatbot";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Nav />
      <main id="main-content">
        <HomeExperience />
      </main>
      <Footer />
      <BookConsultation />
      <Chatbot />
    </>
  );
}
