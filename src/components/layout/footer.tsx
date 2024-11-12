function ArrowIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className='relative bottom-[3px]'
    >
      <path
        d="M2.07102 11.3494L0.963068 10.2415L9.2017 1.98864H2.83807L2.85227 0.454545H11.8438V9.46023H10.2955L10.3097 3.09659L2.07102 11.3494Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className=" max-w-screen-2xl font-tenon mr-8">
      <div className="font-sm mt-8 flex w-full text-primary ml-4 justify-end mr-4 gap-2">
        <div>
          <a
            className="flex items-center transition-all opacity-85 hover:opacity-100"
            rel="noopener noreferrer"
            target="_blank"
            href="https://github.com/chedgo"
          >
            <ArrowIcon />
            <p className="ml-2 h-7">GitHub</p>
          </a>
        </div>
        <div>
          <a
            className="flex items-center transition-all opacity-85 hover:opacity-100"
            rel="noopener noreferrer"
            target="_blank"
            href="https://www.linkedin.com/in/diego-glusberg-349a46a3/"
          >
            <ArrowIcon />
            <p className="ml-2 h-7">LinkedIn</p>
          </a>
        </div>
      </div>
    </footer>
  );
}
