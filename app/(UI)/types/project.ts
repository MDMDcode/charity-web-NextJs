export interface Share {
  title: string;
  price: number;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  image_url: string;
  pricing: {
    is_open_price: boolean;
    default_price: string;
    has_shares: boolean;
    shares: Share[];
    min_price: number | null;
    suggested_amount: number | null;
  };
  target: {
    has_target: boolean;
    goal_amount: string;
    collected_amount: string;
    percentage: number;
  };
}   