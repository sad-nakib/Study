import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

export interface SubjectItem {
  id: string;
  name: string;
  code?: string;
  description?: string;
  color: string;
  icon?: string;
  order: number;
}

export interface ClassItem {
  id: string;
  subjectId: string;
  title: string;
  youtubeUrl: string;
  driveSheetUrl: string;
  bookPdfUrl?: string;
  topic?: string;
  instructor?: string;
  dateAdded: string;
}

interface DatabaseSchema {
  subjects: SubjectItem[];
  classes: ClassItem[];
}

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "store.json");

const DEFAULT_DATA: DatabaseSchema = {
  subjects: [
    {
      id: "subj-english",
      name: "English",
      code: "ENG",
      description: "Grammar, Reading Comprehension, Vocabulary & Writing Skills",
      color: "indigo",
      icon: "BookOpen",
      order: 1,
    },
    {
      id: "subj-math",
      name: "Math",
      code: "MATH",
      description: "Algebra, Calculus, Geometry, Trigonometry & Problem Solving",
      color: "emerald",
      icon: "Calculator",
      order: 2,
    },
    {
      id: "subj-gk",
      name: "General Knowledge",
      code: "GK",
      description: "Current Affairs, World History, Science & Geography",
      color: "amber",
      icon: "Globe",
      order: 3,
    },
  ],
  classes: [
    // English Classes
    {
      id: "cls-eng-1",
      subjectId: "subj-english",
      title: "Class 01: Complete Tenses & Sentence Structures",
      youtubeUrl: "https://www.youtube.com/watch?v=0IAPZzGSbME",
      driveSheetUrl: "https://docs.google.com/document/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/preview",
      bookPdfUrl: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/preview",
      topic: "Grammar Fundamentals",
      instructor: "Prof. Sarah",
      dateAdded: "2026-08-01",
    },
    {
      id: "cls-eng-2",
      subjectId: "subj-english",
      title: "Class 02: Vocabulary Building & Idiomatic Expressions",
      youtubeUrl: "https://www.youtube.com/watch?v=fNk_zzaMoSs",
      driveSheetUrl: "https://docs.google.com/document/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/preview",
      topic: "Vocabulary Mastery",
      instructor: "Prof. Sarah",
      dateAdded: "2026-08-05",
    },
    {
      id: "cls-eng-3",
      subjectId: "subj-english",
      title: "Class 03: Reading Comprehension Techniques & Speed Tactics",
      youtubeUrl: "https://www.youtube.com/watch?v=76dhtgZt38A",
      driveSheetUrl: "https://docs.google.com/presentation/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/preview",
      topic: "Reading & Analysis",
      instructor: "Prof. Sarah",
      dateAdded: "2026-08-10",
    },

    // Math Classes
    {
      id: "cls-math-1",
      subjectId: "subj-math",
      title: "Class 01: Linear Equations, Graphs & Matrix Basics",
      youtubeUrl: "https://www.youtube.com/watch?v=fNk_zzaMoSs",
      driveSheetUrl: "https://docs.google.com/document/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/preview",
      bookPdfUrl: "https://openstax.org/details/books/calculus-volume-1",
      topic: "Algebra & Matrices",
      instructor: "Prof. Gilbert",
      dateAdded: "2026-08-02",
    },
    {
      id: "cls-math-2",
      subjectId: "subj-math",
      title: "Class 02: Differentiation Rules & Rate of Change",
      youtubeUrl: "https://www.youtube.com/watch?v=PFDu9oVAE-g",
      driveSheetUrl: "https://docs.google.com/presentation/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/preview",
      topic: "Calculus Foundations",
      instructor: "Prof. Gilbert",
      dateAdded: "2026-08-06",
    },
    {
      id: "cls-math-3",
      subjectId: "subj-math",
      title: "Class 03: Probability & Permutation Combinations",
      youtubeUrl: "https://www.youtube.com/watch?v=s-CYnVz-uh4",
      driveSheetUrl: "https://docs.google.com/document/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/preview",
      topic: "Probability Theory",
      instructor: "Prof. Gilbert",
      dateAdded: "2026-08-11",
    },

    // GK Classes
    {
      id: "cls-gk-1",
      subjectId: "subj-gk",
      title: "Class 01: Modern World History & International Treaties",
      youtubeUrl: "https://www.youtube.com/watch?v=7Zc9Nu_3VGs",
      driveSheetUrl: "https://docs.google.com/document/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/preview",
      bookPdfUrl: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/preview",
      topic: "World Affairs",
      instructor: "Dr. Walter",
      dateAdded: "2026-08-03",
    },
    {
      id: "cls-gk-2",
      subjectId: "subj-gk",
      title: "Class 02: Physical Geography, Oceans & Climate Zones",
      youtubeUrl: "https://www.youtube.com/watch?v=hO3z2u3vW28",
      driveSheetUrl: "https://docs.google.com/presentation/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/preview",
      topic: "Geography",
      instructor: "Dr. Walter",
      dateAdded: "2026-08-08",
    },
  ],
};

function readDatabase(): DatabaseSchema {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(content);
    }
  } catch (err) {
    console.error("Error reading database:", err);
  }
  // Initialize with default data if not exists
  writeDatabase(DEFAULT_DATA);
  return DEFAULT_DATA;
}

