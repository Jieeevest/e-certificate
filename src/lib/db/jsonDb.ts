import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Definisi tipe data
type User = {
  id: string;
  username: string;
  password: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
};

type Student = {
  id: string;
  nim: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  year?: string;
  enrollmentDate: string;
  major: string;
  createdAt: string;
  updatedAt: string;
};

type Certificate = {
  id: string;
  title: string;
  description?: string;
  issueDate: string;
  expiryDate?: string;
  studentId: string;
  fileUrl?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

// Path ke file JSON
const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const STUDENTS_FILE = path.join(DATA_DIR, 'students.json');
const CERTIFICATES_FILE = path.join(DATA_DIR, 'certificates.json');

// Fungsi helper untuk membaca file JSON
function readJsonFile<T>(filePath: string): T[] {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data) as T[];
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return [];
  }
}

// Fungsi helper untuk menulis file JSON
function writeJsonFile<T>(filePath: string, data: T[]): void {
  try {
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error(`Error writing file ${filePath}:`, error);
  }
}

// Kelas JsonDb untuk mengelola data
export class JsonDb {
  // User methods
  async user() {
    return {
      findUnique: async ({ where }: { where: { id?: string; username?: string } }) => {
        const users = readJsonFile<User>(USERS_FILE);
        if (where.id) {
          return users.find(user => user.id === where.id) || null;
        }
        if (where.username) {
          return users.find(user => user.username === where.username) || null;
        }
        return null;
      },
      findMany: async () => {
        return readJsonFile<User>(USERS_FILE);
      },
      create: async ({ data }: { data: Omit<User, 'id' | 'createdAt' | 'updatedAt'> }) => {
        const users = readJsonFile<User>(USERS_FILE);
        const now = new Date().toISOString();
        const newUser: User = {
          id: uuidv4(),
          ...data,
          createdAt: now,
          updatedAt: now
        };
        users.push(newUser);
        writeJsonFile<User>(USERS_FILE, users);
        return newUser;
      },
      update: async ({ where, data }: { where: { id: string }, data: Partial<User> }) => {
        const users = readJsonFile<User>(USERS_FILE);
        const index = users.findIndex(user => user.id === where.id);
        if (index === -1) return null;
        
        const updatedUser = {
          ...users[index],
          ...data,
          updatedAt: new Date().toISOString()
        };
        users[index] = updatedUser;
        writeJsonFile<User>(USERS_FILE, users);
        return updatedUser;
      },
      delete: async ({ where }: { where: { id: string } }) => {
        const users = readJsonFile<User>(USERS_FILE);
        const index = users.findIndex(user => user.id === where.id);
        if (index === -1) return null;
        
        const deletedUser = users[index];
        users.splice(index, 1);
        writeJsonFile<User>(USERS_FILE, users);
        return deletedUser;
      }
    };
  }

  // Student methods
  async student() {
    return {
      findUnique: async ({ where }: { where: { id?: string; nim?: string; email?: string } }) => {
        const students = readJsonFile<Student>(STUDENTS_FILE);
        if (where.id) {
          return students.find(student => student.id === where.id) || null;
        }
        if (where.nim) {
          return students.find(student => student.nim === where.nim) || null;
        }
        if (where.email) {
          return students.find(student => student.email === where.email) || null;
        }
        return null;
      },
      findMany: async () => {
        return readJsonFile<Student>(STUDENTS_FILE);
      },
      create: async ({ data }: { data: Omit<Student, 'id' | 'createdAt' | 'updatedAt'> }) => {
        const students = readJsonFile<Student>(STUDENTS_FILE);
        const now = new Date().toISOString();
        const newStudent: Student = {
          id: uuidv4(),
          ...data,
          createdAt: now,
          updatedAt: now
        };
        students.push(newStudent);
        writeJsonFile<Student>(STUDENTS_FILE, students);
        return newStudent;
      },
      update: async ({ where, data }: { where: { id: string }, data: Partial<Student> }) => {
        const students = readJsonFile<Student>(STUDENTS_FILE);
        const index = students.findIndex(student => student.id === where.id);
        if (index === -1) return null;
        
        const updatedStudent = {
          ...students[index],
          ...data,
          updatedAt: new Date().toISOString()
        };
        students[index] = updatedStudent;
        writeJsonFile<Student>(STUDENTS_FILE, students);
        return updatedStudent;
      },
      delete: async ({ where }: { where: { id: string } }) => {
        const students = readJsonFile<Student>(STUDENTS_FILE);
        const index = students.findIndex(student => student.id === where.id);
        if (index === -1) return null;
        
        const deletedStudent = students[index];
        students.splice(index, 1);
        writeJsonFile<Student>(STUDENTS_FILE, students);
        return deletedStudent;
      }
    };
  }

