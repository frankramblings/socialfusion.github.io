import { 
  users, type User, type InsertUser,
  type ActivityPost, type Child, type Contact, type Comment
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Activity methods
  getActivities(): Promise<ActivityPost[]>;
  getChildActivities(childId: number): Promise<ActivityPost[]>;
  
  // Child methods
  getChild(id: number): Promise<Child | undefined>;
  getClassmates(): Promise<Child[]>;
  
  // Contact methods
  getContacts(): Promise<Contact[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private activities: ActivityPost[];
  private children: Child[];
  private contacts: Contact[];
  private comments: Comment[];
  currentId: number;

  constructor() {
    this.users = new Map();
    this.currentId = 1;
    
    // Initialize with mock data for development
    this.activities = [
      {
        id: 1,
        classroom: "Sunflower Room",
        date: "2 hours ago",
        content: "Cecilia worked with the <strong>Pink Tower</strong> today, showing great concentration and coordination.",
        imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1122&q=80",
        author: "Ms. Johnson",
        childId: 708743,
        createdAt: new Date()
      },
      {
        id: 2,
        classroom: "Sunflower Room",
        date: "Yesterday",
        content: "Today our class explored shapes and colors through a cooperative art project.",
        imageUrl: "https://images.unsplash.com/photo-1560969184-10fe8719e047?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        author: "Ms. Johnson",
        childId: 708743,
        createdAt: new Date()
      },
      {
        id: 3,
        classroom: "Sunflower Room",
        date: "2 days ago",
        content: "We had a special guest visit our classroom to talk about different animals and habitats.",
        imageUrl: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        author: "Ms. Johnson",
        childId: 0,
        createdAt: new Date()
      }
    ];
    
    this.children = [
      {
        id: 708743,
        firstName: "Cecilia",
        lastName: "Emanuele",
        nickname: "Cece",
        avatarUrl: "https://images.unsplash.com/photo-1616685042551-4bcdce34c636?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80",
        classroom: "Sunflower Room",
        birthDate: "2019-04-15"
      },
      {
        id: 708744,
        firstName: "Emma",
        lastName: "Liu",
        nickname: null,
        avatarUrl: "https://images.unsplash.com/photo-1615538758137-e7f773e6e67d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80",
        classroom: "Sunflower Room",
        birthDate: "2019-02-23"
      },
      {
        id: 708745,
        firstName: "Liam",
        lastName: "Johnson",
        nickname: null,
        avatarUrl: "https://images.unsplash.com/photo-1615538329852-f1880dca25b1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80",
        classroom: "Sunflower Room",
        birthDate: "2019-01-10"
      },
      {
        id: 708746,
        firstName: "Sophia",
        lastName: "Patel",
        nickname: null,
        avatarUrl: "https://images.unsplash.com/photo-1620573083867-389ccc133014?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80",
        classroom: "Sunflower Room",
        birthDate: "2019-06-05"
      },
      {
        id: 708747,
        firstName: "Noah",
        lastName: "Garcia",
        nickname: null,
        avatarUrl: "https://images.unsplash.com/photo-1620573088001-371398beec18?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80",
        classroom: "Sunflower Room",
        birthDate: "2019-03-21"
      }
    ];
    
    this.contacts = [
      {
        id: 1,
        name: "Sarah Johnson",
        role: "Lead Teacher - Sunflower Room",
        email: "sjohnson@littlelearnersacademy.edu",
        phone: "+1 (555) 123-4567",
        avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
      },
      {
        id: 2,
        name: "Michael Chen",
        role: "Assistant Teacher - Sunflower Room",
        email: "mchen@littlelearnersacademy.edu",
        phone: "+1 (555) 987-6543",
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
      },
      {
        id: 3,
        name: "Lisa Rodriguez",
        role: "School Director",
        email: "lrodriguez@littlelearnersacademy.edu",
        phone: "+1 (555) 456-7890",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80"
      },
      {
        id: 4,
        name: "David Thompson",
        role: "Administrative Assistant",
        email: "dthompson@littlelearnersacademy.edu",
        phone: "+1 (555) 234-5678",
        avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
      },
      {
        id: 5,
        name: "Sophia Lee",
        role: "School Nurse",
        email: "slee@littlelearnersacademy.edu",
        phone: "+1 (555) 345-6789",
        avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
      }
    ];
    
    this.comments = [
      {
        id: 1,
        activityId: 1,
        author: "Frank Emanuele",
        authorImage: "https://dhabtygr2920s.cloudfront.net/webpack/images/missing_tiny_square-845c8bc9b051a242224b117cf6bc55d9.png",
        date: "1 hour ago",
        content: "Thanks for the update! She's been talking about the Pink Tower at home too.",
        createdAt: new Date()
      },
      {
        id: 2,
        activityId: 2,
        author: "Ms. Johnson",
        authorImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        date: "Yesterday",
        content: "The children had so much fun with this activity!",
        createdAt: new Date()
      }
    ];
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Activity methods
  async getActivities(): Promise<ActivityPost[]> {
    // Add comments to activities
    return this.activities.map(activity => {
      const activityComments = this.comments.filter(comment => comment.activityId === activity.id);
      return {
        ...activity,
        comments: activityComments
      } as unknown as ActivityPost;
    }).sort((a, b) => {
      // Safe comparison that handles null dates
      const dateA = a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
      const dateB = b.createdAt instanceof Date ? b.createdAt.getTime() : 0;
      return dateB - dateA;
    });
  }
  
  async getChildActivities(childId: number): Promise<ActivityPost[]> {
    // Get activities for a specific child or activities without a childId (classroom-wide)
    const childActivities = this.activities.filter(
      activity => activity.childId === childId || activity.childId === 0
    );
    
    // Add comments to activities
    return childActivities.map(activity => {
      const activityComments = this.comments.filter(comment => comment.activityId === activity.id);
      return {
        ...activity,
        comments: activityComments
      } as unknown as ActivityPost;
    }).sort((a, b) => {
      // Safe comparison that handles null dates
      const dateA = a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
      const dateB = b.createdAt instanceof Date ? b.createdAt.getTime() : 0;
      return dateB - dateA;
    });
  }
  
  // Child methods
  async getChild(id: number): Promise<Child | undefined> {
    return this.children.find(child => child.id === id);
  }
  
  async getClassmates(): Promise<Child[]> {
    return this.children;
  }
  
  // Contact methods
  async getContacts(): Promise<Contact[]> {
    return this.contacts;
  }
}

export const storage = new MemStorage();
