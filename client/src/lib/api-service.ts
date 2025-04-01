// Constants
const TC_API_BASE = "https://www.transparentclassroom.com/api/v1";

// Helper function to get auth token from localStorage
const getAuthToken = (): string | null => {
  const authData = localStorage.getItem("tc_mobile_auth");
  if (!authData) return null;
  
  try {
    const userData = JSON.parse(authData);
    return userData.token || null;
  } catch (error) {
    console.error("Error parsing auth data:", error);
    return null;
  }
};

// Generic API request function
async function apiRequest<T>(
  endpoint: string, 
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  data?: any
): Promise<T> {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error("Not authenticated");
  }
  
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
  
  const config: RequestInit = {
    method,
    headers,
    credentials: "include",
  };
  
  if (data) {
    config.body = JSON.stringify(data);
  }
  
  const response = await fetch(`${TC_API_BASE}${endpoint}`, config);
  
  if (!response.ok) {
    // Handle different error states
    if (response.status === 401) {
      // Clear invalid auth
      localStorage.removeItem("tc_mobile_auth");
      throw new Error("Session expired. Please login again");
    }
    
    const errorText = await response.text();
    throw new Error(errorText || `API error: ${response.status}`);
  }
  
  return response.json();
}

// API functions for Transparent Classroom
export const TCApi = {
  // User profile
  getUserProfile: () => {
    return apiRequest<any>("/me");
  },
  
  // Children
  getChildren: () => {
    return apiRequest<any>("/children");
  },
  
  getChildById: (id: number) => {
    return apiRequest<any>(`/children/${id}`);
  },
  
  // Activities
  getActivities: (params?: { page?: number, child_id?: number }) => {
    const queryParams = new URLSearchParams();
    
    if (params?.page) {
      queryParams.append("page", params.page.toString());
    }
    
    if (params?.child_id) {
      queryParams.append("child_id", params.child_id.toString());
    }
    
    const query = queryParams.toString() ? `?${queryParams.toString()}` : "";
    return apiRequest<any>(`/activities${query}`);
  },
  
  // Schools
  getSchools: () => {
    return apiRequest<any>("/schools");
  },
  
  // Classrooms
  getClassrooms: () => {
    return apiRequest<any>("/classrooms");
  },
  
  // Authentication-related functions
  login: async (email: string, password: string) => {
    // This would be replaced with the actual TC auth endpoint
    // For now, returning mock data
    return {
      id: 635484,
      firstName: "Frank",
      lastName: "Emanuele",
      fullName: "Frank Emanuele",
      email: email,
      avatar: "https://dhabtygr2920s.cloudfront.net/webpack/images/missing_tiny_square-845c8bc9b051a242224b117cf6bc55d9.png",
      token: "sample-auth-token"
    };
  },
  
  // Other TC API endpoints would be added here
};

export default TCApi;