import {
  LockClosedIcon,
  ClipboardDocumentCheckIcon,
  UsersIcon,
  CloudArrowDownIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/solid";

import benefitOneImg from "../../public/img/healthcare1.png";
import benefitTwoImg from "../../public/img/hero3.png";

const benefitOne = {
  title: "Why Choose ChainCare?",
  desc: "ChainCare revolutionizes medical data management with blockchain technology, ensuring security, transparency, and accessibility for your health records.",
  image: benefitOneImg,
  bullets: [
    {
      title: "Secure and Private Data",
      desc: "Blockchain ensures end-to-end encryption and tamper-proof medical records.",
      icon: <LockClosedIcon />,
    },
    {
      title: "Seamless Access",
      desc: "Patients and doctors can securely access medical data anytime, anywhere.",
      icon: <ClipboardDocumentCheckIcon />,
    },
    {
      title: "Improved Collaboration",
      desc: "Facilitates collaboration between healthcare providers for better treatment outcomes.",
      icon: <UsersIcon />,
    },
  ],
};

const benefitTwo = {
  title: "Key Features of ChainCare",
  desc: "Our platform offers cutting-edge features to manage and protect medical records efficiently. Built for scalability, security, and ease of use.",
  image: benefitTwoImg,
  bullets: [
    {
      title: "Decentralized Storage",
      desc: "Records are securely stored on a decentralized blockchain network.",
      icon: <CloudArrowDownIcon />,
    },
    {
      title: "Global Accessibility",
      desc: "Access medical records globally with full transparency and control.",
      icon: <GlobeAltIcon />,
    },
    {
      title: "Trusted Security",
      desc: "Advanced blockchain protocols ensure data security and prevent breaches.",
      icon: <ShieldCheckIcon />,
    },
  ],
};

export { benefitOne, benefitTwo };
