-- Remove admin approval requirement by auto-approving users

-- Update default value for approved column to true
ALTER TABLE user_roles 
ALTER COLUMN approved SET DEFAULT true;

-- Update existing unapproved users to approved
UPDATE user_roles 
SET approved = true, 
    approved_at = now()
WHERE approved = false;

-- Update the handle_new_user function to auto-approve users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', '')
  );

  -- Insert user role with auto-approval
  INSERT INTO public.user_roles (user_id, role, approved, approved_at)
  VALUES (
    new.id,
    COALESCE((new.raw_user_meta_data->>'role')::app_role, 'student'),
    true,  -- Auto-approve
    now()  -- Set approved timestamp
  );

  RETURN new;
END;
$$;