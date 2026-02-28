import Link from "next/link";
import Image from "next/image";
import { UserPlus, FileEdit, Users, LineChart, BrainCircuit, Briefcase, ScrollText, ListTodo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";

export const features = [
  {
    icon: <BrainCircuit className="w-10 h-10 mb-4 text-primary" />,
    title: "AI-Powered Career Guidance",
    description:
      "Get personalized career advice and insights powered by advanced AI technology.",
  },
  {
    icon: <Briefcase className="w-10 h-10 mb-4 text-primary" />,
    title: "Interview Preparation",
    description:
      "Practice with role-specific questions and get instant feedback to improve your performance.",
  },
  {
    icon: <LineChart className="w-10 h-10 mb-4 text-primary" />,
    title: "Industry Insights",
    description:
      "Stay ahead with real-time industry trends, salary data, and market analysis.",
  },
  {
    icon: <ScrollText className="w-10 h-10 mb-4 text-primary" />,
    title: "Smart Resume Creation",
    description: "Generate ATS-optimized resumes with AI assistance.",
  },
  {
    icon: <BrainCircuit className="w-10 h-10 mb-4 text-primary" />,
    title: "Quiz Time",
    description: "Test your knowledge with an AI-curated 10-question quiz specific to your selected domain.",
  },
  {
    icon: <ListTodo className="w-10 h-10 mb-4 text-primary" />,
    title: "Task Manager",
    description: "Organize applications, setup deadlines, and track your prep with a drag-and-drop workflow.",
  },
];

export const howItWorks = [
  {
    title: "Professional Onboarding",
    description: "Share your industry and expertise for personalized guidance",
    icon: <UserPlus className="w-8 h-8 text-primary" />,
  },
  {
    title: "Craft Your Documents",
    description: "Create ATS-optimized resumes and compelling cover letters",
    icon: <FileEdit className="w-8 h-8 text-primary" />,
  },
  {
    title: "Prepare for Interviews",
    description:
      "Practice with AI-powered mock interviews tailored to your role",
    icon: <Users className="w-8 h-8 text-primary" />,
  },
  {
    title: "Track Your Progress",
    description: "Monitor improvements with detailed performance analytics",
    icon: <LineChart className="w-8 h-8 text-primary" />,
  },
];

export const testimonial = [
  {
    quote:
      "The AI-powered interview prep was a game-changer. Landed my dream job at a top tech company!",
    author: "Akriti Gupta",
    image: "https://randomuser.me/api/portraits/women/75.jpg",
    role: "Software Engineer",
    company: "Tech Giant Co.",
  },
  {
    quote:
      "The industry insights helped me pivot my career successfully. The salary data was spot-on!",
    author: "RohanDas Patel",
    image: "https://randomuser.me/api/portraits/men/75.jpg",
    role: "Product Manager",
    company: "StartUp Inc.",
  },
  {
    quote:
      "My resume's ATS score improved significantly. Got more interviews in two weeks than in six months!",
    author: "Priya Pandey",
    image: "https://randomuser.me/api/portraits/women/74.jpg",
    role: "Marketing Director",
    company: "Global Corp",
  },
];

const faqs = [
  {
    question: "What makes Kripa AI unique as a career development tool?",
    answer:
      "Kripa AI combines AI-powered career tools with industry-specific insights to help you advance your career. Our platform offers three main features: an intelligent resume builder, a cover letter generator, and an adaptive interview preparation system. Each tool is tailored to your industry and skills, providing personalized guidance for your professional journey.",
  },
  {
    question: "How does Kripa AI create tailored content?",
    answer:
      "Kripa AI learns about your industry, experience, and skills during onboarding. It then uses this information to generate customized resumes, cover letters, and interview questions. The content is specifically aligned with your professional background and industry standards, making it highly relevant and effective.",
  },
  {
    question: "How accurate and up-to-date are Kripa AI's industry insights?",
    answer:
      "We update our industry insights weekly using advanced AI analysis of current market trends. This includes salary data, in-demand skills, and industry growth patterns. Our system constantly evolves to ensure you have the most relevant information for your career decisions.",
  },
  {
    question: "Is my data secure with Kripa AI?",
    answer:
      "Absolutely. We prioritize the security of your professional information. All data is encrypted and securely stored using industry-standard practices. We use Clerk for authentication and never share your personal information with third parties.",
  },
  {
    question: "How can I track my interview preparation progress?",
    answer:
      "Kripa AI tracks your performance across multiple practice interviews, providing detailed analytics and improvement suggestions. You can view your progress over time, identify areas for improvement, and receive AI-generated tips to enhance your interview skills based on your responses.",
  },
  {
    question: "Can I edit the AI-generated content?",
    answer:
      "Yes! While Kripa AI generates high-quality initial content, you have full control to edit and customize all generated resumes, cover letters, and other content. Our markdown editor makes it easy to refine the content to perfectly match your needs.",
  },
];

export const ourTeam = [
  {
    name: "Kripanshu Gupta",
    role: "Team Leader (MERN Stack Developer)",
    emoji: "👨🏻‍💼",
    linkedin: "https://www.linkedin.com/in/kripanshu-gupta-a66349261",
  },
  {
    name: "Ansh Soni",
    role: "AI Tool Expert",
    emoji: "👨🏻‍💼",
    linkedin: "https://www.linkedin.com/in/ansh-soni-b3a472335",
  },
  {
    name: "Deeksha Pandey",
    role: "Front-End Developer",
    emoji: "👩🏻‍💼",
    linkedin: "https://www.linkedin.com/in/deeksha-p-b72480259",
  },
  {
    name: "Anushri Tiwari",
    role: "Back-End Developer",
    emoji: "👩🏻‍💼",
    linkedin: "https://www.linkedin.com/in/anushri-tiwari-916494300",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-between">
      {/* Navbar Placeholder */}
      <header className="w-full p-6 flex items-center justify-between border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center space-x-3">
          <Image src="/logo.png" alt="KripaAI Logo" width={32} height={32} className="rounded-md" />
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
            KripaAI
          </span>
        </div>
        <nav className="flex items-center space-x-6">
          <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden md:block">
            Home
          </Link>
          <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden md:block">
            Features
          </Link>
          <Link href="#faq" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden md:block">
            FAQ
          </Link>
          <Link href="#about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden md:block">
            About
          </Link>

          <SignedIn>
            <Link href="/dashboard">
              <Button variant="outline" className="hidden md:inline-flex">Dashboard</Button>
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>

          <SignedOut>
            <SignInButton mode="modal">
              <Button>Get Started</Button>
            </SignInButton>
          </SignedOut>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex-1 w-full flex flex-col items-center justify-center px-4 text-center py-24 md:py-32 relative overflow-hidden">
        {/* Decorative Background Gradients */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-10 pointer-events-none" />
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[100px] -z-10 pointer-events-none" />

        <div className="space-y-6 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
            Accelerate Your Career with <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
              AI-Powered Coaching
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Build stand-out resumes, ace your mock interviews, and discover personalized industry insights with KripaAI.
            Level up your professional journey today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link href="/dashboard">
              <Button size="lg" className="h-12 px-8 text-base w-full sm:w-auto">
                Start Building Now
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="h-12 px-8 text-base w-full sm:w-auto">
                Explore Features
              </Button>
            </Link>
          </div>
        </div>

        {/* Mockup or Graphic Placeholder */}
        <div className="mt-16 w-full max-w-5xl rounded-xl border border-border/50 bg-card/50 backdrop-blur aspect-video flex items-center justify-center overflow-hidden relative shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-primary/5 pointer-events-none z-10" />
          <Image src="/hero.png" alt="Platform Dashboard Preview" fill className="object-cover opacity-90" priority />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-24 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A simple, four-step process to accelerate your career growth.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center p-6 space-y-4 bg-muted/30 rounded-xl border border-border/50"
              >
                <div className="p-4 bg-primary/10 rounded-full">{item.icon}</div>
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full py-24 bg-muted/50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Everything You Need to Get Ahead</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              KripaAI gives you the tools to optimize your professional representation and fine-tune your interview skills, powered by Google Gemini.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-card p-6 rounded-xl border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                {feature.icon}
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full py-24 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-12">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonial.map((testimonial, index) => (
              <Card key={index} className="bg-muted/50">
                <CardContent className="pt-6">
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="relative h-12 w-12 flex-shrink-0">
                        <Image
                          width={40}
                          height={40}
                          src={testimonial.image}
                          alt={testimonial.author}
                          className="rounded-full object-cover border-2 border-primary/20"
                        />
                      </div>
                      <div>
                        <div className="font-semibold">{testimonial.author}</div>
                        <div className="text-sm text-muted-foreground">
                          {testimonial.role}
                        </div>
                        <div className="text-sm text-primary">
                          {testimonial.company}
                        </div>
                      </div>
                    </div>
                    <blockquote className="text-muted-foreground italic relative">
                      <span className="text-3xl text-primary absolute -top-4 -left-2 opacity-20">
                        &quot;
                      </span>
                      {testimonial.quote}
                    </blockquote>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="w-full py-24 bg-muted/50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to know about Kripa AI and how it works.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-lg">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="w-full py-24 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The incredible minds behind Kripa AI, building tools to accelerate
              your career.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {ourTeam.map((member, index) => (
              <Link key={index} href={member.linkedin} target="_blank" rel="noopener noreferrer">
                <Card className="bg-muted/50 hover:bg-muted/80 transition-colors h-full flex flex-col items-center text-center p-6 border-transparent hover:border-primary/20 cursor-pointer">
                  <div className="flex items-center justify-center w-24 h-24 mb-4 text-6xl bg-primary/10 rounded-full border-4 border-background shadow-sm">
                    {member.emoji}
                  </div>
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-sm text-primary font-medium">
                    {member.role}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer / Credits */}
      <footer id="about" className="w-full py-8 border-t border-border/40 text-center flex flex-col items-center">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} KripaAI. Inspired by the tutorial and original project by{" "}
          <span className="font-semibold text-foreground">TeamCode11</span>.
        </p>
      </footer>
    </main>
  );
}
