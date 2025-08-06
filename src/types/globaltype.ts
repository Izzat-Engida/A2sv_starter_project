export type User={
    full_name:string,
    email:string,
    password:string,
    role:string 
}
export type Applications={
  success:boolean,
  data:{reviews:Reviews[],
  total_count:number,
  page:number,
  limit:number,
}
  ,
   message:string,
}
export type Reviews={
  id:string,
  applicant_name:string,
  status:string,
  assigned_reviewer_name:string|null,
}
export type Applicantion={
  success: boolean,
  data: {
    id: string,
    status: string,
    school: string,
    degree: string,
    leetcode_handle: string,
    codeforces_handle: string,
    essay_why_a2sv: string,
    essay_about_you: string,
    resume_url: string,
    submitted_at:string,
    updated_at: string
  },
  message:string

}
export type HorizontalBar={
  in_progress:number,
  accepted:number,
  interview:number,
  applied:number,
}