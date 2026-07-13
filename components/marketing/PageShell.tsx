import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import BookConsultation from "@/components/BookConsultation";
import Chatbot from "@/components/Chatbot";

export default function PageShell({ children }: { children: React.ReactNode }) {
  return <><Nav /><main id="main-content" className="pt-[72px]">{children}</main><Footer /><BookConsultation /><Chatbot /></>;
}
