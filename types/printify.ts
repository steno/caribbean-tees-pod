// Printify API Types

export interface PrintifyProduct {
  id: string
  title: string
  description: string
  tags: string[]
  options: PrintifyOption[]
  variants: PrintifyVariant[]
  images: PrintifyImage[]
  created_at: string
  updated_at: string
  visible: boolean
  is_locked: boolean
  blueprint_id: number
  user_id: number
  shop_id: number
  print_provider_id: number
  print_areas: PrintifyPrintArea[]
  sales_channel_properties: any[]
}

export interface PrintifyOption {
  name: string
  type: string
  values: PrintifyOptionValue[]
}

export interface PrintifyOptionValue {
  id: number
  title: string
  colors?: string[]
}

export interface PrintifyVariant {
  id: number
  sku: string
  cost: number
  price: number
  title: string
  grams: number
  is_enabled: boolean
  is_default: boolean
  is_available: boolean
  options: number[]
}

export interface PrintifyImage {
  src: string
  variant_ids: number[]
  position: string
  is_default: boolean
  is_selected_for_publishing?: boolean
}

export interface PrintifyPrintArea {
  variant_ids: number[]
  placeholders: PrintifyPlaceholder[]
  background?: string
}

export interface PrintifyPlaceholder {
  position: string
  images: PrintifyPlaceholderImage[]
}

export interface PrintifyPlaceholderImage {
  id: string
  name: string
  type: string
  height: number
  width: number
  x: number
  y: number
  scale: number
  angle: number
}

// Order Creation Types
export interface PrintifyOrderRequest {
  external_id: string
  label?: string
  line_items: PrintifyLineItem[]
  shipping_method: number
  send_shipping_notification: boolean
  address_to: PrintifyAddress
}

export interface PrintifyLineItem {
  product_id: string
  variant_id: number
  quantity: number
}

export interface PrintifyAddress {
  first_name: string
  last_name: string
  email: string
  phone: string
  country: string
  region: string
  address1: string
  address2?: string
  city: string
  zip: string
}

export interface PrintifyOrderResponse {
  id: string
  address_to: PrintifyAddress
  line_items: PrintifyOrderLineItem[]
  metadata: {
    order_type: string
    shop_order_id: string
    shop_order_label: string
    shop_fulfilled_at: string
  }
  total_price: number
  total_shipping: number
  total_tax: number
  status: string
  shipping_method: number
  shipments: any[]
  created_at: string
  sent_to_production_at: string | null
  fulfilled_at: string | null
}

export interface PrintifyOrderLineItem {
  product_id: string
  quantity: number
  variant_id: number
  print_provider_id: number
  cost: number
  shipping_cost: number
  status: string
  metadata: {
    title: string
    price: number
    variant_label: string
    sku: string
    country: string
  }
  sent_to_production_at: string | null
  fulfilled_at: string | null
}

