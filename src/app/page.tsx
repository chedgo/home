import Image from 'next/image';
import Link from 'next/link';
import { ReactNode } from 'react';

const SectionTitle = ({ children }: { children: ReactNode }) => (
  <h2 className="text-2xl font-semibold text-primary mb-4">{children}</h2>
);

const Paragraph = ({ children }: { children: ReactNode }) => (
  <p className="mb-4 text-secondary">{children}</p>
);

const ListItem = ({ children }: { children: ReactNode }) => (
  <li className="text-secondary">{children}</li>
);

export default function Page() {
  return (
    <div className="rounded-lg flex min-w-full gap-14">
      <div className="w-1/3">
        <h1 className="mb-8 ml-6 text-8xl font-bold tracking-tighter text-primary ">
          Diego <br />
          Glusberg
        </h1>
        <div className="w-full">
          <Image
            src={'/diego.jpg'}
            width={500}
            height={500}
            alt="Diego Glusberg"
            className="object-cover"
          />
        </div>
      </div>
      <div className="w-2/3 pt-40">
        <div className=''>
          I&apos;m a{' '}
          <span className="text-accent font-bold"> Full-Stack Engineer </span>{' '}
          specializing in building{' '}
          <span className="text-accent font-bold">AI-powered Products</span>.
        </div>
        <Paragraph>
          My journey from a fine-dining chef to software developer has been
          unconventional but rewarding, and I&apos;ve brought along excellent
          communication skills and a drive for excellence. At Practica, which
          was acquired by BetterUp in March 2024, I built our{' '}
          <span className="text-accent font-bold">Coaching Marketplace</span>{' '}
          and developed an{' '}
          <span className="text-accent font-bold">AI Career Coaching App</span>.
          My work spanned from prompt engineering to user interface design and
          data model creation.
        </Paragraph>
        <SectionTitle>What Drives Me</SectionTitle>
        <Paragraph>
          <span className="text-accent font-bold">
            Kindness, Collaboration, Efficiency.{' '}
          </span>
          Delivering results under tight deadlines is second nature to me,
          thanks to my time in professional kitchens. I&apos;m passionate about
          using technology to make a real impact on people&apos;s lives.
        </Paragraph>
        <SectionTitle>Tech Experience</SectionTitle>
        <div className="mt-2 text-accent">
          <div className="font-semibold">Practica (Acquired by BetterUp)</div>
          <div>
            <em className="text-secondary">
              Founding Engineer and First Hire, Jan 2021 - March 2024
            </em>
          </div>
          <div className="mt-4 text-accent">
            Practica was a tight-knit team of just five people, which meant I
            wore many hats and was involved in every aspect of the product.
          </div>
          <ul className="list-disc list-outside flex flex-col gap-3 mt-10 pl-5">
            <ListItem>
              <Link
                href="https://practicahq.com/learn"
                className="text-primary font-bold hover:underline"
              >
                AI Career Coaching App
              </Link>
              : Led development from concept to implementation. Architected
              RAG-powered non-linear personalized career growth experience,
              leveraging a third-party NLP API for prompt generation for rapid
              development.
            </ListItem>
            <ListItem>
              <span className="text-accent font-bold">
                Marketplace Platform
              </span>
              : Automated key aspects of a coaching marketplace, including
              coach-client matching, billing, note-taking, curriculum resource
              provision, learning experience management, and email handling.
              Features were owned from concept to implementation and beyond.
            </ListItem>
            <ListItem>
              <span className="text-accent font-bold">Tech Stack</span>:
              Specializing in NextJS, React, and Node. Integrated vector
              (Pinecone) and relational databases (Postgres). I&apos;ve a proven
              track record of delivering high-quality code and features.
            </ListItem>
            <ListItem>
              <span className="text-accent font-bold">
                Strategic Decision-Making
              </span>
              : Contributed to product strategy and roadmap planning. Led
              development of a new product features with a focus on process and
              user experience.
            </ListItem>
          </ul>
        </div>
      </div>
    </div>
  );
}
