import api from '../../api/api';

// =============================
// 🧩 أنواع البيانات (Interfaces)
// =============================
export interface UserGeneral {
  id: number;
  fullname: string;
  role: string;
  branch_id: number;
  is_active: boolean;
  contact: {
    email: string;
    phone1: string;
    phone2?: string;
  };
  login: {
    username: string;
    is_active: boolean;
  };
  branch?: {
    id: number;
    name: string;
  };
}

export interface CreateUserPayload {
  fullname: string;
  role: string;
  branch_id: number;
  username: string;
  password: string;
  password_confirmation: string,
  email: string;
  phone1: string;
  phone2?: string;
}

export interface UpdateUserPayload extends Partial<CreateUserPayload> {
  is_active?: boolean;
}

// =============================
// 🧠 خدمة إدارة المستخدمين (API)
// =============================
const UsersService = {
  async getAll(): Promise<UserGeneral[]> {
    const response = await api.get('/users');
    return response.data.data;
  },

  async getById(id: number): Promise<UserGeneral> {
    const response = await api.get(`/users/${id}`);
    return response.data.data;
  },

  async getByBranchId(branchId: number): Promise<UserGeneral> {
    const response = await api.get(`/users/branch/${branchId}`);
    return response.data;
  },

  async create(payload: CreateUserPayload): Promise<UserGeneral> {
    const response = await api.post('/users', payload);
    return response.data.data;
  },

  async update(id: number, payload: UpdateUserPayload): Promise<UserGeneral> {
    const response = await api.put(`/users/${id}`, payload);
    return response.data.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/users/${id}`);
  },
};

export default UsersService;

// =============================
// 🧾 نموذج المستخدم (Form Model)
// =============================
