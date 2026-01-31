import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import EPKForm from '@/components/epk/EPKForm';

export default async function NewEPKPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Create New EPK</h1>
        <p className="text-gray-600 mt-1">
          Fill in your artist information to create your electronic press kit.
        </p>
      </div>

      <EPKForm userId={user.id} />
    </div>
  );
}
