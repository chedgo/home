import Image from 'next/image';
import { ReactNode } from 'react';

const SectionTitle = ({ children }: { children: ReactNode }) => (
  <h2 className="text-2xl font-semibold text-blue-800 mb-4">{children}</h2>
);

const Paragraph = ({ children }: { children: ReactNode }) => (
  <p className="mb-4 text-gray-700">{children}</p>
);

const ListItem = ({ children }: { children: ReactNode }) => (
  <li className="text-gray-600">{children}</li>
);

export default function Page() {
  return (
    <section className="p-8 bg-white shadow-md rounded-lg">
      <h1 className="mb-8 text-3xl font-bold tracking-tighter text-blue-800">
        Diego Glusberg
      </h1>
      <Image
        src={'/odd.png'}
        width={500}
        height={500}
        alt="Diego Glusberg"
        className="mb-8"
      />
      <Paragraph>
        I&apos;m a full-stack engineer specializing in building AI-powered products.
        My journey from a fine-dining chef to a tech professional has been
        unconventional but rewarding. At Practica, which was acquired by
        BetterUp in March 2024, I built our coaching marketplace and developed
        an AI career coaching app. My work spanned from prompt engineering to
        user interface design and data model creation.
      </Paragraph>
      <SectionTitle>What Drives Me</SectionTitle>
      <Paragraph>
        Kindness, efficiency and collaboration. Delivering results under tight
        deadlines is second nature to me, thanks to my time in professional
        kitchens. I&apos;m passionate about using technology to make a real impact on
        people&apos;s lives.
      </Paragraph>
      <SectionTitle>Tech Experience</SectionTitle>
      <div className="mt-2 text-gray-600">
        <div className="font-semibold">Practica (Acquired by BetterUp)</div>
        <div>
          <em className="text-gray-500">
            Founding Engineer and First Hire, Jan 2021 - March 2024
          </em>
        </div>
        <div className="mt-4">
          Practica was a tight-knit team of just five people, which meant I wore
          many hats and was involved in every aspect of the product.
        </div>
        <ul className="list-disc list-outside flex flex-col gap-3 mt-10 pl-5">
          <ListItem>
            AI Career Coaching App: Led development from concept to
            implementation. Pioneered prompt engineering and AI algorithms for
            personalized coaching.
          </ListItem>
          <ListItem>
            Productivity and Code Quality: Streamlined team workflows, reducing
            feature deployment time.
          </ListItem>
          <ListItem>
            Full-Stack Solutions: Built scalable solutions with NextJS, React,
            and Node. Integrated vector (Pinecone) and relational databases
            (Postgres).
          </ListItem>
          <ListItem>
            Strategic Decision-Making: Used data analytics and agile methodology
            to shape product direction, shipping new updates and features
            several times a week.
          </ListItem>
        </ul>
      </div>
    </section>
  );
}
