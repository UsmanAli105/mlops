export interface DocumentData {
  branchCode: string;
  address: string;
  city: string;
  model: string;
  region: string;
  customerRequest: string;
  problemDescription: string;
  actionTaken: string;
  faultyPartHandedOver: string;
  handedOverTo: string;
  nameOfBranchPerson: string;
  branchPersonDesignation: string;
  bankName: string;
  branchLocation: string;
}

export interface ProcessingStage {
  name: string;
  description: string;
  completed: boolean;
  loading: boolean;
}

export interface UploadState {
  uploading: boolean;
  processing: boolean;
  completed: boolean;
  error: string | null;
  data: DocumentData | null;
}
