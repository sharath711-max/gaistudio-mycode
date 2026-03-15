export interface Customer {
  id: number;
  name: string;
  phone: string;
  balance: number;
  gold_weight_balance: number;
  silver_weight_balance: number;
  notes: string;
  created_at: string;
}

export interface GoldTest {
  id: number;
  test_number?: string;
  customer_id: number;
  customer_name: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  item_count: number;
  total_weight: number;
  created_at: string;
  updated_at: string;
  items?: GoldTestItem[];
}

export interface GoldTestItem {
  id: number;
  test_id: number;
  name: string;
  gross_weight: number;
  test_weight: number;
  net_weight: number;
  purity: number;
  fine_weight: number;
  remarks?: string;
  returned: boolean;
}

export interface Stats {
  customerCount: number;
  goldTestCount: number;
  silverTestCount: number;
  pendingGold: number;
  pendingSilver: number;
}

export interface AuditLog {
  id: number;
  user_id: number;
  user_name: string;
  action: string;
  entity: string;
  entity_id: number;
  old_value: string;
  new_value: string;
  timestamp: string;
}
