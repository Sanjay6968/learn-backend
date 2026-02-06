/**
 * ─── Seed Script ──────────────────────────────────────────
 * Run: npm run seed
 * Seeds 3 dummy users and 7 courses into MongoDB.
 * Clears existing Users & Courses before inserting.
 */

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
    description:
      'A comprehensive beginner-friendly course covering HTML, CSS, and JavaScript fundamentals.',
    price: 0,
    image: 'https://images.unsplash.com/photo-1593597271464-363dfbcc598d?w=600&q=80',
    category: 'Web Development',
    instructor: 'Sarah Chen',
    duration: '4 hours',
    level: 'Beginner',
  },
  {
    title: 'Advanced React Patterns',
    description:
      'Master advanced React techniques including Context API, custom hooks, performance optimisation.',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1517582786271-e8edd135c3e7?w=600&q=80',
    category: 'Frontend',
    instructor: 'James Liu',
    duration: '6 hours',
    level: 'Advanced',
  },
  {
    title: 'Python for Data Science',
    description:
      'Dive into Python libraries like Pandas, NumPy, and Matplotlib.',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&q=80',
    category: 'Data Science',
    instructor: 'Emily Park',
    duration: '5 hours',
    level: 'Intermediate',
  },
  {
    title: 'Node.js & Express Masterclass',
    description:
      'Build scalable REST APIs using Node.js and Express.',
    price: 44.99,
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80',
    category: 'Backend',
    instructor: 'Michael Torres',
    duration: '7 hours',
    level: 'Intermediate',
  },
  {
    title: 'CSS Mastery & Tailwind',
    description:
      'Master flexbox, grid, animations, and Tailwind CSS.',
    price: 0,
    image: 'https://images.unsplash.com/photo-1610224580231-4cabd8129b4d?w=600&q=80',
    category: 'Frontend',
    instructor: 'Lisa Wong',
    duration: '3 hours',
    level: 'Beginner',
  },
  {
    title: 'Cloud & DevOps Fundamentals',
    description:
      'Understand cloud computing, CI/CD pipelines, Docker, and Kubernetes.',
    price: 54.99,
    image: 'https://images.unsplash.com/photo-1544197210-5943032016be?w=600&q=80',
    category: 'DevOps',
    instructor: 'David Kim',
    duration: '8 hours',
    level: 'Intermediate',
  },
  {
    title: 'Machine Learning Basics',
    description:
      'Introduction to ML: supervised learning, neural networks, and scikit-learn.',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=80',
    category: 'AI / ML',
    instructor: 'Rachel Adams',
    duration: '6 hours',
    level: 'Intermediate',
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding\n');

    // Clear old data
    await User.deleteMany({});
    await Course.deleteMany({});
    console.log('Cleared Users & Courses\n');

    // Insert users PROPERLY (important)
    console.log('Seeding Users...\n');

    for (const u of USERS) {
      const user = new User(u);
      await user.save(); // 🔥 triggers bcrypt hashing
      console.log(`• ${u.name} — ${u.email} / password: ${u.password}`);
    }

    // Insert courses
    const createdCourses = await Course.insertMany(COURSES);
    console.log('\nSeeded Courses:');

    createdCourses.forEach((c) =>
      console.log(`• [${c.price === 0 ? 'FREE' : '$' + c.price}] ${c.title}`)
    );

    console.log('\nSeed complete!');
    process.exit();
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
}

seed();
