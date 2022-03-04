export interface IAnnouncementType {
  id: string;
  startDate: string;
  endDate: string;
  content: string;
}

export type QsParamType = string | (string | null)[] | null;
