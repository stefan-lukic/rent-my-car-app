import {
  FaKey,
  FaUserFriends,
  FaComments,
  FaCheckCircle,
  FaCar,
} from 'react-icons/fa';
import l from '@/helper/en';

export const sidebarLinks = [
  {
    label: l.sidebar.sport,
    link: '/sport',
    icon: '/icons/apple.svg',
  },
  {
    label: l.sidebar.health,
    link: '/health',
    icon: '/icons/apple.svg',
  },
  {
    label: l.sidebar.education,
    link: '/education',
    icon: '/icons/apple.svg',
  },
  {
    label: l.sidebar.entertainment,
    link: '/entertainment',
    icon: '/icons/apple.svg',
  },
  {
    label: l.sidebar.addProvider,
    link: '/provider',
    icon: '/icons/apple.svg',
  },
];

export const accountDropDownList = [
  {
    label: l.sidebar.manageMyAccount,
    icon: '/icons/apple.svg',
    route: '/account',
  },
  {
    label: l.common.logOut,
    icon: '/icons/apple.svg',
    route: '/sign-in',
  },
];

export const healthProviders = [
  {
    id: '1',
    image:
      'https://via.placeholder.com/150/000000/FFFFFF?text=Health+Provider+1',
    title: 'Health Provider One',
    description:
      'Providing comprehensive health services and wellness programs.',
  },
  {
    id: '2',
    image:
      'https://via.placeholder.com/150/000000/FFFFFF?text=Health+Provider+2',
    title: 'Health Provider Two',
    description:
      'Specializing in advanced medical treatments and patient care.',
  },
  {
    id: '3',
    image:
      'https://via.placeholder.com/150/000000/FFFFFF?text=Health+Provider+3',
    title: 'Health Provider Three',
    description:
      'Dedicated to delivering quality healthcare and patient support.',
  },
  {
    id: '4',
    image:
      'https://via.placeholder.com/150/000000/FFFFFF?text=Health+Provider+4',
    title: 'Health Provider Four',
    description:
      'Expertise in family medicine, pediatrics, and preventive care.',
  },
  {
    id: '5',
    image:
      'https://via.placeholder.com/150/000000/FFFFFF?text=Health+Provider+5',
    title: 'Health Provider Five',
    description:
      'Leading provider of specialized medical services and wellness programs.',
  },
];

export const sportProviders = [
  {
    id: '1',
    image:
      'https://via.placeholder.com/150/000000/FFFFFF?text=Sport+Provider+1',
    title: 'Sport Provider One',
    description:
      'Offering comprehensive sports facilities and training programs.',
  },
  {
    id: '2',
    image:
      'https://via.placeholder.com/150/000000/FFFFFF?text=Sport+Provider+2',
    title: 'Sport Provider Two',
    description: 'Specializing in fitness and wellness classes for all ages.',
  },
  {
    id: '3',
    image:
      'https://via.placeholder.com/150/000000/FFFFFF?text=Sport+Provider+3',
    title: 'Sport Provider Three',
    description:
      'Dedicated to providing top-notch sports coaching and equipment.',
  },
  {
    id: '4',
    image:
      'https://via.placeholder.com/150/000000/FFFFFF?text=Sport+Provider+4',
    title: 'Sport Provider Four',
    description:
      'Expertise in team sports, personal training, and recreational activities.',
  },
  {
    id: '5',
    image:
      'https://via.placeholder.com/150/000000/FFFFFF?text=Sport+Provider+5',
    title: 'Sport Provider Five',
    description: 'Leading provider of outdoor adventure and extreme sports.',
  },
];

export const educationProviders = [
  {
    id: '1',
    image:
      'https://via.placeholder.com/150/000000/FFFFFF?text=Education+Provider+1',
    title: 'Education Provider One',
    description: 'Offering a wide range of educational programs and courses.',
  },
  {
    id: '2',
    image:
      'https://via.placeholder.com/150/000000/FFFFFF?text=Education+Provider+2',
    title: 'Education Provider Two',
    description: 'Specializing in online learning and virtual classrooms.',
  },
  {
    id: '3',
    image:
      'https://via.placeholder.com/150/000000/FFFFFF?text=Education+Provider+3',
    title: 'Education Provider Three',
    description:
      'Dedicated to providing quality education and career development.',
  },
  {
    id: '4',
    image:
      'https://via.placeholder.com/150/000000/FFFFFF?text=Education+Provider+4',
    title: 'Education Provider Four',
    description:
      'Expertise in STEM education and innovative learning solutions.',
  },
  {
    id: '5',
    image:
      'https://via.placeholder.com/150/000000/FFFFFF?text=Education+Provider+5',
    title: 'Education Provider Five',
    description:
      'Leading provider of language learning and cultural exchange programs.',
  },
];

export const entertainmentProviders = [
  {
    id: '1',
    image:
      'https://via.placeholder.com/150/000000/FFFFFF?text=Entertainment+Provider+1',
    title: 'Entertainment Provider One',
    description: 'Offering a variety of entertainment options for all ages.',
  },
  {
    id: '2',
    image:
      'https://via.placeholder.com/150/000000/FFFFFF?text=Entertainment+Provider+2',
    title: 'Entertainment Provider Two',
    description: 'Specializing in live performances, music, and theater.',
  },
  {
    id: '3',
    image:
      'https://via.placeholder.com/150/000000/FFFFFF?text=Entertainment+Provider+3',
    title: 'Entertainment Provider Three',
    description: 'Dedicated to providing quality entertainment and events.',
  },
  {
    id: '4',
    image:
      'https://via.placeholder.com/150/000000/FFFFFF?text=Entertainment+Provider+4',
    title: 'Entertainment Provider Four',
    description: 'Expertise in film production, television, and digital media.',
  },
  {
    id: '5',
    image:
      'https://via.placeholder.com/150/000000/FFFFFF?text=Entertainment+Provider+5',
    title: 'Entertainment Provider Five',
    description:
      'Leading provider of amusement parks, attractions, and family entertainment.',
  },
];

export const howItWorksContent = [
  'Meet the renter to receive the car keys and get acquainted with the vehicle.',
  'Schedule a convenient time to meet the renter in person for a smooth handover.',
  'Communicate with the renter to arrange a suitable time and location for key collection.',
  'Use the app to complete the vehicle inspection process before driving off.',
  'The renter will guide you through all the essential features and functions of the car.',
  'Return the car and the keys directly to the renter at the agreed location.',
  'Follow the renter`s instructions for returning the car to ensure a hassle-free experience.',
];

export const howItWorksIcons = [
  <FaKey className="text-brand" />,
  <FaUserFriends className="text-brand" />,
  <FaComments className="text-brand" />,
  <FaCheckCircle className="text-brand" />,
  <FaCar className="text-brand" />,
  <FaKey className="text-brand" />,
  <FaKey className="text-brand" />,
];
