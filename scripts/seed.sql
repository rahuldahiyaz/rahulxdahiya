-- Create initial data for RAKE_ORDER_PRIORITY
INSERT INTO rake_order_priority (priority, description) VALUES
(1, 'Critical - Immediate attention required'),
(2, 'High - Process within 24 hours'),
(3, 'Medium - Process within 48 hours'),
(4, 'Low - Process within a week');

-- Create sample destinations and mills for RAKE_ORD
INSERT INTO rake_ord (orderNumber, destination, materialCode, party, mill) VALUES
('SAMPLE001', 'Mumbai', 'MAT001', 'Party A', 'Mill 1'),
('SAMPLE002', 'Delhi', 'MAT002', 'Party B', 'Mill 2'),
('SAMPLE003', 'Bangalore', 'MAT003', 'Party C', 'Mill 3');

-- Create admin user (password: admin123)
INSERT INTO users (id, email, password, role, firstName, lastName, department, designation) VALUES
('admin001', 'admin@company.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9u2', 'ADMIN', 'Admin', 'User', 'IT', 'System Administrator');
