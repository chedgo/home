'use client';

import { useState } from 'react';
import { useGenerateQuestionList } from '@/hooks/useGenerateQuestionList';
import { InterviewSimulator } from './InterviewSimulator';
import { Question } from '@/types/Interviews';
import mockData from './mockData.json';
import { ResumeUpload } from '@/components/ResumeUpload';
export const useMockData = false;
export default function InterviewPractice() {
  const [jobDescription, setJobDescription] = useState(
    useMockData ? mockData.jobDescription : ''
  );
  const [companyProfile, setCompanyProfile] = useState(
    useMockData ? mockData.companyProfile : ''
  );
  const [resume, setResume] = useState(useMockData ? mockData.resume : '');
  const [interviewStarted, setInterviewStarted] = useState(false);
  const { fetchQuestionList, isLoading, questions } = useGenerateQuestionList();

  return interviewStarted ? (
    <div className="h-[calc(100vh-theme(spacing.16))] flex flex-col">
      <div className="text-primary px-4 lg:px-10 py-4">
        <div className="font-tenon">
          <div
            className="cursor-pointer"
            onClick={() => setInterviewStarted(false)}
          >
            ← back
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <InterviewSimulator
          questions={questions.filter(
            (q): q is Question => q !== undefined && typeof q?.text === 'string'
          )}
        />
      </div>
    </div>
  ) : (
    <div className="min-h-[calc(100vh-theme(spacing.16))] text-primary px-4 lg:px-10 py-8">
      <div className="lg:w-2/3 lg:pt-44 text-primary ">
        <div className="mb-4 font-tenon">
          The purpose of this page is to simulate an interview session in order
          to practice for a first round interview for a tech industry job.
        </div>
      </div>
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
          <ResumeUpload 
            value={resume}
            onChange={setResume}
          />
        </div>
      </div>
      <div
        className={`border-2 border-primary text-primary mt-8 p-2 w-fit 
          ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-primary hover:text-white transition-colors'}`}
        onClick={() => !isLoading && fetchQuestionList(jobDescription, companyProfile, resume)}
      >
        {isLoading ? 'Generating Questions...' : 'Generate Script'}
      </div>
      {questions.length > 0 && (
        <div>
          <ol className="list-decimal pl-4 mt-4">
            {questions.map((question) => {
              if (!question?.text) return null;
              return (
                <li key={question.text} className="mb-2">
                  {question.text}
                </li>
              );
            })}
          </ol>

          <div className="flex gap-4">
            <div
              className="border-2 border-primary text-primary mt-8 p-2 w-fit cursor-pointer hover:bg-primary hover:text-white transition-colors"
              onClick={() => setInterviewStarted(true)}
            >
              Launch Interview
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
