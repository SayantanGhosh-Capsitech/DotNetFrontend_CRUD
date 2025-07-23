export interface Student {
  id?: string;
  name: string;
  isGraduated: boolean;
  courses?: string[];
  gender: string;
  age: number;
  courseDetail?: {
    id: string;
    name: string;
  }[];
}
// export interface StudentUpdate {
//   id?: string;
//   name: string;
//   isGraduated: boolean;
//   gender: string;
//   age: number;
//   courseDetail?: {
//     id: string;
//     name: string;
//   }[];
// }
