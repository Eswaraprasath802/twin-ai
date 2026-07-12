// Indian states/UTs with representative capital coordinates.
// Used to fetch live weather per-state without needing a custom backend.

export interface IndianState {
  id: string;
  name: string;
  capital: string;
  lat: number;
  lon: number;
}

export const INDIAN_STATES: IndianState[] = [
  { id: "AP", name: "Andhra Pradesh", capital: "Amaravati", lat: 16.5062, lon: 80.648 },
  { id: "AR", name: "Arunachal Pradesh", capital: "Itanagar", lat: 27.0844, lon: 93.6053 },
  { id: "AS", name: "Assam", capital: "Dispur", lat: 26.1433, lon: 91.7898 },
  { id: "BR", name: "Bihar", capital: "Patna", lat: 25.5941, lon: 85.1376 },
  { id: "CT", name: "Chhattisgarh", capital: "Raipur", lat: 21.2514, lon: 81.6296 },
  { id: "GA", name: "Goa", capital: "Panaji", lat: 15.4909, lon: 73.8278 },
  { id: "GJ", name: "Gujarat", capital: "Gandhinagar", lat: 23.2156, lon: 72.6369 },
  { id: "HR", name: "Haryana", capital: "Chandigarh", lat: 30.7333, lon: 76.7794 },
  { id: "HP", name: "Himachal Pradesh", capital: "Shimla", lat: 31.1048, lon: 77.1734 },
  { id: "JH", name: "Jharkhand", capital: "Ranchi", lat: 23.3441, lon: 85.3096 },
  { id: "KA", name: "Karnataka", capital: "Bengaluru", lat: 12.9716, lon: 77.5946 },
  { id: "KL", name: "Kerala", capital: "Thiruvananthapuram", lat: 8.5241, lon: 76.9366 },
  { id: "MP", name: "Madhya Pradesh", capital: "Bhopal", lat: 23.2599, lon: 77.4126 },
  { id: "MH", name: "Maharashtra", capital: "Mumbai", lat: 19.076, lon: 72.8777 },
  { id: "MN", name: "Manipur", capital: "Imphal", lat: 24.817, lon: 93.9368 },
  { id: "ML", name: "Meghalaya", capital: "Shillong", lat: 25.5788, lon: 91.8933 },
  { id: "MZ", name: "Mizoram", capital: "Aizawl", lat: 23.7271, lon: 92.7176 },
  { id: "NL", name: "Nagaland", capital: "Kohima", lat: 25.6751, lon: 94.1086 },
  { id: "OR", name: "Odisha", capital: "Bhubaneswar", lat: 20.2961, lon: 85.8245 },
  { id: "PB", name: "Punjab", capital: "Chandigarh", lat: 30.7333, lon: 76.7794 },
  { id: "RJ", name: "Rajasthan", capital: "Jaipur", lat: 26.9124, lon: 75.7873 },
  { id: "SK", name: "Sikkim", capital: "Gangtok", lat: 27.3389, lon: 88.6065 },
  { id: "TN", name: "Tamil Nadu", capital: "Chennai", lat: 13.0827, lon: 80.2707 },
  { id: "TG", name: "Telangana", capital: "Hyderabad", lat: 17.385, lon: 78.4867 },
  { id: "TR", name: "Tripura", capital: "Agartala", lat: 23.8315, lon: 91.2868 },
  { id: "UP", name: "Uttar Pradesh", capital: "Lucknow", lat: 26.8467, lon: 80.9462 },
  { id: "UT", name: "Uttarakhand", capital: "Dehradun", lat: 30.3165, lon: 78.0322 },
  { id: "WB", name: "West Bengal", capital: "Kolkata", lat: 22.5726, lon: 88.3639 },
  { id: "DL", name: "Delhi (NCT)", capital: "New Delhi", lat: 28.6139, lon: 77.209 },
  { id: "JK", name: "Jammu & Kashmir", capital: "Srinagar", lat: 34.0837, lon: 74.7973 },
  { id: "PY", name: "Puducherry", capital: "Puducherry", lat: 11.9416, lon: 79.8083 },
];
