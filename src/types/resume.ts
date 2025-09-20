export interface Career {
  companyName: string;
  joinedAt: string;
  quitAt: string;
  workPerformance: string;
  working: boolean;
}

export type educationLevel =
  | 'HIGH_SCHOOL'
  | 'ASSOCIATE'
  | 'BACHELOR'
  | 'MASTER'
  | 'DOCTORATE';

export type educationStatus =
  | 'GRADUATED'
  | 'EXPECTED_TO_GRADUATE'
  | 'ENROLLED'
  | 'ON_LEAVE'
  | 'DROPOUT'
  | 'COMPLETED';

export interface Education {
  level: educationLevel | '';
  majorField: string;
  status: educationStatus | '';
}

export interface Resume {
  isNewcomer: boolean;
  careerList: Career[];
  educationList: Education[];
  skillList: string[];
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResumeFormInput {
  isNewcomer: boolean | null;
  careerList: Career[];
  educationList: Education[];
  skillList: {
    id: string;
    name: string;
  }[];
  content: string;
}

export interface ResumeRequestBody {
  isNewcomer: boolean;
  careerList: Career[];
  educationList: Education[];
  skillList: string[];
  content: string;
}

export interface ResumeResponse {
  newcomer: boolean;
  careerDtoList: Career[];
  educationDtoList: Education[];
  skillList: string[];
  content: string;
  createdAt: string;
  updatedAt: string;
}

export type ResumeTab = 'career' | 'education' | 'skill' | 'content';
