const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const User = require('../models/User');
const Course = require('../models/Course');

const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://localhost:27017/course_subscription_db';

const USERS = [
  { name: 'monu', email: 'monu@gmail.com', password: 'pass@4647' },
  { name: 'sanjay', email: 'sanjay@gmail.com', password: 'pass@777' },
  { name: 'manij', email: 'manij@gmail.com', password: 'pass@7878' },
];

const COURSES = [
  {
    title: 'Intro to Web Development',
    description: 'A comprehensive beginner-friendly course covering HTML, CSS, and JavaScript fundamentals.',
    price: 0,
    image: 'https://picsum.photos/seed/webdev/600/400',
    category: 'Web Development',
    instructor: 'Sarah Chen',
    duration: '4 hours',
    level: 'Beginner',
  },
  {
    title: 'Advanced React Patterns',
    description: 'Master advanced React techniques including Context API, custom hooks, performance optimisation.',
    price: 49.99,
    image: 'https://picsum.photos/seed/react/600/400',
    category: 'Frontend',
    instructor: 'James Liu',
    duration: '6 hours',
    level: 'Advanced',
  },
  {
    title: 'Python for Data Science',
    description: 'Dive into Python libraries like Pandas, NumPy, and Matplotlib.',
    price: 39.99,
    image: 'https://picsum.photos/seed/python/600/400',
    category: 'Data Science',
    instructor: 'Emily Park',
    duration: '5 hours',
    level: 'Intermediate',
  },
  {
    title: 'Node.js & Express Masterclass',
    description: 'Build scalable REST APIs using Node.js and Express.',
    price: 44.99,
    image: 'https://picsum.photos/seed/nodejs/600/400',
    category: 'Backend',
    instructor: 'Michael Torres',
    duration: '7 hours',
    level: 'Intermediate',
  },
  {
    title: 'CSS Mastery & Tailwind',
    description: 'Master flexbox, grid, animations, and Tailwind CSS.',
    price: 0,
    image: 'https://picsum.photos/seed/css/600/400',
    category: 'Frontend',
    instructor: 'Lisa Wong',
    duration: '3 hours',
    level: 'Beginner',
  },
  {
    title: 'Cloud & DevOps Fundamentals',
    description: 'Understand cloud computing, CI/CD pipelines, Docker, and Kubernetes.',
    price: 54.99,
    image: 'https://picsum.photos/seed/cloud/600/400',
    category: 'DevOps',
    instructor: 'David Kim',
    duration: '8 hours',
    level: 'Intermediate',
  },
  {
    title: 'Machine Learning Basics',
    description: 'Introduction to ML: supervised learning, neural networks, and scikit-learn.',
    price: 59.99,
    image: 'https://picsum.photos/seed/ml/600/400',
    category: 'AI / ML',
    instructor: 'Rachel Adams',
    duration: '6 hours',
    level: 'Intermediate',
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);

    console.log("Connected to MongoDB");

    await User.deleteMany({});
    await Course.deleteMany({});

    console.log("Old data cleared");

    for (const u of USERS) {
      const user = new User(u);
      await user.save();
    }

    await Course.insertMany(COURSES);

    console.log("Database seeded successfully");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
