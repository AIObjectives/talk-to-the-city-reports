import type { Writable } from 'svelte/store';

export interface Log {
  title: string;
  detail: string;
  type: 'success' | 'error' | 'info';
}

export interface BaseData {
  processing?: boolean;
  label: string;
  dirty: boolean;
  compute_type: string;
  input_ids: { [key: string]: string | object[] };
  output_ids?: { [key: string]: string | object[] };
  category: string;
  icon: string;
  output?: any;
  show_in_ui: boolean;
  show_to_anon?: boolean;
  show_settings_in_standard_view?: boolean;
  message: string;
  enable?: boolean;
  log?: Log[];
  state?: Writable<any>;
}

export interface DGEdgeInterface {
  id: string;
  source: string;
  selected: boolean;
  target: string;
}

export interface GCSData {
  filename: string;
  size_kb: number;
  gcs_path: string;
  save_to_gcs?: boolean;
}

export interface DGNodeInterface<T extends BaseData = BaseData> {
  id: string;
  position: {
    x: number;
    y: number;
  };
  type: string;
  data: T;
  zIndex?: number;
  dragging?: boolean;
  dragHandle?: boolean;
  isConnectable?: boolean;
  type?: string;
  xPos?: number;
  yPos?: number;
  positionAbsolute?: boolean;
  width?: number;
  height?: number;
  selected?: boolean;
  sourcePosition?: string;
  targetPosition?: string;
}

export type GCSBaseData = BaseData & GCSData;
