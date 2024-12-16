import Image from "next/image";
import React from "react";
import { Container } from "@/components/Container";

import userOneImg from "../../public/img/user1.jpg";
import userTwoImg from "../../public/img/user2.jpg";
import userThreeImg from "../../public/img/user3.jpg";

export const Testimonials = () => {
  return (
    <Container>
      <div className="grid gap-10 lg:grid-cols-2 xl:grid-cols-3" id="testimonials">
        {/* Testimonial 1 */}
        <div className="lg:col-span-2 xl:col-auto">
          <div className="flex flex-col justify-between w-full h-full bg-gray-100 px-14 rounded-2xl py-14 dark:bg-trueGray-800">
            <p className="text-2xl leading-normal ">
              <Mark>“ChainCare revolutionized</Mark> how we manage medical records. The blockchain ensures security, and we can access patient data seamlessly when authorized.”
            </p>
            <Avatar
              image={userOneImg}
              name="Dr. Emily Johnson"
              title="Head of IT at St. Mary Hospital"
            />
          </div>
        </div>

        {/* Testimonial 2 */}
        <div className="">
          <div className="flex flex-col justify-between w-full h-full bg-gray-100 px-14 rounded-2xl py-14 dark:bg-trueGray-800">
            <p className="text-2xl leading-normal ">
              <Mark>“As a patient,</Mark> I now have full control over my health records. I decide who gets access and for how long. It’s incredibly empowering.”
            </p>
            <Avatar
              image={userTwoImg}
              name="Michael Chen"
              title="Patient Advocate"
            />
          </div>
        </div>

        {/* Testimonial 3 */}
        <div className="">
          <div className="flex flex-col justify-between w-full h-full bg-gray-100 px-14 rounded-2xl py-14 dark:bg-trueGray-800">
            <p className="text-2xl leading-normal ">
              <Mark>“ChainCare is a game-changer.</Mark> The transparency and privacy provided by blockchain technology allow doctors to focus on patient care without administrative burdens.”
            </p>
            <Avatar
              image={userThreeImg}
              name="Dr. Ahmed Khalid"
              title="Oncologist at City Medical Center"
            />
          </div>
        </div>
      </div>
    </Container>
  );
};


interface AvatarProps {
  image: never;
  name: string;
  title: string;
}

function Avatar(props: Readonly<AvatarProps>) {
  return (
    <div className="flex items-center mt-8 space-x-3">
      <div className="flex-shrink-0 overflow-hidden rounded-full w-14 h-14">
        <Image
          src={props.image}
          width="40"
          height="40"
          alt="Avatar"
          placeholder="blur"
        />
      </div>
      <div>
        <div className="text-lg font-medium">{props.name}</div>
        <div className="text-gray-600 dark:text-gray-400">{props.title}</div>
      </div>
    </div>
  );
}

function Mark(props: { readonly children: React.ReactNode }) {
  return (
    <>
      {" "}
      <mark className="text-indigo-800 bg-indigo-100 rounded-md ring-indigo-100 ring-4 dark:ring-indigo-900 dark:bg-indigo-900 dark:text-indigo-200">
        {props.children}
      </mark>{" "}
    </>
  );
}
