import api from '../../api/api';

// 🧩 تعريف النوع Branch داخل نفس الملف
export interface Branch {
  branch_id: number;
  name: string;
  address?: string;
  phone1?: string;
  phone2?: string;
  manager_id?: {
    user_id: number;
    fullname: string;
    phone1: string;
    phone2: string;
    email: string;
    address: string;
  } | null;
  google_map_location?: string;
  is_active: boolean;
}

// 🧠 النوع المستخدم عند الإنشاء أو التحديث
export type BranchPayload = Omit<Branch, "branch_id" | "created_at" | "updated_at" | "manager">;

const branchService = {
  // جلب جميع الفروع
  async getAll(): Promise<Branch[]> {
    const { data } = await api.get("/branches");
    return data;
  },

  // جلب فرع محدد
  async getById(id: number): Promise<Branch> {
    const { data } = await api.get(`/branches/${id}`);
    return data;
  },

  // إنشاء فرع جديد
  async create(payload: BranchPayload): Promise<Branch> {
    const { data } = await api.post("/branches", payload);
    return data;
  },

  // تحديث فرع موجود
  async update(id: number, payload: Partial<BranchPayload>): Promise<Branch> {
    const { data } = await api.put(`/branches/${id}`, payload);
    return data;
  },

  // حذف فرع
  async delete(id: number): Promise<void> {
    await api.delete(`/branches/${id}`);
  },
};

export default branchService;