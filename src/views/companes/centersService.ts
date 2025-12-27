import api from '../../api/api';

/**
 * =============================
 * Contact Info
 * =============================
 */
export interface ContactInfo {
  phone?: string;
  email?: string;
  address?: string;
  whatsapp?: string;
}

/**
 * =============================
 * Branch
 * =============================
 */
export interface Branch {
  id: number;
  name: string;
  address?: string;
  phone?: string;
}

/**
 * =============================
 * Center
 * =============================
 */
export interface Center {
  center_id: number;
  name: string;
  description?: string;
  contact_info?: ContactInfo;
  website_url?: string;
  logo_path?: string;
  is_active: boolean;
  branches?: Branch[];
  created_at?: string;
  updated_at?: string;
}

/**
 * =============================
 * Center Form (Create / Update)
 * =============================
 */
export interface CenterForm {
  name: string;
  description?: string;
  contact_info: ContactInfo;
  website_url?: string;
  logo_path?: string | null;
  is_active: boolean;
}

/**
 * =============================
 * Center Service
 * =============================
 */

const centerService = {
  /**
   * Get all centers with branches
   */
  async getAll(): Promise<Center[]> {
    const { data } = await api.get("/centers");
    return data.data ?? data;
  },

  /**
   * Get single center by ID
   */
  async getById(id: number): Promise<Center> {
    const { data } = await api.get(`/centers/${id}`);
    return data.data ?? data;
  },

  /**
   * Create new center
   */
  async create(payload: CenterForm): Promise<Center> {
    const { data } = await api.post("/centers", payload);
    return data.data ?? data;
  },

  /**
   * Update center
   */
  async update(id: number, payload: CenterForm): Promise<Center> {
    const { data } = await api.put(`/centers/${id}`, payload);
    return data.data ?? data;
  },

  /**
   * Delete center
   */
  async delete(id: number): Promise<void> {
    await api.delete(`/centers/${id}`);
  },
};

export default centerService;