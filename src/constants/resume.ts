export const EDUCATION_LEVELS = [
  { label: '고등학교', value: 'HIGH_SCHOOL' },
  { label: '전문학사', value: 'ASSOCIATE' },
  { label: '학사', value: 'BACHELOR' },
  { label: '석사', value: 'MASTER' },
  { label: '박사', value: 'DOCTORATE' },
] as const;

export const EDUCATION_STATUSES = [
  { label: '졸업', value: 'GRADUATED' },
  { label: '졸업예정', value: 'EXPECTED_TO_GRADUATE' },
  { label: '재학', value: 'ENROLLED' },
  { label: '휴학', value: 'ON_LEAVE' },
  { label: '중퇴', value: 'DROPOUT' },
  { label: '수료', value: 'COMPLETED' },
] as const;
