import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Cursor: any;
  Duration: any;
  Time: any;
  Upload: any;
  Weekday: any;
};


export type AddAssignmentInput = {
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  file?: Maybe<Scalars['Upload']>;
  classID: Scalars['ID'];
  dueDate: Scalars['Time'];
  isExam?: Scalars['Boolean'];
  duration?: Maybe<Scalars['Duration']>;
};

export type AddAssignmentSubmissionInput = {
  assignmentID: Scalars['ID'];
  files: Array<Scalars['Upload']>;
  submittedAt?: Maybe<Scalars['Time']>;
};

export type AddAttendanceInput = {
  date: Scalars['Time'];
  state: AttendanceState;
  classID: Scalars['ID'];
  studentID: Scalars['ID'];
};

export type AddClassInput = {
  name: Scalars['String'];
  active?: Scalars['Boolean'];
  teacherID: Scalars['ID'];
  stageID: Scalars['ID'];
};

export type AddCourseGradeInput = {
  studentID: Scalars['ID'];
  stageID: Scalars['ID'];
  classID: Scalars['ID'];
  activityFirst?: Maybe<Scalars['Int']>;
  activitySecond?: Maybe<Scalars['Int']>;
  writtenFirst?: Maybe<Scalars['Int']>;
  writtenSecond?: Maybe<Scalars['Int']>;
  courseFinal?: Maybe<Scalars['Int']>;
  year: Scalars['String'];
};

export type AddGroupInput = {
  name: Scalars['String'];
  active?: Scalars['Boolean'];
  userID: Scalars['ID'];
};

export type AddScheduleInput = {
  weekday: Scalars['Weekday'];
  duration: Scalars['Duration'];
  startsAt: Scalars['Time'];
  classID: Scalars['ID'];
};

export type AddSchoolInput = {
  name: Scalars['String'];
  image: Scalars['Upload'];
  active?: Scalars['Boolean'];
};

export type AddStageInput = {
  name: Scalars['String'];
  active?: Scalars['Boolean'];
  tuitionAmount: Scalars['Int'];
  schoolID: Scalars['ID'];
};

export type AddTuitionPaymentInput = {
  stageID: Scalars['ID'];
  studentID: Scalars['ID'];
  year: Scalars['String'];
  paidAmount: Scalars['Int'];
};

export type AddUserInput = {
  name: Scalars['String'];
  username: Scalars['String'];
  password: Scalars['String'];
  phone: Scalars['String'];
  image?: Maybe<Scalars['Upload']>;
  role?: Role;
  active?: Scalars['Boolean'];
  schoolID?: Maybe<Scalars['ID']>;
  stageID?: Maybe<Scalars['ID']>;
};

export type Assignment = Node & {
  __typename?: 'Assignment';
  id: Scalars['ID'];
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  dueDate: Scalars['Time'];
  duration?: Maybe<Scalars['Duration']>;
  isExam: Scalars['Boolean'];
  file?: Maybe<Scalars['String']>;
  createdAt: Scalars['Time'];
  updatedAt: Scalars['Time'];
  class: Class;
  submissions?: Maybe<AssignmentSubmissionConnection>;
};


export type AssignmentSubmissionsArgs = {
  after?: Maybe<Scalars['Cursor']>;
  first?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  last?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<AssignmentSubmissionOrder>;
  where?: Maybe<AssignmentSubmissionWhereInput>;
};

export type AssignmentConnection = {
  __typename?: 'AssignmentConnection';
  totalCount: Scalars['Int'];
  pageInfo: PageInfo;
  edges?: Maybe<Array<Maybe<AssignmentEdge>>>;
};

export type AssignmentEdge = {
  __typename?: 'AssignmentEdge';
  node?: Maybe<Assignment>;
  cursor: Scalars['Cursor'];
};

export type AssignmentOrder = {
  field?: Maybe<AssignmentOrderField>;
  direction: OrderDirection;
};

export enum AssignmentOrderField {
  Name = 'NAME',
  Description = 'DESCRIPTION',
  DueDate = 'DUE_DATE',
  Duration = 'DURATION',
  CreatedAt = 'CREATED_AT',
  UpdatedAt = 'UPDATED_AT'
}

export type AssignmentSubmission = Node & {
  __typename?: 'AssignmentSubmission';
  id: Scalars['ID'];
  files: Array<Scalars['String']>;
  submittedAt?: Maybe<Scalars['Time']>;
  createdAt: Scalars['Time'];
  updatedAt: Scalars['Time'];
  student: User;
  assignment: Assignment;
};

export type AssignmentSubmissionConnection = {
  __typename?: 'AssignmentSubmissionConnection';
  totalCount: Scalars['Int'];
  pageInfo: PageInfo;
  edges?: Maybe<Array<Maybe<AssignmentSubmissionEdge>>>;
};

export type AssignmentSubmissionEdge = {
  __typename?: 'AssignmentSubmissionEdge';
  node?: Maybe<AssignmentSubmission>;
  cursor: Scalars['Cursor'];
};

export type AssignmentSubmissionOrder = {
  field?: Maybe<AssignmentSubmissionOrderField>;
  direction: OrderDirection;
};

export enum AssignmentSubmissionOrderField {
  SubmittedAt = 'SUBMITTED_AT',
  CreatedAt = 'CREATED_AT',
  UpdatedAt = 'UPDATED_AT'
}

/**
 * AssignmentSubmissionWhereInput is used for filtering AssignmentSubmission objects.
 * Input was generated by ent.
 */
export type AssignmentSubmissionWhereInput = {
  not?: Maybe<AssignmentSubmissionWhereInput>;
  and?: Maybe<Array<AssignmentSubmissionWhereInput>>;
  or?: Maybe<Array<AssignmentSubmissionWhereInput>>;
  /** created_at field predicates */
  createdAt?: Maybe<Scalars['Time']>;
  createdAtNEQ?: Maybe<Scalars['Time']>;
  createdAtIn?: Maybe<Array<Scalars['Time']>>;
  createdAtNotIn?: Maybe<Array<Scalars['Time']>>;
  createdAtGT?: Maybe<Scalars['Time']>;
  createdAtGTE?: Maybe<Scalars['Time']>;
  createdAtLT?: Maybe<Scalars['Time']>;
  createdAtLTE?: Maybe<Scalars['Time']>;
  /** updated_at field predicates */
  updatedAt?: Maybe<Scalars['Time']>;
  updatedAtNEQ?: Maybe<Scalars['Time']>;
  updatedAtIn?: Maybe<Array<Scalars['Time']>>;
  updatedAtNotIn?: Maybe<Array<Scalars['Time']>>;
  updatedAtGT?: Maybe<Scalars['Time']>;
  updatedAtGTE?: Maybe<Scalars['Time']>;
  updatedAtLT?: Maybe<Scalars['Time']>;
  updatedAtLTE?: Maybe<Scalars['Time']>;
  /** submitted_at field predicates */
  submittedAt?: Maybe<Scalars['Time']>;
  submittedAtNEQ?: Maybe<Scalars['Time']>;
  submittedAtIn?: Maybe<Array<Scalars['Time']>>;
  submittedAtNotIn?: Maybe<Array<Scalars['Time']>>;
  submittedAtGT?: Maybe<Scalars['Time']>;
  submittedAtGTE?: Maybe<Scalars['Time']>;
  submittedAtLT?: Maybe<Scalars['Time']>;
  submittedAtLTE?: Maybe<Scalars['Time']>;
  submittedAtIsNil?: Maybe<Scalars['Boolean']>;
  submittedAtNotNil?: Maybe<Scalars['Boolean']>;
  /** id field predicates */
  id?: Maybe<Scalars['ID']>;
  idNEQ?: Maybe<Scalars['ID']>;
  idIn?: Maybe<Array<Scalars['ID']>>;
  idNotIn?: Maybe<Array<Scalars['ID']>>;
  idGT?: Maybe<Scalars['ID']>;
  idGTE?: Maybe<Scalars['ID']>;
  idLT?: Maybe<Scalars['ID']>;
  idLTE?: Maybe<Scalars['ID']>;
  /** student edge predicates */
  hasStudent?: Maybe<Scalars['Boolean']>;
  hasStudentWith?: Maybe<Array<UserWhereInput>>;
  /** assignment edge predicates */
  hasAssignment?: Maybe<Scalars['Boolean']>;
  hasAssignmentWith?: Maybe<Array<AssignmentWhereInput>>;
};

/**
 * AssignmentWhereInput is used for filtering Assignment objects.
 * Input was generated by ent.
 */
export type AssignmentWhereInput = {
  not?: Maybe<AssignmentWhereInput>;
  and?: Maybe<Array<AssignmentWhereInput>>;
  or?: Maybe<Array<AssignmentWhereInput>>;
  /** created_at field predicates */
  createdAt?: Maybe<Scalars['Time']>;
  createdAtNEQ?: Maybe<Scalars['Time']>;
  createdAtIn?: Maybe<Array<Scalars['Time']>>;
  createdAtNotIn?: Maybe<Array<Scalars['Time']>>;
  createdAtGT?: Maybe<Scalars['Time']>;
  createdAtGTE?: Maybe<Scalars['Time']>;
  createdAtLT?: Maybe<Scalars['Time']>;
  createdAtLTE?: Maybe<Scalars['Time']>;
  /** updated_at field predicates */
  updatedAt?: Maybe<Scalars['Time']>;
  updatedAtNEQ?: Maybe<Scalars['Time']>;
  updatedAtIn?: Maybe<Array<Scalars['Time']>>;
  updatedAtNotIn?: Maybe<Array<Scalars['Time']>>;
  updatedAtGT?: Maybe<Scalars['Time']>;
  updatedAtGTE?: Maybe<Scalars['Time']>;
  updatedAtLT?: Maybe<Scalars['Time']>;
  updatedAtLTE?: Maybe<Scalars['Time']>;
  /** name field predicates */
  name?: Maybe<Scalars['String']>;
  nameNEQ?: Maybe<Scalars['String']>;
  nameIn?: Maybe<Array<Scalars['String']>>;
  nameNotIn?: Maybe<Array<Scalars['String']>>;
  nameGT?: Maybe<Scalars['String']>;
  nameGTE?: Maybe<Scalars['String']>;
  nameLT?: Maybe<Scalars['String']>;
  nameLTE?: Maybe<Scalars['String']>;
  nameContains?: Maybe<Scalars['String']>;
  nameHasPrefix?: Maybe<Scalars['String']>;
  nameHasSuffix?: Maybe<Scalars['String']>;
  nameEqualFold?: Maybe<Scalars['String']>;
  nameContainsFold?: Maybe<Scalars['String']>;
  /** description field predicates */
  description?: Maybe<Scalars['String']>;
  descriptionNEQ?: Maybe<Scalars['String']>;
  descriptionIn?: Maybe<Array<Scalars['String']>>;
  descriptionNotIn?: Maybe<Array<Scalars['String']>>;
  descriptionGT?: Maybe<Scalars['String']>;
  descriptionGTE?: Maybe<Scalars['String']>;
  descriptionLT?: Maybe<Scalars['String']>;
  descriptionLTE?: Maybe<Scalars['String']>;
  descriptionContains?: Maybe<Scalars['String']>;
  descriptionHasPrefix?: Maybe<Scalars['String']>;
  descriptionHasSuffix?: Maybe<Scalars['String']>;
  descriptionIsNil?: Maybe<Scalars['Boolean']>;
  descriptionNotNil?: Maybe<Scalars['Boolean']>;
  descriptionEqualFold?: Maybe<Scalars['String']>;
  descriptionContainsFold?: Maybe<Scalars['String']>;
  /** file field predicates */
  file?: Maybe<Scalars['String']>;
  fileNEQ?: Maybe<Scalars['String']>;
  fileIn?: Maybe<Array<Scalars['String']>>;
  fileNotIn?: Maybe<Array<Scalars['String']>>;
  fileGT?: Maybe<Scalars['String']>;
  fileGTE?: Maybe<Scalars['String']>;
  fileLT?: Maybe<Scalars['String']>;
  fileLTE?: Maybe<Scalars['String']>;
  fileContains?: Maybe<Scalars['String']>;
  fileHasPrefix?: Maybe<Scalars['String']>;
  fileHasSuffix?: Maybe<Scalars['String']>;
  fileIsNil?: Maybe<Scalars['Boolean']>;
  fileNotNil?: Maybe<Scalars['Boolean']>;
  fileEqualFold?: Maybe<Scalars['String']>;
  fileContainsFold?: Maybe<Scalars['String']>;
  /** is_exam field predicates */
  isExam?: Maybe<Scalars['Boolean']>;
  isExamNEQ?: Maybe<Scalars['Boolean']>;
  /** due_date field predicates */
  dueDate?: Maybe<Scalars['Time']>;
  dueDateNEQ?: Maybe<Scalars['Time']>;
  dueDateIn?: Maybe<Array<Scalars['Time']>>;
  dueDateNotIn?: Maybe<Array<Scalars['Time']>>;
  dueDateGT?: Maybe<Scalars['Time']>;
  dueDateGTE?: Maybe<Scalars['Time']>;
  dueDateLT?: Maybe<Scalars['Time']>;
  dueDateLTE?: Maybe<Scalars['Time']>;
  /** duration field predicates */
  duration?: Maybe<Scalars['Duration']>;
  durationNEQ?: Maybe<Scalars['Duration']>;
  durationIn?: Maybe<Array<Scalars['Duration']>>;
  durationNotIn?: Maybe<Array<Scalars['Duration']>>;
  durationGT?: Maybe<Scalars['Duration']>;
  durationGTE?: Maybe<Scalars['Duration']>;
  durationLT?: Maybe<Scalars['Duration']>;
  durationLTE?: Maybe<Scalars['Duration']>;
  durationIsNil?: Maybe<Scalars['Boolean']>;
  durationNotNil?: Maybe<Scalars['Boolean']>;
  /** deleted_at field predicates */
  deletedAt?: Maybe<Scalars['Time']>;
  deletedAtNEQ?: Maybe<Scalars['Time']>;
  deletedAtIn?: Maybe<Array<Scalars['Time']>>;
  deletedAtNotIn?: Maybe<Array<Scalars['Time']>>;
  deletedAtGT?: Maybe<Scalars['Time']>;
  deletedAtGTE?: Maybe<Scalars['Time']>;
  deletedAtLT?: Maybe<Scalars['Time']>;
  deletedAtLTE?: Maybe<Scalars['Time']>;
  deletedAtIsNil?: Maybe<Scalars['Boolean']>;
  deletedAtNotNil?: Maybe<Scalars['Boolean']>;
  /** id field predicates */
  id?: Maybe<Scalars['ID']>;
  idNEQ?: Maybe<Scalars['ID']>;
  idIn?: Maybe<Array<Scalars['ID']>>;
  idNotIn?: Maybe<Array<Scalars['ID']>>;
  idGT?: Maybe<Scalars['ID']>;
  idGTE?: Maybe<Scalars['ID']>;
  idLT?: Maybe<Scalars['ID']>;
  idLTE?: Maybe<Scalars['ID']>;
  /** class edge predicates */
  hasClass?: Maybe<Scalars['Boolean']>;
  hasClassWith?: Maybe<Array<ClassWhereInput>>;
  /** submissions edge predicates */
  hasSubmissions?: Maybe<Scalars['Boolean']>;
  hasSubmissionsWith?: Maybe<Array<AssignmentSubmissionWhereInput>>;
  /** grades edge predicates */
  hasGrades?: Maybe<Scalars['Boolean']>;
  hasGradesWith?: Maybe<Array<GradeWhereInput>>;
};

