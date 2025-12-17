import api from '../../api/api';

// 🧩 تعريف نوع الإيجار Rental
export interface Rental {
  rental_id: number;
  vehicle: {
    vehicle_id: number;
    plate_number: string;
    brand: string;
    model: string;
  };
  customer: {
    customer_id: number;
    fullname: string;
    phone1?: string;
  };
  start_date: string;
  end_date?: string;
  rental_type: 'hours' | 'kilometers';
  limit_value?: number;
  price_per_unit: number;
  total_price?: number;
  fuel_start?: number;
  fuel_end?: number;
  odometer_start?: number;
  odometer_end?: number;
  status: 'active' | 'completed' | 'canceled';
  created_by?: {
    user_id: number;
    fullname: string;
  } | null;
  created_at: string;
  updated_at: string;
}

// 🧠 نوع البيانات المرسلة عند إنشاء الإيجار
export type RentalPayload = {
  vehicle_id: number;
  customer_id: number;
  start_date: string | null;
  end_date: string | null;
  rental_type: 'hours' | 'kilometers';
  limit_value?: number | null;
  price_per_unit: number;
  fuel_start?: number | null;
  odometer_start?: number | null;
  created_by?: number | null;
};

// 🧠 نوع البيانات المرسلة عند إنهاء الإيجار
export type RentalUpdatePayload = {
  fuel_end?: number | null;
  odometer_end?: number | null;
  total_price?: number | null;
};

// 🧩 فلترة الإيجارات
export interface RentalFilters {
  status?: 'active' | 'completed' | 'canceled';
  branch_id?: number;
  customer_id?: number;
  start_date?: string;
  end_date?: string;
}

// 🧩 فلترة حسب الفرع (بدون pagination)
export interface BranchRentalFilters {
  status?: 'active' | 'completed' | 'canceled';
  customer_id?: number;
  start_date?: string;
  end_date?: string;
}

const rentalService = {
  // 🔹 جلب جميع الإيجارات مع إمكانية الفلترة
  async getAll(filters: RentalFilters = {}): Promise<Rental[]> {
    const { data } = await api.get('/rentals', { params: filters });
    return data.data;
  },

  // 🔹 جلب إيجار واحد
  async getById(id: number): Promise<Rental> {
    const { data } = await api.get(`/rentals/${id}`);
    return data.data;
  },

  // 🔹 إنشاء إيجار جديد
  async create(payload: RentalPayload): Promise<Rental> {
    const { data } = await api.post('/rentals', payload);
    return data.data;
  },

  // 🔹 تعديل بيانات الإيجار
  async update(id: number, payload: Partial<RentalPayload>): Promise<Rental> {
    const { data } = await api.put(`/rentals/${id}`, payload);
    return data.data;
  },

  // 🔹 إنهاء الإيجار (complete)
  async complete(id: number, payload: RentalUpdatePayload): Promise<Rental> {
    const { data } = await api.patch(`/rentals/${id}/complete`, payload);
    return data.data;
  },

  // 🔹 إلغاء الإيجار (cancel)
  async cancel(id: number, reason?: string): Promise<Rental> {
    const { data } = await api.delete(`/rentals/${id}/cancel`, {
      data: { reason },
    });
    return data.data;
  },

  // 🔹 جلب الإيجارات حسب الفرع (بدون pagination)
  async getByBranch(branchId: number, filters: BranchRentalFilters = {}): Promise<Rental[]> {
    const { data } = await api.get(`/rentals/branch/${branchId}`, { params: filters });
    return data.data;
  },
};

export default rentalService;