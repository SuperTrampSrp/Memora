import { create } from "zustand";
import {
  createSocialEvent,
  deleteSocialEvent,
  getAllSocialEvents,
  getUpcomingSocialEvents,
} from "../database/socialEvents";
import { SocialEvent } from "../types";
import {
  cancelSocialEventReminder,
  scheduleSocialEventReminder,
} from "../utils/notifications";

interface SocialEventStore {
  events: SocialEvent[];
  upcomingEvents: (SocialEvent & { daysUntil: number })[];
  loadEvents: () => void;
  addEvent: (event: Omit<SocialEvent, "id" | "createdAt">) => void;
  removeEvent: (id: string) => void;
}

export const useSocialEventStore = create<SocialEventStore>((set) => ({
  events: [],
  upcomingEvents: [],

  loadEvents: () => {
    set({
      events: getAllSocialEvents(),
      upcomingEvents: getUpcomingSocialEvents(30) as (SocialEvent & {
        daysUntil: number;
      })[],
    });
  },

  addEvent: async (event) => {
    const created = createSocialEvent(event);
    await scheduleSocialEventReminder(created);
    set({
      events: getAllSocialEvents(),
      upcomingEvents: getUpcomingSocialEvents(30) as (SocialEvent & {
        daysUntil: number;
      })[],
    });
  },

  removeEvent: async (id) => {
    await cancelSocialEventReminder(id);
    deleteSocialEvent(id);
    set({
      events: getAllSocialEvents(),
      upcomingEvents: getUpcomingSocialEvents(30) as (SocialEvent & {
        daysUntil: number;
      })[],
    });
  },
}));