export type Attendance = Node & {
  __typename?: 'Attendance';
  id: Scalars['ID'];
  date: Scalars['Time'];
  state: AttendanceState;
  createdAt: Scalars['Time'];
  updatedAt: Scalars['Time'];
  class: Class;
  student: User;
};

export type AttendanceConnection = {
  __typename?: 'AttendanceConnection';
  totalCount: Scalars['Int'];
  pageInfo: PageInfo;
  edges?: Maybe<Array<Maybe<AttendanceEdge>>>;
};

export type AttendanceEdge = {
  __typename?: 'AttendanceEdge';
  node?: Maybe<Attendance>;
  cursor: Scalars['Cursor'];
};

export type AttendanceOrder = {
  field?: Maybe<AttendanceOrderField>;
  direction: OrderDirection;
};

export enum AttendanceOrderField {
  Date = 'DATE',
  CreatedAt = 'CREATED_AT',
  UpdatedAt = 'UPDATED_AT'
}

export enum AttendanceState {
  Present = 'PRESENT',
  Absent = 'ABSENT',
  ExcusedAbsent = 'EXCUSED_ABSENT',
  Sick = 'SICK'
}

/**
 * AttendanceWhereInput is used for filtering Attendance objects.
 * Input was generated by ent.
 */
export type AttendanceWhereInput = {
  not?: Maybe<AttendanceWhereInput>;
  and?: Maybe<Array<AttendanceWhereInput>>;
  or?: Maybe<Array<AttendanceWhereInput>>;
  /** created_at field predicates */
  createdAt?: Maybe<Scalars['Time']>;
  createdAtNEQ?: Maybe<Scalars['Time']>;
  createdAtIn?: Maybe<Array<Scalars['Time']>>;
  createdAtNotIn?: Maybe<Array<Scalars['Time']>>;
  createdAtGT?: Maybe<Scalars['Time']>;
  createdAtGTE?: Maybe<Scalars['Time']>;
  createdAtLT?: Maybe<Scalars['Time']>;
  createdAtLTE?: Maybe<Scalars['Time']>;
  /** updated_at field predicates */
  updatedAt?: Maybe<Scalars['Time']>;
  updatedAtNEQ?: Maybe<Scalars['Time']>;
  updatedAtIn?: Maybe<Array<Scalars['Time']>>;
  updatedAtNotIn?: Maybe<Array<Scalars['Time']>>;
  updatedAtGT?: Maybe<Scalars['Time']>;
  updatedAtGTE?: Maybe<Scalars['Time']>;
  updatedAtLT?: Maybe<Scalars['Time']>;
  updatedAtLTE?: Maybe<Scalars['Time']>;
  /** date field predicates */
  date?: Maybe<Scalars['Time']>;
  dateNEQ?: Maybe<Scalars['Time']>;
  dateIn?: Maybe<Array<Scalars['Time']>>;
  dateNotIn?: Maybe<Array<Scalars['Time']>>;
  dateGT?: Maybe<Scalars['Time']>;
  dateGTE?: Maybe<Scalars['Time']>;
  dateLT?: Maybe<Scalars['Time']>;
  dateLTE?: Maybe<Scalars['Time']>;
  /** state field predicates */
  state?: Maybe<AttendanceState>;
  stateNEQ?: Maybe<AttendanceState>;
  stateIn?: Maybe<Array<AttendanceState>>;
  stateNotIn?: Maybe<Array<AttendanceState>>;
  /** id field predicates */
  id?: Maybe<Scalars['ID']>;
  idNEQ?: Maybe<Scalars['ID']>;
  idIn?: Maybe<Array<Scalars['ID']>>;
  idNotIn?: Maybe<Array<Scalars['ID']>>;
  idGT?: Maybe<Scalars['ID']>;
  idGTE?: Maybe<Scalars['ID']>;
  idLT?: Maybe<Scalars['ID']>;
  idLTE?: Maybe<Scalars['ID']>;
  /** class edge predicates */
  hasClass?: Maybe<Scalars['Boolean']>;
  hasClassWith?: Maybe<Array<ClassWhereInput>>;
  /** student edge predicates */
  hasStudent?: Maybe<Scalars['Boolean']>;
  hasStudentWith?: Maybe<Array<UserWhereInput>>;
};

export type AuthData = {
  __typename?: 'AuthData';
  accessToken: Scalars['String'];
  refreshToken: Scalars['String'];
};

export type Class = Node & {
  __typename?: 'Class';
  id: Scalars['ID'];
  name: Scalars['String'];
  active: Scalars['Boolean'];
  createdAt: Scalars['Time'];
  updatedAt: Scalars['Time'];
  stage: Stage;
  teacher: User;
  group: Group;
  assignments?: Maybe<AssignmentConnection>;
  attendances?: Maybe<AttendanceConnection>;
  schedules?: Maybe<ScheduleConnection>;
  courseGrades?: Maybe<CourseGradeConnection>;
};


export type ClassAssignmentsArgs = {
  after?: Maybe<Scalars['Cursor']>;
  first?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  last?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<AssignmentOrder>;
  where?: Maybe<AssignmentWhereInput>;
};


export type ClassAttendancesArgs = {
  after?: Maybe<Scalars['Cursor']>;
  first?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  last?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<AttendanceOrder>;
  where?: Maybe<AttendanceWhereInput>;
};


export type ClassSchedulesArgs = {
  after?: Maybe<Scalars['Cursor']>;
  first?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  last?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<ScheduleOrder>;
  where?: Maybe<ScheduleWhereInput>;
};


export type ClassCourseGradesArgs = {
  after?: Maybe<Scalars['Cursor']>;
  first?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  last?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<CourseGradeOrder>;
  where?: Maybe<CourseGradeWhereInput>;
};

export type ClassConnection = {
  __typename?: 'ClassConnection';
  totalCount: Scalars['Int'];
  pageInfo: PageInfo;
  edges?: Maybe<Array<Maybe<ClassEdge>>>;
};

export type ClassEdge = {
  __typename?: 'ClassEdge';
  node?: Maybe<Class>;
  cursor: Scalars['Cursor'];
};

export type ClassOrder = {
  field?: Maybe<ClassOrderField>;
  direction: OrderDirection;
};

export enum ClassOrderField {
  Name = 'NAME',
  CreatedAt = 'CREATED_AT',
  UpdatedAt = 'UPDATED_AT'
}

/**
 * ClassWhereInput is used for filtering Class objects.
 * Input was generated by ent.
 */
export type ClassWhereInput = {
  not?: Maybe<ClassWhereInput>;
  and?: Maybe<Array<ClassWhereInput>>;
  or?: Maybe<Array<ClassWhereInput>>;
  /** created_at field predicates */
  createdAt?: Maybe<Scalars['Time']>;
  createdAtNEQ?: Maybe<Scalars['Time']>;
  createdAtIn?: Maybe<Array<Scalars['Time']>>;
  createdAtNotIn?: Maybe<Array<Scalars['Time']>>;
  createdAtGT?: Maybe<Scalars['Time']>;
  createdAtGTE?: Maybe<Scalars['Time']>;
  createdAtLT?: Maybe<Scalars['Time']>;
  createdAtLTE?: Maybe<Scalars['Time']>;
  /** updated_at field predicates */
  updatedAt?: Maybe<Scalars['Time']>;
  updatedAtNEQ?: Maybe<Scalars['Time']>;
  updatedAtIn?: Maybe<Array<Scalars['Time']>>;
  updatedAtNotIn?: Maybe<Array<Scalars['Time']>>;
  updatedAtGT?: Maybe<Scalars['Time']>;
  updatedAtGTE?: Maybe<Scalars['Time']>;
  updatedAtLT?: Maybe<Scalars['Time']>;
  updatedAtLTE?: Maybe<Scalars['Time']>;
  /** name field predicates */
  name?: Maybe<Scalars['String']>;
  nameNEQ?: Maybe<Scalars['String']>;
  nameIn?: Maybe<Array<Scalars['String']>>;
  nameNotIn?: Maybe<Array<Scalars['String']>>;
  nameGT?: Maybe<Scalars['String']>;
  nameGTE?: Maybe<Scalars['String']>;
  nameLT?: Maybe<Scalars['String']>;
  nameLTE?: Maybe<Scalars['String']>;
  nameContains?: Maybe<Scalars['String']>;
  nameHasPrefix?: Maybe<Scalars['String']>;
  nameHasSuffix?: Maybe<Scalars['String']>;
  nameEqualFold?: Maybe<Scalars['String']>;
  nameContainsFold?: Maybe<Scalars['String']>;
  /** active field predicates */
  active?: Maybe<Scalars['Boolean']>;
  activeNEQ?: Maybe<Scalars['Boolean']>;
  /** deleted_at field predicates */
  deletedAt?: Maybe<Scalars['Time']>;
  deletedAtNEQ?: Maybe<Scalars['Time']>;
  deletedAtIn?: Maybe<Array<Scalars['Time']>>;
  deletedAtNotIn?: Maybe<Array<Scalars['Time']>>;
  deletedAtGT?: Maybe<Scalars['Time']>;
  deletedAtGTE?: Maybe<Scalars['Time']>;
  deletedAtLT?: Maybe<Scalars['Time']>;
  deletedAtLTE?: Maybe<Scalars['Time']>;
  deletedAtIsNil?: Maybe<Scalars['Boolean']>;
  deletedAtNotNil?: Maybe<Scalars['Boolean']>;
  /** id field predicates */
  id?: Maybe<Scalars['ID']>;
  idNEQ?: Maybe<Scalars['ID']>;
  idIn?: Maybe<Array<Scalars['ID']>>;
  idNotIn?: Maybe<Array<Scalars['ID']>>;
  idGT?: Maybe<Scalars['ID']>;
  idGTE?: Maybe<Scalars['ID']>;
  idLT?: Maybe<Scalars['ID']>;
  idLTE?: Maybe<Scalars['ID']>;
  /** stage edge predicates */
  hasStage?: Maybe<Scalars['Boolean']>;
  hasStageWith?: Maybe<Array<StageWhereInput>>;
  /** teacher edge predicates */
  hasTeacher?: Maybe<Scalars['Boolean']>;
  hasTeacherWith?: Maybe<Array<UserWhereInput>>;
  /** group edge predicates */
  hasGroup?: Maybe<Scalars['Boolean']>;
  hasGroupWith?: Maybe<Array<GroupWhereInput>>;
  /** assignments edge predicates */
  hasAssignments?: Maybe<Scalars['Boolean']>;
  hasAssignmentsWith?: Maybe<Array<AssignmentWhereInput>>;
  /** attendances edge predicates */
  hasAttendances?: Maybe<Scalars['Boolean']>;
  hasAttendancesWith?: Maybe<Array<AttendanceWhereInput>>;
  /** schedules edge predicates */
  hasSchedules?: Maybe<Scalars['Boolean']>;
  hasSchedulesWith?: Maybe<Array<ScheduleWhereInput>>;
  /** course_grades edge predicates */
  hasCourseGrades?: Maybe<Scalars['Boolean']>;
  hasCourseGradesWith?: Maybe<Array<CourseGradeWhereInput>>;
};

