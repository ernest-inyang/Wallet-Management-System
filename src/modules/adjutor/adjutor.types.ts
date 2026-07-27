export interface KarmaVerificationResponse {
    status: string;
    message: string;
    data: KarmaRecord | null;
    meta: {
      cost: number;
      balance: number;
    };
  }
  
  export interface KarmaRecord {
    karma_identity: string;
    amount_in_contention: string;
    reason: string | null;
    default_date: string;
    karma_type: {
      karma: string;
    };
    karma_identity_type: {
      identity_type: string;
    };
    reporting_entity: {
      name: string;
      email: string;
    };
  }