function writeDatabase(data: DatabaseSchema): boolean {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Error writing database:", err);
    return false;
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // Get full database
  app.get("/api/data", (_req, res) => {
    const data = readDatabase();
    res.json(data);
  });

  // Bulk save database
  app.post("/api/data", (req, res) => {
    const { subjects, classes } = req.body;
    if (!Array.isArray(subjects) || !Array.isArray(classes)) {
      res.status(400).json({ error: "Invalid data format" });
      return;
    }
    const success = writeDatabase({ subjects, classes });
    if (success) {
      res.json({ success: true });
    } else {
      res.status(500).json({ error: "Failed to persist data" });
    }
  });

  // Create Subject
  app.post("/api/subjects", (req, res) => {
    const { name, code, description, color, icon } = req.body;
    if (!name) {
      res.status(400).json({ error: "Subject name is required" });
      return;
    }
    const data = readDatabase();
    const newSubject: SubjectItem = {
      id: `subj-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim(),
      code: code ? code.trim() : undefined,
      description: description ? description.trim() : undefined,
      color: color || "indigo",
      icon: icon || "BookOpen",
      order: data.subjects.length + 1,
    };
    data.subjects.push(newSubject);
    writeDatabase(data);
    res.status(201).json(newSubject);
  });

  // Update Subject
  app.put("/api/subjects/:id", (req, res) => {
    const { id } = req.params;
    const { name, code, description, color, icon } = req.body;
    const data = readDatabase();
    const index = data.subjects.findIndex((s) => s.id === id);
    if (index === -1) {
      res.status(404).json({ error: "Subject not found" });
      return;
    }
    data.subjects[index] = {
      ...data.subjects[index],
      name: name !== undefined ? name.trim() : data.subjects[index].name,
      code: code !== undefined ? code.trim() : data.subjects[index].code,
      description: description !== undefined ? description.trim() : data.subjects[index].description,
      color: color || data.subjects[index].color,
      icon: icon || data.subjects[index].icon,
    };
    writeDatabase(data);
    res.json(data.subjects[index]);
  });

  // Delete Subject and all its classes
  app.delete("/api/subjects/:id", (req, res) => {
    const { id } = req.params;
    const data = readDatabase();
    data.subjects = data.subjects.filter((s) => s.id !== id);
    data.classes = data.classes.filter((c) => c.subjectId !== id);
    writeDatabase(data);
    res.json({ success: true, deletedSubjectId: id });
  });

  // Create Class
  app.post("/api/classes", (req, res) => {
    const { subjectId, title, youtubeUrl, driveSheetUrl, bookPdfUrl, topic, instructor } = req.body;
    if (!subjectId || !title || !youtubeUrl) {
      res.status(400).json({ error: "subjectId, title, and youtubeUrl are required" });
      return;
    }
    const data = readDatabase();
    const newClass: ClassItem = {
      id: `cls-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      subjectId,
      title: title.trim(),
      youtubeUrl: youtubeUrl.trim(),
      driveSheetUrl: driveSheetUrl ? driveSheetUrl.trim() : "",
      bookPdfUrl: bookPdfUrl ? bookPdfUrl.trim() : undefined,
      topic: topic ? topic.trim() : undefined,
      instructor: instructor ? instructor.trim() : undefined,
      dateAdded: new Date().toISOString().split("T")[0],
    };
    data.classes.push(newClass);
    writeDatabase(data);
    res.status(201).json(newClass);
  });

  // Update Class
  app.put("/api/classes/:id", (req, res) => {
    const { id } = req.params;
    const { subjectId, title, youtubeUrl, driveSheetUrl, bookPdfUrl, topic, instructor } = req.body;
    const data = readDatabase();
    const index = data.classes.findIndex((c) => c.id === id);
    if (index === -1) {
      res.status(404).json({ error: "Class not found" });
      return;
    }
    data.classes[index] = {
      ...data.classes[index],
      subjectId: subjectId || data.classes[index].subjectId,
      title: title !== undefined ? title.trim() : data.classes[index].title,
      youtubeUrl: youtubeUrl !== undefined ? youtubeUrl.trim() : data.classes[index].youtubeUrl,
      driveSheetUrl: driveSheetUrl !== undefined ? driveSheetUrl.trim() : data.classes[index].driveSheetUrl,
      bookPdfUrl: bookPdfUrl !== undefined ? bookPdfUrl.trim() : data.classes[index].bookPdfUrl,
      topic: topic !== undefined ? topic.trim() : data.classes[index].topic,
      instructor: instructor !== undefined ? instructor.trim() : data.classes[index].instructor,
    };
    writeDatabase(data);
    res.json(data.classes[index]);
  });

  // Delete Class
  app.delete("/api/classes/:id", (req, res) => {
    const { id } = req.params;
    const data = readDatabase();
    data.classes = data.classes.filter((c) => c.id !== id);
    writeDatabase(data);
    res.json({ success: true, deletedClassId: id });
  });

  // Reset to default data
  app.post("/api/reset", (_req, res) => {
    writeDatabase(DEFAULT_DATA);
    res.json(DEFAULT_DATA);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Study Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