export type CourseGrade = Node & {
  __typename?: 'CourseGrade';
  id: Scalars['ID'];
  activityFirst?: Maybe<Scalars['Int']>;
  activitySecond?: Maybe<Scalars['Int']>;
  writtenFirst?: Maybe<Scalars['Int']>;
  writtenSecond?: Maybe<Scalars['Int']>;
  courseFinal?: Maybe<Scalars['Int']>;
  year: Scalars['String'];
  createdAt: Scalars['Time'];
  updatedAt: Scalars['Time'];
  student: User;
  class: Class;
  stage: Stage;
};

export type CourseGradeConnection = {
  __typename?: 'CourseGradeConnection';
  totalCount: Scalars['Int'];
  pageInfo: PageInfo;
  edges?: Maybe<Array<Maybe<CourseGradeEdge>>>;
};

export type CourseGradeEdge = {
  __typename?: 'CourseGradeEdge';
  node?: Maybe<CourseGrade>;
  cursor: Scalars['Cursor'];
};

export type CourseGradeOrder = {
  field?: Maybe<CourseGradeOrderField>;
  direction: OrderDirection;
};

export enum CourseGradeOrderField {
  ActivityFirst = 'ACTIVITY_FIRST',
  ActivitySecond = 'ACTIVITY_SECOND',
  WrittenFirst = 'WRITTEN_FIRST',
  WrittenSecond = 'WRITTEN_SECOND',
  CourseFinal = 'COURSE_FINAL',
  Year = 'YEAR',
  CreatedAt = 'CREATED_AT',
  UpdatedAt = 'UPDATED_AT'
}

/**
 * CourseGradeWhereInput is used for filtering CourseGrade objects.
 * Input was generated by ent.
 */
export type CourseGradeWhereInput = {
  not?: Maybe<CourseGradeWhereInput>;
  and?: Maybe<Array<CourseGradeWhereInput>>;
  or?: Maybe<Array<CourseGradeWhereInput>>;
  /** created_at field predicates */
  createdAt?: Maybe<Scalars['Time']>;
  createdAtNEQ?: Maybe<Scalars['Time']>;
  createdAtIn?: Maybe<Array<Scalars['Time']>>;
  createdAtNotIn?: Maybe<Array<Scalars['Time']>>;
  createdAtGT?: Maybe<Scalars['Time']>;
  createdAtGTE?: Maybe<Scalars['Time']>;
  createdAtLT?: Maybe<Scalars['Time']>;
  createdAtLTE?: Maybe<Scalars['Time']>;
  /** updated_at field predicates */
  updatedAt?: Maybe<Scalars['Time']>;
  updatedAtNEQ?: Maybe<Scalars['Time']>;
  updatedAtIn?: Maybe<Array<Scalars['Time']>>;
  updatedAtNotIn?: Maybe<Array<Scalars['Time']>>;
  updatedAtGT?: Maybe<Scalars['Time']>;
  updatedAtGTE?: Maybe<Scalars['Time']>;
  updatedAtLT?: Maybe<Scalars['Time']>;
  updatedAtLTE?: Maybe<Scalars['Time']>;
  /** activity_first field predicates */
  activityFirst?: Maybe<Scalars['Int']>;
  activityFirstNEQ?: Maybe<Scalars['Int']>;
  activityFirstIn?: Maybe<Array<Scalars['Int']>>;
  activityFirstNotIn?: Maybe<Array<Scalars['Int']>>;
  activityFirstGT?: Maybe<Scalars['Int']>;
  activityFirstGTE?: Maybe<Scalars['Int']>;
  activityFirstLT?: Maybe<Scalars['Int']>;
  activityFirstLTE?: Maybe<Scalars['Int']>;
  activityFirstIsNil?: Maybe<Scalars['Boolean']>;
  activityFirstNotNil?: Maybe<Scalars['Boolean']>;
  /** activity_second field predicates */
  activitySecond?: Maybe<Scalars['Int']>;
  activitySecondNEQ?: Maybe<Scalars['Int']>;
  activitySecondIn?: Maybe<Array<Scalars['Int']>>;
  activitySecondNotIn?: Maybe<Array<Scalars['Int']>>;
  activitySecondGT?: Maybe<Scalars['Int']>;
  activitySecondGTE?: Maybe<Scalars['Int']>;
  activitySecondLT?: Maybe<Scalars['Int']>;
  activitySecondLTE?: Maybe<Scalars['Int']>;
  activitySecondIsNil?: Maybe<Scalars['Boolean']>;
  activitySecondNotNil?: Maybe<Scalars['Boolean']>;
  /** written_first field predicates */
  writtenFirst?: Maybe<Scalars['Int']>;
  writtenFirstNEQ?: Maybe<Scalars['Int']>;
  writtenFirstIn?: Maybe<Array<Scalars['Int']>>;
  writtenFirstNotIn?: Maybe<Array<Scalars['Int']>>;
  writtenFirstGT?: Maybe<Scalars['Int']>;
  writtenFirstGTE?: Maybe<Scalars['Int']>;
  writtenFirstLT?: Maybe<Scalars['Int']>;
  writtenFirstLTE?: Maybe<Scalars['Int']>;
  writtenFirstIsNil?: Maybe<Scalars['Boolean']>;
  writtenFirstNotNil?: Maybe<Scalars['Boolean']>;
  /** written_second field predicates */
  writtenSecond?: Maybe<Scalars['Int']>;
  writtenSecondNEQ?: Maybe<Scalars['Int']>;
  writtenSecondIn?: Maybe<Array<Scalars['Int']>>;
  writtenSecondNotIn?: Maybe<Array<Scalars['Int']>>;
  writtenSecondGT?: Maybe<Scalars['Int']>;
  writtenSecondGTE?: Maybe<Scalars['Int']>;
  writtenSecondLT?: Maybe<Scalars['Int']>;
  writtenSecondLTE?: Maybe<Scalars['Int']>;
  writtenSecondIsNil?: Maybe<Scalars['Boolean']>;
  writtenSecondNotNil?: Maybe<Scalars['Boolean']>;
  /** course_final field predicates */
  courseFinal?: Maybe<Scalars['Int']>;
  courseFinalNEQ?: Maybe<Scalars['Int']>;
  courseFinalIn?: Maybe<Array<Scalars['Int']>>;
  courseFinalNotIn?: Maybe<Array<Scalars['Int']>>;
  courseFinalGT?: Maybe<Scalars['Int']>;
  courseFinalGTE?: Maybe<Scalars['Int']>;
  courseFinalLT?: Maybe<Scalars['Int']>;
  courseFinalLTE?: Maybe<Scalars['Int']>;
  courseFinalIsNil?: Maybe<Scalars['Boolean']>;
  courseFinalNotNil?: Maybe<Scalars['Boolean']>;
  /** year field predicates */
  year?: Maybe<Scalars['String']>;
  yearNEQ?: Maybe<Scalars['String']>;
  yearIn?: Maybe<Array<Scalars['String']>>;
  yearNotIn?: Maybe<Array<Scalars['String']>>;
  yearGT?: Maybe<Scalars['String']>;
  yearGTE?: Maybe<Scalars['String']>;
  yearLT?: Maybe<Scalars['String']>;
  yearLTE?: Maybe<Scalars['String']>;
  yearContains?: Maybe<Scalars['String']>;
  yearHasPrefix?: Maybe<Scalars['String']>;
  yearHasSuffix?: Maybe<Scalars['String']>;
  yearEqualFold?: Maybe<Scalars['String']>;
  yearContainsFold?: Maybe<Scalars['String']>;
  /** id field predicates */
  id?: Maybe<Scalars['ID']>;
  idNEQ?: Maybe<Scalars['ID']>;
  idIn?: Maybe<Array<Scalars['ID']>>;
  idNotIn?: Maybe<Array<Scalars['ID']>>;
  idGT?: Maybe<Scalars['ID']>;
  idGTE?: Maybe<Scalars['ID']>;
  idLT?: Maybe<Scalars['ID']>;
  idLTE?: Maybe<Scalars['ID']>;
  /** student edge predicates */
  hasStudent?: Maybe<Scalars['Boolean']>;
  hasStudentWith?: Maybe<Array<UserWhereInput>>;
  /** class edge predicates */
  hasClass?: Maybe<Scalars['Boolean']>;
  hasClassWith?: Maybe<Array<ClassWhereInput>>;
  /** stage edge predicates */
  hasStage?: Maybe<Scalars['Boolean']>;
  hasStageWith?: Maybe<Array<StageWhereInput>>;
};



/**
 * GradeWhereInput is used for filtering Grade objects.
 * Input was generated by ent.
 */
export type GradeWhereInput = {
  not?: Maybe<GradeWhereInput>;
  and?: Maybe<Array<GradeWhereInput>>;
  or?: Maybe<Array<GradeWhereInput>>;
  /** created_at field predicates */
  createdAt?: Maybe<Scalars['Time']>;
  createdAtNEQ?: Maybe<Scalars['Time']>;
  createdAtIn?: Maybe<Array<Scalars['Time']>>;
  createdAtNotIn?: Maybe<Array<Scalars['Time']>>;
  createdAtGT?: Maybe<Scalars['Time']>;
  createdAtGTE?: Maybe<Scalars['Time']>;
  createdAtLT?: Maybe<Scalars['Time']>;
  createdAtLTE?: Maybe<Scalars['Time']>;
  /** updated_at field predicates */
  updatedAt?: Maybe<Scalars['Time']>;
  updatedAtNEQ?: Maybe<Scalars['Time']>;
  updatedAtIn?: Maybe<Array<Scalars['Time']>>;
  updatedAtNotIn?: Maybe<Array<Scalars['Time']>>;
  updatedAtGT?: Maybe<Scalars['Time']>;
  updatedAtGTE?: Maybe<Scalars['Time']>;
  updatedAtLT?: Maybe<Scalars['Time']>;
  updatedAtLTE?: Maybe<Scalars['Time']>;
  /** exam_grade field predicates */
  examGrade?: Maybe<Scalars['Int']>;
  examGradeNEQ?: Maybe<Scalars['Int']>;
  examGradeIn?: Maybe<Array<Scalars['Int']>>;
  examGradeNotIn?: Maybe<Array<Scalars['Int']>>;
  examGradeGT?: Maybe<Scalars['Int']>;
  examGradeGTE?: Maybe<Scalars['Int']>;
  examGradeLT?: Maybe<Scalars['Int']>;
  examGradeLTE?: Maybe<Scalars['Int']>;
  /** id field predicates */
  id?: Maybe<Scalars['ID']>;
  idNEQ?: Maybe<Scalars['ID']>;
  idIn?: Maybe<Array<Scalars['ID']>>;
  idNotIn?: Maybe<Array<Scalars['ID']>>;
  idGT?: Maybe<Scalars['ID']>;
  idGTE?: Maybe<Scalars['ID']>;
  idLT?: Maybe<Scalars['ID']>;
  idLTE?: Maybe<Scalars['ID']>;
  /** student edge predicates */
  hasStudent?: Maybe<Scalars['Boolean']>;
  hasStudentWith?: Maybe<Array<UserWhereInput>>;
  /** exam edge predicates */
  hasExam?: Maybe<Scalars['Boolean']>;
  hasExamWith?: Maybe<Array<AssignmentWhereInput>>;
};

export type Group = Node & {
  __typename?: 'Group';
  id: Scalars['ID'];
  name: Scalars['String'];
  groupType: GroupType;
  active: Scalars['Boolean'];
  createdAt: Scalars['Time'];
  updatedAt: Scalars['Time'];
  class?: Maybe<Class>;
  users?: Maybe<Array<User>>;
  messages?: Maybe<MessageConnection>;
};


