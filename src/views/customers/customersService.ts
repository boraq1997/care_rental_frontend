import api from '../../api/api';
import type { AxiosResponse } from "axios";

// ==============================
// أنواع البيانات (Interfaces)
// ==============================
export interface CustomerContact {
  email: string | null;
  phone1: string | null;
  phone2: string | null;
  address: string | null;
}

export interface Customer {
  customer_id: number;
  fullname: string;
  national_id: string | null;
  birthday: string | null;
  license_number: string | null;
  vip_level: "gold" | "silver" | "bronze";
  contact: CustomerContact | null;
  created_at?: string;
}

export interface CreateOrUpdateCustomerPayload {
  fullname: string;
  national_id?: string | null;
  birthday?: string | null;
  license_number?: string | null;
  vip_level: string;

  email?: string | null;
  phone1?: string | null;
  phone2?: string | null;
  address?: string | null;
}

// ==============================
// Service
// ==============================
class CustomerService {
  /**
   * 1. جلب جميع الزبائن
   */
  async getAll(): Promise<Customer[]> {
    const response: AxiosResponse<Customer[]> = await api.get("/customers");
    return response.data;
  }

  /**
   * 2. جلب زبون واحد
   */
  async getById(customerId: number): Promise<Customer> {
    const response: AxiosResponse<Customer> = await api.get(
      `/customers/${customerId}`
    );
    return response.data;
  }

  async getCustomerRentals(ceustomerId: number): Promise<Customer> {
    const response: AxiosResponse<Customer> = await api.get(`rentals/customer/${ceustomerId}`);
    return response.data;
  }

  /**
   * 3. إنشاء زبون جديد
   */
  async create(payload: CreateOrUpdateCustomerPayload): Promise<Customer> {
    const response: AxiosResponse<{ data: Customer }> = await api.post(
      "/customers",
      payload
    );
    return response.data.data;
  }

  /**
   * 4. تعديل بيانات الزبون
   */
  async update(
    customerId: number,
    payload: CreateOrUpdateCustomerPayload
  ): Promise<Customer> {
    const response: AxiosResponse<{ data: Customer }> = await api.put(
      `/customers/${customerId}`,
      payload
    );
    return response.data.data;
  }

  /**
   * 5. حذف زبون
   */
  async delete(customerId: number): Promise<void> {
    await api.delete(`/customers/${customerId}`);
  }
}

export default new CustomerService();