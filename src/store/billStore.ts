import { create } from "zustand";
import {
  createBill,
  deleteBill,
  getAllBills,
  getDueSoonBills,
  markBillPaid,
} from "../database/bills";
import { Bill } from "../types";
import {
  cancelBillReminder,
  scheduleBillReminder,
} from "../utils/notifications";

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

  addBill: async (bill) => {
    const created = createBill(bill);
    await scheduleBillReminder(created);
    set({
      bills: getAllBills(),
      dueSoonBills: getDueSoonBills(7),
    });
  },

  payBill: async (id) => {
    await cancelBillReminder(id);
    markBillPaid(id);
    const updatedBills = getAllBills();
    const paid = updatedBills.find((b) => b.id === id);
    if (paid) await scheduleBillReminder(paid);
    set({
      bills: updatedBills,
      dueSoonBills: getDueSoonBills(7),
    });
  },

  removeBill: async (id) => {
    await cancelBillReminder(id);
    deleteBill(id);
    set({
      bills: getAllBills(),
      dueSoonBills: getDueSoonBills(7),
    });
  },
}));
