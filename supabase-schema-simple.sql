-- ========================================
-- QUIZMAX - Supabase Database Schema (Simplified)
-- ========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- PROFILES TABLE (extends auth.users)
-- ========================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies (simplified)
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- ========================================
-- QUIZZES TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS public.quizzes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  visibility TEXT NOT NULL CHECK (visibility IN ('public', 'private', 'unlisted')),
  show_answer_immediately BOOLEAN DEFAULT false,
  questions JSONB NOT NULL DEFAULT '[]',
  views INTEGER DEFAULT 0,
  attempts INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;

-- Quizzes policies (simplified)
CREATE POLICY "Anyone can view public quizzes"
  ON public.quizzes FOR SELECT
  USING (visibility = 'public');

CREATE POLICY "Anyone can view unlisted quizzes"
  ON public.quizzes FOR SELECT
  USING (visibility = 'unlisted');

CREATE POLICY "Users can view their own quizzes"
  ON public.quizzes FOR SELECT
  USING (creator_id = auth.uid());

CREATE POLICY "Authenticated users can create quizzes"
  ON public.quizzes FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND creator_id = auth.uid());

CREATE POLICY "Users can update their own quizzes"
  ON public.quizzes FOR UPDATE
  USING (creator_id = auth.uid());

CREATE POLICY "Users can delete their own quizzes"
  ON public.quizzes FOR DELETE
  USING (creator_id = auth.uid());

-- ========================================
-- QUIZ ATTEMPTS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  answers JSONB NOT NULL DEFAULT '{}',
  score INTEGER,
  total_questions INTEGER,
  percentage INTEGER,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Quiz attempts policies (simplified)
CREATE POLICY "Users can view their own attempts"
  ON public.quiz_attempts FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Anyone can create attempts"
  ON public.quiz_attempts FOR INSERT
  WITH CHECK (true);

-- ========================================
-- INDEXES
-- ========================================
CREATE INDEX IF NOT EXISTS idx_quizzes_creator_id ON public.quizzes(creator_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_visibility ON public.quizzes(visibility);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz_id ON public.quiz_attempts(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_id ON public.quiz_attempts(user_id);

-- ========================================
-- FUNCTIONS AND TRIGGERS
-- ========================================

-- Function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profiles updated_at
DROP TRIGGER IF EXISTS on_profile_updated ON public.profiles;
CREATE TRIGGER on_profile_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Trigger for quizzes updated_at
DROP TRIGGER IF EXISTS on_quiz_updated ON public.quizzes;
CREATE TRIGGER on_quiz_updated
  BEFORE UPDATE ON public.quizzes
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ========================================
-- STORAGE BUCKET FOR IMAGES
-- ========================================

-- Create storage bucket for quiz images
INSERT INTO storage.buckets (id, name, public)
VALUES ('quiz-images', 'quiz-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies (minimal - configure more in dashboard if needed)
CREATE POLICY "Public access to quiz images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'quiz-images');

CREATE POLICY "Authenticated users can upload"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'quiz-images' AND auth.role() = 'authenticated');