export type GroupMessagesArgs = {
  after?: Maybe<Scalars['Cursor']>;
  first?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  last?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<MessageOrder>;
  where?: Maybe<MessageWhereInput>;
};

export type GroupConnection = {
  __typename?: 'GroupConnection';
  totalCount: Scalars['Int'];
  pageInfo: PageInfo;
  edges?: Maybe<Array<Maybe<GroupEdge>>>;
};

export type GroupEdge = {
  __typename?: 'GroupEdge';
  node?: Maybe<Group>;
  cursor: Scalars['Cursor'];
};

export type GroupOrder = {
  field?: Maybe<GroupOrderField>;
  direction: OrderDirection;
};

export enum GroupOrderField {
  Name = 'NAME',
  CreatedAt = 'CREATED_AT',
  UpdatedAt = 'UPDATED_AT'
}

export enum GroupType {
  Private = 'PRIVATE',
  Shared = 'SHARED'
}

/**
 * GroupWhereInput is used for filtering Group objects.
 * Input was generated by ent.
 */
export type GroupWhereInput = {
  not?: Maybe<GroupWhereInput>;
  and?: Maybe<Array<GroupWhereInput>>;
  or?: Maybe<Array<GroupWhereInput>>;
  /** created_at field predicates */
  createdAt?: Maybe<Scalars['Time']>;
  createdAtNEQ?: Maybe<Scalars['Time']>;
  createdAtIn?: Maybe<Array<Scalars['Time']>>;
  createdAtNotIn?: Maybe<Array<Scalars['Time']>>;
  createdAtGT?: Maybe<Scalars['Time']>;
  createdAtGTE?: Maybe<Scalars['Time']>;
  createdAtLT?: Maybe<Scalars['Time']>;
  createdAtLTE?: Maybe<Scalars['Time']>;
  /** updated_at field predicates */
  updatedAt?: Maybe<Scalars['Time']>;
  updatedAtNEQ?: Maybe<Scalars['Time']>;
  updatedAtIn?: Maybe<Array<Scalars['Time']>>;
  updatedAtNotIn?: Maybe<Array<Scalars['Time']>>;
  updatedAtGT?: Maybe<Scalars['Time']>;
  updatedAtGTE?: Maybe<Scalars['Time']>;
  updatedAtLT?: Maybe<Scalars['Time']>;
  updatedAtLTE?: Maybe<Scalars['Time']>;
  /** name field predicates */
  name?: Maybe<Scalars['String']>;
  nameNEQ?: Maybe<Scalars['String']>;
  nameIn?: Maybe<Array<Scalars['String']>>;
  nameNotIn?: Maybe<Array<Scalars['String']>>;
  nameGT?: Maybe<Scalars['String']>;
  nameGTE?: Maybe<Scalars['String']>;
  nameLT?: Maybe<Scalars['String']>;
  nameLTE?: Maybe<Scalars['String']>;
  nameContains?: Maybe<Scalars['String']>;
  nameHasPrefix?: Maybe<Scalars['String']>;
  nameHasSuffix?: Maybe<Scalars['String']>;
  nameIsNil?: Maybe<Scalars['Boolean']>;
  nameNotNil?: Maybe<Scalars['Boolean']>;
  nameEqualFold?: Maybe<Scalars['String']>;
  nameContainsFold?: Maybe<Scalars['String']>;
  /** group_type field predicates */
  groupType?: Maybe<GroupType>;
  groupTypeNEQ?: Maybe<GroupType>;
  groupTypeIn?: Maybe<Array<GroupType>>;
  groupTypeNotIn?: Maybe<Array<GroupType>>;
  /** active field predicates */
  active?: Maybe<Scalars['Boolean']>;
  activeNEQ?: Maybe<Scalars['Boolean']>;
  /** deleted_at field predicates */
  deletedAt?: Maybe<Scalars['Time']>;
  deletedAtNEQ?: Maybe<Scalars['Time']>;
  deletedAtIn?: Maybe<Array<Scalars['Time']>>;
  deletedAtNotIn?: Maybe<Array<Scalars['Time']>>;
  deletedAtGT?: Maybe<Scalars['Time']>;
  deletedAtGTE?: Maybe<Scalars['Time']>;
  deletedAtLT?: Maybe<Scalars['Time']>;
  deletedAtLTE?: Maybe<Scalars['Time']>;
  deletedAtIsNil?: Maybe<Scalars['Boolean']>;
  deletedAtNotNil?: Maybe<Scalars['Boolean']>;
  /** id field predicates */
  id?: Maybe<Scalars['ID']>;
  idNEQ?: Maybe<Scalars['ID']>;
  idIn?: Maybe<Array<Scalars['ID']>>;
  idNotIn?: Maybe<Array<Scalars['ID']>>;
  idGT?: Maybe<Scalars['ID']>;
  idGTE?: Maybe<Scalars['ID']>;
  idLT?: Maybe<Scalars['ID']>;
  idLTE?: Maybe<Scalars['ID']>;
  /** class edge predicates */
  hasClass?: Maybe<Scalars['Boolean']>;
  hasClassWith?: Maybe<Array<ClassWhereInput>>;
  /** users edge predicates */
  hasUsers?: Maybe<Scalars['Boolean']>;
  hasUsersWith?: Maybe<Array<UserWhereInput>>;
  /** messages edge predicates */
  hasMessages?: Maybe<Scalars['Boolean']>;
  hasMessagesWith?: Maybe<Array<MessageWhereInput>>;
};

export type LoginInput = {
  username: Scalars['String'];
  password: Scalars['String'];
};

export type Message = Node & {
  __typename?: 'Message';
  id: Scalars['ID'];
  content: Scalars['String'];
  attachment: Scalars['String'];
  createdAt: Scalars['Time'];
  updatedAt: Scalars['Time'];
  group: Group;
  owner: User;
};

export type MessageConnection = {
  __typename?: 'MessageConnection';
  totalCount: Scalars['Int'];
  pageInfo: PageInfo;
  edges?: Maybe<Array<Maybe<MessageEdge>>>;
};

export type MessageEdge = {
  __typename?: 'MessageEdge';
  node?: Maybe<Message>;
  cursor: Scalars['Cursor'];
};

export type MessageOrder = {
  field?: Maybe<MessageOrderField>;
  direction: OrderDirection;
};

export enum MessageOrderField {
  CreatedAt = 'CREATED_AT',
  UpdatedAt = 'UPDATED_AT'
}

/**
 * MessageWhereInput is used for filtering Message objects.
 * Input was generated by ent.
 */
export type MessageWhereInput = {
  not?: Maybe<MessageWhereInput>;
  and?: Maybe<Array<MessageWhereInput>>;
  or?: Maybe<Array<MessageWhereInput>>;
  /** created_at field predicates */
  createdAt?: Maybe<Scalars['Time']>;
  createdAtNEQ?: Maybe<Scalars['Time']>;
  createdAtIn?: Maybe<Array<Scalars['Time']>>;
  createdAtNotIn?: Maybe<Array<Scalars['Time']>>;
  createdAtGT?: Maybe<Scalars['Time']>;
  createdAtGTE?: Maybe<Scalars['Time']>;
  createdAtLT?: Maybe<Scalars['Time']>;
  createdAtLTE?: Maybe<Scalars['Time']>;
  /** updated_at field predicates */
  updatedAt?: Maybe<Scalars['Time']>;
  updatedAtNEQ?: Maybe<Scalars['Time']>;
  updatedAtIn?: Maybe<Array<Scalars['Time']>>;
  updatedAtNotIn?: Maybe<Array<Scalars['Time']>>;
  updatedAtGT?: Maybe<Scalars['Time']>;
  updatedAtGTE?: Maybe<Scalars['Time']>;
  updatedAtLT?: Maybe<Scalars['Time']>;
  updatedAtLTE?: Maybe<Scalars['Time']>;
  /** content field predicates */
  content?: Maybe<Scalars['String']>;
  contentNEQ?: Maybe<Scalars['String']>;
  contentIn?: Maybe<Array<Scalars['String']>>;
  contentNotIn?: Maybe<Array<Scalars['String']>>;
  contentGT?: Maybe<Scalars['String']>;
  contentGTE?: Maybe<Scalars['String']>;
  contentLT?: Maybe<Scalars['String']>;
  contentLTE?: Maybe<Scalars['String']>;
  contentContains?: Maybe<Scalars['String']>;
  contentHasPrefix?: Maybe<Scalars['String']>;
  contentHasSuffix?: Maybe<Scalars['String']>;
  contentIsNil?: Maybe<Scalars['Boolean']>;
  contentNotNil?: Maybe<Scalars['Boolean']>;
  contentEqualFold?: Maybe<Scalars['String']>;
  contentContainsFold?: Maybe<Scalars['String']>;
  /** attachment field predicates */
  attachment?: Maybe<Scalars['String']>;
  attachmentNEQ?: Maybe<Scalars['String']>;
  attachmentIn?: Maybe<Array<Scalars['String']>>;
  attachmentNotIn?: Maybe<Array<Scalars['String']>>;
  attachmentGT?: Maybe<Scalars['String']>;
  attachmentGTE?: Maybe<Scalars['String']>;
  attachmentLT?: Maybe<Scalars['String']>;
  attachmentLTE?: Maybe<Scalars['String']>;
  attachmentContains?: Maybe<Scalars['String']>;
  attachmentHasPrefix?: Maybe<Scalars['String']>;
  attachmentHasSuffix?: Maybe<Scalars['String']>;
  attachmentIsNil?: Maybe<Scalars['Boolean']>;
  attachmentNotNil?: Maybe<Scalars['Boolean']>;
  attachmentEqualFold?: Maybe<Scalars['String']>;
  attachmentContainsFold?: Maybe<Scalars['String']>;
  /** deleted_at field predicates */
  deletedAt?: Maybe<Scalars['Time']>;
  deletedAtNEQ?: Maybe<Scalars['Time']>;
  deletedAtIn?: Maybe<Array<Scalars['Time']>>;
  deletedAtNotIn?: Maybe<Array<Scalars['Time']>>;
  deletedAtGT?: Maybe<Scalars['Time']>;
  deletedAtGTE?: Maybe<Scalars['Time']>;
  deletedAtLT?: Maybe<Scalars['Time']>;
  deletedAtLTE?: Maybe<Scalars['Time']>;
  deletedAtIsNil?: Maybe<Scalars['Boolean']>;
  deletedAtNotNil?: Maybe<Scalars['Boolean']>;
  /** id field predicates */
  id?: Maybe<Scalars['ID']>;
  idNEQ?: Maybe<Scalars['ID']>;
  idIn?: Maybe<Array<Scalars['ID']>>;
  idNotIn?: Maybe<Array<Scalars['ID']>>;
  idGT?: Maybe<Scalars['ID']>;
  idGTE?: Maybe<Scalars['ID']>;
  idLT?: Maybe<Scalars['ID']>;
  idLTE?: Maybe<Scalars['ID']>;
  /** group edge predicates */
  hasGroup?: Maybe<Scalars['Boolean']>;
  hasGroupWith?: Maybe<Array<GroupWhereInput>>;
  /** owner edge predicates */
  hasOwner?: Maybe<Scalars['Boolean']>;
  hasOwnerWith?: Maybe<Array<UserWhereInput>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addSchool: School;
  updateSchool: School;
  deleteSchool: Scalars['Boolean'];
  deleteSchoolPermanently: Scalars['Boolean'];
  addUser: User;
  updateUser: User;
  deleteUser: Scalars['Boolean'];
  deleteUserPermanently: Scalars['Boolean'];
  addStage: Stage;
  updateStage: Stage;
  deleteStage: Scalars['Boolean'];
  deleteStagePermanently: Scalars['Boolean'];
  loginAdmin: AuthData;
  loginUser: AuthData;
  refreshTokens: AuthData;
  postMessage: Message;
  addGroup: Group;
  updateGroup: Group;
  deleteGroup: Scalars['Boolean'];
  addClass: Class;
  updateClass: Class;
  deleteClass: Scalars['Boolean'];
  addAssignment: Assignment;
  updateAssignment: Assignment;
  deleteAssignment: Scalars['Boolean'];
  addAssignmentSubmission: AssignmentSubmission;
  updateAssignmentSubmission: AssignmentSubmission;
  deleteAssignmentSubmissionFile: AssignmentSubmission;
  deleteAssignmentSubmission: Scalars['Boolean'];
  addSchedule: Schedule;
  updateSchedule: Schedule;
  deleteSchedule: Scalars['Boolean'];
  addCourseGrade: CourseGrade;
  updateCourseGrade: CourseGrade;
  deleteCourseGrade: Scalars['Boolean'];
  addTuitionPayment: TuitionPayment;
  updateTuitionPayment: TuitionPayment;
  deleteTuitionPayment: Scalars['Boolean'];
  addAttendance: Attendance;
  updateAttendance: Attendance;
  deleteAttendance: Scalars['Boolean'];
};


