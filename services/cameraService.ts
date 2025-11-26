/**
 * SERVICE LAYER: SUPABASE REALTIME
 * 
 * We use the Supabase JS client to listen to Postgres changes.
 * The ESP32 updates row id=1 via REST API.
 * The Frontend receives the 'UPDATE' event via WebSocket.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { CloudData, SupabaseCredentials } from '../types';

let supabase: SupabaseClient | null = null;
let subscription: any = null;

/**
 * Initializes the Supabase client and checks connection
 */
export const checkConnection = async (creds: SupabaseCredentials): Promise<boolean> => {
  try {
    supabase = createClient(creds.url, creds.key);
    
    // Simple query to verify credentials and table existence
    const { data, error } = await supabase
      .from('camera_stream')
      .select('id')
      .eq('id', 1)
      .single();
      
    if (error) throw error;
    return true;
  } catch (e) {
    console.error("Supabase connection check failed:", e);
    return false;
  }
};

/**
 * Subscribes to Realtime changes on the 'camera_stream' table.
 */
export const subscribeToStream = (
  creds: SupabaseCredentials, 
  onData: (data: CloudData) => void,
  onError: (err: any) => void
) => {
  if (!supabase) {
    supabase = createClient(creds.url, creds.key);
  }

  // Clean up previous subscription
  if (subscription) {
    supabase.removeChannel(subscription);
  }

  // Subscribe to UPDATE events on row with id=1
  const channel = supabase.channel('esp32-stream')
    .on(
      'postgres_changes',
      { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'camera_stream', 
        filter: 'id=eq.1' 
      },
      (payload) => {
        // payload.new contains the updated row
        const newData = payload.new as any;
        // Map database columns to our CloudData type
        onData({
          photo: newData.photo,
          sensor: newData.sensor
        });
      }
    )
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log("Connected to Supabase Realtime");
      }
      if (status === 'CHANNEL_ERROR') {
        onError("Failed to connect to Realtime channel");
      }
    });

  subscription = channel;

  return () => {
    if (supabase && subscription) {
      supabase.removeChannel(subscription);
    }
  };
};
