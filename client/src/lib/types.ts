export interface ActivityPost {
  id: number;
  classroom: string;
  date: string;
  content: string;
  imageUrl?: string;
  author: string;
  comments?: ActivityComment[];
}

export interface ActivityComment {
  id: number;
  author: string;
  authorImage?: string;
  date: string;
  content: string;
}

export interface Child {
  id: number;
  firstName: string;
  lastName: string;
  nickname?: string;
  avatarUrl?: string;
  classroom: string;
  birthDate?: string;
}

export interface Contact {
  id: number;
  name: string;
  role: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
}
