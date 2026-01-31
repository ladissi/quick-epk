import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import EPKForm from '@/components/epk/EPKForm';

interface EditEPKPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditEPKPage({ params }: EditEPKPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: epk } = await supabase
    .from('epks')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (!epk) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Edit EPK</h1>
        <p className="text-gray-600 mt-1">
          Update your electronic press kit for {epk.artist_name}
        </p>
      </div>

      <EPKForm initialData={epk} userId={user.id} />
    </div>
  );
}
