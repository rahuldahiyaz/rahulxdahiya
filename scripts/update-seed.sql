-- Update existing RAKE_ORD table with new destinations and mills
DELETE FROM rake_ord;

-- Insert new destinations (steel companies)
INSERT INTO rake_ord (orderNumber, destination, materialCode, party, mill) VALUES
('SAMPLE001', 'Tata Steel', 'MAT001', 'Steel Supplier A', 'Blast Furnace'),
('SAMPLE002', 'JSW Steel', 'MAT002', 'Steel Supplier B', 'Steel Melting'),
('SAMPLE003', 'Steel Authority of India Limited (SAIL)', 'MAT003', 'Steel Supplier C', 'Sinter Plant'),
('SAMPLE004', 'Jindal Steel and Power Limited (JSPL)', 'MAT004', 'Steel Supplier D', 'Rail & Structural Mill'),
('SAMPLE005', 'ArcelorMittal Nippon Steel India (AM/NS India)', 'MAT005', 'Steel Supplier E', 'Universal Rail Mill'),
('SAMPLE006', 'Tata Steel BSL (formerly Bhushan Steel)', 'MAT006', 'Steel Supplier F', 'Plate Mill'),
('SAMPLE007', 'Electrosteel Steels Ltd (Vedanta Group)', 'MAT007', 'Steel Supplier G', 'Bar & Rod Mill'),
('SAMPLE008', 'Rashtriya Ispat Nigam Limited (RINL, Vizag Steel)', 'MAT008', 'Steel Supplier H', 'Merchant Mill'),
('SAMPLE009', 'Jindal Stainless Ltd', 'MAT009', 'Steel Supplier I', 'Wire Rod Mill'),
('SAMPLE010', 'Shyam Metalics and Energy Ltd', 'MAT010', 'Steel Supplier J', 'Coke Oven Battery');
