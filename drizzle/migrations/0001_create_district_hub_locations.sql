CREATE TABLE public.district_hub_locations (
  district_id TEXT PRIMARY KEY,
  district_name TEXT NOT NULL,
  geocode_query TEXT NOT NULL,
  rollout_phase SMALLINT NOT NULL CHECK (rollout_phase IN (1, 2, 3)),
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  geocoded_at TIMESTAMPTZ NOT NULL
);

GRANT SELECT ON public.district_hub_locations TO anon;
GRANT SELECT ON public.district_hub_locations TO authenticated;
GRANT ALL ON public.district_hub_locations TO service_role;

ALTER TABLE public.district_hub_locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view public district hub locations"
ON public.district_hub_locations
FOR SELECT
TO anon, authenticated
USING (true);

INSERT INTO public.district_hub_locations
  (district_id, district_name, geocode_query, rollout_phase, latitude, longitude, geocoded_at)
VALUES
  ('bagerhat', 'Bagerhat', 'Bagerhat District, Bangladesh', 3, 22.6602436, 89.7895478, '2026-11-17T05:55:00.000Z'),
  ('bandarban', 'Bandarban', 'Bandarban District, Bangladesh', 3, 21.8311002, 92.3686321, '2026-11-17T05:55:00.000Z'),
  ('barguna', 'Barguna', 'Barguna District, Bangladesh', 3, 22.0952915, 90.1120696, '2026-11-17T05:55:00.000Z'),
  ('barishal', 'Barishal', 'Barishal District, Bangladesh', 1, 22.7022098, 90.3696316, '2026-11-17T05:55:00.000Z'),
  ('bhola', 'Bhola', 'Bhola District, Bangladesh', 3, 22.1785315, 90.7101023, '2026-11-17T05:55:00.000Z'),
  ('bogura', 'Bogura', 'Bogura District, Bangladesh', 2, 24.8510402, 89.3697225, '2026-11-17T05:55:00.000Z'),
  ('brahmanbaria', 'Brahmanbaria', 'Brahmanbaria District, Bangladesh', 3, 23.9608181, 91.1115014, '2026-11-17T05:55:00.000Z'),
  ('chandpur', 'Chandpur', 'Chandpur District, Bangladesh', 3, 23.2513148, 90.8517846, '2026-11-17T05:55:00.000Z'),
  ('chapai-nawabganj', 'Chapai Nawabganj', 'Chapai Nawabganj District, Bangladesh', 3, 24.7413111, 88.2912069, '2026-11-17T05:55:00.000Z'),
  ('chattogram', 'Chattogram', 'Chattogram District, Bangladesh', 1, 22.5150105, 91.7538817, '2026-11-17T05:55:00.000Z'),
  ('chuadanga', 'Chuadanga', 'Chuadanga District, Bangladesh', 3, 23.6160512, 88.8263006, '2026-11-17T05:55:00.000Z'),
  ('coxs-bazar', 'Cox’s Bazar', 'Cox''s Bazar District, Bangladesh', 2, 21.5640626, 92.0282129, '2026-11-17T05:55:00.000Z'),
  ('cumilla', 'Cumilla', 'Cumilla District, Bangladesh', 2, 23.4575667, 91.1808996, '2026-11-17T05:55:00.000Z'),
  ('dhaka', 'Dhaka', 'Gawsia Twin Peak, 30 N Circular Rd, Dhaka 1205, Bangladesh', 1, 23.7455798, 90.3713917, '2026-11-17T05:55:00.000Z'),
  ('dinajpur', 'Dinajpur', 'Dinajpur District, Bangladesh', 2, 25.6279123, 88.6331758, '2026-11-17T05:55:00.000Z'),
  ('faridpur', 'Faridpur', 'Faridpur District, Bangladesh', 2, 23.5423919, 89.6308921, '2026-11-17T05:55:00.000Z'),
  ('feni', 'Feni', 'Feni District, Bangladesh', 2, 22.9408784, 91.4066646, '2026-11-17T05:55:00.000Z'),
  ('gaibandha', 'Gaibandha', 'Gaibandha District, Bangladesh', 3, 25.3296928, 89.5429652, '2026-11-17T05:55:00.000Z'),
  ('gazipur', 'Gazipur', 'Gazipur District, Bangladesh', 2, 24.0958171, 90.4125181, '2026-11-17T05:55:00.000Z'),
  ('gopalganj', 'Gopalganj', 'Gopalganj District, Bangladesh', 3, 23.0488146, 89.8879304, '2026-11-17T05:55:00.000Z'),
  ('habiganj', 'Habiganj', 'Habiganj District, Bangladesh', 3, 24.4771236, 91.4506565, '2026-11-17T05:55:00.000Z'),
  ('jamalpur', 'Jamalpur', 'Jamalpur District, Bangladesh', 3, 25.0830926, 89.7853218, '2026-11-17T05:55:00.000Z'),
  ('jashore', 'Jashore', 'Jashore District, Bangladesh', 2, 23.1634014, 89.2181664, '2026-11-17T05:55:00.000Z'),
  ('jhalokati', 'Jhalokati', 'Jhalokati District, Bangladesh', 3, 22.57208, 90.1869644, '2026-11-17T05:55:00.000Z'),
  ('jhenaidah', 'Jhenaidah', 'Jhenaidah District, Bangladesh', 3, 23.5449873, 89.1726031, '2026-11-17T05:55:00.000Z'),
  ('joypurhat', 'Joypurhat', 'Joypurhat District, Bangladesh', 3, 25.0947349, 89.0944937, '2026-11-17T05:55:00.000Z'),
  ('khagrachhari', 'Khagrachhari', 'Khagrachhari District, Bangladesh', 3, 23.1321751, 91.949021, '2026-11-17T05:55:00.000Z'),
  ('khulna', 'Khulna', 'Khulna District, Bangladesh', 1, 22.6737735, 89.3966581, '2026-11-17T05:55:00.000Z'),
  ('kishoreganj', 'Kishoreganj', 'Kishoreganj District, Bangladesh', 2, 24.4260457, 90.9820668, '2026-11-17T05:55:00.000Z'),
  ('kurigram', 'Kurigram', 'Kurigram District, Bangladesh', 3, 25.8072414, 89.6294746, '2026-11-17T05:55:00.000Z'),
  ('kushtia', 'Kushtia', 'Kushtia District, Bangladesh', 2, 23.8906995, 89.1099368, '2026-11-17T05:55:00.000Z'),
  ('lakshmipur', 'Lakshmipur', 'Lakshmipur District, Bangladesh', 3, 22.9446744, 90.8281907, '2026-11-17T05:55:00.000Z'),
  ('lalmonirhat', 'Lalmonirhat', 'Lalmonirhat District, Bangladesh', 3, 25.9923398, 89.2847251, '2026-11-17T05:55:00.000Z'),
  ('madaripur', 'Madaripur', 'Madaripur District, Bangladesh', 3, 23.2393346, 90.1869644, '2026-11-17T05:55:00.000Z'),
  ('magura', 'Magura', 'Magura District, Bangladesh', 3, 23.4289726, 89.436391, '2026-11-17T05:55:00.000Z'),
  ('manikganj', 'Manikganj', 'Manikganj District, Bangladesh', 3, 23.8616512, 90.0003228, '2026-11-17T05:55:00.000Z'),
  ('meherpur', 'Meherpur', 'Meherpur District, Bangladesh', 3, 23.8051991, 88.6723578, '2026-11-17T05:55:00.000Z'),
  ('moulvibazar', 'Moulvibazar', 'Moulvibazar District, Bangladesh', 2, 24.3095344, 91.7314903, '2026-11-17T05:55:00.000Z'),
  ('munshiganj', 'Munshiganj', 'Munshiganj District, Bangladesh', 3, 23.4980931, 90.4126621, '2026-11-17T05:55:00.000Z'),
  ('mymensingh', 'Mymensingh', 'Mymensingh District, Bangladesh', 2, 24.7538575, 90.4072919, '2026-11-17T05:55:00.000Z'),
  ('naogaon', 'Naogaon', 'Naogaon District, Bangladesh', 3, 24.9131597, 88.7530952, '2026-11-17T05:55:00.000Z'),
  ('narail', 'Narail', 'Narail District, Bangladesh', 3, 23.1162929, 89.5840404, '2026-11-17T05:55:00.000Z'),
  ('narayanganj', 'Narayanganj', 'Narayanganj District, Bangladesh', 2, 23.7146601, 90.563609, '2026-11-17T05:55:00.000Z'),
  ('narsingdi', 'Narsingdi', 'Narsingdi District, Bangladesh', 2, 24.134378, 90.7860057, '2026-11-17T05:55:00.000Z'),
  ('natore', 'Natore', 'Natore District, Bangladesh', 3, 24.410243, 89.0076177, '2026-11-17T05:55:00.000Z'),
  ('netrokona', 'Netrokona', 'Netrokona District, Bangladesh', 3, 24.8103284, 90.8656415, '2026-11-17T05:55:00.000Z'),
  ('nilphamari', 'Nilphamari', 'Nilphamari District, Bangladesh', 3, 25.8482798, 88.9414134, '2026-11-17T05:55:00.000Z'),
  ('noakhali', 'Noakhali', 'Noakhali District, Bangladesh', 2, 22.8723789, 91.0973184, '2026-11-17T05:55:00.000Z'),
  ('pabna', 'Pabna', 'Pabna District, Bangladesh', 2, 24.158505, 89.4480718, '2026-11-17T05:55:00.000Z'),
  ('panchagarh', 'Panchagarh', 'Panchagarh District, Bangladesh', 3, 26.2708705, 88.5951751, '2026-11-17T05:55:00.000Z'),
  ('patuakhali', 'Patuakhali', 'Patuakhali District, Bangladesh', 3, 22.2248632, 90.4547503, '2026-11-17T05:55:00.000Z'),
  ('pirojpur', 'Pirojpur', 'Pirojpur District, Bangladesh', 3, 22.5790744, 89.9759264, '2026-11-17T05:55:00.000Z'),
  ('rajbari', 'Rajbari', 'Rajbari District, Bangladesh', 3, 23.715134, 89.5874819, '2026-11-17T05:55:00.000Z'),
  ('rajshahi', 'Rajshahi', 'Rajshahi District, Bangladesh', 1, 24.3733087, 88.6048716, '2026-11-17T05:55:00.000Z'),
  ('rangamati', 'Rangamati', 'Rangamati District, Bangladesh', 3, 22.7324173, 92.2985134, '2026-11-17T05:55:00.000Z'),
  ('rangpur', 'Rangpur', 'Rangpur District, Bangladesh', 2, 25.7467925, 89.2508335, '2026-11-17T05:55:00.000Z'),
  ('satkhira', 'Satkhira', 'Satkhira District, Bangladesh', 3, 22.3154812, 89.1114525, '2026-11-17T05:55:00.000Z'),
  ('shariatpur', 'Shariatpur', 'Shariatpur District, Bangladesh', 3, 23.2423214, 90.4347711, '2026-11-17T05:55:00.000Z'),
  ('sherpur', 'Sherpur', 'Sherpur District, Bangladesh', 3, 25.0746235, 90.1494904, '2026-11-17T05:55:00.000Z'),
  ('sirajganj', 'Sirajganj', 'Sirajganj District, Bangladesh', 3, 24.3141115, 89.5699615, '2026-11-17T05:55:00.000Z'),
  ('sunamganj', 'Sunamganj', 'Sunamganj District, Bangladesh', 3, 25.0714535, 91.3991627, '2026-11-17T05:55:00.000Z'),
  ('sylhet', 'Sylhet', 'Sylhet District, Bangladesh', 1, 24.8993357, 91.8700473, '2026-11-17T05:55:00.000Z'),
  ('tangail', 'Tangail', 'Tangail District, Bangladesh', 2, 24.3917427, 89.9948257, '2026-11-17T05:55:00.000Z'),
  ('thakurgaon', 'Thakurgaon', 'Thakurgaon District, Bangladesh', 3, 26.0418392, 88.4282616, '2026-11-17T05:55:00.000Z');