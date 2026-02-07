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
    description: 'Learn HTML, CSS, and JavaScript fundamentals.',
    price: 0,
    image: '/images/web.jpg',
    category: 'Web Development',
    instructor: 'Sarah Chen',
    duration: '4 hours',
    level: 'Beginner',
  },
  {
    title: 'Advanced React Patterns',
    description: 'Master advanced React techniques and performance optimization.',
    price: 49.99,
    image: '/images/react.jpg',
    category: 'Frontend',
    instructor: 'James Liu',
    duration: '6 hours',
    level: 'Advanced',
  },
  {
    title: 'Python for Data Science',
    description: 'Pandas, NumPy, Matplotlib and ML basics.',
    price: 39.99,
    image: '/images/python.jpg',
    category: 'Data Science',
    instructor: 'Emily Park',
    duration: '5 hours',
    level: 'Intermediate',
  },
  {
    title: 'Node.js & Express Masterclass',
    description: 'Build scalable REST APIs using Node.js.',
    price: 44.99,
    image: '/images/nodejs.jpg',
    category: 'Backend',
    instructor: 'Michael Torres',
    duration: '7 hours',
    level: 'Intermediate',
  },
  {
    title: 'Machine Learning Basics',
    description: 'Intro to ML, neural networks and AI models.',
    price: 59.99,
    image: '/images/Machine_Learning.jpg',
    category: 'AI / ML',
    instructor: 'Rachel Adams',
    duration: '6 hours',
    level: 'Intermediate',
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);

    console.log("MongoDB connected");

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
