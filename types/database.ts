export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          printify_product_id: string
          title: string
          description: string | null
          main_image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          printify_product_id: string
          title: string
          description?: string | null
          main_image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          printify_product_id?: string
          title?: string
          description?: string | null
          main_image_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      product_variants: {
        Row: {
          id: string
          product_id: string
          printify_variant_id: number
          title: string
          price: number
          is_available: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          printify_variant_id: number
          title: string
          price: number
          is_available?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          printify_variant_id?: number
          title?: string
          price?: number
          is_available?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          stripe_session_id: string
          stripe_payment_intent_id: string | null
          printify_order_id: string | null
          customer_email: string
          customer_name: string | null
          shipping_address: Json
          total_amount: number
          status: string
          line_items: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          stripe_session_id: string
          stripe_payment_intent_id?: string | null
          printify_order_id?: string | null
          customer_email: string
          customer_name?: string | null
          shipping_address: Json
          total_amount: number
          status?: string
          line_items: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          stripe_session_id?: string
          stripe_payment_intent_id?: string | null
          printify_order_id?: string | null
          customer_email?: string
          customer_name?: string | null
          shipping_address?: Json
          total_amount?: number
          status?: string
          line_items?: Json
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

