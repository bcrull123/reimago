export type DomainState = "available" | "taken" | "premium" | "unknown";

export type DomainOffer = {
  domain: string;
  state: DomainState;
};

export type DomainCheck = {
  offers: DomainOffer[];
  sample: boolean;
  note: string;
};
