export interface ResumeItem {
  title: string;
  period: string;
  place?: string;
  details?: string | string[];
}

export interface ResumeSection {
  sectionTitle: string;
  items: ResumeItem[];
}

export const education: ResumeSection = {
  sectionTitle: "Education",
  items: [
    {
      title: "Scrum Fundamentals",
      period: "Grupo Babel",
    },
    {
      title: "Six SigmaYellow Belt",
      period: "Grupo Babel",
    },
    {
      title: "CISCO CCNA Exploration : Network Fundamentals",
      period: "Universidad Americana",
    },
    {
      title: "Bachelor Degree in System Engineer",
      period: "Universidad Americana",
    },
  ],
};

export const experience: ResumeSection = {
  sectionTitle: "Professional Experience",
  items: [
    {
      title: "QA Analyst",
      period: "VML Contractor",
      place: "Remote",
      details: [
        "Responsibilities and Achievements:",
        "Manual and automated testing in Agile (Scrum) environments.",
        "Design and execution of functional, regression, and smoke tests for critical web flows.",
        "Review of user stories and definition of acceptance criteria.",
        "Defect management in JIRA; validation using BrowserStack and Chrome DevTools.",
        "End-to-end test automation with .NET Core and Docker, integrated into CI/CD pipelines.",
        "Participation in Agile ceremonies: daily stand-ups, sprint planning, retrospectives, and demos.",

        "Featured Project: MazdaAutomationDocker",
        "Developed a modular automation framework in .NET Core.",
        "Layered structure: TestCases (functional scenarios) and Utils (reusable functions).",
        "Portable execution in Docker using Dockerfile and docker-compose, with distinguished configurations (appsettings.json).",

        "Client Accounts:",

        "Coca-Cola Account",
        "QA validation for digital marketing campaigns and web experiences.",
        "Functional testing, content verification, and cross-device compatibility validation.",
        "Collaboration with design, development, and product teams to ensure high-quality releases.",
        "Identification and reporting of defects aligned with requirements and design specifications.",

        "Kruger Account",
        "QA support during migration of the corporate website to the KrugerPro platform.",
        "Functional, regression, and exploratory testing of web components.",
        "Validation of content integrity, navigation flows, and production readiness.",
        "Defect reporting, tracking, and collaboration with developers to ensure resolution.",

        "T-Mobile Account",
        "QA validation of marketing email campaigns including major product launches.",
        "Email rendering and compatibility testing using Litmus.",
        "Pre-release validation through QA environments (MDC).",
        "Verification of links, formatting, responsiveness, and content accuracy.",

        "Technologies and tools: .NET Core, Docker, JIRA, Chrome DevTools, BrowserStack, Git, Litmus, Manual & Automated QA, Scrum.",
      ],
    },
    {
      title: "Full Stack Developer",
      period: "Senegence International",
      place: "Heredia",
      details: [
        "Maintained and enhanced existing functionalities while developing new components for e-commerce platforms using React.js, React Router, Redux.js, and C#.",
        "Managed version migrations to the latest React releases, ensuring smooth transitions, performance optimization, and compatibility.",
        "Handled troubleshooting, debugging, and implementation of scalable solutions to improve user experience and support business growth.",
        "Technologies: React.js, React Router, Redux.js, C#",
      ],
    },
    {
      title: "Software Engineer",
      period: "Isthmus Software",
      place: "Heredia",
      details: `
      I provided engineering support and conduct technical evaluations for Development Security Tools 
      at Intel’s Product Assurance & Security Team. Specializing in aligning security measures with 
      Software Development Lifecycle specifications, I ensure robust protection throughout the development process.
      My role involves implementing and optimizing security solutions to safeguard Intel’s products, 
      contributing to the overall integrity and resilience of the organization’s software ecosystem. 
      
      BCR SAFI investment fund operates as a platform consolidating investor funds, employing technologies like 
      VB.net, Winforms, Webforms, ASP.net, MS-SQL, Reporting Services, Windows Services, and WebServices. 
      These technologies facilitate the efficient management and utilization of investors’ funds, ensuring 
      seamless operations and data management. The platform’s diverse tech stack enables robust functionality
      across various interfaces, providing a comprehensive solution for investment management and reporting services`,
    },
    {
      title: "Engineering Support Specialist",
      period: "Intel Labs",
      place: "Belén , Heredia",
      details: [
        "Responsibilities and Achievements:",
        "Provided hardware and software engineering support by researching and implementing improved methods and processes, delivering detailed reports on problem resolutions.",
        "Developed RPM packages and automation scripts using Batch (Windows), Bash, and Python (Linux distros like Ubuntu and Red Hat).",
        "Created comprehensive documentation and reports for RPMs and automation scripts, guiding team members on installation, execution, and data collection procedures.",

        "Skills: Log analysis, Programming, Teamwork, Microsoft Excel, Security, Databases, Microsoft Office, Cybersecurity",
      ],
    },
    {
      title: "Software Developer",
      period: "Grupo Babel",
      place: "San Pablo Heredia",
      details: [
        "BCR Commercial Platform",
        "Responsibilities and Achievements:",
        "Contributed to the development and maintenance of CR Commercial, a centralized transactional platform integrating multiple business channels (BCR Commercial, Kristal, BCR Mi Negocio, Modulo Interno, Modulo Monitoreo).",
        "Worked with a tech stack including C#, .NET Framework, ASP.NET MVC, LINQ, WCF, Web Services, JavaScript, XML, JSON, and MS SQL to enhance operational efficiency and streamline business transactions.",
        "Collaborated within Agile (Scrum) teams using Git for version control and participated in software development lifecycle activities.",
        "Technologies & Skills: C#, .NET Framework, ASP.NET MVC, WCF, Web Services, JavaScript, XML, JSON, MS SQL, Entity Framework, ASP.NET Web API, T-SQL, Git, Agile methodologies, Scrum, teamwork.",
      ],
    },
  ],
};
