export type ServiceFormState = {
  status: "idle" | "success" | "error";
  message: string | null;
  fieldErrors?: Partial<
    Record<
      | "title"
      | "slug"
      | "shortDescription"
      | "description"
      | "category"
      | "features"
      | "sortOrder"
      | "icon",
      string[]
    >
  >;
};

export const initialServiceState: ServiceFormState = {
  status: "idle",
  message: null,
};
