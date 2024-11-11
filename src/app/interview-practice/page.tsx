'use client';

import { useState } from 'react';
import { useGenerateScript } from '@/hooks/useGenerateScript';
export default function InterviewPractice() {
  const [jobDescription, setJobDescription] = useState('');
  const [companyProfile, setCompanyProfile] = useState('');
  const [resume, setResume] = useState('');

  const { fetchScript, isLoading, script, isDoneLoading } = useGenerateScript();
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
        onClick={() => fetchScript(jobDescription, companyProfile, resume)}
      >
        Generate Script
      </div>
      {/* when loaded, the script is displayed */}
      <div>
        <div>{script}</div>
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
