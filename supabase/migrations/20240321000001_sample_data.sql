-- Insert sample rooms
INSERT INTO rooms (number, type, max_occupancy) VALUES
  ('101', 'single', 1),
  ('102', 'double', 2),
  ('103', 'triple', 3);

-- Insert sample maintenance requests
INSERT INTO maintenance_requests (room_number, type, description, priority) VALUES
  ('101', 'repair', 'Broken light fixture', 'medium'),
  ('102', 'cleaning', 'Regular cleaning required', 'low'); 