  // Certificate methods
  async certificate() {
    return {
      findUnique: async ({ where }: { where: { id: string } }) => {
        const certificates = readJsonFile<Certificate>(CERTIFICATES_FILE);
        return certificates.find(cert => cert.id === where.id) || null;
      },
      findMany: async ({ where }: { where?: { studentId?: string } } = {}) => {
        const certificates = readJsonFile<Certificate>(CERTIFICATES_FILE);
        if (where?.studentId) {
          return certificates.filter(cert => cert.studentId === where.studentId);
        }
        return certificates;
      },
      create: async ({ data }: { data: Omit<Certificate, 'id' | 'createdAt' | 'updatedAt'> }) => {
        const certificates = readJsonFile<Certificate>(CERTIFICATES_FILE);
        const now = new Date().toISOString();
        const newCertificate: Certificate = {
          id: uuidv4(),
          ...data,
          createdAt: now,
          updatedAt: now
        };
        certificates.push(newCertificate);
        writeJsonFile<Certificate>(CERTIFICATES_FILE, certificates);
        return newCertificate;
      },
      update: async ({ where, data }: { where: { id: string }, data: Partial<Certificate> }) => {
        const certificates = readJsonFile<Certificate>(CERTIFICATES_FILE);
        const index = certificates.findIndex(cert => cert.id === where.id);
        if (index === -1) return null;
        
        const updatedCertificate = {
          ...certificates[index],
          ...data,
          updatedAt: new Date().toISOString()
        };
        certificates[index] = updatedCertificate;
        writeJsonFile<Certificate>(CERTIFICATES_FILE, certificates);
        return updatedCertificate;
      },
      delete: async ({ where }: { where: { id: string } }) => {
        const certificates = readJsonFile<Certificate>(CERTIFICATES_FILE);
        const index = certificates.findIndex(cert => cert.id === where.id);
        if (index === -1) return null;
        
        const deletedCertificate = certificates[index];
        certificates.splice(index, 1);
        writeJsonFile<Certificate>(CERTIFICATES_FILE, certificates);
        return deletedCertificate;
      }
    };
  }

  // Metode untuk statistik dashboard
  async count(model: 'user' | 'student' | 'certificate') {
    switch (model) {
      case 'user':
        return readJsonFile<User>(USERS_FILE).length;
      case 'student':
        return readJsonFile<Student>(STUDENTS_FILE).length;
      case 'certificate':
        return readJsonFile<Certificate>(CERTIFICATES_FILE).length;
      default:
        return 0;
    }
  }

  // Metode untuk menghitung sertifikat berdasarkan status
  async countCertificatesByStatus() {
    const certificates = readJsonFile<Certificate>(CERTIFICATES_FILE);
    const statusCounts: Record<string, number> = {
      PENDING: 0,
      ISSUED: 0,
      REVOKED: 0
    };
    
    certificates.forEach(cert => {
      if (statusCounts[cert.status] !== undefined) {
        statusCounts[cert.status]++;
      } else {
        statusCounts[cert.status] = 1;
      }
    });
    
    return statusCounts;
  }
}

// Ekspor instance JsonDb
export const jsonDb = new JsonDb();