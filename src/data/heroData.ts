export interface ValueProposition {
  num: string;
  title: string;
  description: string;
  corner?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export const VALUE_PROPOSITIONS: ValueProposition[] = [
  {
    num: '01',
    title: 'CREATIVE SOLUTIONS',
    description:
      "We don't simply follow standard solutions. We understand the problem, think differently and create practical, innovative solutions specifically around each customer's needs.",
    corner: 'top-left',
  },
  {
    num: '02',
    title: 'CUSTOMER FIRST',
    description:
      'Every project starts with understanding the customer. Their requirements, goals and challenges guide our decisions, so the final solution is built for their actual needs.',
    corner: 'top-right',
  },
  {
    num: '03',
    title: 'END-TO-END DEVELOPMENT',
    description:
      'We build across both hardware and software — from electronics, embedded systems, IoT and PCB design to software, AI, web platforms and complete product development.',
    corner: 'bottom-left',
  },
  {
    num: '04',
    title: 'LONG-TERM PARTNERSHIP',
    description:
      "We don't want to be just a service provider. We aim to become a technology partner, supporting your product from the first idea through development, improvement and future growth.",
    corner: 'bottom-right',
  },
];

export const ENGINEERING_DISCIPLINES = [
  'CAD',
  'Embedded Systems',
  'IoT',
  'Robotics',
  'Full-Stack Software',
  'ML',
];
