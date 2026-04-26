export type PartnerFormState = {
  status: "idle" | "success" | "error";
  message: string | null;
  fieldErrors?: Partial<
    Record<
      "name" | "websiteUrl" | "category" | "sortOrder" | "logo",
      string[]
    >
  >;
};

export const initialPartnerState: PartnerFormState = {
  status: "idle",
  message: null,
};