export type MutationAddSchoolArgs = {
  input: AddSchoolInput;
};


export type MutationUpdateSchoolArgs = {
  id: Scalars['ID'];
  input: UpdateSchoolInput;
};


export type MutationDeleteSchoolArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteSchoolPermanentlyArgs = {
  id: Scalars['ID'];
};


export type MutationAddUserArgs = {
  input: AddUserInput;
};


export type MutationUpdateUserArgs = {
  id: Scalars['ID'];
  input: UpdateUserInput;
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteUserPermanentlyArgs = {
  id: Scalars['ID'];
};


export type MutationAddStageArgs = {
  input: AddStageInput;
};


export type MutationUpdateStageArgs = {
  id: Scalars['ID'];
  input: UpdateStageInput;
};


export type MutationDeleteStageArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteStagePermanentlyArgs = {
  id: Scalars['ID'];
};


export type MutationLoginAdminArgs = {
  input: LoginInput;
};


export type MutationLoginUserArgs = {
  input: LoginInput;
};


export type MutationRefreshTokensArgs = {
  token: Scalars['String'];
};


export type MutationPostMessageArgs = {
  input: PostMessageInput;
};


export type MutationAddGroupArgs = {
  input: AddGroupInput;
};


export type MutationUpdateGroupArgs = {
  id: Scalars['ID'];
  input: UpdateGroupInput;
};


export type MutationDeleteGroupArgs = {
  id: Scalars['ID'];
};


export type MutationAddClassArgs = {
  input: AddClassInput;
};


export type MutationUpdateClassArgs = {
  id: Scalars['ID'];
  input: UpdateClassInput;
};


export type MutationDeleteClassArgs = {
  id: Scalars['ID'];
};


export type MutationAddAssignmentArgs = {
  input: AddAssignmentInput;
};


export type MutationUpdateAssignmentArgs = {
  id: Scalars['ID'];
  input: UpdateAssignmentInput;
};


export type MutationDeleteAssignmentArgs = {
  id: Scalars['ID'];
};


export type MutationAddAssignmentSubmissionArgs = {
  input: AddAssignmentSubmissionInput;
};


export type MutationUpdateAssignmentSubmissionArgs = {
  id: Scalars['ID'];
  input: UpdateAssignmentSubmissionInput;
};


export type MutationDeleteAssignmentSubmissionFileArgs = {
  id: Scalars['ID'];
  index: Scalars['Int'];
};


export type MutationDeleteAssignmentSubmissionArgs = {
  id: Scalars['ID'];
};


export type MutationAddScheduleArgs = {
  input: AddScheduleInput;
};


export type MutationUpdateScheduleArgs = {
  id: Scalars['ID'];
  input: UpdateScheduleInput;
};


export type MutationDeleteScheduleArgs = {
  id: Scalars['ID'];
};


export type MutationAddCourseGradeArgs = {
  input: AddCourseGradeInput;
};


export type MutationUpdateCourseGradeArgs = {
  id: Scalars['ID'];
  input: UpdateCourseGradeInput;
};


export type MutationDeleteCourseGradeArgs = {
  id: Scalars['ID'];
};


export type MutationAddTuitionPaymentArgs = {
  input: AddTuitionPaymentInput;
};


export type MutationUpdateTuitionPaymentArgs = {
  id: Scalars['ID'];
  input: UpdateTuitionPaymentInput;
};


export type MutationDeleteTuitionPaymentArgs = {
  id: Scalars['ID'];
};


export type MutationAddAttendanceArgs = {
  input: AddAttendanceInput;
};


export type MutationUpdateAttendanceArgs = {
  id: Scalars['ID'];
  input: UpdateAttendanceInput;
};


export type MutationDeleteAttendanceArgs = {
  id: Scalars['ID'];
};

export type Node = {
  id: Scalars['ID'];
};

export enum OrderDirection {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type PageInfo = {
  __typename?: 'PageInfo';
  hasNextPage: Scalars['Boolean'];
  hasPreviousPage: Scalars['Boolean'];
  startCursor?: Maybe<Scalars['Cursor']>;
  endCursor?: Maybe<Scalars['Cursor']>;
};

export type PostMessageInput = {
  groupID: Scalars['ID'];
  content: Scalars['String'];
  attachment?: Maybe<Scalars['Upload']>;
};

export type Query = {
  __typename?: 'Query';
  me: User;
  school: School;
  schools: SchoolConnection;
  user: User;
  users: UserConnection;
  stage: Stage;
  stages: StageConnection;
  messages: MessageConnection;
  group: Group;
  groups: GroupConnection;
  class: Class;
  classes: ClassConnection;
  assignment: Assignment;
  assignments: AssignmentConnection;
  assignmentSubmissions: AssignmentSubmissionConnection;
  schedule: Array<Schedule>;
  courseGrades: CourseGradeConnection;
  tuitionPayments: TuitionPaymentConnection;
  attendances: AttendanceConnection;
};


export type QuerySchoolArgs = {
  id: Scalars['ID'];
};


export type QuerySchoolsArgs = {
  after?: Maybe<Scalars['Cursor']>;
  first?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  last?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<SchoolOrder>;
  where?: Maybe<SchoolWhereInput>;
};


export type QueryUserArgs = {
  id: Scalars['ID'];
};


export type QueryUsersArgs = {
  after?: Maybe<Scalars['Cursor']>;
  first?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  last?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<UserOrder>;
  where?: Maybe<UserWhereInput>;
};


export type QueryStageArgs = {
  id: Scalars['ID'];
};


export type QueryStagesArgs = {
  after?: Maybe<Scalars['Cursor']>;
  first?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  last?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<StageOrder>;
  where?: Maybe<StageWhereInput>;
};


export type QueryMessagesArgs = {
  groupID: Scalars['ID'];
  after?: Maybe<Scalars['Cursor']>;
  first?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  last?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<MessageOrder>;
  where?: Maybe<MessageWhereInput>;
};


export type QueryGroupArgs = {
  id: Scalars['ID'];
};


export type QueryGroupsArgs = {
  userID?: Maybe<Scalars['ID']>;
  after?: Maybe<Scalars['Cursor']>;
  first?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  last?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<GroupOrder>;
  where?: Maybe<GroupWhereInput>;
};


export type QueryClassArgs = {
  id: Scalars['ID'];
};


export type QueryClassesArgs = {
  userID?: Maybe<Scalars['ID']>;
  stageID?: Maybe<Scalars['ID']>;
  schoolID?: Maybe<Scalars['ID']>;
  after?: Maybe<Scalars['Cursor']>;
  first?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  last?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<ClassOrder>;
  where?: Maybe<ClassWhereInput>;
};


export type QueryAssignmentArgs = {
  id: Scalars['ID'];
};


export type QueryAssignmentsArgs = {
  userID?: Maybe<Scalars['ID']>;
  stageID?: Maybe<Scalars['ID']>;
  schoolID?: Maybe<Scalars['ID']>;
  after?: Maybe<Scalars['Cursor']>;
  first?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  last?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<AssignmentOrder>;
  where?: Maybe<AssignmentWhereInput>;
};


export type QueryAssignmentSubmissionsArgs = {
  assignmentID?: Maybe<Scalars['ID']>;
  after?: Maybe<Scalars['Cursor']>;
  first?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  last?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<AssignmentSubmissionOrder>;
  where?: Maybe<AssignmentSubmissionWhereInput>;
};


export type QueryScheduleArgs = {
  stageID?: Maybe<Scalars['ID']>;
  weekday?: Maybe<Scalars['Weekday']>;
};


export type QueryCourseGradesArgs = {
  studentID?: Maybe<Scalars['ID']>;
  stageID?: Maybe<Scalars['ID']>;
  classID?: Maybe<Scalars['ID']>;
  after?: Maybe<Scalars['Cursor']>;
  first?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  last?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<CourseGradeOrder>;
  where?: Maybe<CourseGradeWhereInput>;
};


export type QueryTuitionPaymentsArgs = {
  studentID?: Maybe<Scalars['ID']>;
  stageID?: Maybe<Scalars['ID']>;
  after?: Maybe<Scalars['Cursor']>;
  first?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  last?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<TuitionPaymentOrder>;
  where?: Maybe<TuitionPaymentWhereInput>;
};


export type QueryAttendancesArgs = {
  studentID?: Maybe<Scalars['ID']>;
  classID?: Maybe<Scalars['ID']>;
  after?: Maybe<Scalars['Cursor']>;
  first?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  last?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<AttendanceOrder>;
  where?: Maybe<AttendanceWhereInput>;
};

export enum Role {
  SuperAdmin = 'SUPER_ADMIN',
  SchoolAdmin = 'SCHOOL_ADMIN',
  Teacher = 'TEACHER',
  Student = 'STUDENT'
}

export type Schedule = Node & {
  __typename?: 'Schedule';
  id: Scalars['ID'];
  weekday: Scalars['Weekday'];
  duration: Scalars['Duration'];
  startsAt: Scalars['Time'];
  class: Class;
};

export type ScheduleConnection = {
  __typename?: 'ScheduleConnection';
  totalCount: Scalars['Int'];
  pageInfo: PageInfo;
  edges?: Maybe<Array<Maybe<ScheduleEdge>>>;
};

export type ScheduleEdge = {
  __typename?: 'ScheduleEdge';
  node?: Maybe<Schedule>;
  cursor: Scalars['Cursor'];
};

export type ScheduleOrder = {
  field?: Maybe<ScheduleOrderField>;
  direction: OrderDirection;
};

export enum ScheduleOrderField {
  Weekday = 'WEEKDAY',
  StartsAt = 'STARTS_AT',
  Duration = 'DURATION',
  CreatedAt = 'CREATED_AT',
  UpdatedAt = 'UPDATED_AT'
}

/**
 * ScheduleWhereInput is used for filtering Schedule objects.
 * Input was generated by ent.
 */
export type ScheduleWhereInput = {
  not?: Maybe<ScheduleWhereInput>;
  and?: Maybe<Array<ScheduleWhereInput>>;
  or?: Maybe<Array<ScheduleWhereInput>>;
  /** weekday field predicates */
  weekday?: Maybe<Scalars['Weekday']>;
  weekdayNEQ?: Maybe<Scalars['Weekday']>;
  weekdayIn?: Maybe<Array<Scalars['Weekday']>>;
  weekdayNotIn?: Maybe<Array<Scalars['Weekday']>>;
  weekdayGT?: Maybe<Scalars['Weekday']>;
  weekdayGTE?: Maybe<Scalars['Weekday']>;
  weekdayLT?: Maybe<Scalars['Weekday']>;
  weekdayLTE?: Maybe<Scalars['Weekday']>;
  /** starts_at field predicates */
  startsAt?: Maybe<Scalars['Time']>;
  startsAtNEQ?: Maybe<Scalars['Time']>;
  startsAtIn?: Maybe<Array<Scalars['Time']>>;
  startsAtNotIn?: Maybe<Array<Scalars['Time']>>;
  startsAtGT?: Maybe<Scalars['Time']>;
  startsAtGTE?: Maybe<Scalars['Time']>;
  startsAtLT?: Maybe<Scalars['Time']>;
  startsAtLTE?: Maybe<Scalars['Time']>;
  /** duration field predicates */
  duration?: Maybe<Scalars['Duration']>;
  durationNEQ?: Maybe<Scalars['Duration']>;
  durationIn?: Maybe<Array<Scalars['Duration']>>;
  durationNotIn?: Maybe<Array<Scalars['Duration']>>;
  durationGT?: Maybe<Scalars['Duration']>;
  durationGTE?: Maybe<Scalars['Duration']>;
  durationLT?: Maybe<Scalars['Duration']>;
  durationLTE?: Maybe<Scalars['Duration']>;
  /** id field predicates */
  id?: Maybe<Scalars['ID']>;
  idNEQ?: Maybe<Scalars['ID']>;
  idIn?: Maybe<Array<Scalars['ID']>>;
  idNotIn?: Maybe<Array<Scalars['ID']>>;
  idGT?: Maybe<Scalars['ID']>;
  idGTE?: Maybe<Scalars['ID']>;
  idLT?: Maybe<Scalars['ID']>;
  idLTE?: Maybe<Scalars['ID']>;
  /** class edge predicates */
  hasClass?: Maybe<Scalars['Boolean']>;
  hasClassWith?: Maybe<Array<ClassWhereInput>>;
};

export type School = Node & {
  __typename?: 'School';
  id: Scalars['ID'];
  active: Scalars['Boolean'];
  name: Scalars['String'];
  image?: Maybe<Scalars['String']>;
  createdAt: Scalars['Time'];
  updatedAt: Scalars['Time'];
  users?: Maybe<UserConnection>;
  stages?: Maybe<StageConnection>;
};


export type SchoolUsersArgs = {
  after?: Maybe<Scalars['Cursor']>;
  first?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  last?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<UserOrder>;
  where?: Maybe<UserWhereInput>;
};


export type SchoolStagesArgs = {
  after?: Maybe<Scalars['Cursor']>;
  first?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  last?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<StageOrder>;
  where?: Maybe<StageWhereInput>;
};

export type SchoolConnection = {
  __typename?: 'SchoolConnection';
  totalCount: Scalars['Int'];
  pageInfo: PageInfo;
  edges?: Maybe<Array<Maybe<SchoolEdge>>>;
};

export type SchoolEdge = {
  __typename?: 'SchoolEdge';
  node?: Maybe<School>;
  cursor: Scalars['Cursor'];
};

export type SchoolOrder = {
  field?: Maybe<SchoolOrderField>;
  direction: OrderDirection;
};

export enum SchoolOrderField {
  Name = 'NAME',
  CreatedAt = 'CREATED_AT',
  UpdatedAt = 'UPDATED_AT'
}

/**
 * SchoolWhereInput is used for filtering School objects.
 * Input was generated by ent.
 */
export type SchoolWhereInput = {
  not?: Maybe<SchoolWhereInput>;
  and?: Maybe<Array<SchoolWhereInput>>;
  or?: Maybe<Array<SchoolWhereInput>>;
  /** created_at field predicates */
  createdAt?: Maybe<Scalars['Time']>;
  createdAtNEQ?: Maybe<Scalars['Time']>;
  createdAtIn?: Maybe<Array<Scalars['Time']>>;
  createdAtNotIn?: Maybe<Array<Scalars['Time']>>;
  createdAtGT?: Maybe<Scalars['Time']>;
  createdAtGTE?: Maybe<Scalars['Time']>;
  createdAtLT?: Maybe<Scalars['Time']>;
  createdAtLTE?: Maybe<Scalars['Time']>;
  /** updated_at field predicates */
  updatedAt?: Maybe<Scalars['Time']>;
  updatedAtNEQ?: Maybe<Scalars['Time']>;
  updatedAtIn?: Maybe<Array<Scalars['Time']>>;
  updatedAtNotIn?: Maybe<Array<Scalars['Time']>>;
  updatedAtGT?: Maybe<Scalars['Time']>;
  updatedAtGTE?: Maybe<Scalars['Time']>;
  updatedAtLT?: Maybe<Scalars['Time']>;
  updatedAtLTE?: Maybe<Scalars['Time']>;
  /** name field predicates */
  name?: Maybe<Scalars['String']>;
  nameNEQ?: Maybe<Scalars['String']>;
  nameIn?: Maybe<Array<Scalars['String']>>;
  nameNotIn?: Maybe<Array<Scalars['String']>>;
  nameGT?: Maybe<Scalars['String']>;
  nameGTE?: Maybe<Scalars['String']>;
  nameLT?: Maybe<Scalars['String']>;
  nameLTE?: Maybe<Scalars['String']>;
  nameContains?: Maybe<Scalars['String']>;
  nameHasPrefix?: Maybe<Scalars['String']>;
  nameHasSuffix?: Maybe<Scalars['String']>;
  nameEqualFold?: Maybe<Scalars['String']>;
  nameContainsFold?: Maybe<Scalars['String']>;
  /** image field predicates */
  image?: Maybe<Scalars['String']>;
  imageNEQ?: Maybe<Scalars['String']>;
  imageIn?: Maybe<Array<Scalars['String']>>;
  imageNotIn?: Maybe<Array<Scalars['String']>>;
  imageGT?: Maybe<Scalars['String']>;
  imageGTE?: Maybe<Scalars['String']>;
  imageLT?: Maybe<Scalars['String']>;
  imageLTE?: Maybe<Scalars['String']>;
  imageContains?: Maybe<Scalars['String']>;
  imageHasPrefix?: Maybe<Scalars['String']>;
  imageHasSuffix?: Maybe<Scalars['String']>;
  imageEqualFold?: Maybe<Scalars['String']>;
  imageContainsFold?: Maybe<Scalars['String']>;
  /** directory field predicates */
  directory?: Maybe<Scalars['String']>;
  directoryNEQ?: Maybe<Scalars['String']>;
  directoryIn?: Maybe<Array<Scalars['String']>>;
  directoryNotIn?: Maybe<Array<Scalars['String']>>;
  directoryGT?: Maybe<Scalars['String']>;
  directoryGTE?: Maybe<Scalars['String']>;
  directoryLT?: Maybe<Scalars['String']>;
  directoryLTE?: Maybe<Scalars['String']>;
  directoryContains?: Maybe<Scalars['String']>;
  directoryHasPrefix?: Maybe<Scalars['String']>;
  directoryHasSuffix?: Maybe<Scalars['String']>;
  directoryEqualFold?: Maybe<Scalars['String']>;
  directoryContainsFold?: Maybe<Scalars['String']>;
  /** active field predicates */
  active?: Maybe<Scalars['Boolean']>;
  activeNEQ?: Maybe<Scalars['Boolean']>;
  /** deleted_at field predicates */
  deletedAt?: Maybe<Scalars['Time']>;
  deletedAtNEQ?: Maybe<Scalars['Time']>;
  deletedAtIn?: Maybe<Array<Scalars['Time']>>;
  deletedAtNotIn?: Maybe<Array<Scalars['Time']>>;
  deletedAtGT?: Maybe<Scalars['Time']>;
  deletedAtGTE?: Maybe<Scalars['Time']>;
  deletedAtLT?: Maybe<Scalars['Time']>;
  deletedAtLTE?: Maybe<Scalars['Time']>;
  deletedAtIsNil?: Maybe<Scalars['Boolean']>;
  deletedAtNotNil?: Maybe<Scalars['Boolean']>;
  /** id field predicates */
  id?: Maybe<Scalars['ID']>;
  idNEQ?: Maybe<Scalars['ID']>;
  idIn?: Maybe<Array<Scalars['ID']>>;
  idNotIn?: Maybe<Array<Scalars['ID']>>;
  idGT?: Maybe<Scalars['ID']>;
  idGTE?: Maybe<Scalars['ID']>;
  idLT?: Maybe<Scalars['ID']>;
  idLTE?: Maybe<Scalars['ID']>;
  /** users edge predicates */
  hasUsers?: Maybe<Scalars['Boolean']>;
  hasUsersWith?: Maybe<Array<UserWhereInput>>;
  /** stages edge predicates */
  hasStages?: Maybe<Scalars['Boolean']>;
  hasStagesWith?: Maybe<Array<StageWhereInput>>;
};

export type Stage = Node & {
  __typename?: 'Stage';
  id: Scalars['ID'];
  name: Scalars['String'];
  tuitionAmount: Scalars['Int'];
  active: Scalars['Boolean'];
  createdAt: Scalars['Time'];
  updatedAt: Scalars['Time'];
  school: School;
  classes?: Maybe<ClassConnection>;
  payments?: Maybe<TuitionPaymentConnection>;
  students?: Maybe<UserConnection>;
  courseGrades?: Maybe<Array<CourseGrade>>;
};


export type StageClassesArgs = {
  after?: Maybe<Scalars['Cursor']>;
  first?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  last?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<ClassOrder>;
  where?: Maybe<ClassWhereInput>;
};


export type StagePaymentsArgs = {
  after?: Maybe<Scalars['Cursor']>;
  first?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  last?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<TuitionPaymentOrder>;
  where?: Maybe<TuitionPaymentWhereInput>;
};


export type StageStudentsArgs = {
  after?: Maybe<Scalars['Cursor']>;
  first?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  last?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<UserOrder>;
  where?: Maybe<UserWhereInput>;
};

export type StageConnection = {
  __typename?: 'StageConnection';
  totalCount: Scalars['Int'];
  pageInfo: PageInfo;
  edges?: Maybe<Array<Maybe<StageEdge>>>;
};

export type StageEdge = {
  __typename?: 'StageEdge';
  node?: Maybe<Stage>;
  cursor: Scalars['Cursor'];
};

export type StageOrder = {
  field?: Maybe<StageOrderField>;
  direction: OrderDirection;
};

export enum StageOrderField {
  Name = 'NAME',
  CreatedAt = 'CREATED_AT',
  UpdatedAt = 'UPDATED_AT'
}

/**
 * StageWhereInput is used for filtering Stage objects.
 * Input was generated by ent.
 */
export type StageWhereInput = {
  not?: Maybe<StageWhereInput>;
  and?: Maybe<Array<StageWhereInput>>;
  or?: Maybe<Array<StageWhereInput>>;
  /** created_at field predicates */
  createdAt?: Maybe<Scalars['Time']>;
  createdAtNEQ?: Maybe<Scalars['Time']>;
  createdAtIn?: Maybe<Array<Scalars['Time']>>;
  createdAtNotIn?: Maybe<Array<Scalars['Time']>>;
  createdAtGT?: Maybe<Scalars['Time']>;
  createdAtGTE?: Maybe<Scalars['Time']>;
  createdAtLT?: Maybe<Scalars['Time']>;
  createdAtLTE?: Maybe<Scalars['Time']>;
  /** updated_at field predicates */
  updatedAt?: Maybe<Scalars['Time']>;
  updatedAtNEQ?: Maybe<Scalars['Time']>;
  updatedAtIn?: Maybe<Array<Scalars['Time']>>;
  updatedAtNotIn?: Maybe<Array<Scalars['Time']>>;
  updatedAtGT?: Maybe<Scalars['Time']>;
  updatedAtGTE?: Maybe<Scalars['Time']>;
  updatedAtLT?: Maybe<Scalars['Time']>;
  updatedAtLTE?: Maybe<Scalars['Time']>;
  /** name field predicates */
  name?: Maybe<Scalars['String']>;
  nameNEQ?: Maybe<Scalars['String']>;
  nameIn?: Maybe<Array<Scalars['String']>>;
  nameNotIn?: Maybe<Array<Scalars['String']>>;
  nameGT?: Maybe<Scalars['String']>;
  nameGTE?: Maybe<Scalars['String']>;
  nameLT?: Maybe<Scalars['String']>;
  nameLTE?: Maybe<Scalars['String']>;
  nameContains?: Maybe<Scalars['String']>;
  nameHasPrefix?: Maybe<Scalars['String']>;
  nameHasSuffix?: Maybe<Scalars['String']>;
  nameEqualFold?: Maybe<Scalars['String']>;
  nameContainsFold?: Maybe<Scalars['String']>;
  /** tuition_amount field predicates */
  tuitionAmount?: Maybe<Scalars['Int']>;
  tuitionAmountNEQ?: Maybe<Scalars['Int']>;
  tuitionAmountIn?: Maybe<Array<Scalars['Int']>>;
  tuitionAmountNotIn?: Maybe<Array<Scalars['Int']>>;
  tuitionAmountGT?: Maybe<Scalars['Int']>;
  tuitionAmountGTE?: Maybe<Scalars['Int']>;
  tuitionAmountLT?: Maybe<Scalars['Int']>;
  tuitionAmountLTE?: Maybe<Scalars['Int']>;
  /** directory field predicates */
  directory?: Maybe<Scalars['String']>;
  directoryNEQ?: Maybe<Scalars['String']>;
  directoryIn?: Maybe<Array<Scalars['String']>>;
  directoryNotIn?: Maybe<Array<Scalars['String']>>;
  directoryGT?: Maybe<Scalars['String']>;
  directoryGTE?: Maybe<Scalars['String']>;
  directoryLT?: Maybe<Scalars['String']>;
  directoryLTE?: Maybe<Scalars['String']>;
  directoryContains?: Maybe<Scalars['String']>;
  directoryHasPrefix?: Maybe<Scalars['String']>;
  directoryHasSuffix?: Maybe<Scalars['String']>;
  directoryEqualFold?: Maybe<Scalars['String']>;
  directoryContainsFold?: Maybe<Scalars['String']>;
  /** active field predicates */
  active?: Maybe<Scalars['Boolean']>;
  activeNEQ?: Maybe<Scalars['Boolean']>;
  /** deleted_at field predicates */
  deletedAt?: Maybe<Scalars['Time']>;
  deletedAtNEQ?: Maybe<Scalars['Time']>;
  deletedAtIn?: Maybe<Array<Scalars['Time']>>;
  deletedAtNotIn?: Maybe<Array<Scalars['Time']>>;
  deletedAtGT?: Maybe<Scalars['Time']>;
  deletedAtGTE?: Maybe<Scalars['Time']>;
  deletedAtLT?: Maybe<Scalars['Time']>;
  deletedAtLTE?: Maybe<Scalars['Time']>;
  deletedAtIsNil?: Maybe<Scalars['Boolean']>;
  deletedAtNotNil?: Maybe<Scalars['Boolean']>;
  /** id field predicates */
  id?: Maybe<Scalars['ID']>;
  idNEQ?: Maybe<Scalars['ID']>;
  idIn?: Maybe<Array<Scalars['ID']>>;
  idNotIn?: Maybe<Array<Scalars['ID']>>;
  idGT?: Maybe<Scalars['ID']>;
  idGTE?: Maybe<Scalars['ID']>;
  idLT?: Maybe<Scalars['ID']>;
  idLTE?: Maybe<Scalars['ID']>;
  /** school edge predicates */
  hasSchool?: Maybe<Scalars['Boolean']>;
  hasSchoolWith?: Maybe<Array<SchoolWhereInput>>;
  /** classes edge predicates */
  hasClasses?: Maybe<Scalars['Boolean']>;
  hasClassesWith?: Maybe<Array<ClassWhereInput>>;
  /** payments edge predicates */
  hasPayments?: Maybe<Scalars['Boolean']>;
  hasPaymentsWith?: Maybe<Array<TuitionPaymentWhereInput>>;
  /** students edge predicates */
  hasStudents?: Maybe<Scalars['Boolean']>;
  hasStudentsWith?: Maybe<Array<UserWhereInput>>;
  /** course_grades edge predicates */
  hasCourseGrades?: Maybe<Scalars['Boolean']>;
  hasCourseGradesWith?: Maybe<Array<CourseGradeWhereInput>>;
};

export enum State {
  Present = 'PRESENT',
  Absent = 'ABSENT',
  ExcusedAbsent = 'EXCUSED_ABSENT',
  Sick = 'SICK'
}

export type Subscription = {
  __typename?: 'Subscription';
  messagePosted: Message;
};


export type SubscriptionMessagePostedArgs = {
  groupID: Scalars['ID'];
};


export type TuitionPayment = Node & {
  __typename?: 'TuitionPayment';
  id: Scalars['ID'];
  year: Scalars['String'];
  paidAmount: Scalars['Int'];
  createdAt: Scalars['Time'];
  updatedAt: Scalars['Time'];
  student: User;
  stage: Stage;
};

export type TuitionPaymentConnection = {
  __typename?: 'TuitionPaymentConnection';
  totalCount: Scalars['Int'];
  pageInfo: PageInfo;
  edges?: Maybe<Array<Maybe<TuitionPaymentEdge>>>;
};

export type TuitionPaymentEdge = {
  __typename?: 'TuitionPaymentEdge';
  node?: Maybe<TuitionPayment>;
  cursor: Scalars['Cursor'];
};

export type TuitionPaymentOrder = {
  field?: Maybe<TuitionPaymentOrderField>;
  direction: OrderDirection;
};

export enum TuitionPaymentOrderField {
  PaidAmount = 'PAID_AMOUNT',
  Year = 'YEAR',
  CreatedAt = 'CREATED_AT',
  UpdatedAt = 'UPDATED_AT'
}

/**
 * TuitionPaymentWhereInput is used for filtering TuitionPayment objects.
 * Input was generated by ent.
 */
export type TuitionPaymentWhereInput = {
  not?: Maybe<TuitionPaymentWhereInput>;
  and?: Maybe<Array<TuitionPaymentWhereInput>>;
  or?: Maybe<Array<TuitionPaymentWhereInput>>;
  /** created_at field predicates */
  createdAt?: Maybe<Scalars['Time']>;
  createdAtNEQ?: Maybe<Scalars['Time']>;
  createdAtIn?: Maybe<Array<Scalars['Time']>>;
  createdAtNotIn?: Maybe<Array<Scalars['Time']>>;
  createdAtGT?: Maybe<Scalars['Time']>;
  createdAtGTE?: Maybe<Scalars['Time']>;
  createdAtLT?: Maybe<Scalars['Time']>;
  createdAtLTE?: Maybe<Scalars['Time']>;
  /** updated_at field predicates */
  updatedAt?: Maybe<Scalars['Time']>;
  updatedAtNEQ?: Maybe<Scalars['Time']>;
  updatedAtIn?: Maybe<Array<Scalars['Time']>>;
  updatedAtNotIn?: Maybe<Array<Scalars['Time']>>;
  updatedAtGT?: Maybe<Scalars['Time']>;
  updatedAtGTE?: Maybe<Scalars['Time']>;
  updatedAtLT?: Maybe<Scalars['Time']>;
  updatedAtLTE?: Maybe<Scalars['Time']>;
  /** year field predicates */
  year?: Maybe<Scalars['String']>;
  yearNEQ?: Maybe<Scalars['String']>;
  yearIn?: Maybe<Array<Scalars['String']>>;
  yearNotIn?: Maybe<Array<Scalars['String']>>;
  yearGT?: Maybe<Scalars['String']>;
  yearGTE?: Maybe<Scalars['String']>;
  yearLT?: Maybe<Scalars['String']>;
  yearLTE?: Maybe<Scalars['String']>;
  yearContains?: Maybe<Scalars['String']>;
  yearHasPrefix?: Maybe<Scalars['String']>;
  yearHasSuffix?: Maybe<Scalars['String']>;
  yearEqualFold?: Maybe<Scalars['String']>;
  yearContainsFold?: Maybe<Scalars['String']>;
  /** paid_amount field predicates */
  paidAmount?: Maybe<Scalars['Int']>;
  paidAmountNEQ?: Maybe<Scalars['Int']>;
  paidAmountIn?: Maybe<Array<Scalars['Int']>>;
  paidAmountNotIn?: Maybe<Array<Scalars['Int']>>;
  paidAmountGT?: Maybe<Scalars['Int']>;
  paidAmountGTE?: Maybe<Scalars['Int']>;
  paidAmountLT?: Maybe<Scalars['Int']>;
  paidAmountLTE?: Maybe<Scalars['Int']>;
  /** id field predicates */
  id?: Maybe<Scalars['ID']>;
  idNEQ?: Maybe<Scalars['ID']>;
  idIn?: Maybe<Array<Scalars['ID']>>;
  idNotIn?: Maybe<Array<Scalars['ID']>>;
  idGT?: Maybe<Scalars['ID']>;
  idGTE?: Maybe<Scalars['ID']>;
  idLT?: Maybe<Scalars['ID']>;
  idLTE?: Maybe<Scalars['ID']>;
  /** student edge predicates */
  hasStudent?: Maybe<Scalars['Boolean']>;
  hasStudentWith?: Maybe<Array<UserWhereInput>>;
  /** stage edge predicates */
  hasStage?: Maybe<Scalars['Boolean']>;
  hasStageWith?: Maybe<Array<StageWhereInput>>;
};

export type UpdateAssignmentInput = {
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  file?: Maybe<Scalars['Upload']>;
  dueDate?: Maybe<Scalars['Time']>;
  duration?: Maybe<Scalars['Duration']>;
};

export type UpdateAssignmentSubmissionInput = {
  files: Array<Scalars['Upload']>;
  submittedAt?: Maybe<Scalars['Time']>;
};

export type UpdateAttendanceInput = {
  date?: Maybe<Scalars['Time']>;
  state?: Maybe<AttendanceState>;
};

export type UpdateClassInput = {
  name?: Maybe<Scalars['String']>;
  active?: Maybe<Scalars['Boolean']>;
  teacherID?: Maybe<Scalars['ID']>;
};

export type UpdateCourseGradeInput = {
  activityFirst?: Maybe<Scalars['Int']>;
  activitySecond?: Maybe<Scalars['Int']>;
  writtenFirst?: Maybe<Scalars['Int']>;
  writtenSecond?: Maybe<Scalars['Int']>;
  courseFinal?: Maybe<Scalars['Int']>;
};

export type UpdateGroupInput = {
  name?: Maybe<Scalars['String']>;
  active?: Maybe<Scalars['Boolean']>;
};

export type UpdateScheduleInput = {
  weekday?: Maybe<Scalars['Weekday']>;
  duration?: Maybe<Scalars['Duration']>;
  startsAt?: Maybe<Scalars['Time']>;
};

export type UpdateSchoolInput = {
  name?: Maybe<Scalars['String']>;
  image?: Maybe<Scalars['Upload']>;
  active?: Maybe<Scalars['Boolean']>;
};

export type UpdateStageInput = {
  name?: Maybe<Scalars['String']>;
  active?: Maybe<Scalars['Boolean']>;
  tuitionAmount?: Maybe<Scalars['Int']>;
};

export type UpdateTuitionPaymentInput = {
  year?: Maybe<Scalars['String']>;
  paidAmount?: Maybe<Scalars['Int']>;
};

export type UpdateUserInput = {
  name?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  image?: Maybe<Scalars['Upload']>;
  active?: Maybe<Scalars['Boolean']>;
  stageID?: Maybe<Scalars['ID']>;
};


export type User = Node & {
  __typename?: 'User';
  id: Scalars['ID'];
  name: Scalars['String'];
  username: Scalars['String'];
  phone: Scalars['String'];
  image: Scalars['String'];
  role: Role;
  active: Scalars['Boolean'];
  createdAt: Scalars['Time'];
  updatedAt: Scalars['Time'];
  stage?: Maybe<Stage>;
  school?: Maybe<School>;
  messages?: Maybe<MessageConnection>;
  groups?: Maybe<GroupConnection>;
  classes?: Maybe<ClassConnection>;
  assignmentSubmissions?: Maybe<AssignmentSubmissionConnection>;
  payments?: Maybe<TuitionPaymentConnection>;
  courseGrades: Array<CourseGrade>;
};


export type UserMessagesArgs = {
  after?: Maybe<Scalars['Cursor']>;
  first?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  last?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<MessageOrder>;
  where?: Maybe<MessageWhereInput>;
};


export type UserGroupsArgs = {
  after?: Maybe<Scalars['Cursor']>;
  first?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  last?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<GroupOrder>;
  where?: Maybe<GroupWhereInput>;
};


export type UserClassesArgs = {
  stageID?: Maybe<Scalars['ID']>;
  after?: Maybe<Scalars['Cursor']>;
  first?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  last?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<ClassOrder>;
  where?: Maybe<ClassWhereInput>;
};


export type UserAssignmentSubmissionsArgs = {
  after?: Maybe<Scalars['Cursor']>;
  first?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  last?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<AssignmentSubmissionOrder>;
  where?: Maybe<AssignmentSubmissionWhereInput>;
};


export type UserPaymentsArgs = {
  after?: Maybe<Scalars['Cursor']>;
  first?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  last?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<TuitionPaymentOrder>;
  where?: Maybe<TuitionPaymentWhereInput>;
};

export type UserConnection = {
  __typename?: 'UserConnection';
  totalCount: Scalars['Int'];
  pageInfo: PageInfo;
  edges?: Maybe<Array<Maybe<UserEdge>>>;
};

export type UserEdge = {
  __typename?: 'UserEdge';
  node?: Maybe<User>;
  cursor: Scalars['Cursor'];
};

export type UserOrder = {
  field?: Maybe<UserOrderField>;
  direction: OrderDirection;
};

export enum UserOrderField {
  Name = 'NAME',
  Username = 'USERNAME',
  Phone = 'PHONE',
  Role = 'ROLE',
  CreatedAt = 'CREATED_AT',
  UpdatedAt = 'UPDATED_AT'
}

/**
 * UserWhereInput is used for filtering User objects.
 * Input was generated by ent.
 */
export type UserWhereInput = {
  not?: Maybe<UserWhereInput>;
  and?: Maybe<Array<UserWhereInput>>;
  or?: Maybe<Array<UserWhereInput>>;
  /** created_at field predicates */
  createdAt?: Maybe<Scalars['Time']>;
  createdAtNEQ?: Maybe<Scalars['Time']>;
  createdAtIn?: Maybe<Array<Scalars['Time']>>;
  createdAtNotIn?: Maybe<Array<Scalars['Time']>>;
  createdAtGT?: Maybe<Scalars['Time']>;
  createdAtGTE?: Maybe<Scalars['Time']>;
  createdAtLT?: Maybe<Scalars['Time']>;
  createdAtLTE?: Maybe<Scalars['Time']>;
  /** updated_at field predicates */
  updatedAt?: Maybe<Scalars['Time']>;
  updatedAtNEQ?: Maybe<Scalars['Time']>;
  updatedAtIn?: Maybe<Array<Scalars['Time']>>;
  updatedAtNotIn?: Maybe<Array<Scalars['Time']>>;
  updatedAtGT?: Maybe<Scalars['Time']>;
  updatedAtGTE?: Maybe<Scalars['Time']>;
  updatedAtLT?: Maybe<Scalars['Time']>;
  updatedAtLTE?: Maybe<Scalars['Time']>;
  /** name field predicates */
  name?: Maybe<Scalars['String']>;
  nameNEQ?: Maybe<Scalars['String']>;
  nameIn?: Maybe<Array<Scalars['String']>>;
  nameNotIn?: Maybe<Array<Scalars['String']>>;
  nameGT?: Maybe<Scalars['String']>;
  nameGTE?: Maybe<Scalars['String']>;
  nameLT?: Maybe<Scalars['String']>;
  nameLTE?: Maybe<Scalars['String']>;
  nameContains?: Maybe<Scalars['String']>;
  nameHasPrefix?: Maybe<Scalars['String']>;
  nameHasSuffix?: Maybe<Scalars['String']>;
  nameEqualFold?: Maybe<Scalars['String']>;
  nameContainsFold?: Maybe<Scalars['String']>;
  /** username field predicates */
  username?: Maybe<Scalars['String']>;
  usernameNEQ?: Maybe<Scalars['String']>;
  usernameIn?: Maybe<Array<Scalars['String']>>;
  usernameNotIn?: Maybe<Array<Scalars['String']>>;
  usernameGT?: Maybe<Scalars['String']>;
  usernameGTE?: Maybe<Scalars['String']>;
  usernameLT?: Maybe<Scalars['String']>;
  usernameLTE?: Maybe<Scalars['String']>;
  usernameContains?: Maybe<Scalars['String']>;
  usernameHasPrefix?: Maybe<Scalars['String']>;
  usernameHasSuffix?: Maybe<Scalars['String']>;
  usernameEqualFold?: Maybe<Scalars['String']>;
  usernameContainsFold?: Maybe<Scalars['String']>;
  /** phone field predicates */
  phone?: Maybe<Scalars['String']>;
  phoneNEQ?: Maybe<Scalars['String']>;
  phoneIn?: Maybe<Array<Scalars['String']>>;
  phoneNotIn?: Maybe<Array<Scalars['String']>>;
  phoneGT?: Maybe<Scalars['String']>;
  phoneGTE?: Maybe<Scalars['String']>;
  phoneLT?: Maybe<Scalars['String']>;
  phoneLTE?: Maybe<Scalars['String']>;
  phoneContains?: Maybe<Scalars['String']>;
  phoneHasPrefix?: Maybe<Scalars['String']>;
  phoneHasSuffix?: Maybe<Scalars['String']>;
  phoneEqualFold?: Maybe<Scalars['String']>;
  phoneContainsFold?: Maybe<Scalars['String']>;
  /** image field predicates */
  image?: Maybe<Scalars['String']>;
  imageNEQ?: Maybe<Scalars['String']>;
  imageIn?: Maybe<Array<Scalars['String']>>;
  imageNotIn?: Maybe<Array<Scalars['String']>>;
  imageGT?: Maybe<Scalars['String']>;
  imageGTE?: Maybe<Scalars['String']>;
  imageLT?: Maybe<Scalars['String']>;
  imageLTE?: Maybe<Scalars['String']>;
  imageContains?: Maybe<Scalars['String']>;
  imageHasPrefix?: Maybe<Scalars['String']>;
  imageHasSuffix?: Maybe<Scalars['String']>;
  imageIsNil?: Maybe<Scalars['Boolean']>;
  imageNotNil?: Maybe<Scalars['Boolean']>;
  imageEqualFold?: Maybe<Scalars['String']>;
  imageContainsFold?: Maybe<Scalars['String']>;
  /** directory field predicates */
  directory?: Maybe<Scalars['String']>;
  directoryNEQ?: Maybe<Scalars['String']>;
  directoryIn?: Maybe<Array<Scalars['String']>>;
  directoryNotIn?: Maybe<Array<Scalars['String']>>;
  directoryGT?: Maybe<Scalars['String']>;
  directoryGTE?: Maybe<Scalars['String']>;
  directoryLT?: Maybe<Scalars['String']>;
  directoryLTE?: Maybe<Scalars['String']>;
  directoryContains?: Maybe<Scalars['String']>;
  directoryHasPrefix?: Maybe<Scalars['String']>;
  directoryHasSuffix?: Maybe<Scalars['String']>;
  directoryEqualFold?: Maybe<Scalars['String']>;
  directoryContainsFold?: Maybe<Scalars['String']>;
  /** token_version field predicates */
  tokenVersion?: Maybe<Scalars['Int']>;
  tokenVersionNEQ?: Maybe<Scalars['Int']>;
  tokenVersionIn?: Maybe<Array<Scalars['Int']>>;
  tokenVersionNotIn?: Maybe<Array<Scalars['Int']>>;
  tokenVersionGT?: Maybe<Scalars['Int']>;
  tokenVersionGTE?: Maybe<Scalars['Int']>;
  tokenVersionLT?: Maybe<Scalars['Int']>;
  tokenVersionLTE?: Maybe<Scalars['Int']>;
  /** role field predicates */
  role?: Maybe<Role>;
  roleNEQ?: Maybe<Role>;
  roleIn?: Maybe<Array<Role>>;
  roleNotIn?: Maybe<Array<Role>>;
  /** active field predicates */
  active?: Maybe<Scalars['Boolean']>;
  activeNEQ?: Maybe<Scalars['Boolean']>;
  /** deleted_at field predicates */
  deletedAt?: Maybe<Scalars['Time']>;
  deletedAtNEQ?: Maybe<Scalars['Time']>;
  deletedAtIn?: Maybe<Array<Scalars['Time']>>;
  deletedAtNotIn?: Maybe<Array<Scalars['Time']>>;
  deletedAtGT?: Maybe<Scalars['Time']>;
  deletedAtGTE?: Maybe<Scalars['Time']>;
  deletedAtLT?: Maybe<Scalars['Time']>;
  deletedAtLTE?: Maybe<Scalars['Time']>;
  deletedAtIsNil?: Maybe<Scalars['Boolean']>;
  deletedAtNotNil?: Maybe<Scalars['Boolean']>;
  /** id field predicates */
  id?: Maybe<Scalars['ID']>;
  idNEQ?: Maybe<Scalars['ID']>;
  idIn?: Maybe<Array<Scalars['ID']>>;
  idNotIn?: Maybe<Array<Scalars['ID']>>;
  idGT?: Maybe<Scalars['ID']>;
  idGTE?: Maybe<Scalars['ID']>;
  idLT?: Maybe<Scalars['ID']>;
  idLTE?: Maybe<Scalars['ID']>;
  /** stage edge predicates */
  hasStage?: Maybe<Scalars['Boolean']>;
  hasStageWith?: Maybe<Array<StageWhereInput>>;
  /** school edge predicates */
  hasSchool?: Maybe<Scalars['Boolean']>;
  hasSchoolWith?: Maybe<Array<SchoolWhereInput>>;
  /** classes edge predicates */
  hasClasses?: Maybe<Scalars['Boolean']>;
  hasClassesWith?: Maybe<Array<ClassWhereInput>>;
  /** messages edge predicates */
  hasMessages?: Maybe<Scalars['Boolean']>;
  hasMessagesWith?: Maybe<Array<MessageWhereInput>>;
  /** submissions edge predicates */
  hasSubmissions?: Maybe<Scalars['Boolean']>;
  hasSubmissionsWith?: Maybe<Array<AssignmentSubmissionWhereInput>>;
  /** attendances edge predicates */
  hasAttendances?: Maybe<Scalars['Boolean']>;
  hasAttendancesWith?: Maybe<Array<AttendanceWhereInput>>;
  /** payments edge predicates */
  hasPayments?: Maybe<Scalars['Boolean']>;
  hasPaymentsWith?: Maybe<Array<TuitionPaymentWhereInput>>;
  /** grades edge predicates */
  hasGrades?: Maybe<Scalars['Boolean']>;
  hasGradesWith?: Maybe<Array<GradeWhereInput>>;
  /** groups edge predicates */
  hasGroups?: Maybe<Scalars['Boolean']>;
  hasGroupsWith?: Maybe<Array<GroupWhereInput>>;
  /** course_grades edge predicates */
  hasCourseGrades?: Maybe<Scalars['Boolean']>;
  hasCourseGradesWith?: Maybe<Array<CourseGradeWhereInput>>;
};


export type LoginMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', loginUser: { __typename?: 'AuthData', accessToken: string, refreshToken: string } };

export type RefreshTokensMutationVariables = Exact<{
  refreshToken: Scalars['String'];
}>;


export type RefreshTokensMutation = { __typename?: 'Mutation', refreshTokens: { __typename?: 'AuthData', accessToken: string, refreshToken: string } };

export type AssignmentsQueryVariables = Exact<{
  dueDate: Scalars['Time'];
}>;


export type AssignmentsQuery = { __typename?: 'Query', assignments: { __typename?: 'AssignmentConnection', edges?: Maybe<Array<Maybe<{ __typename?: 'AssignmentEdge', node?: Maybe<{ __typename?: 'Assignment', name: string, description?: Maybe<string>, dueDate: any, isExam: boolean, class: { __typename?: 'Class', name: string } }> }>>> } };

export type ClassesQueryVariables = Exact<{ [key: string]: never; }>;


export type ClassesQuery = { __typename?: 'Query', classes: { __typename?: 'ClassConnection', totalCount: number, edges?: Maybe<Array<Maybe<{ __typename?: 'ClassEdge', cursor: any, node?: Maybe<{ __typename?: 'Class', id: string, name: string, active: boolean, createdAt: any, updatedAt: any }> }>>>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean } } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename?: 'User', id: string, name: string, role: Role, school?: Maybe<{ __typename?: 'School', id: string, name: string }>, stage?: Maybe<{ __typename?: 'Stage', id: string, name: string }> } };

