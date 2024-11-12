'use client';

import { useState } from 'react';
import { useGenerateQuestionList } from '@/hooks/useGenerateQuestionList';

const mockJobDescription = `About the job
Astoria AI (http://www.astoria.ai) is an early-stage startup focused on building human-centered global talent intelligence platform powered by Artificial Intelligence. At Astoria AI we believe that people have indispensable human need to realize their full potential. Our mission is to help people to unlock their potential and help organizations to attract those people and build sustained practices of retaining motivated and most qualified talent. 

 

Job Summary: 

We are seeking a talented software developer with 6+ years of experience to join our team. The ideal candidate will be responsible for designing, developing, and maintaining software applications using variety of methods including conversational AI, vector search & embeddings, personalization and recommendation systems with ML/LLM-based tools and APIs. They will work closely with the product team to ensure that software applications are designed to meet user needs and business goals. 

 

Compensation includes equity shares until MVP launch and salary after. Become a part of our team and our success story. 



Responsibilities: 

- Develop software applications from scratch using LLM-based tools and APIs (both closed- and open-source) 

- Collaborate with other members of our dev team on building reliable and scalable data pipelines for the platform 

- Work with the product team to develop application features according to project scope and requirements 

- Test and debug software applications to ensure high-quality, reliable software 

- Continuously improve the performance and scalability of software applications 

- Stay up-to-date with emerging LLM-based tools, techniques, and technologies 

- Collaborate with other developers to integrate LLM-based tools into the software development process 

 

Requirements: 

- At least 6+ years of experience in software development, with recent focus on Prompt Engineering and LLM-based tools and APIs 

- Working knowledge of prompt programming (DSPy and other frameworks) 

- Bachelor's degree or higher in Computer Science or related field 

- Strong programming skills in Python, Typescript or Go 

- Experience with ChatGPT and other LLM-based tools, including pre-trained models and fine-tuning techniques 

- Familiarity with software development best practices, including version control, automated testing, and continuous integration/continuous deployment (CI/CD) 

- Excellent problem-solving skills and attention to detail 

- Ability to work independently and as part of a team in a quick-paced environment 

- Strong communication skills, both written and verbal 

 

Project experience requirements: 

- Proven ability and track record of building and deploying conversational AI systems (chatbots, virtual assistants) for multi-turn real-time user interactions 

- Experience in NLP, NLU, and NLG to handle complex user queries and provide intelligent, contextual responses 

- Knowledge of vector search and retrieval augmented generation (RAG) techniques to build graphs and search through vast amounts of user data 

 

If you are a motivated and innovative developer who is passionate about leveraging LLM-based tools to create cutting-edge software applications, we would love to hear from you. This is an exciting opportunity to join a fast-growing startup and make a meaningful impact on the talent management industry. `;

const mockCompanyProfile = `Overview
At Astoria AI we believe that people have indispensable human need to realize their full potential.

Our mission is to help people find highest point of contribution and help organizations to attract those people and build sustained practices of retaining motivated and most qualified talent.

Website
https://www.astoria.ai/
Industry
Software Development
Company size
11-50 employees
9 associated members LinkedIn members who’ve listed Astoria AI as their current workplace on their profile.
Headquarters
New York, New York

Dive Into the New Age of Talent Management AI
Human Centered AI
Task for AI algorithms
While old recruiting models and patchwork approach solutions have failed to resolve millennia-old recruiting problem, we are approaching the stage where unlocking human potential can become center task for AI algorithms.

Human side of the equation
Even the most sophisticated technology can’t solve this problem without one fundamental change. Placing the emphasis on the human side of the equation.

Deep understanding of values and aspirations
Understanding someone’s values and aspirations leads to understanding their motivations and yields treasure trove of data that helps AI algorithms to unlock person’s fullest potential and significantly improve recruiting.

Our unique AI algorithm and platform
Using our platform will help you to recruit new employees and ensure your existing team members always at highest point of contribution.


We build sensitive and Human Centered AI Ecosystem
In the era of the Great Resignation, the companies best able to attract and retain talent will be those that deeply understand the needs of employees and offer benefits based on that knowledge.
`;

