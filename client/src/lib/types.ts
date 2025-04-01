export interface School {
  id: number;
  name: string;
  location?: string;
  logo?: string;
}

export interface User {
  id: number;
  firstName: string;
  lastName?: string;
  fullName: string;
  email: string;
  avatar?: string;
}

export interface Child {
  id: number;
  firstName: string;
  nickname?: string;
  lastName: string;
  fullName: string;
  avatar?: string;
  classroom?: Classroom;
  parent?: User;
}

export interface Classroom {
  id: number;
  name: string;
  teacher?: string;
}

export interface Activity {
  id: number;
  title: string;
  description: string;
  date: string;
  className: string;
  teacher: string;
  imageUrl?: string;
  likes: number;
  comments: number;
  childId: number;
}

export interface QuickLink {
  id: string;
  title: string;
  icon: string;
  url: string;
}
