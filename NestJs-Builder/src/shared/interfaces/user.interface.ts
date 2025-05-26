export interface IUser {
  id: number;
  email: string;
  role: string;
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
