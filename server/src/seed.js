// Adds the demo projects, bugs and comments.
// It NEVER deletes anything: a project is skipped if one with the same name
// already exists, so running it again is always safe.
// Run with: npm run seed
import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import Project from "./models/Project.js";
import Bug from "./models/Bug.js";
import Comment from "./models/Comment.js";

const PROJECTS = [
  {
    name: "Student Portal",
    description: "Dashboard, profile, course progress and notice board for students",
    clientName: "Gradious Learning",
    members: ["u2", "u3"],
    bugs: [
      { title: "Course progress shows 0% after refresh", description: "Progress bar resets until the page is opened twice.", severity: "high", priority: "high", status: "in_progress", assignee: "u2",
        comments: [{ author: "u2", authorName: "Dev One", text: "Reproduced. The progress API is called before the user session loads." }] },
      { title: "Notice board marks all notices as unread", description: "Read notices appear unread after logging in again.", severity: "medium", priority: "medium", status: "open" },
      { title: "Profile photo upload fails above 2 MB", description: "Large photos show a generic error instead of a size message.", severity: "medium", priority: "low", status: "resolved", assignee: "u3" },
    ],
  },
  {
    name: "Practice Problems",
    description: "MCQs, coding challenges, assignments and SQL practice",
    clientName: "Gradious Learning",
    members: ["u2", "u3"],
    bugs: [
      { title: "Code editor loses my answer on refresh", description: "Unsaved code disappears when the page reloads.", severity: "critical", priority: "high", status: "in_progress", assignee: "u2",
        comments: [{ author: "u1", authorName: "Admin User", text: "Students reported this twice this week. Please prioritise." }] },
      { title: "MCQ score is wrong for multiple-select questions", description: "Partially correct answers are scored as fully wrong.", severity: "high", priority: "high", status: "open" },
      { title: "SQL practice runs the previous query", description: "Pressing Run executes the query from the last attempt.", severity: "medium", priority: "medium", status: "in_review", assignee: "u3" },
      { title: "Assignment due date shown in the wrong timezone", description: "Deadlines are shown in UTC instead of IST.", severity: "low", priority: "medium", status: "closed", assignee: "u3" },
    ],
  },
  {
    name: "Mock Tests",
    description: "Timed tests, scoring and results",
    clientName: "Gradious Learning",
    members: ["u3"],
    bugs: [
      { title: "Timer keeps running after submit", description: "The countdown continues on the result page.", severity: "high", priority: "high", status: "open" },
      { title: "Test auto-submits when switching tabs once", description: "One accidental tab switch ends the whole test.", severity: "medium", priority: "medium", status: "in_progress", assignee: "u3" },
      { title: "Result page does not show section-wise score", description: "Only the total score is displayed.", severity: "medium", priority: "low", status: "open" },
    ],
  },
  {
    name: "Doubts Forum",
    description: "Students ask doubts and mentors reply",
    clientName: "Gradious Learning",
    members: ["u2"],
    bugs: [
      { title: "Mentor reply notification is not sent", description: "Students are not told when a mentor answers.", severity: "high", priority: "medium", status: "in_review", assignee: "u2" },
      { title: "Code blocks lose indentation in doubts", description: "Pasted code is shown without its spacing.", severity: "medium", priority: "medium", status: "open" },
      { title: "Cannot attach a screenshot to a doubt", description: "The attach button does nothing on mobile.", severity: "low", priority: "low", status: "open" },
    ],
  },
  {
    name: "Jobs & Internships",
    description: "Job listings, applications and company profiles",
    clientName: "Gradious Placements",
    members: ["u2", "u3"],
    bugs: [
      { title: "Apply button works twice for the same job", description: "Students can submit duplicate applications.", severity: "high", priority: "high", status: "in_progress", assignee: "u3" },
      { title: "Company logo missing on job cards", description: "Logos load only on the job details page.", severity: "low", priority: "low", status: "resolved", assignee: "u2" },
      { title: "Location filter returns all jobs", description: "Choosing a city does not narrow the list.", severity: "medium", priority: "medium", status: "open" },
    ],
  },
];

await connectDB();

for (const { bugs, ...fields } of PROJECTS) {
  if (await Project.exists({ name: fields.name })) {
    console.log(`Skipped (already exists): ${fields.name}`);
    continue;
  }

  const project = await Project.create({ ...fields, createdBy: "u1" });

  for (const { comments = [], ...bugFields } of bugs) {
    const bug = await Bug.create({ ...bugFields, project: project._id, reporter: "u4" });
    for (const comment of comments) {
      await Comment.create({ bug: bug._id, ...comment });
    }
  }
  console.log(`Added: ${fields.name} (${bugs.length} bugs)`);
}

await mongoose.disconnect();
