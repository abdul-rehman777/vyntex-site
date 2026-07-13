import type { Metadata } from "next"; import ServicesHub from "@/components/marketing/ServicesHub";
export const metadata: Metadata = { title: "Services | VYNTEX", description: "Explore VYNTEX website development, AI automation, CRM, chatbot, branding, and digital marketing services." };
export default function Page(){ return <ServicesHub/>; }