export type ScheduleQueryVariables = Exact<{
  weekday?: Maybe<Scalars['Weekday']>;
  stageID?: Maybe<Scalars['ID']>;
}>;


export type ScheduleQuery = { __typename?: 'Query', schedule: Array<{ __typename?: 'Schedule', id: string, duration: any, weekday: any, startsAt: any, class: { __typename?: 'Class', name: string, teacher: { __typename?: 'User', name: string } } }> };

export type StagesQueryVariables = Exact<{ [key: string]: never; }>;


export type StagesQuery = { __typename?: 'Query', stages: { __typename?: 'StageConnection', totalCount: number, edges?: Maybe<Array<Maybe<{ __typename?: 'StageEdge', node?: Maybe<{ __typename?: 'Stage', id: string }> }>>> } };


export const LoginDocument = gql`
    mutation Login($username: String!, $password: String!) {
  loginUser(input: {username: $username, password: $password}) {
    accessToken
    refreshToken
  }
}
    `;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const RefreshTokensDocument = gql`
    mutation RefreshTokens($refreshToken: String!) {
  refreshTokens(token: $refreshToken) {
    accessToken
    refreshToken
  }
}
    `;

export function useRefreshTokensMutation() {
  return Urql.useMutation<RefreshTokensMutation, RefreshTokensMutationVariables>(RefreshTokensDocument);
};
export const AssignmentsDocument = gql`
    query Assignments($dueDate: Time!) {
  assignments(where: {dueDate: $dueDate}) {
    edges {
      node {
        name
        description
        dueDate
        class {
          name
        }
        isExam
      }
    }
  }
}
    `;

