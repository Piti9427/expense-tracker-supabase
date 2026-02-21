-- Create expenses table
create table expenses (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users not null default auth.uid(),
  amount numeric not null check (amount > 0),
  category text not null,
  description text,
  date date not null default current_date
);

-- Enable RLS
alter table expenses enable row level security;

-- Policies for expenses
create policy "Users can view their own expenses" 
on expenses for select 
using (auth.uid() = user_id);

create policy "Users can insert their own expenses" 
on expenses for insert 
with check (auth.uid() = user_id);

create policy "Users can update their own expenses" 
on expenses for update 
using (auth.uid() = user_id);

create policy "Users can delete their own expenses" 
on expenses for delete 
using (auth.uid() = user_id);
