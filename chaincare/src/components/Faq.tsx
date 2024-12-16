"use client";
import React from "react";
import { Container } from "@/components/Container";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/24/solid";

export const Faq = () => {
  return (
    <Container className="!p-0">
      <div className="w-full max-w-2xl p-2 mx-auto rounded-2xl">
        {faqdata.map((item) => (
          <div key={item.question} className="mb-5">
            <Disclosure>
              {({ open }) => (
                <>
                  <DisclosureButton className="flex items-center justify-between w-full px-4 py-4 text-lg text-left text-gray-800 rounded-lg bg-gray-50 hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-indigo-100 focus-visible:ring-opacity-75 dark:bg-trueGray-800 dark:text-gray-200">
                    <span>{item.question}</span>
                    <ChevronUpIcon
                      className={`${
                        open ? "transform rotate-180" : ""
                      } w-5 h-5 text-indigo-500`}
                    />
                  </DisclosureButton>
                  <DisclosurePanel className="px-4 pt-4 pb-2 text-gray-500 dark:text-gray-300">
                    {item.answer}
                  </DisclosurePanel>
                </>
              )}
            </Disclosure>
          </div>
        ))}
      </div>
    </Container>
  );
}

const faqdata = [
  {
    question: "What is ChainCare, and how does it work?",
    answer:
      "ChainCare is a decentralized medical record management system built on blockchain technology. It securely stores and provides access to patient records while ensuring privacy and transparency.",
  },
  {
    question: "Who owns and controls the medical data on ChainCare?",
    answer:
      "Patients have complete ownership and control of their medical data. They can grant or revoke access to doctors, hospitals, or other authorized personnel at any time.",
  },
  {
    question: "Is the data stored on ChainCare secure?",
    answer:
      "Yes, ChainCare uses blockchain technology, which ensures that all records are encrypted, tamper-proof, and securely stored in a decentralized network.",
  },
  {
    question: "How can healthcare providers access patient records?",
    answer:
      "Healthcare providers can access patient records only when granted permission by the patient. Permissions can be time-bound and revoked at any time.",
  },
  {
    question: "Does ChainCare comply with healthcare regulations?",
    answer:
      "Yes, ChainCare complies with major healthcare privacy and security regulations, including HIPAA and GDPR, ensuring legal and ethical data management.",
  },
];