export function useAssignmentsQuery(options: Omit<Urql.UseQueryArgs<AssignmentsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<AssignmentsQuery>({ query: AssignmentsDocument, ...options });
};
export const ClassesDocument = gql`
    query Classes {
  classes {
    edges {
      cursor
      node {
        id
        name
        active
        createdAt
        updatedAt
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
    totalCount
  }
}
    `;

export function useClassesQuery(options: Omit<Urql.UseQueryArgs<ClassesQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<ClassesQuery>({ query: ClassesDocument, ...options });
};
export const MeDocument = gql`
    query Me {
  me {
    id
    name
    school {
      id
      name
    }
    stage {
      id
      name
    }
    role
  }
}
    `;

export function useMeQuery(options: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MeQuery>({ query: MeDocument, ...options });
};
export const ScheduleDocument = gql`
    query Schedule($weekday: Weekday, $stageID: ID) {
  schedule(weekday: $weekday, stageID: $stageID) {
    id
    duration
    weekday
    startsAt
    class {
      name
      teacher {
        name
      }
    }
  }
}
    `;

export function useScheduleQuery(options: Omit<Urql.UseQueryArgs<ScheduleQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<ScheduleQuery>({ query: ScheduleDocument, ...options });
};
export const StagesDocument = gql`
    query Stages {
  stages {
    totalCount
    edges {
      node {
        id
      }
    }
  }
}
    `;

export function useStagesQuery(options: Omit<Urql.UseQueryArgs<StagesQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<StagesQuery>({ query: StagesDocument, ...options });
};