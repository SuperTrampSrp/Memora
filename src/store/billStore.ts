import { create } from "zustand";
import {
    createBill,
    deleteBill,
    getAllBills,
    getDueSoonBills,
    markBillPaid,
} from "../database/bills";
import { Bill } from "../types";

interface BillStore {
  bills: Bill[];
  dueSoonBills: Bill[];
  loadBills: () => void;
  addBill: (bill: Omit<Bill, "id" | "paid" | "createdAt">) => void;
  payBill: (id: string) => void;
  removeBill: (id: string) => void;
}

export const useBillStore = create<BillStore>((set) => ({
  bills: [],
  dueSoonBills: [],

  loadBills: () => {
    set({
      bills: getAllBills(),
      dueSoonBills: getDueSoonBills(7),
    });
  },

  addBill: (bill) => {
    createBill(bill);
    set({
      bills: getAllBills(),
      dueSoonBills: getDueSoonBills(7),
    });
  },

  payBill: (id) => {
    markBillPaid(id);
    set({
      bills: getAllBills(),
      dueSoonBills: getDueSoonBills(7),
    });
  },

  removeBill: (id) => {
    deleteBill(id);
    set({
      bills: getAllBills(),
      dueSoonBills: getDueSoonBills(7),
    });
  },
}));