const mockResume = `Contact
1 (847) 630-3510 (Mobile)
diego.glusberg@gmail.com
www.linkedin.com/in/diegoglusberg-349a46a3 (LinkedIn)
Top Skills
OpenAI API
Artificial Intelligence (AI)
TypeScript
Diego Glusberg
Founding Full-Stack Engineer | Generative AI Builder | Ex-Practica
(Acquired 2024)
Evanston, Illinois, United States
Summary
Formerly a fine-dining chef, I was a founding engineer and the first
hire at Practica, which was acquired by BetterUp in March 2024.
At Practica, I played a key role in creating a groundbreaking AI
career coaching app. This non-linear, multi-agential system has
empowered users to achieve their professional goals. I have
extensive experience in prompt engineering for LLMs, and working
with AI in a full-stack capacity. I thrive in startup environments.
With a background that includes both strategic decision-making and
hands-on technical work, I have collaborated closely with founders
and stakeholders to ensure alignment with the company’s vision
and user needs. My contributions have laid a solid foundation for
technological innovation and company growth. As a former chef,
I bring a unique perspective to my work, always striving to create
technology that genuinely improves people's lives. I am passionate
about taking on new challenges where I can leverage my expertise
to contribute to meaningful projects with intensity and kindness.
Experience
Practica
Founding Software Engineer
January 2021 - March 2024 (3 years 3 months)
Acquired by BetterUp March 2024!
As a Founding Engineer and first hire at Practica, I have embraced the unique
challenges of a startup environment, supporting a coaching marketplace,
through several different products leading to the creation of a pioneering AI
career coaching app from its inception. My role has touched every aspect
of the product development lifecycle, from the initial concept to the final
implementation. I have been deeply involved in both the strategic decisionPage 1 of 4making and the hands-on technical work required to bring our vision to life,
establishing a solid foundation for the company's growth and technological
innovation.
- Architected and led the development of an AI career coaching app using
Generative AI and RAG, resulting in significant user engagement.
- Collaborated closely with a developer and designer, streamlining workflows
and reducing feature deployment time.
- Architected and implemented a scalable full-stack solution with NextJS,
React, and Node, integrating vector and relational databases.
- Played a strategic role in product direction, utilizing data analytics to inform
feature development.
check out our TechCrunch coverage: https://techcrunch.com/2023/10/30/
chatgpt-for-career-growth-practica-introduces-ai-based-career-coaching-andmentorship/
Charlie Bird
Sous Chef
April 2019 - March 2020 (1 year)
New York, New York, United States
Led a team of 10 in high-volume service, mastering efficiency and culinary
excellence, while managing inventory and fostering a flexible, fast-paced work
environment.
Gramercy Tavern
Line Cook (Saucier)
May 2016 - April 2019 (3 years)
New York, New York, United States
Maintained and pushed forward Michelin Star standards of excellence,
showcasing adaptability and commitment to excellence across all stations,
including prep and butchery. Leading team efforts in a demanding, highvolume setting.
Restaurant August
Backwaiter
July 2015 - February 2016 (8 months)
New Orleans, Louisiana, United States
Page 2 of 4Coordinated with front and back of house staff at a top New Orleans
restaurant, supervising food runners, resolving guest issues with creative
solutions, and contributing to high customer satisfaction through precise
plating and expediting.
Dove's Luncheonette
Sous Chef
November 2014 - July 2015 (9 months)
Chicago, Illinois, United States
Supported the Executive Chef in managing a high-volume kitchen (up to 300
covers), ensuring top-quality output with meticulous attention to detail. Led
training and supervision of kitchen staff on recipes and procedures, played a
role in menu planning, and effectively coordinated with front-of-house teams.
Oversaw inventory management and assisted with procurement.
The Winchester
Line Cook
January 2014 - June 2014 (6 months)
Chicago, Illinois, United States
Prepared diverse menus from scratch, ensuring high-quality output and
sanitation standards across all meal services. Maintained equipment and
station organization for both hot and cold stations.
Old World Food Truck
Cook
November 2012 - December 2013 (1 year 2 months)
San Francisco, California, United States
Executed a rotating scratch menu with strict sanitation and quality. Handled
front-of-house operations and customer service. Managed on-site catering
for events up to 250 people and oversaw the truck's social media and web
presence.
Ikes Love & Sandwiches
Associate
September 2011 - October 2012 (1 year 2 months)
San Francisco, California, United States
Versatile role covering all kitchen duties in a high-volume setting, including
training staff. Managed front-of-house operations to ensure excellent customer
service, and handled full-day operational responsibilities from open to close.
Page 3 of 4Education
Wesleyan University
Bachelor's degree, Philosophy · (2007 - 2011)
Page 4 of 4
`;

const mockData = true;

export default function InterviewPractice() {
  const [jobDescription, setJobDescription] = useState(
    mockData ? mockJobDescription : ''
  );
  const [companyProfile, setCompanyProfile] = useState(
    mockData ? mockCompanyProfile : ''
  );
  const [resume, setResume] = useState(mockData ? mockResume : '');

  const { fetchQuestionList, isLoading, questions, isDoneLoading } =
    useGenerateQuestionList();
  return (
    <div className="text-primary pl-4 lg:pl-10 pr-8">
      {/* instructions at the top*/}
      <div className="lg:w-2/3 lg:pt-44 text-primary ">
        <div className="mb-4 font-tenon">
          The purpose of this page is to simulate an interview session in order
          to practice for a first round interview for a tech industry job.
        </div>
      </div>
      {/* inputs here- the job post, a company profile and a resume */}
      <div>
        <div>
          <div>please paste in the job post here:</div>
          <div>
            <textarea
              className="border-primary/50 border-2 focus:border-primary focus:outline-none"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            ></textarea>
          </div>
          <div>
            please paste in a profile of the company here, anything you can find
            on the web will help:
          </div>
          <div>
            <textarea
              className="border-primary/50 border-2 focus:border-primary focus:outline-none"
              value={companyProfile}
              onChange={(e) => setCompanyProfile(e.target.value)}
            ></textarea>
          </div>
          <div>please paste in your resume here:</div>
          <div>
            <textarea
              className="border-primary/50 border-2 focus:border-primary focus:outline-none"
              value={resume}
              onChange={(e) => setResume(e.target.value)}
            ></textarea>
          </div>
        </div>
      </div>
      {/* button to generate a scripts */}
      <div
        className={`border-2 border-primary text-primary mt-8 p-2 w-fit cursor-pointer ${
          isLoading ? 'opacity-50' : ''
        }`}
        onClick={() => fetchQuestionList(jobDescription, companyProfile, resume)}
      >
        Generate Script
      </div>
      {/* when loaded, the script is displayed */}
      <div>
        <div>{questions}</div>
      </div>
      {/* button to launch a the interview simulator, or regenerate the script */}
      <div className="flex gap-4">
        <div className="border-2 border-primary text-primary mt-8 p-2 w-fit">
          Launch Interview
        </div>
        <div className="border-2 border-primary text-primary mt-8 p-2 w-fit">
          Regenerate Script
        </div>
      </div>
      {/* interview will display structured data and give feedback as it goes*/}
      <div>interview will go here</div>
    </div>
  );
}
