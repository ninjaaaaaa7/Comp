// India's top cities for availability. Mumbai is the live demo city (its 14
// companion profiles are real data); other cities re-skin the same profiles
// with local areas via localizeArea() so every city feels served.

export interface City {
  id: string;
  name: string;
  state: string;
  members: number; // verified members (demo figure)
  areas: string[]; // used to localize companion cards
}

export const CITIES: City[] = [
  { id: 'mumbai', name: 'Mumbai', state: 'Maharashtra', members: 2300, areas: ['Bandra', 'Colaba', 'Andheri', 'Dadar', 'Powai', 'Juhu', 'Lower Parel', 'Matunga', 'Versova', 'Worli', 'Chembur', 'Malad', 'Fort', 'Khar'] },
  { id: 'delhi', name: 'Delhi NCR', state: 'Delhi', members: 2100, areas: ['Hauz Khas', 'Connaught Place', 'Saket', 'Dwarka', 'Gurugram', 'Noida', 'Lajpat Nagar', 'Vasant Kunj', 'Karol Bagh', 'Mayur Vihar', 'Rohini', 'Greater Kailash', 'Chandni Chowk', 'Janakpuri'] },
  { id: 'bengaluru', name: 'Bengaluru', state: 'Karnataka', members: 1900, areas: ['Indiranagar', 'Koramangala', 'Jayanagar', 'Whitefield', 'HSR Layout', 'Malleshwaram', 'JP Nagar', 'Basavanagudi', 'Yelahanka', 'BTM Layout', 'Rajajinagar', 'Hebbal', 'MG Road', 'Banashankari'] },
  { id: 'hyderabad', name: 'Hyderabad', state: 'Telangana', members: 1400, areas: ['Banjara Hills', 'Jubilee Hills', 'Gachibowli', 'Madhapur', 'Secunderabad', 'Kukatpally', 'Begumpet', 'Himayatnagar', 'Kondapur', 'Manikonda', 'Charminar', 'Ameerpet', 'Miyapur', 'Uppal'] },
  { id: 'chennai', name: 'Chennai', state: 'Tamil Nadu', members: 1200, areas: ['Adyar', 'T. Nagar', 'Mylapore', 'Anna Nagar', 'Velachery', 'Besant Nagar', 'Nungambakkam', 'Alwarpet', 'Porur', 'Tambaram', 'Kilpauk', 'Egmore', 'OMR', 'Guindy'] },
  { id: 'kolkata', name: 'Kolkata', state: 'West Bengal', members: 1100, areas: ['Park Street', 'Salt Lake', 'Ballygunge', 'New Town', 'Alipore', 'Gariahat', 'Behala', 'Jadavpur', 'Howrah', 'Dum Dum', 'Esplanade', 'Tollygunge', 'Rajarhat', 'Shyambazar'] },
  { id: 'pune', name: 'Pune', state: 'Maharashtra', members: 1050, areas: ['Koregaon Park', 'Viman Nagar', 'Baner', 'Kothrud', 'Aundh', 'Hinjawadi', 'Camp', 'Deccan', 'Hadapsar', 'Wakad', 'Kalyani Nagar', 'Shivajinagar', 'Magarpatta', 'Pashan'] },
  { id: 'ahmedabad', name: 'Ahmedabad', state: 'Gujarat', members: 800, areas: ['Satellite', 'Navrangpura', 'Bodakdev', 'Maninagar', 'Vastrapur', 'Prahlad Nagar', 'CG Road', 'Thaltej', 'Paldi', 'Gota', 'Chandkheda', 'Bopal', 'Naranpura', 'SG Highway'] },
  { id: 'jaipur', name: 'Jaipur', state: 'Rajasthan', members: 650, areas: ['C-Scheme', 'Malviya Nagar', 'Vaishali Nagar', 'Mansarovar', 'Raja Park', 'Bani Park', 'Jagatpura', 'Tonk Road', 'Civil Lines', 'Jhotwara', 'Sodala', 'Amer Road', 'Sanganer', 'Bapu Nagar'] },
  { id: 'chandigarh', name: 'Chandigarh', state: 'Punjab/Haryana', members: 500, areas: ['Sector 17', 'Sector 35', 'Panchkula', 'Mohali', 'Sector 22', 'Sector 8', 'Manimajra', 'Zirakpur', 'Sector 43', 'Sector 15', 'Industrial Area', 'Sector 26', 'New Chandigarh', 'Kharar'] },
];

export const DEFAULT_CITY_ID = 'mumbai';

export function getCity(id: string): City {
  return CITIES.find((c) => c.id === id) ?? CITIES[0];
}

/**
 * Deterministically maps a companion (by index) to an area in the chosen city,
 * so re-skinned cards stay stable across renders.
 */
export function localizeArea(cityId: string, companionIndex: number): string {
  const city = getCity(cityId);
  return city.areas[companionIndex % city.areas.length];
}
