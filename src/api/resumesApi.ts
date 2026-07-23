import { apiClient } from "./client";

export type CreateResumeResponse = {
  resumeId: string;
};

export type SubmitResumeResponse = {
  resumeId: string;
  status: "DRAFT" | "PUBLISHED";
};

export type GetResumesResponseItem = {
  id: string;
  candidateName: string;
  jobTitle: string;
  status: "Draft" | "Published";
  likesCount: number;
  updatedAt: string;
};

export const resumesApi = {
  createDraftResume: (payload: {
    resumeIdFromUpload: string;
    candidateName: string;
    jobTitle: string;
  }) =>
    apiClient.get<CreateResumeResponse>(
      `/resumes/upload-create?resumeIdFromUpload=${encodeURIComponent(
        payload.resumeIdFromUpload,
      )}&candidateName=${encodeURIComponent(payload.candidateName)}&jobTitle=${encodeURIComponent(payload.jobTitle)}`,
    ),

  submitResume: (resumeId: string) =>
    apiClient.get<SubmitResumeResponse>(
      `/resumes/${encodeURIComponent(resumeId)}/submit`,
    ),

  getResumes: () => apiClient.get<GetResumesResponseItem[]>(`/resumes`),
};
