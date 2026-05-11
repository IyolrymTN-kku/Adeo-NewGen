export type ContactState = {
  status: "idle" | "success" | "error";
  message: string | null;
  fieldErrors?: Partial<Record<
    "name" | "email" | "company" | "phone" | "message",
    string[]
  >>;
};

export const initialContactState: ContactState = {
  status: "idle",
  message: null,
};