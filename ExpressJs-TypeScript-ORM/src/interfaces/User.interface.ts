export interface User {
  _id: string | null; // ObjectId or string type for MongoDB ObjectId
  name: string;
  email: string;
  password?: string;
  status: "active" | "inactive";
  createdAt?: Date;
  updatedAt?: Date;
}