import React from 'react';
import { FaLinkedin, FaTwitter, FaGithub } from 'react-icons/fa';

const teamMembers = [
  {
    name: 'Sabbahi Mohamed Amine',
    position: 'Lead Developer',
    description: 'Expert in frontend and backend development, with over 10 years of experience.',
    image: 'https://randomuser.me/api/portraits/men/1.jpg',
    linkedin: 'https://linkedin.com',
    twitter: 'https://twitter.com',
    github: 'https://github.com'
  },
  {
    name: 'Nidar Salma',
    position: 'UI/UX Designer',
    description: 'Specialist in user interface and user experience design.',
    image: 'https://randomuser.me/api/portraits/women/2.jpg',
    linkedin: 'https://linkedin.com',
    twitter: 'https://twitter.com',
    github: 'https://github.com'
  },
  {
    name: 'Bakkali Ayoub',
    position: 'Project Manager',
    description: 'Skilled in project management and agile methodologies.',
    image: 'https://randomuser.me/api/portraits/men/3.jpg',
    linkedin: 'https://linkedin.com',
    twitter: 'https://twitter.com',
    github: 'https://github.com'
  }
];

const TeamMemberCard = ({ member }) => (
  <div className="bg-white shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 ease-in-out p-6 rounded-lg">
    <img
      className="w-24 h-24 rounded-full mx-auto"
      src={member.image}
      alt={member.name}
    />
    <h2 className="text-xl font-semibold mt-4 text-center">{member.name}</h2>
    <p className="text-gray-600 text-center">{member.position}</p>
    <p className="text-gray-700 mt-2 text-center">{member.description}</p>
    <div className="flex justify-center mt-4">
      <a href={member.linkedin} className="text-blue-500 mx-2"><FaLinkedin size={20} /></a>
      <a href={member.twitter} className="text-blue-400 mx-2"><FaTwitter size={20} /></a>
      <a href={member.github} className="text-gray-800 mx-2"><FaGithub size={20} /></a>
    </div>
  </div>
);

export const TeamSection = () => {
  return (
    <section className="bg-gray-100 py-12">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold text-center mb-8">Meet the team members</h1>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member, index) => (
            <TeamMemberCard key={index} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;