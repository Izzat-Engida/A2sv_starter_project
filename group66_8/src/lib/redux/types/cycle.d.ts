export interface Cycle {
  id: number;
  name: string;
  start_date: string;
  created_at: string;
  is_active: string;
}
export interface CreateCyclePayload {
  name: string;
  start_date: string;
  end_date: string;
}
