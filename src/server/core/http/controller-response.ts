export type ControllerResponse<T = unknown> = {
  status: number;
  body: T;
};
