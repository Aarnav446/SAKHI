# ESP32-CAM Supabase Controller

## Quick Start

1.  **Install Dependencies**
    ```bash
    npm install
    npm install @supabase/supabase-js
    ```

2.  **Supabase Setup**
    *   Create a project at [supabase.com](https://supabase.com).
    *   Go to **SQL Editor** and run:
        ```sql
        create table camera_stream (
          id int primary key,
          photo text,
          sensor jsonb,
          updated_at timestamptz default now()
        );
        insert into camera_stream (id, photo, sensor) values (1, '', '{}');
        alter publication supabase_realtime add table camera_stream;
        ```
    *   Get your **Project URL** and **Anon Key** from Project Settings > API.

3.  **Run Development Server**
    ```bash
    npm run dev
    ```

4.  **Flash ESP32**
    *   Use the provided Arduino code.
    *   Update `supabase_url` and `supabase_key` in the C++ code.
    *   The ESP32 must have internet access (via Hotspot or Router).

## Troubleshooting

*   **No Image**:
    *   Verify the table name is `camera_stream`.
    *   Ensure Realtime is enabled (`alter publication...`).
    *   If images are too large (HD/SVGA), Supabase Realtime might drop the message. Use QVGA (320x240).
*   **Connection Failed**:
    *   Check if your Anon Key is correct.
    *   Check browser console for 401/404 errors.
