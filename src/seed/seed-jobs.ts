import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import User from "../models/auth/user.model";
import dotenv from "dotenv";
import JobModel from "../models/job.model";

dotenv.config();

const majors = [
  "Computer Science",
  "Information Technology",
  "Software Engineering",
  "Data Science",
  "Artificial Intelligence",
  "Cybersecurity",
  "Mechanical Engineering",
  "Electrical Engineering",
  "Civil Engineering",
  "Electronics and Communication",
  "Biomedical Engineering",
  "Architecture",
  "Physics",
  "Mathematics",
  "Statistics",
  "Business Administration",
  "Finance",
  "Accounting",
  "Marketing",
  "Economics",
  "Psychology",
  "Sociology",
  "Political Science",
  "Philosophy",
  "History",
  "English Literature",
  "Linguistics",
  "Law",
  "Criminal Justice",
  "Journalism",
  "Media Studies",
  "Fine Arts",
  "Music",
  "Graphic Design",
  "Fashion Design",
  "Biotechnology",
  "Microbiology",
  "Zoology",
  "Botany",
  "Environmental Science",
  "Geology",
  "Nursing",
  "Pharmacy",
  "Medicine",
  "Veterinary Science",
  "Public Health",
  "Agricultural Science",
];

function generateRichTextDescription(): string {
  const jobTitle = faker.person.jobTitle();
  const responsibilities = Array.from(
    { length: 3 },
    () => `<li>${faker.lorem.sentence()}</li>`
  ).join("\n");
  const requirements = Array.from(
    { length: 3 },
    () => `<li>${faker.lorem.sentence()}</li>`
  ).join("\n");

  return `
    <h2>About the Role</h2>
    <p>As a ${jobTitle} at ${faker.company.name()}, ${faker.lorem.sentences(
    2
  )}</p>

    <h3>Responsibilities</h3>
    <ul>
      ${responsibilities}
    </ul>

    <h3>Requirements</h3>
    <ul>
      ${requirements}
    </ul>

    <p>${faker.lorem.sentences(2)} Join our team and ${faker.company
    .catchPhrase()
    .toLowerCase()}.</p>
  `;
}

const MONGO_URI = process.env.MONGO_URI || "";
console.log("🔍 MONGO_URI:", MONGO_URI);

async function connectDB() {
  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected to MongoDB Atlas");
}

function generateRandomJob(postedById: mongoose.Types.ObjectId) {
  const experienceType = faker.helpers.arrayElement([
    "no-experience",
    "1-3 years",
    "3-5 years",
    "5-10 years",
    "10+ years",
  ]);

  const isFixed = faker.datatype.boolean();

  return {
    title: faker.person.jobTitle(),
    description: generateRichTextDescription(),
    type: faker.helpers.arrayElement([
      "full-time",
      "part-time",
      "freelance",
      "remote",
      "hybrid",
    ]),
    education: {
      name: faker.helpers.arrayElement(majors),
      startDate: faker.date.past({ years: 5 }),
      endDate: faker.date.past({ years: 1 }),
      isCurrent: false,
    },
    experience:
      experienceType === "no-experience"
        ? { type: "no-experience" }
        : {
            type: experienceType,
            company: faker.company.name(),
            location: faker.location.city(),
            role: faker.person.jobType(),
            description: faker.lorem.sentences(2),
            startDate: faker.date.past({ years: 3 }),
            endDate: faker.date.recent(),
            isCurrent: faker.datatype.boolean(),
            noticePeriod: faker.number.int({ min: 15, max: 90 }),
          },
    skills: faker.helpers.arrayElements(
      [
        "JavaScript",
        "TypeScript",
        "React",
        "Node.js",
        "MongoDB",
        "Python",
        "Docker",
        "AWS",
        "PostgreSQL",
      ],
      faker.number.int({ min: 3, max: 6 })
    ),
    salary: isFixed
      ? {
          type: "fixed",
          amount: faker.number.int({ min: 30000, max: 120000 }),
          currency: "INR",
        }
      : {
          type: "negotiable",
          min: faker.number.int({ min: 30000, max: 50000 }),
          max: faker.number.int({ min: 50001, max: 150000 }),
          currency: "INR",
        },
    location: faker.location.city(),
    company: faker.company.name(),
    status: faker.helpers.arrayElement(["active", "inactive", "draft"]),
    applicationDeadline: faker.date.future(),
    postedBy: postedById,
  };
}

async function seedJobs(jobCount: number) {
  const users = await User.find({ email: /dummyuser\d+@example\.com/ });

  if (!users.length) {
    throw new Error("❌ No users found. Run seed-users.ts first.");
  }

  const jobs = Array.from({ length: jobCount }, () => {
    const randomUser = faker.helpers.arrayElement(users);
    return generateRandomJob(randomUser._id);
  });

  await JobModel.insertMany(jobs);
  console.log(`🚀 Inserted ${jobCount} jobs using ${users.length} users`);
}

async function run() {
  try {
    await connectDB();
    await seedJobs(1000); // change count as needed
  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

run();
