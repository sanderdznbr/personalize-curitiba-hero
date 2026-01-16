-- Adicionar campos de configuração visual para os banners
ALTER TABLE public.banners 
ADD COLUMN overlay_color TEXT DEFAULT '#00C563',
ADD COLUMN overlay_opacity DECIMAL(3,2) DEFAULT 1.0,
ADD COLUMN image_fit TEXT DEFAULT 'cover',
ADD COLUMN slide_duration INTEGER DEFAULT 5000;