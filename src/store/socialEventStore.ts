import { create } from "zustand";
import {
    createSocialEvent,
    deleteSocialEvent,
    getAllSocialEvents,
    getUpcomingSocialEvents,
} from "../database/socialEvents";
import { SocialEvent } from "../types";

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

  addEvent: (event) => {
    createSocialEvent(event);
    set({
      events: getAllSocialEvents(),
      upcomingEvents: getUpcomingSocialEvents(30) as (SocialEvent & {
        daysUntil: number;
      })[],
    });
  },

  removeEvent: (id) => {
    deleteSocialEvent(id);
    set({
      events: getAllSocialEvents(),
      upcomingEvents: getUpcomingSocialEvents(30) as (SocialEvent & {
        daysUntil: number;
      })[],
    });
  },
}));
