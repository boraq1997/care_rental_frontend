import api from '../../api/api';

// 🧩 تعريف نوع السيارة
export interface Vehicle {
  vehicle_id: number;
  plate_number: string;
  brand: string;
  model: string;
  year: number;
  color?: string;
  current_odometer?: number;
  fule_level: 'full' | 'half' | 'quarter' | 'almostـempty';
  owner_type: 'branche' | 'otherOwner';
  owner?: {
    user_id: number;
    fullname: string;
  } | null;
  branch?: {
    branch_id: number;
    name: string;
  } | null;
  details?: {
    chassis_number?: string;
    insurance_number?: string;
    insurance_expiry?: string;
    inspection_expiry?: string;
    notes?: string;
  } | null;
  status: 'available' | 'rented' | 'maintenance';
  created_at?: string;
  updated_at?: string;
}

// 🧠 النوع المستخدم عند الإنشاء أو التحديث
export type VehiclePayload = Omit<
  Vehicle,
  'vehicle_id' | 'created_at' | 'updated_at' | 'owner' | 'branch' | 'details'
>;

const vehicleService = {
  // جلب جميع السيارات
  async getAll(): Promise<Vehicle[]> {
    const { data } = await api.get('/vehicles');
    return data;
  },

  // جلب سيارة محددة
  async getById(id: number): Promise<Vehicle> {
    const { data } = await api.get(`/vehicles/${id}`);
    return data;
  },

  // جلب السيارات حسب نوع المالك و ID
  async getByOwner(ownerType: 'branche' | 'otherOwner', ownerId: number): Promise<Vehicle[]> {
    const { data } = await api.get(`/vehicles/owner/${ownerType}/${ownerId}`);
    return data;
  },

  // إنشاء سيارة جديدة
  async create(payload: VehiclePayload): Promise<Vehicle> {
    const { data } = await api.post('/vehicles', payload);
    return data;
  },

  // تحديث سيارة موجودة
  async update(id: number, payload: Partial<VehiclePayload>): Promise<Vehicle> {
    const { data } = await api.put(`/vehicles/${id}`, payload);
    return data;
  },

  // حذف سيارة
  async delete(id: number): Promise<void> {
    await api.delete(`/vehicles/${id}`);
  },

  async getVehicleLog(id: number): Promise<void> {
    const {data} =  await api.get(`/vehicle-logs/vehicle/${id}`);
    return data;
  }
};

export default vehicleService;