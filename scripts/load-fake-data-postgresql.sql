DO $$
BEGIN
  FOR i IN 1..1000 LOOP
    INSERT INTO "public"."admin_scaffolds" (
      "id", 
      "integer_type", 
      "smallint_type", 
      "bigint_type", 
      "serial_type", 
      "bigserial_type", 
      "boolean_type", 
      "text_type", 
      "varchar_type", 
      "char_type", 
      "numeric_type", 
      "decimal_type", 
      "real_type", 
      "double_precision_type", 
      "json_type", 
      "jsonb_type", 
      "time_type", 
      "timestamp_type", 
      "date_type", 
      "file_type", 
      "created_at", 
      "updated_at"
    ) 
    VALUES (
      gen_random_uuid(), -- Random UUID
      1, 
      2, 
      3, 
      4, 
      5, 
      't', 
      'foobar', 
      'b', 
      'c                                                                                                                                                                                                                                                              ', 
      6, 
      7, 
      8, 
      9, 
      '{}', 
      '{}', 
      '08:08:00', 
      '2008-01-01 00:00:00', 
      '2024-08-08', 
      NULL, 
      CURRENT_TIMESTAMP, 
      CURRENT_TIMESTAMP
    );
  END LOOP;
END $$;
