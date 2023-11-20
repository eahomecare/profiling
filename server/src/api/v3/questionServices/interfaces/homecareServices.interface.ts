export interface SubService {
  id: number;
  title: string;
  description: string;
}

export interface Service {
  serviceId: number;
  serviceTitle: string;
  subServices: SubService[];
}
