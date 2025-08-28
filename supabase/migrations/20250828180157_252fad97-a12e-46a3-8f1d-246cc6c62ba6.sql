-- Create admin_users table for authentication
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create policy for admin_users (only admins can access)
CREATE POLICY "Admins can manage admin users" 
ON public.admin_users 
FOR ALL 
USING (auth.uid() IN (SELECT id FROM public.admin_users));

-- Create banners table for hero slider
CREATE TABLE public.banners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT,
  button_text TEXT,
  button_link TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

-- Create policies for banners
CREATE POLICY "Everyone can view active banners" 
ON public.banners 
FOR SELECT 
USING (active = true);

CREATE POLICY "Admins can manage banners" 
ON public.banners 
FOR ALL 
USING (auth.uid() IN (SELECT id FROM public.admin_users));

-- Create about_content table
CREATE TABLE public.about_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description1 TEXT,
  description2 TEXT,
  video_web_url TEXT,
  video_mobile_url TEXT,
  button_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.about_content ENABLE ROW LEVEL SECURITY;

-- Create policies for about_content
CREATE POLICY "Everyone can view about content" 
ON public.about_content 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage about content" 
ON public.about_content 
FOR ALL 
USING (auth.uid() IN (SELECT id FROM public.admin_users));

-- Create product_categories table
CREATE TABLE public.product_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  image_url TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;

-- Create policies for product_categories
CREATE POLICY "Everyone can view active products" 
ON public.product_categories 
FOR SELECT 
USING (active = true);

CREATE POLICY "Admins can manage products" 
ON public.product_categories 
FOR ALL 
USING (auth.uid() IN (SELECT id FROM public.admin_users));

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('banners-images', 'banners-images', true),
  ('about-videos', 'about-videos', true),
  ('products-images', 'products-images', true);

-- Create storage policies for banner images
CREATE POLICY "Banner images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'banners-images');

CREATE POLICY "Admins can upload banner images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'banners-images' AND auth.uid() IN (SELECT id FROM public.admin_users));

CREATE POLICY "Admins can update banner images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'banners-images' AND auth.uid() IN (SELECT id FROM public.admin_users));

CREATE POLICY "Admins can delete banner images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'banners-images' AND auth.uid() IN (SELECT id FROM public.admin_users));

-- Create storage policies for about videos
CREATE POLICY "About videos are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'about-videos');

CREATE POLICY "Admins can upload about videos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'about-videos' AND auth.uid() IN (SELECT id FROM public.admin_users));

CREATE POLICY "Admins can update about videos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'about-videos' AND auth.uid() IN (SELECT id FROM public.admin_users));

CREATE POLICY "Admins can delete about videos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'about-videos' AND auth.uid() IN (SELECT id FROM public.admin_users));

-- Create storage policies for product images
CREATE POLICY "Product images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'products-images');

CREATE POLICY "Admins can upload product images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'products-images' AND auth.uid() IN (SELECT id FROM public.admin_users));

CREATE POLICY "Admins can update product images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'products-images' AND auth.uid() IN (SELECT id FROM public.admin_users));

CREATE POLICY "Admins can delete product images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'products-images' AND auth.uid() IN (SELECT id FROM public.admin_users));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_banners_updated_at
  BEFORE UPDATE ON public.banners
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_about_content_updated_at
  BEFORE UPDATE ON public.about_content
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_product_categories_updated_at
  BEFORE UPDATE ON public.product_categories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial about content
INSERT INTO public.about_content (title, description1, description2, button_text) VALUES (
  'Sobre a Personalize',
  'Há mais de 25 anos em curitiba, a Personalize é referência em personalização de roupas para empresas, times e eventos.',
  'Com experiência, credibilidade e tecnologia, entregamos uniformes e produtos personalizados que reforçam sua marca e sua identidade visual.',
  'Entrar em contato'
);

-- Insert initial product categories
INSERT INTO public.product_categories (name, order_index) VALUES 
  ('Camisas Polo', 1),
  ('Camisetas', 2),
  ('Jaquetas', 3),
  ('Corta Vento', 4),
  ('Bonés', 5),
  ('Uniformes', 6);