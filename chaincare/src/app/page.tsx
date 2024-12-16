"use client";

import { Container } from "@/components/Container";
import { Hero } from "@/components/Hero";
import { SectionTitle } from "@/components/SectionTitle";
import { Benefits } from "@/components/Benefits";
import { Testimonials } from "@/components/Testimonials";
import { Faq } from "@/components/Faq";
import { Navbar } from "@/components/Navbar";
import { TeamSection } from "@/components/Team"

import { benefitOne, benefitTwo } from "@/components/data";
import { Footer } from "@/components/Footer";
export default function Home() {
  return (
    <Container>
      <Navbar />
      <Hero />
      <SectionTitle
        preTitle="ChainCare Benefits"
        title="Why Use ChainCare for Medical Records?"
      >
        ChainCare is a decentralized application (DApp) built on blockchain technology to securely store, manage, and share medical records. With enhanced security, privacy, and accessibility, ChainCare transforms how medical data is handled.
      </SectionTitle>

      <Benefits data={benefitOne} />
      <Benefits imgPos="right" data={benefitTwo} />

      <SectionTitle
        preTitle="How It Works"
        title="Discover How ChainCare Simplifies Medical Record Management"
      >
        Watch our demo video to understand how ChainCare securely manages your health records, allows seamless access, and empowers patients and doctors with blockchain-powered transparency.
      </SectionTitle>

      {/* Add a Video Component Here */}

      <SectionTitle
        preTitle="Testimonials"
        title="What Our Users Are Saying"
      >
        Our users trust ChainCare for secure, efficient, and transparent medical record management. Here’s what they have to say about their experience.
      </SectionTitle>

      <Testimonials />

      <SectionTitle preTitle="FAQ" title="Frequently Asked Questions">
        Have questions about how ChainCare works? Find answers to common queries here and learn how to get started with our blockchain-powered medical record manager.
      </SectionTitle>

      <Faq />
      <TeamSection />
    </Container>
  );
}
